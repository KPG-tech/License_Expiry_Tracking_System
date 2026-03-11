import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LicenseService } from '../../services/license.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  template: `
    <div class="dashboard fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard Overview</h1>
          <p class="page-subtitle">Track and manage your software licenses.</p>
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card" (click)="goToLicenses('')">
          <div class="stat-icon bg-indigo-100 text-indigo-600">📊</div>
          <div>
            <h3 class="stat-label">Total Licenses</h3>
            <p class="stat-number">{{ stats?.total || 0 }}</p>
          </div>
        </div>
        <div class="stat-card stat-expiring" (click)="goToLicenses('Expiring Soon')">
          <div class="stat-icon bg-amber-100 text-amber-600">⚠️</div>
          <div>
            <h3 class="stat-label">Expiring Soon</h3>
            <p class="stat-number">{{ stats?.expiringSoon || 0 }}</p>
          </div>
        </div>
        <div class="stat-card stat-expired" (click)="goToLicenses('Expired')">
          <div class="stat-icon bg-red-100 text-red-600">🚨</div>
          <div>
            <h3 class="stat-label">Expired</h3>
            <p class="stat-number">{{ stats?.expired || 0 }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { max-width: 1200px; margin: 0 auto; }
    .fade-in { animation: fadeIn 0.4s ease-in; }
    .page-header { margin-bottom: 2.5rem; }
    .page-title { font-size: 2rem; color: #111827; margin: 0 0 0.5rem 0; font-weight: 700; }
    .page-subtitle { color: #6b7280; margin: 0; font-size: 1rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
    .stat-card { background: white; padding: 1.75rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 1.25rem; border: 1px solid #f3f4f6; }
    .stat-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); border-color: #e5e7eb; }
    .stat-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; flex-shrink: 0; }
    .bg-indigo-100 { background-color: #e0e7ff; } .text-indigo-600 { color: #4f46e5; }
    .bg-amber-100 { background-color: #fef3c7; } .text-amber-600 { color: #d97706; }
    .bg-red-100 { background-color: #fee2e2; } .text-red-600 { color: #dc2626; }
    .stat-label { font-size: 0.95rem; font-weight: 500; color: #6b7280; margin: 0 0 0.25rem 0; text-transform: uppercase; letter-spacing: 0.05em; }
    .stat-number { font-size: 2.25rem; font-weight: 700; margin: 0; color: #111827; line-height: 1; }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: any = null;

  constructor(private licenseService: LicenseService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.licenseService.getStats().subscribe(data => {
      this.stats = data;
      this.cdr.detectChanges(); // Check for view drift explicitly!
    });
  }

  goToLicenses(status: string) {
    if (status) {
      this.router.navigate(['/licenses'], { queryParams: { status } });
    } else {
      this.router.navigate(['/licenses']);
    }
  }
}
