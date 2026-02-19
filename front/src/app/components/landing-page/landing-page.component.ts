import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  images = [
    { src: 'assets/images/nirvana.jpg', alt: 'Slide 1' },
    { src: 'assets/images/website.jpg', alt: 'Slide 2' },
    { src: 'assets/images/shop.jpg', alt: 'Slide 3' },
    { src: 'assets/images/powders-.jpg', alt: 'Slide 4' },
  ];

  // images = [
  //   {
  //     src: 'assets/images/nirvana.jpg', // তোমার সেভ করা নাম
  //     alt: 'Mega Sale',
  //     title: 'The Great Giga Sale',
  //     subtitle: 'Up to 70% Off on Beauty Products',
  //   },
  //   {
  //     src: 'assets/images/website.jpg',
  //     alt: 'New Arrivals',
  //     title: 'New Year New You',
  //     subtitle: 'Latest Beauty & Skincare Collection',
  //   },
  //   {
  //     src: 'assets/images/shop.jpg',
  //     alt: 'Free Shipping',
  //     title: 'Free Shipping Nationwide',
  //     subtitle: 'On All Orders Above ৳999',
  //   },
  //   {
  //     src: 'assets/images/powders-.jpg',
  //     alt: 'Exclusive Deals',
  //     title: 'Exclusive Brand Deals',
  //     subtitle: "COSRX, The Ordinary, L'Oreal & More",
  //   },
  // ];
}
