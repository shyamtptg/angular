import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppCustomPreloader } from './app.routing.loader';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
       path: 'auth',
       loadChildren: './modules/auth/auth.module#AuthModule'
    },
    {
       path: 'hiring',
       loadChildren: './modules/hiring/hiring.module#HiringModule'
    },
    {
       path: 'leave-management',
       loadChildren: './modules/leave-management/leave-management.module#LeaveManagementModule'
    },
    {
       path: 'onboarding',
       loadChildren: './modules/onboarding/onboarding.module#OnboardingModule'
    },
    {
       path: 'workstations',
       loadChildren: './modules/workstations/workstations.module#WorkstationsModule'
    },
    {
       path: 'employeeid',
       loadChildren: './modules/employeeid/employeeid.module#EmployeeidModule'
    },
    {
       path: 'assets',
       loadChildren: './modules/asset-management/asset-management.module#AssetManagementModule'
    },
    {
      path: 'manager',
      loadChildren: './modules/manager/manager.module#ManagerModule'
   },
    {
        path: '**',
        redirectTo: 'login'
    }
];
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {preloadingStrategy: AppCustomPreloader});

