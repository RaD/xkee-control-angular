import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Area } from '../pages/area/interface';
import { Customer } from '../pages/customer/interface';

export interface SyncRequest {
  pk: string;
  active: boolean;
  payment: {
    started: string;
    expired: string;
  } | null;
}

export interface SyncResponse {
  pk: string;
  active: boolean;
  synced: string;
}

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private baseUrl = 'https://api.example.com'; // Replace with actual backend URL

  constructor(private http: HttpClient) {}

  /**
   * Sync customers with backend service
   * @param area - Area containing access credentials
   * @param customers - List of customers to sync
   * @returns Observable with sync response
   */
  syncCustomers(area: Area, customers: Customer[]): Observable<SyncResponse[]> {
    const url = `${this.baseUrl}/sync/${area.pk}/`;
    
    // Prepare request payload
    const payload: SyncRequest[] = customers.map(customer => ({
      pk: customer.pk,
      active: customer.active,
      payment: this.getCustomerPayment(customer)
    }));

    // Prepare headers with authentication
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Access-Key': area.access || '',
      'X-Secret-Key': area.secret || ''
    });

    return this.http.post<SyncResponse[]>(url, payload, { headers }).pipe(
      timeout(10000), // 10 seconds timeout
      catchError((error) => this.handleError(error))
    );
  }

  /**
   * Get customer's current active payment period
   * @param customer - Customer object
   * @returns Payment object with started and expired dates, or null if no valid payment
   */
  private getCustomerPayment(customer: Customer): { started: string; expired: string } | null {
    if (!customer.payments || customer.payments.length === 0) {
      // No payments
      return null;
    }

    // Get the latest payment
    const latestPayment = customer.payments[0];
    const expiredDate = this.ngbDateToDate(latestPayment.expired_in);
    const today = new Date();
    
    // Check if payment period is in the past
    if (expiredDate < today) {
      return null;
    }
    
    return {
      started: this.ngbDateToString(latestPayment.started_in),
      expired: this.ngbDateToString(latestPayment.expired_in)
    };
  }

  /**
   * Convert NgbDateStruct to Date object
   */
  private ngbDateToDate(dateStruct: any): Date {
    if (!dateStruct) return new Date();
    return new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day);
  }

  /**
   * Convert NgbDateStruct to ISO date string
   */
  private ngbDateToString(dateStruct: any): string {
    if (!dateStruct) return '';
    const year = dateStruct.year;
    const month = dateStruct.month.toString().padStart(2, '0');
    const day = dateStruct.day.toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Format Date object to ISO date string
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse | any) {
    let errorMessage = 'Не удалось синхронизировать данные. Попробуйте позже.';
    
    if (error.name === 'TimeoutError') {
      errorMessage = 'Превышено время ожидания ответа сервера. Попробуйте позже.';
    } else if (error.status === 0) {
      errorMessage = 'Нет соединения с сервером. Проверьте подключение к интернету.';
    } else if (error.status >= 400 && error.status < 500) {
      errorMessage = 'Ошибка авторизации. Проверьте настройки территории.';
    } else if (error.status >= 500) {
      errorMessage = 'Ошибка сервера. Попробуйте позже.';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}