import { Component } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';

@Component({
	selector: 'left-navigation',
	templateUrl: './left-navigation.component.html'
})
export class LeftNavigation {
	roles: any;
	permissions: any = {};
	enabledFeatures: any;
	constructor(public commonService: CommonService) {}
	ngOnInit() {
	  var userDetails: any = this.commonService.getItem('currentUserInfo');
	  if (userDetails) {
		 this.roles = userDetails.roles;
		 this.enabledFeatures = userDetails.enabledFeatures;
	  }
	  this.permissions = {
	    "dashboard": this.contains('VIEW_DASHBOARDS'),
		"hiringContainer": this.contains('HIRING_CONTAINER_LINK'),
		"createHiringRequest": this.contains('CREATE_HIRING_REQUEST'),
		"myHiringRequests": this.contains('LIST_MY_HIRING_REQUESTS'),
		"AllHiringRequests": this.contains('LIST_ALL_HIRING_REQUESTS'),
		"jobDescriptions": this.contains('LIST_ALL_JOB_DESCRIPTIONS'),
		"createJobDescription": this.contains('CREATE_JOB_DESCRIPTION'),
		"profileScreening": this.contains('VIEW_PROFILES_TO_SCREEN_LIST'),
		"assignExecutive": this.contains('ASSIGN_RECRUITERS_TO_HIRING_REQUEST'),
		"interviewsContainer": this.contains('INTERVIEWS_CONTAINER_LINK'),
		"interviews": this.contains('VIEW_SCHEDULED_INTERVIEWS'),
		"myInterviews": this.contains('VIEW_MY_INTERVIEWS'),
		"hiringRequests": this.contains('LIST_ASSIGNED_HIRING_REQUESTS'),
		"profilesContainer": this.contains('PROFILES_CONTAINER_LINK'),
		"allProfiles": this.contains('LIST_ALL_PROFILES'),
		"shortlisted": this.contains('VIEW_SHORTLISTED_PROFILES_LIST'),
		"rejected": this.contains('VIEW_REJECTED_PROFILES_LIST'),
		"selected": this.contains('VIEW_SELECTED_CANDIDATES_LIST'),
		"prejoiningPending": this.contains('VIEW_CANDIDATES_PENDING_SUBMISSION_OF_SUPPORTING_DOCUMENTS'),
		"prejoiningCompleted": this.contains('VIEW_PRE_JOINING_COMPLETED_LIST'),
		"readyToVerify": this.contains('VIEW_CANDIDATES_PENDING_VERIFICATION_LIST'),
		"verified": this.contains('VIEW_VERIFIED_CANDIDATES_LIST'),
		"search": this.contains('SEARCH_PROFILES'),
		"offerAccepted": this.contains('VIEW_OFFER_ACCEPTED_CANDIDATES_LIST'),
		"joined": this.contains('VIEW_JOINED_CANDIDATES_LIST'),
		"noShow": this.contains('VIEW_NO_SHOW_CANDIDATES_LIST'),
		"offersContainer": this.contains('OFFERS_CONTAINER_LINK'),
		"offers": this.contains('VIEW_OFFERS_LIST'),
		"readyToOffer": this.contains('VIEW_READY_TO_OFFER_LIST'),
		"releasedOffers": this.contains('VIEW_RELEASED_OFFERS_LIST'),
		"declinedOffers": this.contains('VIEW_DECLINED_OFFERS_LIST'),
		"createFastrackOffer": this.contains('CREATE_FASTTRACK_OFFER')
	  };
	}
	isHidden(applicableRoles: any) {
		var visible: boolean = false, self = this;
		applicableRoles.forEach(function (elem: any, ind: any) {
			if (self.roles.indexOf(elem) != -1) {
				visible = true;
			}
		});
		return (visible) ? false : true;
	}
	contains(feature: string) {
		return (this.enabledFeatures.indexOf(feature) == -1) ? true : false;
	
	}
}