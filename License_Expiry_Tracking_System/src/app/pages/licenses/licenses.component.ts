import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { License, LicenseService } from '../../services/license.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-licenses',
  standalone: false,
  template: `
    <div class="licenses-page fade-in">
      <div class="header-actions">
        <div>
          <h1 class="page-title">Licenses</h1>
          <p class="page-subtitle">Manage all your software subscriptions in one place.</p>
        </div>
        <button (click)="addLicense()" class="btn-primary">
          <span class="icon">+</span> Add New License
        </button>
      </div>
      
      <div class="filters-card">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" [(ngModel)]="searchTerm" placeholder="Search licenses by name or provider..." (input)="onSearch()">
        </div>
        <button *ngIf="statusFilter" class="clear-btn" (click)="clearFilter()">
          Clear Filter: <span class="badge">{{ statusFilter }}</span>
        </button>
      </div>

      <div class="table-container">
        <table class="licenses-table">
          <thead>
            <tr>
              <th>Software Name</th>
              <th>Provider</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let license of licenses" class="table-row">
              <td class="font-medium">{{ license.name }}</td>
              <td>
                <span class="provider-tag">{{ license.provider }}</span>
              </td>
              <td class="date-cell">{{ license.expiryDate | date:'mediumDate' }}</td>
              <td>
                 <span class="status-badge" [ngClass]="getStatusClass(license.status)">{{ license.status || 'Valid' }}</span>
              </td>
              <td class="actions-cell">
                <button class="btn-icon text-indigo" (click)="editLicense(license._id!)" title="Edit">✏️</button>
                <button class="btn-icon text-red" (click)="deleteLicense(license._id!)" title="Delete">🗑️</button>
              </td>
            </tr>
            <tr *ngIf="licenses.length === 0">
              <td colspan="5" class="empty-state">
                <div class="empty-content">
                  <span class="empty-icon">📭</span>
                  <p>No licenses found matching your criteria.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .licenses-page { max-width: 1200px; margin: 0 auto; }
    .fade-in { animation: fadeIn 0.4s ease-in; }
    .header-actions { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
    .page-title { font-size: 2rem; color: #111827; margin: 0 0 0.5rem 0; font-weight: 700; }
    .page-subtitle { color: #6b7280; margin: 0; font-size: 1rem; }
    
    .btn-primary { background: linear-gradient(135deg, #4f46e5, #4338ca); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 8px -1px rgba(79, 70, 229, 0.3); }
    
    .filters-card { background: white; padding: 1.25rem; border-radius: 12px; margin-bottom: 1.5rem; display: flex; gap: 1rem; align-items: center; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border: 1px solid #f3f4f6; }
    .search-box { position: relative; flex: 1; max-width: 500px; }
    .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 1.1rem; }
    .search-box input { width: 100%; padding: 0.75rem 1rem 0.75rem 2.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.95rem; font-family: inherit; transition: all 0.2s; background: #f9fafb; }
    .search-box input:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); background: white; }
    
    .clear-btn { background: #f3f4f6; color: #4b5563; border: 1px solid #e5e7eb; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 500; transition: all 0.2s; }
    .clear-btn:hover { background: #e5e7eb; }
    .clear-btn .badge { background: #4f46e5; color: white; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
    
    .table-container { background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e5e7eb; }
    .licenses-table { width: 100%; border-collapse: collapse; text-align: left; }
    .licenses-table th { background: #f9fafb; padding: 1rem 1.5rem; font-weight: 600; color: #4b5563; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e5e7eb; }
    .licenses-table td { padding: 1rem 1.5rem; border-bottom: 1px solid #f3f4f6; color: #374151; vertical-align: middle; }
    .table-row { transition: background-color 0.2s; }
    .table-row:hover { background-color: #f8fafc; }
    
    .font-medium { font-weight: 500; color: #111827; }
    .provider-tag { background: #f3f4f6; color: #4b5563; padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.85rem; font-weight: 500; display: inline-block; }
    .date-cell { color: #6b7280; font-variant-numeric: tabular-nums; }
    
    .status-badge { padding: 0.35rem 0.85rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; }
    .status-badge.valid { background: #d1fae5; color: #047857; }
    .status-badge.expired { background: #fee2e2; color: #b91c1c; }
    .status-badge.expiring-soon { background: #fef3c7; color: #b45309; }
    
    .text-right { text-align: right; }
    .actions-cell { text-align: right; white-space: nowrap; }
    .btn-icon { background: transparent; border: none; cursor: pointer; padding: 0.5rem; border-radius: 6px; transition: all 0.2s; font-size: 1.1rem; opacity: 0.7; }
    .btn-icon:hover { opacity: 1; background: #f3f4f6; transform: scale(1.1); }
    
    .empty-state { text-align: center; padding: 4rem 2rem !important; }
    .empty-content { display: flex; flex-direction: column; align-items: center; color: #6b7280; }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class LicensesComponent implements OnInit {
  licenses: License[] = [];
  searchTerm: string = '';
  statusFilter: string = '';

  constructor(private licenseService: LicenseService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.statusFilter = params['status'] || '';
      this.loadLicenses();
    });
  }

  loadLicenses() {
    const filters: any = {};
    if (this.searchTerm.trim()) filters.search = this.searchTerm.trim();
    if (this.statusFilter) filters.status = this.statusFilter;

    this.licenseService.getLicenses(filters).subscribe(data => {
      // Create a fresh array reference to ensure Angular updates the view immediately
      this.licenses = data ? [...data] : [];
      this.cdr.detectChanges(); // Check for view drift explicitly!
    });
  }

  onSearch() {
    this.loadLicenses();
  }

  clearFilter() {
    this.router.navigate(['/licenses']);
  }

  addLicense() {
    this.router.navigate(['/licenses/new']);
  }

  viewLicense(id: string) {
    this.router.navigate(['/licenses', id]);
  }

  editLicense(id: string) {
    this.router.navigate(['/licenses', id, 'edit']);
  }

  deleteLicense(id: string) {
    if (confirm('Are you sure you want to delete this license?')) {
      this.licenseService.deleteLicense(id).subscribe(() => this.loadLicenses());
    }
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return 'valid';
    return status.toLowerCase().replace(' ', '-');
  }
}
