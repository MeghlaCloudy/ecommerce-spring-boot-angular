import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { OrderDto } from '../../models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-order-list',
  templateUrl: './admin-order-list.component.html',
  styleUrls: ['./admin-order-list.component.scss']
})
export class AdminOrderListComponent implements OnInit {

  orders: OrderDto[] = [];
  selectedOrder: OrderDto | null = null;
  loading = true;
  error = '';

  @ViewChild('orderDetailsContent') orderDetailsContent!: ElementRef;

  constructor(
    public authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn() || !this.authService.hasRole('ROLE_ADMIN')) {
      this.router.navigate(['/']);
      return;
    }

    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders.';
        this.loading = false;
      }
    });
  }

  updateStatus(orderId: number, newStatus: string) {
    if (!confirm(`Change status to ${newStatus}?`)) return;

    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (updated) => {
        const idx = this.orders.findIndex(o => o.orderId === updated.orderId);
        if (idx !== -1) this.orders[idx] = updated;
      }
    });
  }

  // রো ক্লিক করলে মোডাল ওপেন
  openOrderDetails(order: OrderDto) {
    this.selectedOrder = order;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('orderDetailsModal'));
    modal.show();
  }

  // প্রিন্ট ফাংশন
  printOrder() {
    const printContent = this.orderDetailsContent.nativeElement.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow?.document.write(`
      <html>
        <head><title>Order #${this.selectedOrder?.orderId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f0f0f0; }
        </style>
        </head>
        <body onload="window.print();window.close()">
          <h2>Order Details - #${this.selectedOrder?.orderId}</h2>
          ${printContent}
        </body>
      </html>
    `);
    printWindow?.document.close();
  }
}