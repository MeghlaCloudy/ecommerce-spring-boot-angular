
import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { CartDto, ItemDto } from 'src/app/models/models';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cart!: CartDto;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  increaseQty(item: ItemDto): void {
    this.cartService.updateCartItem(item.itemId, {
      productId: item.productId,
      quantity: item.quantity + 1
    });
  }

  decreaseQty(item: ItemDto): void {
    if (item.quantity === 1) return;

    this.cartService.updateCartItem(item.itemId, {
      productId: item.productId,
      quantity: item.quantity - 1
    });
  }

  removeItem(item: ItemDto): void {
    if (!confirm('Remove this item from cart?')) return;

    this.cartService.removeCartItem(item.itemId);
  }

  clearCart(): void {
    if (!confirm('Clear entire cart?')) return;

    this.cartService.clearCart();
  }

  get totalItems(): number {
    return this.cart.items.reduce(
      (sum, i) => sum + i.quantity,
      0
    );
  }
}
// import { Component, OnInit } from '@angular/core';
// import { CartService } from 'src/app/services/cart.service';
// import { CartDto, ItemDto } from 'src/app/models/models';

// @Component({
//   selector: 'app-cart',
//   templateUrl: './cart.component.html',
//   styleUrls: ['./cart.component.scss']
// })
// export class CartComponent implements OnInit {

//   cart!: CartDto;

//   constructor(private cartService: CartService) {}

//   ngOnInit(): void {
//     this.cartService.cart$.subscribe(cart => {
//       this.cart = cart;
//     });
//   }

//   increaseQty(item: ItemDto): void {
//     this.cartService.updateCartItem(item.itemId, {
//       productId: item.productId,
//       quantity: item.quantity + 1
//     }).subscribe();
//   }

//   decreaseQty(item: ItemDto): void {
//     if (item.quantity === 1) return;

//     this.cartService.updateCartItem(item.itemId, {
//       productId: item.productId,
//       quantity: item.quantity - 1
//     }).subscribe();
//   }

//   removeItem(item: ItemDto): void {
//     if (!confirm('Remove this item from cart?')) return;

//     this.cartService.removeCartItem(item.itemId).subscribe();
//   }

//   clearCart(): void {
//     if (!confirm('Clear entire cart?')) return;

//     this.cartService.clearCart().subscribe();
//   }

//   get totalItems(): number {
//     return this.cart.items.reduce((sum, i) => sum + i.quantity, 0);
//   }
// }