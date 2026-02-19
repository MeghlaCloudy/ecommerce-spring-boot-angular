import { Component } from '@angular/core';

@Component({
  selector: 'app-carousal',
  templateUrl: './carousal.component.html',
  styleUrls: ['./carousal.component.scss'],
})
export class CarousalComponent {
  images = [
    { src: 'assets/images/nirvana.jpg', alt: 'Slide 1' },
    { src: 'assets/images/website.jpg', alt: 'Slide 2' },
    { src: 'assets/images/shop.jpg', alt: 'Slide 3' },
    { src: 'assets/images/powders-.jpg', alt: 'Slide 4' },
  ];
}
