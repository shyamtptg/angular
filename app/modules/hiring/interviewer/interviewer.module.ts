import { NgModule } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interviewerRouting } from './interviewer.routing';
import { InterviewerComponent } from './interviewer.component';
import { InterviewerScheduledInterviews } from './interviews/interviews.component';
import { MyInterviews } from './my-interviews/my-interviews.component';
import { InterviewerInterviewFeedback } from './interviews/interview-feedback/interview-feedback.component';
import { InterviewerViewFeedback } from './interviews/view-feedback/view-feedback.component';
import { FeedbackPanelDetails } from './interviews/view-feedback/panel-details/panel-details.component';
import { DownloadLink } from './interviews/download-link/download-link.component';
import { InterviewerProfileDetails } from './interviews/profile-details/profile-details.component';
import { JobDescPopup } from './interviews/job-description/job-description.component';
import { JobDescriptionView } from './interviews/job-description-view/job-description-view.component';
import { InterviewerLeftNavigation } from './leftnavigation/left-navigation.component';
import { InterviewDetails } from './interviews/interview-details/interview-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular/main';
import { CalendarModule, RatingModule, EditorModule, SharedModule, DialogModule} from 'primeng/primeng';
import { PaginationModule } from '../../../shared/pagination/pagination.module';
import { ChartsModule } from '../../../shared/charts/charts.module';
import { LeftNavigationModule } from '../../../shared/left-nav/left-navigation.module';
import { SkillModule } from '../recruiter/skill/skill.module';
import {TabsModule} from '../../../shared/tablist/tabs.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
    imports: [CommonModule, FormsModule, interviewerRouting, ModalModule.forRoot(), NgbModule.forRoot(), AgGridModule.withComponents([DownloadLink, JobDescPopup]), RatingModule, EditorModule, SharedModule, DialogModule, ChartsModule, PaginationModule, LeftNavigationModule,SkillModule,CalendarModule, TabsModule],
    declarations: [InterviewerLeftNavigation, InterviewerComponent, InterviewerScheduledInterviews, MyInterviews, InterviewerInterviewFeedback, InterviewerViewFeedback, FeedbackPanelDetails, DownloadLink, JobDescPopup, JobDescriptionView, InterviewerProfileDetails, InterviewDetails]
})
export class InterviewerModule { }