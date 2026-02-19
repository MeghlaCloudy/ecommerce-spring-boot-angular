import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'; // Router ইম্পোর্ট করো
import { Subscription } from 'rxjs';
import { Brand, User } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { BrandService } from 'src/app/services/brand.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  cartItemCount = 0;
  brands: Brand[] = [];

  // নতুন: গ্লোবাল সার্চের জন্য
  globalSearchTerm: string = '';

  private subscriptions = new Subscription();

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private brandService: BrandService,
    private router: Router // ইনজেক্ট করো
  ) {}

  ngOnInit(): void {
    /* User state */
    this.subscriptions.add(
      this.authService.user$.subscribe((user) => {
        this.currentUser = user;

        if (user) {
          this.cartService.loadCart();
        } else {
          this.cartItemCount = 0;
        }
      })
    );

    /* Cart state */
    this.subscriptions.add(
      this.cartService.cart$.subscribe((cart) => {
        this.cartItemCount = cart.items.length;
      })
    );

    /* Load Brands - Dynamic */
    this.loadBrands();
  }

  loadBrands(): void {
    this.subscriptions.add(
      this.brandService.getAll().subscribe({
        next: (data) => {
          this.brands = data;
        },
        error: (err) => {
          console.error('Failed to load brands', err);
          this.brands = [];
        },
      })
    );
  }

  // নতুন: গ্লোবাল সার্চ ফাংশন
  globalSearch(): void {
    if (this.globalSearchTerm.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { search: this.globalSearchTerm.trim() },
      });
    } else {
      this.router.navigate(['/products']);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get halfLength(): number {
    return Math.ceil(this.brands.length / 2);
  }
}
