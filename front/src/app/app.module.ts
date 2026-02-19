import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrandComponent } from './components/brand/brand.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { JwtInterceptor } from './jwt.interceptor';
import { CategoryComponent } from './components/category/category.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AdminOrderListComponent } from './components/admin-order-list/admin-order-list.component';
import { CarousalComponent } from './components/carousal/carousal.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { SkincareComponent } from './components/skincare/skincare.component';
import { MomsBabyComponent } from './components/moms-baby/moms-baby.component';
import { HairComponent } from './components/hair/hair.component';
import { FragranceComponent } from './components/fragrance/fragrance.component';
import { MakeupComponent } from './components/makeup/makeup.component';
import { AboutComponent } from './components/about/about.component';
import { JewelleryComponent } from './components/jewellery/jewellery.component';
import { ManComponent } from './components/man/man.component';
import { AccessoriesComponent } from './components/accessories/accessories.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';

@NgModule({
  declarations: [
    AppComponent,
    BrandComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    NavbarComponent,
    CategoryComponent,
    ProductFormComponent,
    ProductListComponent,
    ProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    AdminOrderListComponent,
    CarousalComponent,
    LandingPageComponent,
    SkincareComponent,
    MomsBabyComponent,
    HairComponent,
    FragranceComponent,
    MakeupComponent,
    AboutComponent,
    JewelleryComponent,
    ManComponent,
    AccessoriesComponent,
    OrderConfirmationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
