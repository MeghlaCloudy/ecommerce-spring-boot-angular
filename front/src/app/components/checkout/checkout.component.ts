import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { CartDto } from 'src/app/models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  cart!: CartDto;
  paymentMethod: string = 'CASH_ON_DELIVERY';
  shippingMethod: string = 'INSIDE_DHAKA';
  loading: boolean = false;
  bkashNumber: string = '';

  address = {
    name: '',
    phone: '',
    city: '',
    area: '',
    street: '',
    email: '',
    note: '',
    country: 'Bangladesh',
    zipCode: '',
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((cart) => {
      if (cart && cart.items.length > 0) {
        this.cart = cart;
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  get totalItems(): number {
    return this.cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }

  get totalAmount(): number {
    return this.cart?.totalAmount || 0;
  }

  get deliveryCharge(): number {
    return this.shippingMethod === 'INSIDE_DHAKA' ? 60 : 100;
  }

  get finalTotal(): number {
    return this.totalAmount + this.deliveryCharge;
  }

  placeOrder(): void {
    // কার্ট চেক
    if (!this.cart || this.cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // bKash নাম্বার চেক
    if (this.paymentMethod === 'BKASH' && !this.bkashNumber.trim()) {
      alert('Please enter your bKash mobile number.');
      return;
    }

    // বাধ্যতামূলক ফিল্ড চেক
    if (
      !this.address.name.trim() ||
      !this.address.phone.trim() ||
      !this.address.city.trim() ||
      !this.address.street.trim()
    ) {
      alert(
        'Please fill in all required fields: Name, Phone, City, and Address.'
      );
      return;
    }

    this.loading = true;

    const checkoutRequest: any = {
      paymentMethod: this.paymentMethod,
      shippingMethod: this.shippingMethod,
      bkashNumber:
        this.paymentMethod === 'BKASH' ? this.bkashNumber.trim() : null,
      name: this.address.name.trim(),
      phone: this.address.phone.trim(),
      city: this.address.city.trim(),
      area: this.address.area?.trim() || null,
      street: this.address.street.trim(),
      email: this.address.email?.trim() || null,
      note: this.address.note?.trim() || null,
      country: this.address.country,
      zipCode: this.address.zipCode?.trim() || null,
    };

    this.orderService.checkout(checkoutRequest).subscribe({
      next: (response: any) => {
        alert('Order placed successfully! Thank you for shopping with us.');

        // কার্ট ক্লিয়ার
        this.cartService.clearCart();

        // Confirmation পেজে যাও (অর্ডার আইডি পেলে)
        const orderId =
          response?.orderId ||
          response?.id ||
          response?.orderNumber ||
          'latest';
        this.router.navigate(['/order-confirmation', orderId]);

        this.loading = false;
      },
      error: (err) => {
        console.error('Checkout error:', err);
        const errorMsg =
          err.error?.message ||
          err.error ||
          'Checkout failed. Please try again.';
        alert('Checkout failed: ' + errorMsg);
        this.loading = false;
      },
    });
  }
}
