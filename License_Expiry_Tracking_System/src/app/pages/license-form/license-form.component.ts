import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LicenseService } from '../../services/license.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-license-form',
  standalone: false,
  template: `
    <div class="form-wrapper fade-in">
      <div class="form-container">
        <div class="form-header">
          <button type="button" class="back-link" (click)="cancel()">
            <span class="icon">←</span> Back to Licenses
          </button>
          <h2 class="title">{{ isEditMode ? 'Edit License Details' : 'Add New License' }}</h2>
          <p class="subtitle">{{ isEditMode ? 'Update the information for this subscription.' : 'Fill in the details below to track a new software license.' }}</p>
        </div>
        
        <form [formGroup]="licenseForm" (ngSubmit)="onSubmit()" class="form-content">
          <div class="form-group">
            <label>Software Name</label>
            <input formControlName="name" class="form-control" placeholder="e.g. Adobe Creative Cloud">
          </div>
          <div class="form-group">
            <label>License Key <span class="badge-optional" *ngIf="false">Optional</span></label>
            <input formControlName="key" class="form-control font-mono" placeholder="XXXX-XXXX-XXXX-XXXX">
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>Provider</label>
              <input formControlName="provider" class="form-control" placeholder="e.g. Adobe Inc.">
            </div>
            <div class="form-group">
              <label>Expiry Date</label>
              <input type="date" formControlName="expiryDate" class="form-control">
            </div>
          </div>
          
          <div class="form-actions border-t">
            <button type="button" class="btn-secondary" (click)="cancel()">Cancel</button>
            <button type="submit" [disabled]="!licenseForm.valid" class="btn-primary">
              {{ isEditMode ? 'Save Changes' : 'Create License' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-wrapper { padding: 1rem 0; display: flex; justify-content: center; }
    .fade-in { animation: fadeIn 0.4s ease-in; }
    .form-container { background: white; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); width: 100%; max-width: 600px; overflow: hidden; border: 1px solid #f3f4f6; }
    
    .form-header { background: #f8fafc; padding: 2rem 2.5rem; border-bottom: 1px solid #e5e7eb; }
    .back-link { background: none; border: none; font-size: 0.9rem; color: #6b7280; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; padding: 0; margin-bottom: 1.5rem; font-weight: 500; transition: color 0.2s; }
    .back-link:hover { color: #111827; }
    .title { font-size: 1.5rem; color: #111827; margin: 0 0 0.5rem 0; font-weight: 700; }
    .subtitle { color: #6b7280; font-size: 0.95rem; margin: 0; }
    
    .form-content { padding: 2.5rem; }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-weight: 500; color: #374151; font-size: 0.9rem; }
    .badge-optional { font-size: 0.75rem; color: #9ca3af; font-weight: 400; background: #f3f4f6; padding: 0.1rem 0.5rem; border-radius: 999px; }
    
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; gap: 0; } }
    
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; letter-spacing: 0.05em; }
    
    .form-actions { margin-top: 2.5rem; display: flex; justify-content: flex-end; gap: 1rem; padding-top: 2rem; border-top: 1px solid #e5e7eb; }
    
    .btn-primary { background: linear-gradient(135deg, #4f46e5, #4338ca); color: white; border: none; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 0.95rem; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2); }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 8px -1px rgba(79, 70, 229, 0.3); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
    
    .btn-secondary { background: white; color: #374151; border: 1px solid #d1d5db; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-size: 0.95rem; }
    .btn-secondary:hover { background: #f9fafb; border-color: #9ca3af; }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
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
