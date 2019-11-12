import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HiringComponent } from './hiring.component';
import { HeaderModule } from '../../modules/header/header.module';
import { FooterModule } from '../../modules/footer/footer.module';
import { hiringRouting } from './hiring.routing';
import { LeftNavigation } from './leftnavigation/left-navigation.component';
import { SlideNavigation } from './slidenavigation/slide-navigation.component';
import { LeftNavigationModule } from '../../shared/left-nav/left-navigation.module';
import { AddProfileDataService } from './recruiter/addprofile/add-profile.service';
import { AssignExecutiveDataService } from './cpo/assignexecutive/assign-executive.service';
import { OffersDataService } from './cpo/offers/offers.service';
import { InterviewDataService } from './interviewer/interviews/interviews.service';
import { ProfilesDataService } from './recruiter/profiles/profile.service';
import { SearchService } from './recruiter/profiles/search/search.service';
import { NewHiringRequestDataService1 } from './hiring-manager/new-hiring-request-1/new-hiring-request-service';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    hiringRouting,
    HeaderModule,
    FooterModule,
    LeftNavigationModule
  ],
  declarations: [
    HiringComponent,
    LeftNavigation,
    SlideNavigation
  ],
  providers: [
    AddProfileDataService,
    AssignExecutiveDataService,
    NewHiringRequestDataService1,
    OffersDataService,
    InterviewDataService,
    ProfilesDataService,
    SearchService
  ]
})

export class HiringModule { }
