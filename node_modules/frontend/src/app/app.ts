import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = 'frontend';
  authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
