import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeaveManagement } from './leave-management.component';
import { HeaderModule } from '../../modules/header/header.module';
import { FooterModule } from '../../modules/footer/footer.module';
import { leaveManagementRouting } from './leave-management.routing';
import { LmsLeftNavigation } from './left-navigation/left-navigation.component';
import { LmsSlideNavigation } from './slide-navigation/slide-navigation.component';
import { LeftNavigationModule } from '../../shared/left-nav/left-navigation.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular/main';
import { CalendarModule, ButtonModule, PanelModule, AutoCompleteModule, DialogModule } from 'primeng/primeng';
import { TagInputModule } from 'ngx-chips';

import { DashboardComponent } from './dashboard/dashboard.component';
import { FullCalendarModule } from 'ng-fullcalendar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalContentComponent } from './dashboard/modal.component';
import { CalenderComponent } from './calender/calender.component';
import { PaginatorModule } from 'primeng/paginator';
import { PaginationModule } from '../../shared/pagination/pagination.module';
import { MyleavecreditsComponent } from './myleavecredits/myleavecredits.component';
import { CompoffComponent } from './compoff/compoff.component';
import { CompoffmanagerComponent } from './compoffmanager/compoffmanager.component';
import { ActionButtonsComponent } from './action-buttons/action-buttons.component';
import { MyrequestsComponent } from './myrequests/myrequests.component';
import { WorkfromhomeComponent } from './workfromhome/workfromhome.component';
import { ManagerwfhComponent } from './managerwfh/managerwfh.component';
import { CancelrequestComponent } from './cancelrequest/cancelrequest.component';
import { TeamRequestsComponent } from './team-requests/team-requests.component';
import { TeamReportComponent } from './team-report/team-report.component';
import { MyleaveComponent } from './myleave/myleave.component';
import { LeaveRequestDetailsComponent } from './leave-request-details/leave-request-details.component';
import { EmployeeLeaveReportComponent } from './employee-leave-report/employee-leave-report.component';
import { LeaverequestComponent } from './leaverequest/leaverequest.component';
import { LeavecreditsComponent } from './leavecredits/leavecredits.component';
import { EncashmentRequestComponent } from './encashment-request/encashment-request.component';
import { ProfileComponent } from './profile/profile.component';
import { LeaveadjustmentComponent } from './leaveadjustment/leaveadjustment.component';
@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        leaveManagementRouting,
        LeftNavigationModule,
        HeaderModule,
        FooterModule,
        ModalModule.forRoot(),
        PaginatorModule,
        PaginationModule,
        FullCalendarModule,
        CalendarModule,
        DialogModule,
        ButtonModule,
        PanelModule,
        AutoCompleteModule,
        TagInputModule,
        AgGridModule.withComponents([ActionButtonsComponent, CancelrequestComponent])
    ],
    declarations: [
        LeaveManagement,
        LmsLeftNavigation,
        LmsSlideNavigation,
        DashboardComponent,
        ModalContentComponent,
        CalenderComponent,
        MyleavecreditsComponent,
        CompoffComponent,
        CompoffmanagerComponent,
        ActionButtonsComponent,
        MyrequestsComponent,
        WorkfromhomeComponent,
        ManagerwfhComponent,
        CancelrequestComponent,
        TeamRequestsComponent,
        TeamReportComponent,
        MyleaveComponent,
        LeaveRequestDetailsComponent,
        EmployeeLeaveReportComponent,
        LeaverequestComponent,
        LeavecreditsComponent,
        EncashmentRequestComponent,
        ProfileComponent,
        LeaveadjustmentComponent
    ],
    providers: [CalenderComponent],
    entryComponents: [ModalContentComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})

export class LeaveManagementModule { }
