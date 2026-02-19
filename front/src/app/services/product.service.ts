import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductRequest, Product, Brand, Category } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Create product with FormData
  createProduct(
    productRequest: ProductRequest,
    imageFiles: File[]
  ): Observable<Product> {
    const formData = new FormData();

    // 1. Add product JSON as a Blob
    const productBlob = new Blob([JSON.stringify(productRequest)], {
      type: 'application/json',
    });
    formData.append('product', productBlob);

    // 2. Add image files
    imageFiles.forEach((file, index) => {
      formData.append('images', file, file.name);
    });

    return this.http.post<Product>(`${this.apiUrl}/products`, formData);
  }

  // Update product with FormData
  updateProduct(
    id: number,
    productRequest: ProductRequest,
    imageFiles: File[]
  ): Observable<Product> {
    const formData = new FormData();

    // 1. Add product JSON as a Blob
    const productBlob = new Blob([JSON.stringify(productRequest)], {
      type: 'application/json',
    });
    formData.append('product', productBlob);

    // 2. Add image files
    imageFiles.forEach((file, index) => {
      formData.append('images', file, file.name);
    });

    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, formData);
  }

  // Other methods remain the same...
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.apiUrl}/brands`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getProductsByBrand(brandId: number): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/products?brandId=${brandId}`
    );
    // বা তোমার backend API অনুযায়ী
  }
}