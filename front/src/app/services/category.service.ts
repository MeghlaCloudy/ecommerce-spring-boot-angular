import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Category[]>(this.apiUrl);
  }

  create(category: Category, image?: File) {
    const formData = new FormData();
    formData.append('category', new Blob(
      [JSON.stringify(category)],
      { type: 'application/json' }
    ));
    if (image) formData.append('image', image);
    return this.http.post<Category>(this.apiUrl, formData);
  }

  update(id: number, category: Category, image?: File) {
    const formData = new FormData();
    formData.append('category', new Blob(
      [JSON.stringify(category)],
      { type: 'application/json' }
    ));
    if (image) formData.append('image', image);
    return this.http.put<Category>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
