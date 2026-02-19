import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Brand, Category, ProductRequest } from 'src/app/models/models';
import { BrandService } from 'src/app/services/brand.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId?: number;
  brands: Brand[] = [];
  categories: Category[] = [];
  selectedCategories: number[] = [];
  existingImages: string[] = []; // Images already saved on server
  newImageFiles: File[] = []; // New images to upload
  loading = false;
  imagePreviews: string[] = []; // Previews for new images

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadBrands();
    this.loadCategories();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.maxLength(5000)],
      price: [0, [Validators.required, Validators.min(0.01)]],
      discountPrice: [0, [Validators.min(0)]],
      sku: ['', Validators.required],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      brandId: [null, Validators.required]
    });
  }

  loadBrands(): void {
    this.brandService.getAll().subscribe({
      next: (data) => this.brands = data,
      error: (error) => {
        console.error('Error loading brands:', error);
        alert('Failed to load brands');
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: (error) => {
        console.error('Error loading categories:', error);
        alert('Failed to load categories');
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description || '',
          price: product.price,
          discountPrice: product.discountPrice || 0,
          sku: product.sku,
          stockQuantity: product.stockQuantity,
          brandId: product.brandId
        });

        this.existingImages = product.images || [];
        this.selectedCategories = product.categoryIds || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        alert('Failed to load product');
        this.router.navigate(['/products']);
      }
    });
  }

  onCategoryChange(categoryId: number, event: any): void {
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      const index = this.selectedCategories.indexOf(categoryId);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
  }

  onImageSelected(event: any): void {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.match('image.*')) {
        alert(`File ${file.name} is not an image. Please select image files only.`);
        continue;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      this.newImageFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }

    // Clear file input
    event.target.value = '';
  }

  removeExistingImage(index: number): void {
    this.existingImages.splice(index, 1);
  }

  removeNewImage(index: number): void {
    this.newImageFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  setPrimaryImage(index: number, isExisting: boolean = false): void {
    if (isExisting) {
      // Move existing image to front
      const img = this.existingImages[index];
      this.existingImages.splice(index, 1);
      this.existingImages.unshift(img);
    } else {
      // Move new image to front
      const file = this.newImageFiles[index];
      const preview = this.imagePreviews[index];

      this.newImageFiles.splice(index, 1);
      this.imagePreviews.splice(index, 1);

      this.newImageFiles.unshift(file);
      this.imagePreviews.unshift(preview);
    }
  }

  prepareProductRequest(): ProductRequest {
    const formValue = this.productForm.value;

    const productRequest: ProductRequest = {
      name: formValue.name,
      description: formValue.description || undefined,
      price: formValue.price,
      discountPrice: formValue.discountPrice > 0 ? formValue.discountPrice : undefined,
      sku: formValue.sku || undefined,
      stockQuantity: formValue.stockQuantity,
      brandId: formValue.brandId || undefined,
      categoryIds: this.selectedCategories.length > 0 ? this.selectedCategories : undefined
    };

    // Include existing image URLs for update
    if (this.isEditMode && this.existingImages.length > 0) {
      productRequest.imageUrls = this.existingImages;
    }

    return productRequest;
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    const productRequest = this.prepareProductRequest();
    this.loading = true;

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, productRequest, this.newImageFiles)
        .subscribe({
          next: () => {
            alert('Product updated successfully!');
            this.router.navigate(['/products']);
          },
          error: (error) => {
            console.error('Error updating product:', error);
            alert('Failed to update product. Please try again.');
            this.loading = false;
          }
        });
    } else {
      this.productService.createProduct(productRequest, this.newImageFiles)
        .subscribe({
          next: () => {
            alert('Product created successfully!');
            this.router.navigate(['/products']);
          },
          error: (error) => {
            console.error('Error creating product:', error);
            alert('Failed to create product. Please try again.');
            this.loading = false;
          }
        });
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel(): void {
    if (confirm('Are you sure? Any unsaved changes will be lost.')) {
      this.router.navigate(['/products']);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  get f() {
    return this.productForm.controls;
  }
}