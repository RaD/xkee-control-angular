import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, timeout, retryWhen, mergeMap } from 'rxjs/operators';
import { Area } from '../pages/area/interface';
import { Customer } from '../pages/customer/interface';
import { ConfigService } from './config';
import { Utilities } from './phone-utils';

// Если используете ng-bootstrap, лучше импортнуть настоящий тип
// import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
type NgbDateStruct = { year: number; month: number; day: number };

export interface PaymentRecord {
  mm3hash: string;    // MurmurHash3 for duplicate detection
  started: string;    // YYYY-MM-DD
  expired: string;    // YYYY-MM-DD
}

export interface SyncRequest {
  mm3hash: string;
  enabled: boolean;
  payments: PaymentRecord[];
}

export interface SyncPayload {
  devices: string[];
  customers: SyncRequest[];
}

export interface SyncResponse {
  pk: string;
  active: boolean;
  synced: string; // ISO или YYYY-MM-DD — зависит от бэкенда
}


@Injectable({ providedIn: 'root' })
export class SyncService {
  private baseUrl = (ConfigService.getBaseUrl?.() ?? 'https://api.example.com').replace(/\/+$/,'');
  private requestTimeoutMs = 10_000;

  constructor(private http: HttpClient) {}

  private paymentKey(p: PaymentRecord): string {
    // Дедуп по mm3hash
    return p.mm3hash;
  }

  private uniqPayments(payments: PaymentRecord[]): PaymentRecord[] {
    const map = new Map<string, PaymentRecord>();
    for (const p of payments) map.set(this.paymentKey(p), p);
    return Array.from(map.values());
  }

  private sortByStartedDesc(arr: PaymentRecord[]): PaymentRecord[] {
    return [...arr].sort((a, b) => new Date(b.started).getTime() - new Date(a.started).getTime());
  }

  /**
   * Синхронизация покупателей с бэкендом
   */
  syncCustomers(area: Area, customers: Customer[]): Observable<SyncResponse[]> {
    const url = `${this.baseUrl}/sync/${area.pk}/`;

    const syncRequests = this.buildSyncRequests(area, customers);

    const payload: SyncPayload = {
      devices: Array.isArray(area?.devices) ? area.devices : [],
      customers: syncRequests
    };

    // Добавляем заголовки только если значения есть
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (area?.access) headers = headers.set('X-Access-Key', area.access);
    if (area?.secret) headers = headers.set('X-Secret-Key', area.secret);

    return this.http.post<SyncResponse[]>(url, payload, { headers }).pipe(
      timeout(this.requestTimeoutMs),
      // Повторяем только при «временных» проблемах (сеть/5xx/timeout)
      retryWhen(errors =>
        errors.pipe(
          mergeMap((err, attempt) => {
            const isTimeout = err?.name === 'TimeoutError';
            const isNetwork = err instanceof HttpErrorResponse && err.status === 0;
            const is5xx = err instanceof HttpErrorResponse && err.status >= 500;
            const shouldRetry = isTimeout || isNetwork || is5xx;
            if (!shouldRetry || attempt >= 2) {
              return throwError(() => err);
            }
            // экспоненциальная задержка: 500ms, 1500ms
            return timer(500 * Math.pow(3, attempt));
          })
        )
      ),
      catchError((error) => this.handleError(error))
    );
  }

