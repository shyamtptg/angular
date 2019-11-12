

import { NgModule } from '@angular/core';

//Hiring services

import { AddProfileDataService } from '../hiring/recruiter/addprofile/add-profile.service';
import { AssignExecutiveDataService } from '../hiring/cpo/assignexecutive/assign-executive.service';
import { OffersDataService } from '../hiring/cpo/offers/offers.service';
import { InterviewDataService } from '../hiring/interviewer/interviews/interviews.service';
import { ProfilesDataService } from '../hiring/recruiter/profiles/profile.service';
import { SearchService } from '../hiring/recruiter/profiles/search/search.service';
import { NewHiringRequestDataService1 } from '../hiring/hiring-manager/new-hiring-request-1/new-hiring-request-service';

//Leave Management System services

import { LeaveManagementService } from '../leave-management/leave-management.service';


@NgModule({
  providers: [
    AddProfileDataService,
    AssignExecutiveDataService,
    NewHiringRequestDataService1,
    OffersDataService,
    InterviewDataService,
    ProfilesDataService,
    SearchService,
    LeaveManagementService
  ]
})
export class CoreModule {}
