import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-signup',
    standalone: false,
    template: `
    <div class="signup-container">
      <div class="signup-card">
        <h2>Sign Up</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" [(ngModel)]="credentials.username" name="username" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" [(ngModel)]="credentials.password" name="password" required>
          </div>
          <button type="submit" [disabled]="loading">Register</button>
          
          <div class="login-link">
            Already have an account? <a routerLink="/login">Log in here</a>
          </div>

          <div *ngIf="message" class="success-message">{{ message }}</div>
          <div *ngIf="error" class="error">{{ error }}</div>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .signup-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: #eaeff2; }
    .signup-card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 300px; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; }
    .form-group input { width: 100%; padding: 0.5rem; box-sizing: border-box; }
    button { width: 100%; padding: 0.75rem; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
    button[disabled] { background: #ccc; }
    .login-link { text-align: center; margin-top: 1rem; font-size: 0.85rem; }
    .login-link a { color: #007bff; text-decoration: none; font-weight: 500;}
    .success-message { color: #28a745; margin-top: 1rem; font-size: 0.875rem; text-align: center; font-weight: bold; }
    .error { color: #dc3545; margin-top: 1rem; font-size: 0.875rem; text-align: center; }
  `]
})
export class SignupComponent {
    credentials = { username: '', password: '' };
    loading = false;
    error = '';
    message = '';

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit() {
        this.loading = true;
        this.error = '';
        this.message = '';

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
