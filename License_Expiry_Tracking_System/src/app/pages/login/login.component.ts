import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Login</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" [(ngModel)]="credentials.username" name="username" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" [(ngModel)]="credentials.password" name="password" required>
          </div>
          <button type="submit" [disabled]="loading">Login</button>
          <div *ngIf="error" class="error">{{ error }}</div>

          <div class="signup-link">
            Don't have an account? <a routerLink="/signup">Sign up here</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: #eaeff2; }
    .login-card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 300px; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; }
    .form-group input { width: 100%; padding: 0.5rem; box-sizing: border-box; }
    button { width: 100%; padding: 0.75rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button[disabled] { background: #ccc; }
    .signup-link { text-align: center; margin-top: 1rem; font-size: 0.85rem; }
    .signup-link a { color: #007bff; text-decoration: none; font-weight: 500; }
    .error { color: red; margin-top: 1rem; font-size: 0.875rem; text-align: center; }
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
