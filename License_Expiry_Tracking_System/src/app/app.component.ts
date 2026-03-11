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
         <div class="user-profile" *ngIf="authService.currentUser$ | async as user">
           Welcome, <strong>{{ user.username }}</strong>
         </div>
         <nav class="nav-menu">
           <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
             <span class="icon">📊</span> Dashboard
           </a>
           <a routerLink="/licenses" routerLinkActive="active">
             <span class="icon">🎟️</span> Licenses
           </a>
           <a (click)="logout()" class="logout-link">
             <span class="icon">🚪</span> Logout
           </a>
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
      width: 260px;
      background: linear-gradient(180deg, #111827 0%, #1f2937 100%);
      color: white;
      display: flex;
      flex-direction: column;
      box-shadow: 4px 0 10px rgba(0,0,0,0.05);
      z-index: 10;
    }
    .brand {
      padding: 1.75rem 1.5rem;
      background: rgba(0,0,0,0.2);
    }
    .brand h2 { margin: 0; font-size: 1.4rem; font-weight: 700; color: #f9fafb; letter-spacing: 0.5px; }
    .user-profile {
      padding: 1.25rem 1.5rem;
      background: rgba(255,255,255,0.03);
      border-bottom: 1px solid rgba(255,255,255,0.05);
      font-size: 0.9rem;
      color: #9ca3af;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .user-profile strong {
      color: #f3f4f6;
      font-weight: 600;
      font-size: 0.95rem;
    }
    .nav-menu {
      display: flex;
      flex-direction: column;
      padding: 1.5rem 0;
      flex: 1;
    }
    .nav-menu a {
      padding: 1rem 1.75rem;
      color: #d1d5db;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 500;
      border-left: 3px solid transparent;
    }
    .nav-menu a:hover {
      background: rgba(255,255,255,0.05);
      color: white;
    }
    .nav-menu a.active {
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
      border-left-color: #6366f1;
    }
    .logout-link {
      margin-top: auto;
      color: #fca5a5 !important;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .logout-link:hover {
      background: rgba(239, 68, 68, 0.1) !important;
      color: #f87171 !important;
    }
    .main-content {
      flex: 1;
      padding: 2.5rem 3rem;
      background: var(--bg-color);
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
