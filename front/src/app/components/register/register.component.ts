import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  user = {
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.authService.register(this.user).subscribe({
      next: (response: any) => {
        alert('Registration successful! Now login with the same credentials.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        let errorMsg = 'Registration failed!';
        if (err.error && typeof err.error === 'string') {
          errorMsg = err.error;
        } else if (err.error) {
          errorMsg = JSON.stringify(err.error);
        }
        alert(errorMsg);
      },
    });
  }
}
