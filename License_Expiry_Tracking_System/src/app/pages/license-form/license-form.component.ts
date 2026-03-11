import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LicenseService } from '../../services/license.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-license-form',
    standalone: false,
    template: `
    <div class="form-container">
      <h2>{{ isEditMode ? 'Edit' : 'Add' }} License</h2>
      <form [formGroup]="licenseForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Name</label>
          <input formControlName="name" class="form-control">
        </div>
        <div class="form-group">
          <label>Key</label>
          <input formControlName="key" class="form-control">
        </div>
        <div class="form-group">
          <label>Provider</label>
          <input formControlName="provider" class="form-control">
        </div>
        <div class="form-group">
          <label>Expiry Date</label>
          <input type="date" formControlName="expiryDate" class="form-control">
        </div>
        <div class="form-actions">
          <button type="submit" [disabled]="!licenseForm.valid">Save</button>
          <button type="button" class="cancel-btn" (click)="cancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
    styles: [`
    .form-container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-control { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    .form-actions { margin-top: 2rem; display: flex; gap: 1rem; }
    button { padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { background: #ccc; }
    .cancel-btn { background: #6c757d; }
  `]
})
export class LicenseFormComponent implements OnInit {
    licenseForm: FormGroup;
    isEditMode = false;
    licenseId: string | null = null;

    constructor(
        private fb: FormBuilder,
        private licenseService: LicenseService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.licenseForm = this.fb.group({
            name: ['', Validators.required],
            key: ['', Validators.required],
            provider: ['', Validators.required],
            expiryDate: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.licenseId = this.route.snapshot.paramMap.get('id');
        if (this.licenseId) {
            this.isEditMode = true;
            this.licenseService.getLicense(this.licenseId).subscribe(data => {
                // Format date to YYYY-MM-DD for input field
                const formattedDate = new Date(data.expiryDate).toISOString().split('T')[0];
                this.licenseForm.patchValue({ ...data, expiryDate: formattedDate });
            });
        }
    }

    onSubmit(): void {
        if (this.licenseForm.valid) {
            const payload = this.licenseForm.value;
            if (this.isEditMode && this.licenseId) {
                this.licenseService.updateLicense(this.licenseId, payload).subscribe(() => {
                    this.router.navigate(['/licenses']);
                });
            } else {
                this.licenseService.createLicense(payload).subscribe(() => {
                    this.router.navigate(['/licenses']);
                });
            }
        }
    }

    cancel(): void {
        this.router.navigate(['/licenses']);
    }
}
