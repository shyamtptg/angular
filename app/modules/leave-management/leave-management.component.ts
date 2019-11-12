import { Component } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';

@Component({
    templateUrl: './leave-management.component.html',
    styles: [`
       .leave-container {
            margin: 0.7em;
            display: inline-block;
            text-align: center;
       }
       .leave-text {
            font-size:12.5px;
            margin-top:0.7em;
       }
       .leave {
            font-weight: bold;
            font-size:1.7em;
            padding-top:0.4em;
       }
       .page-title {
            font-size:16px;
            margin-top: 1.6em;
            margin-bottom: 1.1em;
            display: inline-block;
       }
       .left-menu-icon {
            margin-top:1.7em;
            margin-bottom: 1.1em;
            display: inline-block;
       }
    `]
})
export class LeaveManagement {
    title: string;
    userName: string;
    userDetails: any;
    URLtitle: string = '';
    leave: any;
    constructor(public commonService: CommonService) {
        this.userDetails = this.commonService.getItem('currentUserInfo');
        this.userName = (this.userDetails) ? this.userDetails['displayName'] : '';
        this.title = 'Leave Management System';
    }
}