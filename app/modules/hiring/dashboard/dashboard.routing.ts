import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { RolePermissionRoute } from '../../../shared/guards/role-permission/role-permission.guard';

export const dashboardRoutes: Routes = [
    { path: '', component: DashboardComponent, canActivate: [RolePermissionRoute], data: { 'feature': 'VIEW_DASHBOARDS' }}
];
export const dashboardRouting: ModuleWithProviders = RouterModule.forChild(dashboardRoutes);