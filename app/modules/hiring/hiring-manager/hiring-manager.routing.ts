import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HiringManagerComponent } from './hiring-manager.component';
import { HiringManagerDashboard } from './dashboard/dashboard.component';
import { NewHiringRequest } from './new-hiring-request/new-hiring-request.component';
import { NewHiringRequest1 } from './new-hiring-request-1/new-hiring-request-component-1';
import { UpdateHiringRequest } from './new-hiring-request-1/update-hiring-request.component';
import { NewJobDescription } from './new-hiring-request-1/new-job-description/new-job-description.component';
import { JobDescriptionList } from './new-hiring-request-1/job-description-list/job-description-list.component';
// import { HiringManagerProfiles } from './profiles/profiles.component';
import { OpenRequests } from './open-requests/open-requests.component';
import { HiringRequestsComponent } from './my-hiring-requests/my-hiring-requests.component';
import { AllHiringRequestsComponent } from './all-hiring-requests/all-hiring-requests.component';
import { HiringRequestSummary } from './hiring-request-summary/hiring-request-summary.component';
import { RecruiterHiringDetails } from './hiringrequestdetails/hiring-request-details.component';
import { RecruiterHiringRequests } from './hiringrequests/hiring-requests.component';
import { CpoAssignExecutive } from '../cpo/assignexecutive/assign-executive.component';
import { HiringTimeline } from './hiring-timeline/hiring-timeline.component';
// import { ProfileDetailsDialog } from './profiles/profile-details/profile-details.component';
import { AuthGuard } from '../../../modules/auth/auth.guard';
import { PreviousRoute } from '../../../shared/guards/previous-route/previous-route.guard';
import { RolePermissionRoute } from '../../../shared/guards/role-permission/role-permission.guard';

export const hiringManagerRoutes: Routes = [
    { path: '', component: HiringManagerDashboard, canActivate: [AuthGuard] },
    { path: 'dashboard', component: HiringManagerDashboard },
    { path: 'requests', component: RecruiterHiringRequests, canActivate: [RolePermissionRoute, PreviousRoute], data: { 'feature': 'LIST_ASSIGNED_HIRING_REQUESTS' } },
    { path: 'hiringdetails/:id', component: RecruiterHiringDetails },
    { path: 'view/:id', component: RecruiterHiringDetails, canActivate: [RolePermissionRoute], data: { 'feature': 'VIEW_HIRING_REQUEST'}},
    { path: 'new', component: NewHiringRequest1, canActivate: [RolePermissionRoute], data: { 'feature': 'CREATE_HIRING_REQUEST' } },
    { path: 'new/:id', component: UpdateHiringRequest, canActivate: [RolePermissionRoute], data: { 'feature': 'UPDATE_HIRING_REQUEST' } },
    { path: 'jobdesc', component: NewJobDescription, canActivate: [RolePermissionRoute], data: { 'feature': 'CREATE_JOB_DESCRIPTION' } },
    { path: 'jobdesc/:jobDescId', component: NewJobDescription, canActivate: [RolePermissionRoute], data: { 'feature': 'UPDATE_JOB_DESCRIPTION' } },
    { path: 'jobdesc-details/:jobDescId', component: NewJobDescription, canActivate: [RolePermissionRoute], data: { 'feature': 'VIEW_JOB_DESCRIPTION' } },
    { path: 'jobdesclist', component: JobDescriptionList, canActivate: [RolePermissionRoute], data: { 'feature': 'LIST_ALL_JOB_DESCRIPTIONS' } },
    //{ path: 'profiles', component: HiringManagerProfiles },
    //{ path: 'screening', component: HiringManagerProfiles, canActivate: [RolePermissionRoute, PreviousRoute], data: { 'feature': 'VIEW_PROFILES_TO_SCREEN_LIST' } },
    //{ path: 'screening/:id', component: ProfileDetailsDialog },
    //{ path: 'profiles/:id', component: ProfileDetailsDialog },
    { path: 'open-positions', component: OpenRequests },
    { path: 'myrequests', component: HiringRequestsComponent, canActivate: [RolePermissionRoute, PreviousRoute], data: { 'feature': 'LIST_MY_HIRING_REQUESTS' } },
    { path: 'allrequests', component: AllHiringRequestsComponent, canActivate: [RolePermissionRoute, PreviousRoute], data: { 'feature': 'LIST_ALL_HIRING_REQUESTS' } },
    { path: 'summary', component: HiringRequestSummary },
    { path: 'assign', component: CpoAssignExecutive, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'ASSIGN_RECRUITERS_TO_HIRING_REQUEST'} },
    { path: 'hiring-timeline/:id', component: HiringTimeline, canActivate: [RolePermissionRoute], data: {'feature': 'VIEW_HIRING_REQUEST_TIMELINE'} }
];

export const hiringManagerRouting: ModuleWithProviders = RouterModule.forChild(hiringManagerRoutes);