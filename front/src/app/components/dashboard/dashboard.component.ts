import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dashVal = '';
  constructor(private authService: AuthService) {} 

  ngOnInit(): void {
    // this.dashVal = this.authService.CheckVal;
  }

  // setValue(): void {
  //   this.authService.setCheckVal(this.dashVal);
  // }
}
