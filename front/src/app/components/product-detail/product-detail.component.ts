import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  loading = false;
  activeImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadProduct(id);
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        alert('Failed to load product');
        this.loading = false;
      }
    });
  }

  setActiveImage(index: number): void {
    this.activeImageIndex = index;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  getDiscountedPrice(): number {
    return this.product?.discountPrice || this.product?.price || 0;
  }

  getDiscountPercent(): number {
    if (!this.product?.discountPrice) return 0;
    return Math.round(((this.product.price - this.product.discountPrice) / this.product.price) * 100);
  }

  getStockStatus(): string {
    if (!this.product) return '';
    
    if (this.product.stockQuantity > 10) return 'In Stock';
    if (this.product.stockQuantity > 0) return 'Low Stock';
    return 'Out of Stock';
  }

  getStockClass(): string {
    if (!this.product) return '';
    
    if (this.product.stockQuantity > 10) return 'success';
    if (this.product.stockQuantity > 0) return 'warning';
    return 'danger';
  }

  // Add this method to ProductDetailComponent
deleteProduct(id: number): void {
  if (confirm('Are you sure you want to delete this product?')) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        alert('Product deleted successfully!');
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    });
  }
}
}