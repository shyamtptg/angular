import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterviewerComponent } from './interviewer.component';
import { InterviewerScheduledInterviews } from './interviews/interviews.component';
import { MyInterviews } from './my-interviews/my-interviews.component';
import { InterviewerInterviewFeedback } from './interviews/interview-feedback/interview-feedback.component';
import { InterviewerViewFeedback } from './interviews/view-feedback/view-feedback.component';
import { InterviewDetails } from './interviews/interview-details/interview-details.component';
import { PreviousRoute } from '../../../shared/guards/previous-route/previous-route.guard';
import { RolePermissionRoute } from '../../../shared/guards/role-permission/role-permission.guard';
export const interviewerRoutes: Routes = [
      { path: 'scheduled-interviews', component: InterviewerScheduledInterviews, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'VIEW_SCHEDULED_INTERVIEWS'}},
      { path: 'my-interviews', component: MyInterviews, canActivate: [RolePermissionRoute, PreviousRoute], data: {'feature': 'VIEW_MY_INTERVIEWS'}},
      { path: 'feedback', component: InterviewerInterviewFeedback },
      { path: 'submit-feedback/:interviewId/:reqId/:needId', component: InterviewerInterviewFeedback, canActivate: [RolePermissionRoute], data: {'feature': 'SUBMIT_INTERVIEW_FEEDBACK'}},
      { path: 'feedback/:id', component: InterviewerViewFeedback },
      { path: 'view-feedback/:id/:reqId/:needId', component: InterviewerViewFeedback, canActivate: [RolePermissionRoute], data: {'feature': 'VIEW_INTERVIEW_FEEDBACK'}},
      { path: 'view/:id', component: InterviewDetails }
];
export const interviewerRouting: ModuleWithProviders = RouterModule.forChild(interviewerRoutes);