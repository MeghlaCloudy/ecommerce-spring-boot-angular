import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
})
export class OrderConfirmationComponent implements OnInit {
  order: any;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    if (orderId && orderId !== 'latest') {
      this.orderService.getOrderById(Number(orderId)).subscribe({
        next: (data) => (this.order = data),
      });
    } else {
      // যদি latest অর্ডার দেখাতে চাও – তুমি localStorage বা service থেকে নিতে পারো
      this.order = history.state.order; // অথবা backend থেকে latest fetch করো
    }
  }

 
  getPaymentMethodText(method: string): string {
    switch (method) {
      case 'CASH_ON_DELIVERY':
        return 'Cash on Delivery';
      case 'BKASH':
        return 'bKash';
      case 'CARD':
        return 'Card / Mobile Wallet';
      default:
        return method || 'N/A';
    }
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return 'https://via.placeholder.com/300';
    return imagePath.startsWith('http')
      ? imagePath
      : 'http://localhost:8080' + imagePath;
  }
}
