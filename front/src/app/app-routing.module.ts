import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandComponent } from './components/brand/brand.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CategoryComponent } from './components/category/category.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AdminOrderListComponent } from './components/admin-order-list/admin-order-list.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { SkincareComponent } from './components/skincare/skincare.component';
import { MomsBabyComponent } from './components/moms-baby/moms-baby.component';
import { HairComponent } from './components/hair/hair.component';
import { MakeupComponent } from './components/makeup/makeup.component';
import { FragranceComponent } from './components/fragrance/fragrance.component';
import { AboutComponent } from './components/about/about.component';
import { JewelleryComponent } from './components/jewellery/jewellery.component';
import { ManComponent } from './components/man/man.component';
import { AccessoriesComponent } from './components/accessories/accessories.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'brands', component: BrandComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/edit/:id', component: ProductFormComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'productdetail/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orderlist', component: AdminOrderListComponent },
  { path: 'landing', component: LandingPageComponent },
  { path: 'skin', component: SkincareComponent },
  {path: 'brand/:id',component:ProductListComponent},
  {path: 'momBaby', component:MomsBabyComponent},
  {path: 'hair', component:HairComponent},
  {path: 'makeup', component:MakeupComponent},
  {path: 'fragrance', component:FragranceComponent},
  { path: 'about', component: AboutComponent },
  { path: 'jewellery', component: JewelleryComponent },
  { path: 'man', component: ManComponent },
  { path: 'accessories', component: AccessoriesComponent },
  {
  path: 'order-confirmation/:orderId',  // অর্ডার আইডি দিয়ে
  component: OrderConfirmationComponent
},

  { path: '', redirectTo: 'landing', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
