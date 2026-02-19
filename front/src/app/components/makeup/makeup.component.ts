import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-makeup',
  templateUrl: './makeup.component.html',
  styleUrls: ['./makeup.component.scss']
})
export class MakeupComponent implements OnInit{

  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  currentPage = 1;
  itemsPerPage = 12;
  totalItems = 0;
  viewMode: 'grid' | 'list' = 'grid';

  currentUser: any = null;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => this.currentUser = user);
    this.loadMakeupProducts();
  }

  loadMakeupProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.filter(p => p.categories?.includes('Makeup'));
        this.filteredProducts = [...this.products];
        this.totalItems = this.filteredProducts.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading makeup products:', err);
        this.loading = false;
      }
    });
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    return pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  toggleViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BDT' }).format(price);
  }

  getDiscountedPrice(product: Product): number {
    return product.discountPrice || product.price;
  }

  getDiscountPercent(product: Product): number {
    if (!product.discountPrice) return 0;
    return Math.round(((product.price - product.discountPrice) / product.price) * 100);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  addToCart(product: Product): void {
    this.cartService.addItemToCart({ productId: product.id, quantity: 1 });
    alert(`${product.name} added to cart!`);
  }

   viewProduct(id: number): void {
    this.router.navigate(['/productdetail', id]);
  }

}
