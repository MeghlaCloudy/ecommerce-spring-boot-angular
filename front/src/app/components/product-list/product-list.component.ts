import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CartItemRequest, Product } from 'src/app/models/models';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  searchTerm: string = '';
  currentPage = 1;
  itemsPerPage = 12;
  totalItems = 0;
  sortField = 'name';
  sortDirection = 'asc';
  viewMode: 'grid' | 'list' = 'grid';
  selectedCategory: string = 'all';
  priceRange = { min: 0, max: 10000 };
  categories: string[] = [];

  currentUser: any = null;

  brandId: number | null = null;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
    });

    this.loadProducts();  // <-- প্রথমে লোড করো

  this.route.paramMap.subscribe((params) => {
    const id = params.get('id');
    this.brandId = id ? Number(id) : null;
    this.loadProducts();
  });

    // ২. সার্চ টার্ম (query param) থেকে লোড
    this.route.queryParamMap.subscribe((qParams) => {
      this.searchTerm = qParams.get('search') || '';
      this.applyFilters(); // সার্চ টার্ম চেঞ্জ হলে অটো ফিল্টার
    });
  }

  loadProducts(): void {
    this.loading = true;

    if (this.brandId !== null) {
      this.productService.getProductsByBrand(this.brandId).subscribe({
        next: (data) => {
          this.products = data;
          this.applyFiltersAndSetup(data);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading brand products:', err);
          this.loading = false;
        },
      });
    } else {
      this.productService.getAllProducts().subscribe({
        next: (data) => {
          this.products = data;
          this.applyFiltersAndSetup(data);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading all products:', err);
          this.loading = false;
        },
      });
    }
  }

  private applyFiltersAndSetup(data: Product[]) {
    this.filteredProducts = [...data];
    this.totalItems = data.length;
    this.extractCategories();
    this.applyFilters(); // সার্চ টার্ম থাকলে অটো ফিল্টার
  }

  extractCategories(): void {
    const allCategories = new Set<string>();
    this.products.forEach((product) => {
      if (product.categories) {
        product.categories.forEach((cat) => allCategories.add(cat));
      }
    });
    this.categories = Array.from(allCategories);
  }

  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.products];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();

      // ব্র্যান্ড ম্যাচ
      if (
        this.products.some((p) => p.brandName?.toLowerCase().includes(term))
      ) {
        filtered = filtered.filter((p) =>
          p.brandName?.toLowerCase().includes(term)
        );
      }
      // ক্যাটাগরি ম্যাচ
      else if (
        this.categories.some((cat) => cat.toLowerCase().includes(term))
      ) {
        filtered = filtered.filter((p) =>
          p.categories?.some((c) => c.toLowerCase().includes(term))
        );
      }
      // নরমাল সার্চ
      else {
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(term) ||
            product.sku?.toLowerCase().includes(term) ||
            product.description?.toLowerCase().includes(term)
        );
      }
    }

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter((product) =>
        product.categories?.includes(this.selectedCategory)
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= this.priceRange.min &&
        product.price <= this.priceRange.max
    );

    filtered = this.sortProducts(filtered);

    this.filteredProducts = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  sortProducts(products: Product[]): Product[] {
    return products.sort((a: any, b: any) => {
      let aValue = a[this.sortField];
      let bValue = b[this.sortField];

      // Handle date sorting
      if (this.sortField === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  sort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): number[] {
    const maxPagesToShow = 5;
    let pages: number[] = [];

    if (this.totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + maxPagesToShow - 1);

      if (end - start + 1 < maxPagesToShow) {
        start = end - maxPagesToShow + 1;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo(0, 0);
    }
  }

  getDiscountedPrice(product: Product): number {
    return product.discountPrice || product.price;
  }

  getDiscountPercent(product: Product): number {
    if (!product.discountPrice || product.discountPrice <= 0) return 0;
    return Math.round(
      ((product.price - product.discountPrice) / product.price) * 100
    );
  }

  getStockStatus(product: Product): string {
    if (product.stockQuantity > 10) return 'In Stock';
    if (product.stockQuantity > 0) return 'Low Stock';
    return 'Out of Stock';
  }

  getStockClass(product: Product): string {
    if (product.stockQuantity > 10) return 'success';
    if (product.stockQuantity > 0) return 'warning';
    return 'danger';
  }

  viewProduct(id: number): void {
    this.router.navigate(['/productdetail', id]);
  }

  editProduct(id: number): void {
    this.router.navigate(['/products/edit', id]);
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product');
        },
      });
    }
  }

  // addToCart(product: Product): void {
  //   const cartItemRequest: CartItemRequest = {
  //     productId: product.id,
  //     quantity: 1
  //   };

  //   console.log('Adding to cart:', cartItemRequest);

  //   this.cartService.addItemToCart(cartItemRequest).subscribe({
  //     next: (cart) => {
  //       console.log('Cart updated:', cart);
  //       alert(`Added ${product.name} to cart!`);
  //     },
  //     error: (error) => {
  //       console.error('Error adding item to cart:', error);
  //       alert('Failed to add item to cart');
  //     }
  //   });
  // }
  addToCart(product: Product): void {
    this.cartService.addItemToCart({
      productId: product.id,
      quantity: 1,
    });

    alert(`${product.name} added to cart`);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }

  // Role-based access methods using AuthService
  isAdmin(): boolean {
    return this.authService.hasRole('ROLE_ADMIN');
  }

  isModerator(): boolean {
    return this.authService.hasRole('ROLE_MODERATOR');
  }

  canEditProducts(): boolean {
    return this.isAdmin() || this.isModerator();
  }

  canDeleteProducts(): boolean {
    return this.isAdmin();
  }

  canAddProducts(): boolean {
    return this.isAdmin() || this.isModerator();
  }

  toggleViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.priceRange = { min: 0, max: 10000 };
    this.applyFilters();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Add this method to your component class
  getShowingRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `${start} to ${end} of ${this.totalItems}`;
  }

  // Alternative: Separate methods for start and end
  getShowingStart(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getShowingEnd(): number {
    const calculatedEnd = this.currentPage * this.itemsPerPage;
    return calculatedEnd > this.totalItems ? this.totalItems : calculatedEnd;
  }
}
