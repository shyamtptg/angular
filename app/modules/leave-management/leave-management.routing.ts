import { LeaveadjustmentComponent } from './leaveadjustment/leaveadjustment.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveManagement } from './leave-management.component';
import { AppConfigGuard } from '../../config/app.config.guard';
import { AuthGuard } from '../../modules/auth/auth.guard';
import { RolePermissionRoute } from '../../shared/guards/role-permission/role-permission.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MyleavecreditsComponent } from './myleavecredits/myleavecredits.component';
import { CompoffComponent } from './compoff/compoff.component';
import { CompoffmanagerComponent } from './compoffmanager/compoffmanager.component';
import { MyrequestsComponent } from './myrequests/myrequests.component';
import { WorkfromhomeComponent } from './workfromhome/workfromhome.component';
import { ManagerwfhComponent } from './managerwfh/managerwfh.component';
import { TeamRequestsComponent } from './team-requests/team-requests.component';
import { TeamReportComponent } from './team-report/team-report.component';
import { MyleaveComponent } from './myleave/myleave.component';
import { LeavecreditsComponent } from './leavecredits/leavecredits.component';
import { LeaveRequestDetailsComponent } from './leave-request-details/leave-request-details.component';
import { EmployeeLeaveReportComponent } from './employee-leave-report/employee-leave-report.component';
import { EncashmentRequestComponent } from './encashment-request/encashment-request.component';


export const leaveManagementRoutes: Routes = [
    {
        path: '',
        component: LeaveManagement,
        canActivate: [ AppConfigGuard, AuthGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'encashment-history', component: EncashmentRequestComponent, canActivate: [RolePermissionRoute], data: {'module': 'lms', 'feature': 'APPROVE_ENCASH_LEAVE_REQUEST'}},
            { path: 'leave-request-details', component: LeaveRequestDetailsComponent },
            { path: 'employee-leave-report', component: EmployeeLeaveReportComponent },
            { path: 'my-requests', component: MyrequestsComponent },
            { path: 'my-leave-credit', component: MyleavecreditsComponent },
            { path: 'my-leave-encashment', component: MyleaveComponent },
            { path: 'team-requests', component: TeamRequestsComponent, canActivate: [RolePermissionRoute], data: {'module': 'lms', 'feature': 'APPROVE_LEAVE_REQUEST'}},
            { path: 'team-report', component: TeamReportComponent, canActivate: [RolePermissionRoute], data: {'module': 'lms', 'feature': 'VIEW_TEAM_REPORT'}},
            { path: 'work-from-home', component: WorkfromhomeComponent },
            { path: 'work-from-home-manager', component: ManagerwfhComponent, canActivate: [RolePermissionRoute], data: {'module': 'lms', 'feature': 'APPROVE_WORK_FROM_HOME_REQUEST'}},
            { path: 'compoff-manager', component: CompoffmanagerComponent, canActivate: [RolePermissionRoute], data: {'module': 'lms', 'feature': 'APPROVE_COMPOFF_REQUEST'}},
            { path: 'compoff', component: CompoffComponent },
            { path: 'leaveadjustment', component: LeaveadjustmentComponent },
            { path: 'leave-credits', component: LeavecreditsComponent, canActivate: [RolePermissionRoute], data: {'module': 'lms', 'feature': 'VIEW_LEAVE_CREDITED_HISTORY_HR'}}
        ]
    }
];

export const leaveManagementRouting: ModuleWithProviders = RouterModule.forChild(leaveManagementRoutes);
