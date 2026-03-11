import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LicensesComponent } from './pages/licenses/licenses.component';
import { LicenseFormComponent } from './pages/license-form/license-form.component';
import { LicenseDetailComponent } from './pages/license-detail/license-detail.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'licenses', component: LicensesComponent },
            { path: 'licenses/new', component: LicenseFormComponent },
            { path: 'licenses/:id', component: LicenseDetailComponent },
            { path: 'licenses/:id/edit', component: LicenseFormComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
