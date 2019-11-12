import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HiringComponent } from './hiring.component';
import { AppConfigGuard } from '../../config/app.config.guard';
import { AuthGuard } from '../../modules/auth/auth.guard';

export const hiringRoutes: Routes = [
    {
        path: '',
        component: HiringComponent,
        canActivate: [ AppConfigGuard, AuthGuard ],
        children: [
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', data: { preload: true } },
            { path: 'interviews', loadChildren: './interviewer/interviewer.module#InterviewerModule', data: { preload: false } },
            { path: 'profiles', loadChildren: './recruiter/recruiter.module#RecruiterModule', data: { preload: false } },
            { path: 'hiring-requests', loadChildren: './hiring-manager/hiring-manager.module#HiringManagerModule' , data: { preload: true }},
            { path: 'offers', loadChildren: './cpo/cpo.module#CpoModule' , data: { preload: false }}
        ]
    }
];

export const hiringRouting: ModuleWithProviders = RouterModule.forChild(hiringRoutes);
