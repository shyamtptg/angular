import { Component, OnInit } from '@angular/core';
import { NewHiringRequestDataService1 } from './hiring-manager/new-hiring-request-1/new-hiring-request-service';
import { AddProfileDataService } from './recruiter/addprofile/add-profile.service';
import { AssignExecutiveDataService } from './cpo/assignexecutive/assign-executive.service';

import { LoaderService } from '../../shared/services/loader.service';
import { CommonService } from '../../shared/services/common.service';

import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';

@Component({
    templateUrl: './hiring.component.html',
    styleUrls: [`./hiring.component.scss`]
})
export class HiringComponent implements OnInit {
    title: string;
    userName: string;
    jobCode: string;
    jobDescription: string;
    jobLocation: string;
    jobCountry: string;
    userDetails: any;
    URLtitle: string = '';
    constructor(
        private hiringRequestDataService: NewHiringRequestDataService1,
        private addProfileDataService: AddProfileDataService,
        private assignExecutiveDataService: AssignExecutiveDataService,
        private router: Router,
        private loaderService: LoaderService,
        public commonService: CommonService
    ) {
        this.userDetails = this.commonService.getItem('currentUserInfo');
        this.userName = (this.userDetails) ? this.userDetails['displayName'] : '';
        this.title = 'Hiring';
        this.jobCode = 'UX120981';
        this.jobDescription = 'UX Designer';
        this.jobLocation = 'Hyderabad';
        this.jobCountry = 'India';
        this.hiringRequestDataService.loadHiringComboData();
        this.hiringRequestDataService.loadPanelMembers();
        this.hiringRequestDataService.loadHiringManagers();
        this.addProfileDataService.loadHiringComboData();
        this.addProfileDataService.loadProspectComboData();
        this.assignExecutiveDataService.loadHiringComboData();
    }
    private capitalizeFirstLetter(string: string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    ngOnInit() {
        const self = this;
        this.router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart) {
                self.loaderService.showLoading();
            } else if (event instanceof RouteConfigLoadEnd) {
                self.loaderService.hideLoading();
            }
        });
    }
}
