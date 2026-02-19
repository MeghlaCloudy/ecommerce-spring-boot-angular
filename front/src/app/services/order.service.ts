import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../environment';
import { OrderDto } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  private ordersSubject = new BehaviorSubject<OrderDto[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) {}

  // নতুন: অ্যাড্রেস সহ চেকআউট
  checkout(request: {
    paymentMethod: string;
    street: string;
    city: string;
    country: string;
    zipCode: string;
  }): Observable<OrderDto> {
    return this.http.post<OrderDto>(`${this.apiUrl}/checkout`, request);
  }

  getUserOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(this.apiUrl);
  }

  getOrderById(orderId: number): Observable<OrderDto> {
    return this.http.get<OrderDto>(`${this.apiUrl}/${orderId}`);
  }

  loadUserOrders(): void {
    this.getUserOrders().subscribe({
      next: (orders) => this.ordersSubject.next(orders),
      error: (err) => {
        console.error('Failed to load orders', err);
        this.ordersSubject.next([]);
      },
    });
  }

  getAllOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/all`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<OrderDto> {
    return this.http.put<OrderDto>(`${this.apiUrl}/${orderId}/status`, { status });
  }
}