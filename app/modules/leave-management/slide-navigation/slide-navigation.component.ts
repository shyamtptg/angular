import { Component } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';

@Component({
	selector: 'lms-slide-navigation',
	templateUrl: './slide-navigation.component.html'
})
export class LmsSlideNavigation {
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
	    "leaveCredits": this.contains('VIEW_LEAVE_CREDITED_HISTORY_HR'),
	  	"teamRequests": this.contains('APPROVE_LEAVE_REQUEST'),
		"encashmentRequest": this.contains('APPROVE_ENCASH_LEAVE_REQUEST'),
		"workFromHomeRequest": this.contains('APPROVE_WORK_FROM_HOME_REQUEST'),
		"compoffRequest": this.contains('APPROVE_COMPOFF_REQUEST'),
		"teamReport": this.contains('VIEW_TEAM_REPORT')
	  };
	}
	contains(feature: string) {
		return (this.enabledFeatures.indexOf(feature) == -1) ? true : false;
	}
}