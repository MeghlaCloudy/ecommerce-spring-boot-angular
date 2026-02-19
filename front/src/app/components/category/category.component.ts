import { Component } from '@angular/core';
import { Category } from 'src/app/models/models';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {

  categories: Category[] = [];
  categoryForm: Category = { name: '' };
  selectedFile?: File;
  editingId?: number;

  constructor(private categoryService: CategoryService) {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(res => this.categories = res);
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  save() {
    if (this.editingId) {
      this.categoryService.update(this.editingId, this.categoryForm, this.selectedFile)
        .subscribe(() => this.reset());
    } else {
      this.categoryService.create(this.categoryForm, this.selectedFile)
        .subscribe(() => this.reset());
    }
  }

  edit(cat: Category) {
    this.categoryForm = { ...cat };
    this.editingId = cat.id;
  }

  delete(id?: number) {
    if (!id) return;
    this.categoryService.delete(id)
      .subscribe(() => this.loadCategories());
  }

  reset() {
    this.categoryForm = { name: '' };
    this.selectedFile = undefined;
    this.editingId = undefined;
    this.loadCategories();
  }

  imageUrl(url?: string) {
    return url ? 'http://localhost:8080' + url : '';
  }
}
