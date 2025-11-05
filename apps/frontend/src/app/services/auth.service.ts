import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000'; // Assuming backend runs on port 3000
  isAuthenticated = signal(false);

  constructor(private http: HttpClient) { }

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.API_URL}/users/register`, { name, email, password });
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.API_URL}/users/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.isAuthenticated.set(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.set(false);
  }

  isLoggedIn() {
    const token = localStorage.getItem('token');
    this.isAuthenticated.set(!!token);
    return !!token;
  }
}
