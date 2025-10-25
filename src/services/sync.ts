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
  registered: string; // ISO datetime string
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

  /**
   * Синхронизация покупателей с бэкендом
   */
  syncCustomers(area: Area, customers: Customer[]): Observable<SyncResponse[]> {
    const url = `${this.baseUrl}/sync/${area.pk}/`;

    const payload: SyncPayload = {
      devices: Array.isArray(area?.devices) ? area.devices : [],
      customers: customers.map((c) => ({
        mm3hash: Utilities.computeHash(Utilities.normalizePhone(c.pk)),
        enabled: Boolean(c.active),
        payments: this.getLatestPayments(c),
      }))
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
   * Get latest 5 payment records or empty array
   */
  private getLatestPayments(customer: Customer): PaymentRecord[] {
    const payments = Array.isArray(customer?.payments) ? customer.payments : [];
    if (payments.length === 0) return [];

    // Sort by registered_in timestamp (descending) and take latest 5
    const sorted = [...payments]
      .filter(p => p.registered_in && p.started_in && p.expired_in)
      .sort((a, b) => b.registered_in - a.registered_in)
      .slice(0, 5);

    return sorted.map(p => ({
      registered: new Date(p.registered_in).toISOString(),
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
