
import { NgModule } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';
import { recruiterRouting } from './recruiter.routing';
import { RecruiterComponent } from './recruiter.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular/main';
import { TagInputModule } from 'ngx-chips';
import {CalendarModule, AutoCompleteModule} from 'primeng/primeng';
import { MultiSelectionModule } from '../../../shared/multiselection/multiselection-module';
import { RecruiterLeftNavigation } from './leftnavigation/left-navigation.component';
import { RecruiterProfiles } from './profiles/all/profiles.component';
import { RecruiterDeactivated } from './profiles/deactivated/deactivated.component';
import { RecruiterSelected } from './profiles/selected/selected.component';
import { PrejoiningPending } from './profiles/prejoining-pending/prejoining-pending.component';
import { PrejoiningCompleted } from './profiles/prejoining-completed/prejoining-completed.component';
import { OfferAccepted } from './profiles/offer-accepted/offer-accepted.component';
import { ProspectJoined } from './profiles/joined/joined.component';
import { ProspectNoShow } from './profiles/no-show/no-show.component';
import { CompletedPrejoining } from './profiles/completed-prejoining/completed-prejoining.component';
import { RecruiterVerified } from './profiles/verified/verified.component';
import { RecruiterSearch } from './profiles/search/search.component';
import { ProspectTimelineComponent } from './profiles/search/prospect-timeline/prospect-timeline.component';
import {DownloadLink} from './profiles/search/download-link/download-link.component';
import { ScheduleInterview } from './profiles/shortlisted/scheduleinterview/schedule-interview.component';
import { RecruiterShortlisted } from './profiles/shortlisted/shortlisted.component';
import { RecruiterRejected } from './profiles/rejected/rejected.component';
import { AddProfileModule } from './addprofile/add-profile.module';
import { DeactivatePersonalGuard } from './addprofile/guards/deactivate-personal-guard';
import { ActivateProfessionalGuard } from './addprofile/guards/activate-professional-guard';
import { ActivatePersonalGuard } from './addprofile/guards/activate-personal-guard';
import { DeactivateProfessionalGuard } from './addprofile/guards/deactivate-professional-guard';
import { DeactivateSkillGuard } from './addprofile/guards/deactivate-skill-guard';
import { ChartsModule } from '../../../shared/charts/charts.module';
import { EmailModule } from '../../../shared/email/email.module';
import { LeftNavigationModule } from '../../../shared/left-nav/left-navigation.module';
import { PaginationModule } from '../../../shared/pagination/pagination.module';
import {TabsModule} from '../../../shared/tablist/tabs.module';
import { RemarksModule } from '../../../shared/remarks/remarks.module';
import { SkillModule } from './skill/skill.module';
import { HRManagerVerification } from './profiles/verification/verification-details.component';
import { HiringManagerProfiles } from './profilescreening/profiles.component';
import { ProfileDetailsDialog } from './profilescreening/profile-details/profile-details.component';
import { InfiniteScrollModule } from '../../../shared/infinite-scrolling/infinite-scroll.module';
import { UploadDocModule } from '../../../shared/upload-doc/upload-doc.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CalendarModule,
        recruiterRouting,
        NgbModule.forRoot(),
        AgGridModule.withComponents([DownloadLink]),
        ChartsModule,
        AddProfileModule,
        EmailModule,
        LeftNavigationModule,
        PaginationModule,
        MultiSelectionModule,
        RemarksModule,
        SkillModule,
        InfiniteScrollModule,
        UploadDocModule,
        TabsModule,
        AutoCompleteModule
    ],
    providers: [
        DeactivatePersonalGuard,
        ActivatePersonalGuard,
        ActivateProfessionalGuard,
        DeactivateProfessionalGuard,
        DeactivateSkillGuard
    ],
    declarations: [
        RecruiterLeftNavigation,
        RecruiterComponent,
        RecruiterDeactivated,
        RecruiterSearch,
        ProspectTimelineComponent,
        DownloadLink,
        RecruiterProfiles,
        RecruiterSelected,
        PrejoiningPending,
        PrejoiningCompleted,
        OfferAccepted,
        ProspectJoined,
        ProspectNoShow,
        CompletedPrejoining,
        RecruiterShortlisted,
        RecruiterRejected,
        RecruiterVerified,
        ScheduleInterview,
        HRManagerVerification,
        HiringManagerProfiles,
        ProfileDetailsDialog
    ]
})
export class RecruiterModule { }
