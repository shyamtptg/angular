import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecruiterComponent } from './recruiter.component';
import { RecruiterProfiles } from './profiles/all/profiles.component';
import { RecruiterDeactivated } from './profiles/deactivated/deactivated.component';
import { RecruiterSelected } from './profiles/selected/selected.component';
import { PrejoiningPending } from './profiles/prejoining-pending/prejoining-pending.component';
import { PrejoiningCompleted } from './profiles/prejoining-completed/prejoining-completed.component';
import { CompletedPrejoining } from './profiles/completed-prejoining/completed-prejoining.component';
import { OfferAccepted } from './profiles/offer-accepted/offer-accepted.component';
import { ProspectJoined } from './profiles/joined/joined.component';
import { ProspectNoShow } from './profiles/no-show/no-show.component';
import { RecruiterVerified } from './profiles/verified/verified.component';
import { HRManagerVerification } from './profiles/verification/verification-details.component';
import { RecruiterSearch } from './profiles/search/search.component';
import { ProspectTimelineComponent } from './profiles/search/prospect-timeline/prospect-timeline.component';
import { ScheduleInterview } from './profiles/shortlisted/scheduleinterview/schedule-interview.component';
import { RecruiterShortlisted } from './profiles/shortlisted/shortlisted.component';
import { RecruiterRejected } from './profiles/rejected/rejected.component';
import { HiringManagerProfiles } from './profilescreening/profiles.component';
import { ProfileDetailsDialog } from './profilescreening/profile-details/profile-details.component';
import { addProfileRoutes } from './addprofile/add-profile.routing';
import { PreviousRoute } from '../../../shared/guards/previous-route/previous-route.guard';
import { RolePermissionRoute } from '../../../shared/guards/role-permission/role-permission.guard';

export const recruiterRoutes: Routes = [
            ...addProfileRoutes,
            { path: 'deactivate', component: RecruiterDeactivated },
            { path: 'select', component: RecruiterSelected, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'VIEW_SELECTED_CANDIDATES_LIST'}},
            { path: 'prejoining-pending', component: PrejoiningPending, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'VIEW_CANDIDATES_PENDING_SUBMISSION_OF_SUPPORTING_DOCUMENTS'}},
            { path: 'prejoining-completed', component: PrejoiningCompleted, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'VIEW_PRE_JOINING_COMPLETED_LIST'}},
            { path: 'readytoverify', component: CompletedPrejoining, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'VIEW_CANDIDATES_PENDING_VERIFICATION_LIST'}},
            { path: 'verified', component: RecruiterVerified, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'VIEW_VERIFIED_CANDIDATES_LIST'}},
            { path: 'verification/:id', component: HRManagerVerification, canActivate: [RolePermissionRoute], data: {'feature': 'VIEW_PRE_JOINING_DOCUMENTS_LIST'}},
            { path: 'verification-details/:id', component: HRManagerVerification },
            { path: 'accepted', component: OfferAccepted, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'VIEW_OFFER_ACCEPTED_CANDIDATES_LIST'}},
            { path: 'joined', component: ProspectJoined, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'VIEW_JOINED_CANDIDATES_LIST'}},
            { path: 'no-show', component: ProspectNoShow, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'VIEW_NO_SHOW_CANDIDATES_LIST'}},
            { path: 'search', component: RecruiterSearch, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'SEARCH_PROFILES'}},
            { path: 'prospect-timeline/:id', component: ProspectTimelineComponent, canActivate: [RolePermissionRoute], data: {'feature': 'VIEW_PROFILE_TIMELINE'}},
            { path: 'shortlist', component: RecruiterShortlisted, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'VIEW_SHORTLISTED_PROFILES_LIST'}},
            { path: 'reject', component: RecruiterRejected, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'VIEW_REJECTED_PROFILES_LIST'}},
            { path: 'schedule/:id', component: ScheduleInterview },
            { path: 'schedule/:id/:reqId/:needId', component: ScheduleInterview, canActivate: [RolePermissionRoute], data: {'feature': 'SCHEDULE_INTERVIEW'} },
            { path: 'reschedule/:interviewId', component: ScheduleInterview, canActivate: [RolePermissionRoute], data: {'feature': 'RESCHEDULE_INTERVIEW'} },
            { path: 'all', component: RecruiterProfiles, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'LIST_ALL_PROFILES'}},
            { path: 'profiles', component: HiringManagerProfiles },
            { path: 'screening', component: HiringManagerProfiles, canActivate: [RolePermissionRoute, PreviousRoute], data: { 'feature': 'VIEW_PROFILES_TO_SCREEN_LIST' } },
            { path: 'screening/:id', component: ProfileDetailsDialog },
            { path: 'screening/:id/:reqId/:needId', component: ProfileDetailsDialog, canActivate: [RolePermissionRoute], data: { 'feature': 'VIEW_PROFILE' } },
            { path: 'profile-details/:id', component: ProfileDetailsDialog, canActivate: [RolePermissionRoute], data: { 'feature': 'VIEW_PROFILE' }}
];
export const recruiterRouting: ModuleWithProviders = RouterModule.forChild(recruiterRoutes);