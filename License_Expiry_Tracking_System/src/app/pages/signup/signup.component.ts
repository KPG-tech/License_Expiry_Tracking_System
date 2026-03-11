import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: false,
  template: `
    <div class="signup-container">
      <div class="signup-card">
        <div class="text-center mb-6">
          <h1 class="system-title">License Expiry Tracking System</h1>
          <h2 class="title mt-4">Create an Account</h2>
          <p class="subtitle">Join us to start tracking your licenses.</p>
        </div>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" [(ngModel)]="credentials.username" name="username" required placeholder="Choose a username">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" [(ngModel)]="credentials.password" name="password" required minlength="6" placeholder="Create a strong password">
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" [(ngModel)]="confirmPassword" name="confirmPassword" required placeholder="Repeat your password">
          </div>
          <button type="submit" [disabled]="loading" class="btn-primary">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
          
          <div class="login-link">
            Already have an account? <a routerLink="/login">Sign in</a>
          </div>

          <div *ngIf="message" class="success-message">{{ message }}</div>
          <div *ngIf="error" class="error">{{ error }}</div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .signup-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #f0fdf4 0%, #e0e7ff 100%); padding: 1rem; }
    .signup-card { background: white; padding: 3rem 2.5rem; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); width: 100%; max-width: 420px; }
    .text-center { text-align: center; }
    .mb-6 { margin-bottom: 2.5rem; }
    .mt-4 { margin-top: 1rem; }
    .brand-logo { font-size: 3rem; margin-bottom: 0.5rem; }
    .system-title { font-size: 1.35rem; font-weight: 700; color: #10b981; margin: 0; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1.3; }
    .title { font-size: 1.75rem; font-weight: 700; color: #111827; margin-bottom: 0.5rem; }
    .subtitle { color: #6b7280; font-size: 0.95rem; margin: 0; }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151; font-size: 0.9rem; }
    .form-group input { width: 100%; border: 1px solid #d1d5db; padding: 0.75rem 1rem; border-radius: 8px; transition: all 0.2s; font-family: inherit; }
    .form-group input:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
    .btn-primary { width: 100%; padding: 0.875rem; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: opacity 0.2s, transform 0.1s; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3); }
    .btn-primary:active { transform: scale(0.98); }
    .btn-primary[disabled] { opacity: 0.7; cursor: not-allowed; }
    .login-link { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: #6b7280; }
    .login-link a { color: #4f46e5; text-decoration: none; font-weight: 600; transition: color 0.2s; }
    .login-link a:hover { color: #4338ca; }
    .success-message { color: #047857; margin-top: 1rem; font-size: 0.875rem; text-align: center; background: #d1fae5; padding: 0.75rem; border-radius: 8px; border: 1px solid #a7f3d0; font-weight: 500; }
    .error { color: #ef4444; margin-top: 1rem; font-size: 0.875rem; text-align: center; background: #fef2f2; padding: 0.75rem; border-radius: 8px; border: 1px solid #fecaca; }
  `]
})
export class SignupComponent {
  credentials = { username: '', password: '' };
  confirmPassword = '';
  loading = false;
  error = '';
  message = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.error = '';
    this.message = '';

    if (!this.credentials.username || !this.credentials.password || !this.confirmPassword) {
      this.error = 'Please fill out all fields.';
      return;
    }

    if (this.credentials.password.length < 6) {
      this.error = 'Password must be at least 6 characters long.';
      return;
    }

    if (this.credentials.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.loading = true;

    this.authService.signup(this.credentials).subscribe({
      next: (response) => {
        this.message = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: any) => {
        this.error = err.error?.error || 'Registration failed. Try a different username.';
        this.loading = false;
      }
    });
  }
}
