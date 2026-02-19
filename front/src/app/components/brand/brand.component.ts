import { Component, OnInit } from '@angular/core';
import { Brand } from 'src/app/models/models';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {
  brands: Brand[] = [];
  brandData: Brand = { name: '', description: '' };
  selectedFile?: File;
  editingId?: number;
  isFormSubmitted = false; // Track form submission state

  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.brandService.getAll().subscribe(data => {
      this.brands = data;
    });
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  saveBrand(): void {
    this.isFormSubmitted = true;
    
    // Validate required fields
    if (!this.brandData.name || this.brandData.name.trim() === '') {
      return;
    }

    if (this.editingId) {
      this.brandService
        .update(this.editingId, this.brandData, this.selectedFile)
        .subscribe(() => {
          this.resetForm();
          this.loadBrands();
        });
    } else {
      this.brandService
        .create(this.brandData, this.selectedFile)
        .subscribe(() => {
          this.resetForm();
          this.loadBrands();
        });
    }
  }

  editBrand(brand: Brand): void {
    this.brandData = { 
      ...brand,
      description: brand.description || ''
    };
    this.editingId = brand.id;
    this.selectedFile = undefined;
    this.isFormSubmitted = false; // Reset form submission state
    
    // Optional: Scroll to form
    document.querySelector('.card')?.scrollIntoView({ behavior: 'smooth' });
  }

  deleteBrand(id?: number): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this brand?')) {
      this.brandService.delete(id).subscribe(() => {
        this.loadBrands();
      });
    }
  }

  resetForm(): void {
    this.brandData = { name: '', description: '' };
    this.selectedFile = undefined;
    this.editingId = undefined;
    this.isFormSubmitted = false; // Reset form submission state
  }

  getImageUrl(logoUrl: string | null | undefined): string {
    if (!logoUrl) return 'assets/no-image.png';
    return logoUrl.startsWith('http')
      ? logoUrl
      : 'http://localhost:8080' + logoUrl;
  }

  // Helper method to check if form is valid
  // isFormValid(): boolean {
  //   return this.brandData.name && this.brandData.name.trim() !== '';
  // }
}