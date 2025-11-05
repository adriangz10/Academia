import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  activeTab = 'login';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.getRawValue();
      this.authService.login(email!, password!).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }

  register() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.getRawValue();
      this.authService.register(name!, email!, password!).subscribe(() => {
        this.activeTab = 'login';
      });
    }
  }
}
