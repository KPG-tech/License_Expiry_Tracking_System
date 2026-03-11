import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { License, LicenseService } from '../../services/license.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-licenses',
  standalone: false,
  template: `
    <div class="licenses-page">
      <div class="header-actions">
        <h1>Licenses</h1>
        <button (click)="addLicense()" class="original-button">Add License</button>
      </div>
      
      <div class="filters">
        <input type="text" [(ngModel)]="searchTerm" placeholder="Search licenses..." (input)="onSearch()">
        <button *ngIf="statusFilter" class="clear-btn" (click)="clearFilter()">Clear Filter: {{ statusFilter }}</button>
      </div>

      <table class="licenses-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Provider</th>
            <th>Expiry Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let license of licenses">
            <td>{{ license.name }}</td>
            <td>{{ license.provider }}</td>
            <td>{{ license.expiryDate | date }}</td>
            <td>
               <span class="status-badge" [ngClass]="getStatusClass(license.status)">{{ license.status || 'Valid' }}</span>
            </td>
            <td>
              <button (click)="viewLicense(license._id!)">View</button>
              <button (click)="editLicense(license._id!)">Edit</button>
              <button class="delete-btn" (click)="deleteLicense(license._id!)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .original-button { background: #2ecc71; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
    .filters { margin-bottom: 1rem; display: flex; gap: 1rem; align-items: center; }
    .filters input { padding: 0.5rem; width: 300px; border: 1px solid #ccc; border-radius: 4px; }
    .clear-btn { background: #6c757d; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
    .licenses-table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .licenses-table th, .licenses-table td { padding: 1rem; text-align: left; border-bottom: 1px solid #eee; }
    .licenses-table th { background: #f8f9fa; font-weight: 600; }
    button { margin-right: 0.5rem; cursor: pointer; }
    .delete-btn { color: #e74c3c; }
    .status-badge { padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.85rem; }
    .status-badge.valid { background: #d4edda; color: #155724; }
    .status-badge.expired { background: #f8d7da; color: #721c24; }
    .status-badge.expiring-soon { background: #fff3cd; color: #856404; }
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
