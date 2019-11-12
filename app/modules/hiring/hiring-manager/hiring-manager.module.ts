import { AutofocusDirective } from './new-hiring-request-1/new-job-description/new-job-sescription.driective';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { AgGridModule } from 'ag-grid-angular/main';
import { DataTableModule, DialogModule, OverlayPanelModule, CalendarModule } from 'primeng/primeng';
import { hiringManagerRouting } from './hiring-manager.routing';
import { DialogService } from '../../../shared/dialogs/dialog.service';
// Components
import { HiringManagerComponent } from './hiring-manager.component';
import { HiringManagerDashboard } from './dashboard/dashboard.component';
import { NewHiringRequest } from './new-hiring-request/new-hiring-request.component';
import { NewHiringRequest1 } from './new-hiring-request-1/new-hiring-request-component-1';
import { UpdateHiringRequest } from './new-hiring-request-1/update-hiring-request.component';
import { HiringRequestNeed } from './new-hiring-request-1/hiring-request-need/hiring-request-need.component';
import { UpdateHiringRequestNeed } from './new-hiring-request-1/update-hiring-request-need/update-hiring-request-need.component';
import { NewJobDescription } from './new-hiring-request-1/new-job-description/new-job-description.component';
import { JobDescriptionList } from './new-hiring-request-1/job-description-list/job-description-list.component';
import { JobDescModal } from './new-hiring-request-1/job-description/job-description.component';
import { RemarksModule } from '../../../shared/remarks/remarks.module';
import { OpenRequests } from './open-requests/open-requests.component';
import { OpenHiringRequest } from './open-requests/hiring-request/hiring-request.component';
import { OpenJobDescription } from './open-requests/job-description/job-description.component';
import { LeftNavigationModule } from '../../../shared/left-nav/left-navigation.module';
import { HiringManagerLeftNavigation } from './leftnavigation/left-navigation.component';
import { HiringRequestsComponent } from './my-hiring-requests/my-hiring-requests.component';
import { AllHiringRequestsComponent } from './all-hiring-requests/all-hiring-requests.component';
import { JobDescriptionModalComponent } from './new-hiring-request/modal/job-description-modal.component';
import { JobDescriptionModule } from './../job-description/job-description.module';
import { MultiSelectionModule } from '../../../shared/multiselection/multiselection-module';
import { InterviewPanel } from './new-hiring-request/interviewpanel/interview-panel.component';
import { HiringRequestSummary } from './hiring-request-summary/hiring-request-summary.component';
import { RecruiterHiringRequests } from './hiringrequests/hiring-requests.component';
import { RecruiterHiringDetails } from './hiringrequestdetails/hiring-request-details.component';
import { RecruiterHiringNeedDetails } from './hiringrequestdetails/hiringrequestsneeddetails/hiring-request-need-details.component';
import { RecruiterInterviewPanel } from './hiringrequestdetails/interviewpanel/interview-panel.component';
import { RecruiterJobDescModal } from './hiringrequestdetails/job-description/job-description.component';
import { NewHiringRequestDataService } from './new-hiring-request/new-hiring-request-service';
import { ChartsModule } from '../../../shared/charts/charts.module';
import { PaginationModule } from '../../../shared/pagination/pagination.module';
import { TabsModule } from './../../../shared/tablist/tabs.module';
import { CpoAssignExecutive } from '../cpo/assignexecutive/assign-executive.component';
import { AssignExecutiveModal } from '../cpo/assignexecutive/assign-executive-modal/assign-executive-modal.component';
import { AssignExecutiveFilterPipe } from '../cpo/assignexecutive/assign-executive-modal/assign-executive-filter.pipe';
import { HiringTimeline } from './hiring-timeline/hiring-timeline.component';
import { SkillModule } from '../recruiter/skill/skill.module';
import { InfiniteScrollModule } from '../../../shared/infinite-scrolling/infinite-scroll.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        hiringManagerRouting,
        NgbModule.forRoot(),
        DataTableModule,
        TagInputModule,
        AgGridModule.withComponents([]),
        DialogModule,
        OverlayPanelModule,
        ChartsModule,
        JobDescriptionModule,
        LeftNavigationModule,
        MultiSelectionModule,
        PaginationModule,
        SkillModule,
        CalendarModule,
        RemarksModule,
        InfiniteScrollModule,
        TabsModule
    ],
    declarations: [
        HiringManagerComponent,
        HiringManagerDashboard,
        NewHiringRequest,
        NewHiringRequest1,
        HiringRequestNeed,
        UpdateHiringRequest,
        UpdateHiringRequestNeed,
        NewJobDescription,
        JobDescriptionList,
        JobDescModal,
        OpenRequests,
        OpenHiringRequest,
        OpenJobDescription,
        HiringRequestsComponent,
        AllHiringRequestsComponent,
        JobDescriptionModalComponent,
        InterviewPanel,
        HiringRequestSummary,
        RecruiterHiringRequests,
        RecruiterHiringDetails,
        RecruiterHiringNeedDetails,
        RecruiterInterviewPanel,
        RecruiterJobDescModal,
        HiringManagerLeftNavigation,
        AutofocusDirective,
        CpoAssignExecutive,
        AssignExecutiveModal,
        AssignExecutiveFilterPipe,
        HiringTimeline],
    providers: [
        DialogService,
        NewHiringRequestDataService
    ]
})
export class HiringManagerModule { }
