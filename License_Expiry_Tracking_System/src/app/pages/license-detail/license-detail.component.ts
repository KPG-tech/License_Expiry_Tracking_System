import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { License, LicenseService } from '../../services/license.service';

@Component({
    selector: 'app-license-detail',
    standalone: false,
    template: `
    <div class="detail-container" *ngIf="license">
      <div class="header">
        <h2>License Details: {{ license.name }}</h2>
        <button class="back-btn" (click)="goBack()">Back to List</button>
      </div>
      
      <div class="card">
        <div class="info-row">
          <span class="label">Provider:</span>
          <span class="value">{{ license.provider }}</span>
        </div>
        <div class="info-row">
          <span class="label">Key:</span>
          <span class="value key-value">{{ license.key }}</span>
        </div>
        <div class="info-row">
          <span class="label">Expiry Date:</span>
          <span class="value">{{ license.expiryDate | date:'longDate' }}</span>
        </div>
        <div class="info-row">
          <span class="label">Status:</span>
          <span class="status-badge" [ngClass]="license.status || 'valid'">{{ license.status || 'Valid' }}</span>
        </div>
      </div>

      <div class="actions">
        <button (click)="renewLicense()" class="renew-btn">Renew License (+365 days)</button>
        <button (click)="editLicense()" class="edit-btn">Edit</button>
        <button (click)="deleteLicense()" class="delete-btn">Delete</button>
      </div>
    </div>
  `,
    styles: [`
    .detail-container { max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem; }
    .info-row { display: flex; margin-bottom: 1rem; border-bottom: 1px solid #f1f2f6; padding-bottom: 0.5rem; }
    .label { font-weight: 600; width: 150px; color: #7f8c8d; }
    .value { color: #2c3e50; font-weight: 500; }
    .key-value { font-family: monospace; background: #f8f9fa; padding: 0.25rem 0.5rem; border-radius: 4px; border: 1px solid #dee2e6; letter-spacing: 1px; }
    button { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; }
    .back-btn { background: #95a5a6; color: white; }
    .actions { display: flex; gap: 1rem; }
    .renew-btn { background: #27ae60; color: white; }
    .edit-btn { background: #f39c12; color: white; }
    .delete-btn { background: #e74c3c; color: white; }
    .status-badge { padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; }
    .status-badge.valid { background: #d4edda; color: #155724; }
    .status-badge.expired { background: #f8d7da; color: #721c24; }
    .status-badge.expiring-soon { background: #fff3cd; color: #856404; }
  `]
})
export class LicenseDetailComponent implements OnInit {
    license: License | null = null;
    licenseId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private licenseService: LicenseService
    ) { }

    ngOnInit(): void {
        this.licenseId = this.route.snapshot.paramMap.get('id');
        if (this.licenseId) {
            this.loadLicense();
        }
    }

    loadLicense() {
        if (this.licenseId) {
            this.licenseService.getLicense(this.licenseId).subscribe(data => {
                this.license = data;
            });
        }
    }

    goBack() {
        this.router.navigate(['/licenses']);
    }

    editLicense() {
        if (this.licenseId) {
            this.router.navigate(['/licenses', this.licenseId, 'edit']);
        }
    }

    deleteLicense() {
        if (this.licenseId && confirm('Are you sure you want to delete this license?')) {
            this.licenseService.deleteLicense(this.licenseId).subscribe(() => {
                this.router.navigate(['/licenses']);
            });
        }
    }

    renewLicense() {
        if (this.licenseId) {
            this.licenseService.renewLicense(this.licenseId, 365).subscribe(() => {
                alert('License renewed successfully!');
                this.loadLicense();
            });
        }
    }
}
