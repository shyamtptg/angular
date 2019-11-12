import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {
  title: string;
  userName: string;
  userDetails: any;
  helpDocUrl: string;

  constructor( private commonService: CommonService) {
    this.userDetails = this.commonService.getItem('currentUserInfo');
    this.userName = (this.userDetails) ? this.userDetails['displayName'] : '';
    this.title = 'Manager';
    this.helpDocUrl = 'https://innomindssw.sharepoint.com/sites/InnomindsUniversity/MySpaceNx/SitePages/Employee.aspx';
   }

  ngOnInit() {
  }

}
