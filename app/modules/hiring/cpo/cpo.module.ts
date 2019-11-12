import { FastTrackOfferModule } from './fast-track-offer/fast-track-offer.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { cpoRouting } from './cpo.routing';
import { CpoComponent } from './cpo.component';
import { CpoLeftNavigation } from './leftnavigation/left-navigation.component';
import { CpoRecruiter } from './recruiter/recruiter.component';
import { CpoProfiles } from './profiles/profiles.component';
import { CpoOffers } from './offers/offers.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from '../../../shared/charts/charts.module';
import { AgGridModule } from 'ag-grid-angular/main';

import { TagInputModule } from 'ngx-chips';
import {CalendarModule} from 'primeng/primeng';
import { MultiSelectionModule } from '../../../shared/multiselection/multiselection-module';
import { ProfileDetailsDialog } from './profiles/profile-details/profile-details.component';
import { DialogModule, OrderListModule } from 'primeng/primeng';
import { LeftNavigationModule } from '../../../shared/left-nav/left-navigation.module';
import { PaginationModule } from '../../../shared/pagination/pagination.module';
import { OfferLetterDetailsModule } from './offer-letter-details/offer-letter-details.module';
import { CPOHiringDetails } from './hiringrequestdetails/hiring-request-details.component';
import { CPOHiringNeedDetails } from './hiringrequestdetails/hiringrequestsneeddetails/hiring-request-need-details.component';
import { CPOInterviewPanel } from './hiringrequestdetails/interviewpanel/interview-panel.component';
import { CPOJobDescModal } from './hiringrequestdetails/job-description/job-description.component';
import { ReadyToOffer } from './ready-to-offer/ready-to-offer.component';
import { ReleasedOffers } from './released/released-offers.component';
import { DeclinedOffers } from './declined/declined-offers.component';
import { FastTrackOffer } from './fast-track-offer/fast-track-offer.component';
import { HRManagerOfferLetterDetails } from '../hr-manager/offerletter-details/offerletter-details.component';
import { LineItemComponent } from '../hr-manager/offerletter-details/ctc-line-item/ctc-line-item.component';
import { Annexure } from '../hr-manager/offerletter-details/annexure/annexure.component';
import { Attachments } from '../hr-manager/offerletter-details/attachments/attachments.component';
import { UploadDocModule } from '../../../shared/upload-doc/upload-doc.module';
import { DownloadOffer } from './download-offer/download-offer.component';
import { RemarksModule } from '../../../shared/remarks/remarks.module';
import { HiringDetailsModal } from './hiring-details-modal/hiring-details-modal.component';
import { ProfileDetailsModal } from './profile-details-modal/profile-details-modal.component';
import { SkillModule } from '../recruiter/skill/skill.module';
import {TabsModule} from './../../../shared/tablist/tabs.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FastTrackOfferModule,
        cpoRouting,
        NgbModule.forRoot(),
        ChartsModule,
        AgGridModule.withComponents([DownloadOffer]),
        DialogModule,
        OrderListModule,
        LeftNavigationModule,
        OfferLetterDetailsModule,
        PaginationModule,
        TagInputModule,
        MultiSelectionModule,
        CalendarModule,
        RemarksModule,
        SkillModule,
        TabsModule,
        UploadDocModule
    ],
    declarations: [
        CpoComponent,
        CpoLeftNavigation,
        CpoRecruiter,
        CpoProfiles,
        CpoOffers,
        ReadyToOffer,
        ReleasedOffers,
        DeclinedOffers,
        FastTrackOffer,
        ProfileDetailsDialog,
        CPOHiringDetails,
        CPOHiringNeedDetails,
        CPOInterviewPanel,
        CPOJobDescModal,
        DownloadOffer,
        HiringDetailsModal,
        ProfileDetailsModal,
        HRManagerOfferLetterDetails,
        LineItemComponent,
        Annexure,
        Attachments
    ]
})
export class CpoModule { }
