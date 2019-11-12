import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-employeeid',
  templateUrl: './employeeid.component.html',
  styleUrls: ['./employeeid.component.scss']
})
export class EmployeeidComponent implements OnInit {
  title: string;
  userName: string;
  userDetails: any;

  constructor(private commonService: CommonService) {
    this.userDetails = this.commonService.getItem('currentUserInfo');
    this.userName = (this.userDetails) ? this.userDetails['displayName'] : '';
    this.title = 'Employeee ID';
  }

  ngOnInit() {
  }

}
