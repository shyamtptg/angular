import { LeaveManagementService } from '../leave-management.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LeaveManagement } from '../leave-management.component';
import { CommonService } from './../../../shared/services/common.service';
@Component({
    selector: 'app-leave-request-details',
    templateUrl: './leave-request-details.component.html',
    styleUrls: ['./leave-request-details.component.scss']
})
export class LeaveRequestDetailsComponent implements OnInit {

    public requestedData;
    constructor(private router: Router, private AppService: LeaveManagementService,
        private route: ActivatedRoute, public LeaveManagement: LeaveManagement, public commonService: CommonService) {
        LeaveManagement.URLtitle = "Team Leave Requests / Profile View"
    }
    ngOnInit() {
        this.requestedData = this.commonService.getItem('empRptData');
        this.router.events.subscribe( (event: any) => {
            if (event instanceof NavigationEnd) {
                if(event.url!='/leave-management/leave-request-details'){
                    localStorage.removeItem('empRptData');
                }
            }
        });
    }

}
