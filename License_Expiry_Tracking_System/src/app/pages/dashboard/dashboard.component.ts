import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LicenseService } from '../../services/license.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      
      <div class="stats-grid">
        <div class="stat-card" (click)="goToLicenses('')">
          <h3>Total Licenses</h3>
          <p class="stat-number">{{ stats?.total || 0 }}</p>
        </div>
        <div class="stat-card stat-expiring" (click)="goToLicenses('Expiring Soon')">
          <h3>Expiring Soon</h3>
          <p class="stat-number">{{ stats?.expiringSoon || 0 }}</p>
        </div>
        <div class="stat-card stat-expired" (click)="goToLicenses('Expired')">
          <h3>Expired</h3>
          <p class="stat-number">{{ stats?.expired || 0 }}</p>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 2rem; }
    .stat-card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
    .stat-card:hover { transform: translateY(-3px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
    .stat-number { font-size: 2.5rem; font-weight: bold; margin: 1rem 0 0; color: #2c3e50; }
    .stat-expiring { border-top: 4px solid #f39c12; }
    .stat-expired { border-top: 4px solid #e74c3c; }
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
