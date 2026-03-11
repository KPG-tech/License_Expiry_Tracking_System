import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LicenseService } from '../../services/license.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-license-form',
  standalone: false,
  template: `
    <div class="form-wrapper fade-in">
      <div class="modern-card">
        
        <!-- Left Side: Visual Hero -->
        <div class="card-left" [class.bg-edit]="isEditMode">
          <div class="left-content">
            <h2 class="hero-title">{{ isEditMode ? 'Update' : 'Create' }}<br/>License</h2>
            <div class="hero-icon">{{ isEditMode ? '📝' : '✨' }}</div>
          </div>
        </div>

        <!-- Right Side: The Form -->
        <div class="card-right">
          <form [formGroup]="licenseForm" (ngSubmit)="onSubmit()" class="form-content">
            
            <div class="form-group floating-group">
              <span class="input-icon">🏷️</span>
              <input formControlName="name" class="form-control floating-input" placeholder=" ">
              <label class="floating-label">Software Name</label>
            </div>
            
            <div class="form-group floating-group">
              <span class="input-icon">🔑</span>
              <input formControlName="key" class="form-control font-mono floating-input" placeholder=" ">
              <label class="floating-label">License Key</label>
            </div>
            
            <div class="form-grid">
              <div class="form-group floating-group">
                <span class="input-icon">🏢</span>
                <input formControlName="provider" class="form-control floating-input" placeholder=" ">
                <label class="floating-label">Provider</label>
              </div>
              
              <div class="form-group floating-group">
                <span class="input-icon">📅</span>
                <input type="date" formControlName="expiryDate" class="form-control floating-input date-input" placeholder=" ">
                <label class="floating-label active-label">Expiry Date</label>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="cancel()">Cancel</button>
              <button type="submit" [disabled]="!licenseForm.valid" class="btn-primary glow">
                {{ isEditMode ? 'Save Changes' : 'Create License' }}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .form-wrapper { padding: 3rem 1.5rem; display: flex; justify-content: center; min-height: calc(100vh - 80px); align-items: flex-start; }
    .fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
    
    .modern-card { background: white; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1); width: 100%; max-width: 850px; display: flex; overflow: hidden; border: 1px solid rgba(255,255,255,0.8); }
    
    .card-left { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); width: 38%; padding: 4rem 2.5rem; display: flex; flex-direction: column; justify-content: center; align-items: center; color: white; position: relative; overflow: hidden; transition: background 0.5s ease; }
    .card-left.bg-edit { background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%); }
    .card-left::after { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%); pointer-events: none; }
    
    .left-content { position: relative; z-index: 1; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 2rem; }
    .hero-title { font-size: 2.25rem; font-weight: 800; margin: 0; line-height: 1.1; letter-spacing: -0.02em; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .hero-icon { font-size: 5.5rem; line-height: 1; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.2)); animation: float 4s ease-in-out infinite; margin-top: 1rem; }
    
    .card-right { width: 62%; background: white; }
    .form-content { padding: 3rem; display: flex; flex-direction: column; gap: 1.5rem; }
    
    .form-group { position: relative; width: 100%; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    
    /* Floating Label & Icon Styles */
    .floating-group { position: relative; }
    .input-icon { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); font-size: 1.25rem; z-index: 2; pointer-events: none; opacity: 0.6; transition: opacity 0.3s, transform 0.3s; }
    
    .floating-input { width: 100%; padding: 1.5rem 1rem 0.5rem 3.25rem !important; border: 2px solid #f3f4f6 !important; border-radius: 14px !important; background: #f9fafb !important; font-size: 1rem !important; font-weight: 500 !important; color: #111827 !important; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; appearance: none; }
    .floating-input:focus { background: white !important; border-color: #6366f1 !important; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important; outline: none; }
    .floating-input:focus ~ .input-icon { opacity: 1; transform: translateY(-50%) scale(1.1); filter: drop-shadow(0 2px 4px rgba(99,102,241,0.2)); }
    
    .floating-label { position: absolute; left: 3.25rem; top: 50%; transform: translateY(-50%); color: #6b7280; font-size: 1rem; pointer-events: none; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); font-weight: 500; margin: 0; }
    
    /* Active Floating Label State */
    .floating-input:focus ~ .floating-label, 
    .floating-input:not(:placeholder-shown) ~ .floating-label, 
    .active-label { top: 0.85rem; font-size: 0.75rem; color: #6366f1; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    
    .date-input { padding-top: 1.6rem !important; padding-bottom: 0.4rem !important; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important; letter-spacing: 0.05em !important; font-weight: 600 !important; color: #374151 !important; }
    
    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; padding-top: 2.5rem; border-top: 1px solid #f3f4f6; }
    
    .btn-primary.glow { background: linear-gradient(135deg, #4f46e5, #6366f1); color: white; border: none; padding: 0.85rem 2.25rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s; font-size: 1rem; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -2px rgba(79, 70, 229, 0.15); }
    .btn-primary.glow:hover:not(:disabled) { transform: translateY(-3px) scale(1.02); box-shadow: 0 20px 25px -5px rgba(79, 70, 229, 0.4), 0 10px 10px -5px rgba(79, 70, 229, 0.2); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; transform: none !important; }
    
    .btn-secondary { background: white; color: #4b5563; border: 2px solid #e5e7eb; padding: 0.85rem 2rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 1rem; }
    .btn-secondary:hover { background: #f3f4f6; border-color: #d1d5db; color: #111827; }
    
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } }
    
    @media (max-width: 768px) { 
      .modern-card { flex-direction: column; } 
      .card-left { width: 100%; padding: 2.5rem 2rem; flex-direction: row; justify-content: space-between; align-items: center; } 
      .left-content { flex-direction: row; width: 100%; justify-content: space-between; align-items: center; gap: 1rem; }
      .hero-title { font-size: 1.75rem; text-align: left; } 
      .hero-icon { font-size: 3.5rem; margin: 0; } 
      .card-right { width: 100%; } 
      .form-content { padding: 2rem 1.5rem; }
      .form-grid { grid-template-columns: 1fr; gap: 1.5rem; } 
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
