import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <div class="app-layout">
      <!-- Sidebar placeholder -->
      <aside class="sidebar" *ngIf="authService.isAuthenticated()">
         <div class="brand">
           <h2>License Tracker</h2>
         </div>
         <nav class="nav-menu">
           <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
           <a routerLink="/licenses" routerLinkActive="active">Licenses</a>
           <a (click)="logout()" class="logout-link">Logout</a>
         </nav>
      </aside>

      <!-- Main content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
    }
    .sidebar {
      width: 250px;
      background: #2c3e50;
      color: white;
      display: flex;
      flex-direction: column;
    }
    .brand {
      padding: 1.5rem;
      background: #1a252f;
      text-align: center;
    }
    .brand h2 { margin: 0; font-size: 1.25rem; }
    .nav-menu {
      display: flex;
      flex-direction: column;
      padding: 1rem 0;
    }
    .nav-menu a {
      padding: 1rem 1.5rem;
      color: #ecf0f1;
      text-decoration: none;
      transition: background 0.3s;
      cursor: pointer;
    }
    .nav-menu a:hover {
      background: #34495e;
    }
    .nav-menu a.active {
      background: #3498db;
      border-left: 4px solid #2980b9;
    }
    .logout-link {
      margin-top: auto;
      color: #e74c3c !important;
    }
    .main-content {
      flex: 1;
      padding: 2rem;
      background: #f8f9fa;
      overflow-y: auto;
    }
  `]
})
export class AppComponent {
  title = 'License Expiry Tracking System';

  constructor(public authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
