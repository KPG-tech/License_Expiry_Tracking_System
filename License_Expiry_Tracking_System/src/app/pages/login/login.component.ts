import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="text-center mb-6">
          <h2 class="title">Welcome Back</h2>
          <p class="subtitle">Please enter your details to sign in.</p>
        </div>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" [(ngModel)]="credentials.username" name="username" required placeholder="Enter your username">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" [(ngModel)]="credentials.password" name="password" required placeholder="••••••••">
          </div>
          <button type="submit" [disabled]="loading" class="btn-primary">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
          <div *ngIf="error" class="error">{{ error }}</div>

          <div class="signup-link">
            Don't have an account? <a routerLink="/signup">Sign up for free</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #f0fdf4 0%, #e0e7ff 100%); }
    .login-card { background: white; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); width: 100%; max-width: 400px; }
    .text-center { text-align: center; }
    .mb-6 { margin-bottom: 2rem; }
    .title { font-size: 1.75rem; font-weight: 700; color: #111827; margin-bottom: 0.5rem; }
    .subtitle { color: #6b7280; font-size: 0.95rem; margin: 0; }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151; font-size: 0.9rem; }
    .form-group input { width: 100%; border: 1px solid #d1d5db; padding: 0.75rem 1rem; border-radius: 8px; transition: all 0.2s; font-family: inherit; }
    .form-group input:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
    .btn-primary { width: 100%; padding: 0.875rem; background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: opacity 0.2s, transform 0.1s; }
    .btn-primary:active { transform: scale(0.98); }
    .btn-primary[disabled] { opacity: 0.7; cursor: not-allowed; }
    .signup-link { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: #6b7280; }
    .signup-link a { color: #4f46e5; text-decoration: none; font-weight: 600; transition: color 0.2s; }
    .signup-link a:hover { color: #4338ca; }
    .error { color: #ef4444; margin-top: 1rem; font-size: 0.875rem; text-align: center; background: #fef2f2; padding: 0.75rem; border-radius: 8px; border: 1px solid #fecaca; }
  `]
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.error = 'Invalid username or password';
        this.loading = false;
      }
    });
  }
}
