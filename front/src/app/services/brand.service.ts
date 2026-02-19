import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class BrandService {


  private baseUrl = 'http://localhost:8080/api/brands';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.baseUrl);
  }

  getById(id: number): Observable<Brand> {
    return this.http.get<Brand>(`${this.baseUrl}/${id}`);
  }

  create(brand: Brand, logo?: File): Observable<Brand> {
    const formData = new FormData();
    formData.append(
      'brand',
      new Blob([JSON.stringify(brand)], { type: 'application/json' })
    );

    if (logo) {
      formData.append('logo', logo);
    }

    return this.http.post<Brand>(this.baseUrl, formData);
  }

  update(id: number, brand: Brand, logo?: File): Observable<Brand> {
    const formData = new FormData();
    formData.append(
      'brand',
      new Blob([JSON.stringify(brand)], { type: 'application/json' })
    );

    if (logo) {
      formData.append('logo', logo);
    }

    return this.http.put<Brand>(`${this.baseUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
