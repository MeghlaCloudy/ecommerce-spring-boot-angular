import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { LoginResponse, User } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'jwtToken';

  // BehaviorSubject to store full user info
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize user from token if exists
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const user = this.parseUserFromToken(token);
      this.userSubject.next(user);
    }
  }

  login(username: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/signin`, { username, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.tokenKey, res.jwtToken);

          // Parse JWT directly to get user data
          const user = this.parseUserFromToken(res.jwtToken);

          // fallback if token parsing fails
          if (!user && res.user) {
            this.userSubject.next({
              userName: res.user.userName,
              userFirstName: res.user.userFirstName,
              userLastName: res.user.userLastName,
              email: res.user.email,
              roles: res.user.roles.map((r) => r.roleName),
            });
          } else {
            this.userSubject.next(user);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  hasRole(role: string): boolean {
    return this.userSubject.value?.roles?.includes(role) || false;
  }

  private parseUserFromToken(token: string): User | null {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      return {
        userName: payload.sub,
        userFirstName: payload.userFirstName || '',
        userLastName: payload.userLastName || '',
        email: payload.email || '',
        roles: payload.roles || [],
      };
    } catch (error) {
      console.error('Failed to parse JWT:', error);
      return null;
    }
  }

  register(userData: {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
  }) {
    return this.http.post(`${this.baseUrl}/signup`, {
      username: userData.username,
      password: userData.password,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      roles: ['USER'], // ডিফল্ট ইউজার রোল
    });
  }
}