  /**
   * Построение списка запросов на синхронизацию с учетом связанных пользователей
   */
  private buildSyncRequests(area: Area, customers: Customer[]): SyncRequest[] {
    const syncMap = new Map<string, SyncRequest>();
    const customerMap = new Map<string, Customer>();
    customers.forEach(c => customerMap.set(c.pk, c));

    const linkedIndex: Record<string, string[]> = area?.linked ?? {};

    // 1) Собираем полное множество всех PK (основные + привязанные)
    const allPks = new Set<string>();
    for (const c of customers) allPks.add(c.pk);
    for (const parentPk of Object.keys(linkedIndex)) {
      for (const childPk of linkedIndex[parentPk] ?? []) {
        allPks.add(childPk);
      }
    }

    // 2) Подготовим быстрый обратный индекс: childPk -> [parentPk...]
    const parentsByChild = new Map<string, string[]>();
    for (const [parentPk, children] of Object.entries(linkedIndex)) {
      for (const childPk of children ?? []) {
        const arr = parentsByChild.get(childPk) ?? [];
        arr.push(parentPk);
        parentsByChild.set(childPk, arr);
      }
    }

    // 3) Вспомогательная функция: получить оплаты клиента по pk (или [])
    const getOwnPaymentRecords = (pk: string): PaymentRecord[] => {
      const c = customerMap.get(pk);
      return c ? this.getLatestPayments(c) : [];
    };

    // 4) Формируем запись ДЛЯ КАЖДОГО пользователя
    for (const pk of allPks) {
      const customer = customerMap.get(pk);

      // Собственные оплаты
      const own = getOwnPaymentRecords(pk);

      // Наследуем оплаты от всех родителей, которые ссылаются на pk
      const parentPks = parentsByChild.get(pk) ?? [];
      let inherited: PaymentRecord[] = [];
      for (const parentPk of parentPks) {
        inherited = inherited.concat(getOwnPaymentRecords(parentPk));
      }

      // Комбинация: собственные + унаследованные
      const combined = this.uniqPayments([...own, ...inherited]);
      const combinedSorted = this.sortByStartedDesc(combined);
      // по желанию можно ограничить объём:
      // const finalPayments = combinedSorted.slice(0, 5);
      const finalPayments = combinedSorted;

      // enabled: берём ИЗ СОБСТВЕННОГО пользователя, если он есть в customers; иначе false
      const enabled = Boolean(customer?.active);

      // mm3hash: считаем из нормализованного телефона (или самого pk, если это и есть телефон)
      const normalizedPk = Utilities.normalizePhone(pk);
      const hash = Utilities.computeHash(normalizedPk);

      syncMap.set(hash, {
        mm3hash: hash,
        enabled,
        payments: finalPayments,
      });
    }

    const result = Array.from(syncMap.values());

    // Отладка (можно убрать)
    console.log('=== Sync Result (ALL users included) ===');
    console.log('Total sync requests:', result.length);
    result.forEach((req, idx) => {
      console.log(`${idx + 1}. ${req.mm3hash}: enabled=${req.enabled}, payments=${req.payments.length}`);
    });
    console.log('========================================');

    return result;
  }

  /**
   * Get latest 5 payment records or empty array
   */
  private getLatestPayments(customer: Customer): PaymentRecord[] {
    const payments = Array.isArray(customer?.payments) ? customer.payments : [];
    if (payments.length === 0) return [];

    const sorted = [...payments]
      .filter(p => p.mm3hash && p.started_in && p.expired_in)
      .sort((a, b) => b.registered_in - a.registered_in);
      // .slice(0, 5); // ← если хочешь ограничить срезом уже тут

    return sorted.map(p => ({
      mm3hash: p.mm3hash!,
      started: this.ngbDateToString(p.started_in),
      expired: this.ngbDateToString(p.expired_in),
    }));
  }

  /** Преобразование NgbDateStruct -> Date (локальная дата) */
  private ngbDateToDate(dateStruct?: NgbDateStruct | null): Date | null {
    if (!dateStruct || !dateStruct.year || !dateStruct.month || !dateStruct.day) return null;
    return new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day);
    // При желании здесь можно собирать UTC: new Date(Date.UTC(...))
  }

  /** Преобразование NgbDateStruct -> 'YYYY-MM-DD' */
  private ngbDateToString(dateStruct?: NgbDateStruct | null): string {
    if (!dateStruct || !dateStruct.year || !dateStruct.month || !dateStruct.day) return '';
    const year = dateStruct.year.toString().padStart(4, '0');
    const month = dateStruct.month.toString().padStart(2, '0');
    const day = dateStruct.day.toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /** Централизованная обработка ошибок */
  private handleError(error: HttpErrorResponse | any) {
    // Сохраним «техническое» сообщение, если оно есть
    const serverMsg =
      (error instanceof HttpErrorResponse && (error.error?.detail || error.error?.message)) ||
      (typeof error?.message === 'string' ? error.message : null);

    if (error?.name === 'TimeoutError') {
      return throwError(() => new Error('Превышено время ожидания ответа сервера. Попробуйте позже.'));
    }

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return throwError(() => new Error('Нет соединения с сервером. Проверьте подключение к интернету.'));
      }
      if (error.status === 401 || error.status === 403) {
        return throwError(() => new Error(serverMsg || 'Ошибка авторизации. Проверьте ключи доступа.'));
      }
      if (error.status >= 400 && error.status < 500) {
        return throwError(() => new Error(serverMsg || 'Ошибка запроса. Проверьте данные и повторите.'));
      }
      if (error.status >= 500) {
        return throwError(() => new Error(serverMsg || 'Ошибка сервера. Попробуйте позже.'));
      }
    }

    return throwError(() => new Error(serverMsg || 'Не удалось синхронизировать данные. Попробуйте позже.'));
  }
}
