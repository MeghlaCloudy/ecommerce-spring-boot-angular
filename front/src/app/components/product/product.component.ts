// import { Component } from '@angular/core';
// import { Product } from 'src/app/models/models';
// import { ProductService } from 'src/app/services/product.service';

// @Component({
//   selector: 'app-product',
//   templateUrl: './product.component.html'
// })
// export class ProductComponent {

//   products: any[] = [];
//   productForm: Product = { name: '', price: 0, stockQuantity: 0 };
//   selectedImages: File[] = [];
//   editingId?: number;

//   constructor(private productService: ProductService) {
//     this.loadProducts();
//   }

//   loadProducts() {
//     this.productService.getAll().subscribe(res => this.products = res);
//   }

//   onImageChange(event: any) {
//     this.selectedImages = Array.from(event.target.files);
//   }

//   save() {
//     if (this.editingId) {
//       this.productService.update(this.editingId, this.productForm, this.selectedImages)
//         .subscribe(() => this.reset());
//     } else {
//       this.productService.create(this.productForm, this.selectedImages)
//         .subscribe(() => this.reset());
//     }
//   }

//   edit(p: any) {
//     this.productForm = { ...p };
//     this.editingId = p.id;
//   }

//   delete(id: number) {
//     this.productService.delete(id).subscribe(() => this.loadProducts());
//   }

//   reset() {
//     this.productForm = { name: '', price: 0, stockQuantity: 0 };
//     this.selectedImages = [];
//     this.editingId = undefined;
//     this.loadProducts();
//   }

//   imageUrl(url: string) {
//     return 'http://localhost:8080' + url;
//   }
// }
