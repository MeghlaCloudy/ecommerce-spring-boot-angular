
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CartDto, CartItemRequest } from '../models/models';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = `${environment.apiUrl}/cart`;

  /* ===============================
     Global Cart State
     =============================== */
  private cartSubject = new BehaviorSubject<CartDto>({
    items: [],
    totalAmount: 0
  });

  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) { }

  /* ===============================
     Load Cart (call once)
     =============================== */
  loadCart(): void {
    this.http.get<CartDto>(this.apiUrl).subscribe({
      next: cart => this.cartSubject.next(cart),
      error: err => {
        console.error('Error loading cart:', err);
        this.cartSubject.next({ items: [], totalAmount: 0 });
      }
    });
  }

  /* ===============================
     Add Item
     =============================== */
  addItemToCart(request: CartItemRequest): void {
    this.http.post<CartDto>(`${this.apiUrl}/add`, request).subscribe({
      next: cart => this.cartSubject.next(cart),
      error: err => console.error('Error adding item:', err)
    });
  }

  /* ===============================
     Update Item
     =============================== */
  updateCartItem(cartItemId: number, request: CartItemRequest): void {
    this.http
      .put<CartDto>(`${this.apiUrl}/update/${cartItemId}`, request)
      .subscribe({
        next: cart => this.cartSubject.next(cart),
        error: err => console.error('Error updating item:', err)
      });
  }

  /* ===============================
     Remove Item
     =============================== */
  removeCartItem(cartItemId: number): void {
    this.http
      .delete<CartDto>(`${this.apiUrl}/remove/${cartItemId}`)
      .subscribe({
        next: cart => {this.loadCart(); },
        error: err => console.error('Error removing item:', err)
      });
  }

  /* ===============================
     Clear Cart
     =============================== */
  clearCart(): void {
    this.http
      .delete<CartDto>(`${this.apiUrl}/clear`)
      .subscribe({
        next: cart => this.cartSubject.next(cart),
        error: err => console.error('Error clearing cart:', err)
      });
  }

  /* ===============================
     Checkout
     =============================== */
  checkout(): void {
    this.http
      .post<CartDto>(`${this.apiUrl}/checkout`, {})
      .subscribe({
        next: cart => this.cartSubject.next(cart),
        error: err => console.error('Checkout failed:', err)
      });
  }

  /* ===============================
     Helpers
     =============================== */
  getCartSnapshot(): CartDto {
    return this.cartSubject.value;
  }

  
  getTotalItems(): number {
    return this.cartSubject.value.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }
}


// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable, of } from 'rxjs';
// import { catchError, map, tap } from 'rxjs/operators';
// import { CartDto, CartItemRequest } from '../models/models';
// import { environment } from '../environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {

//   private apiUrl = `${environment.apiUrl}/cart`;

//   /* ===============================
//      Global Cart State
//      =============================== */
//   private cartSubject = new BehaviorSubject<CartDto>({
//     items: [],
//     totalAmount: 0
//   });

//   cart$ = this.cartSubject.asObservable();

//   constructor(private http: HttpClient) {}

//   /* ===============================
//      Load Cart (call once)
//      =============================== */
//   loadCart(): void {
//     this.getCart().subscribe();
//   }

//   /* ===============================
//      Get Cart
//      =============================== */
//   getCart() {
//     return this.http.get<CartDto>(this.apiUrl).pipe(
//       tap(cart => this.cartSubject.next(cart)),
//       catchError(error => {
//         console.error('Error loading cart:', error);
//         const emptyCart: CartDto = { items: [], totalAmount: 0 };
//         this.cartSubject.next(emptyCart);
//         return of(emptyCart);
//       })
//     );
//   }

//   /* ===============================
//      Add Item
//      =============================== */
//   addItemToCart(request: CartItemRequest): Observable<CartDto> {
//     return this.http.post<CartDto>(`${this.apiUrl}/add`, request).pipe(
//       tap(cart => this.cartSubject.next(cart)),
//       catchError(error => {
//         console.error('Error adding item:', error);
//         return of(this.cartSubject.value);
//       })
//     );
//   }

//   /* ===============================
//      Update Item
//      =============================== */
//   updateCartItem(
//     cartItemId: number,
//     request: CartItemRequest
//   ): Observable<CartDto> {
//     return this.http
//       .put<CartDto>(`${this.apiUrl}/update/${cartItemId}`, request)
//       .pipe(
//         tap(cart => this.cartSubject.next(cart)),
//         catchError(error => {
//           console.error('Error updating item:', error);
//           return of(this.cartSubject.value);
//         })
//       );
//   }

//   /* ===============================
//      Remove Item
//      =============================== */
//   removeCartItem(cartItemId: number): Observable<CartDto> {
//     return this.http
//       .delete<CartDto>(`${this.apiUrl}/remove/${cartItemId}`)
//       .pipe(
//         tap(cart => this.cartSubject.next(cart)),
//         catchError(error => {
//           console.error('Error removing item:', error);
//           return of(this.cartSubject.value);
//         })
//       );
//   }

//   /* ===============================
//      Clear Cart
//      =============================== */
//   clearCart(): Observable<CartDto> {
//     return this.http
//       .delete<CartDto>(`${this.apiUrl}/clear`)
//       .pipe(
//         tap(cart => this.cartSubject.next(cart)),
//         catchError(error => {
//           console.error('Error clearing cart:', error);
//           return of(this.cartSubject.value);
//         })
//       );
//   }

//   /* ===============================
//      Checkout
//      =============================== */
//   checkout(): Observable<CartDto> {
//     return this.http
//       .post<CartDto>(`${this.apiUrl}/checkout`, {})
//       .pipe(
//         tap(cart => this.cartSubject.next(cart)),
//         catchError(error => {
//           console.error('Checkout failed:', error);
//           return of(this.cartSubject.value);
//         })
//       );
//   }

//   /* ===============================
//      Helpers
//      =============================== */
//   getCartSnapshot(): CartDto {
//     return this.cartSubject.value;
//   }

//   getTotalItems(): number {
//     return this.cartSubject.value.items.reduce(
//       (sum, item) => sum + item.quantity,
//       0
//     );
//   }
// }
