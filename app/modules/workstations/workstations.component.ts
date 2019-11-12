import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { HomeService } from './../../home/home.service';
import { FormControl, Validators} from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-workstations',
  templateUrl: './workstations.component.html',
  styleUrls: ['./workstations.component.scss']
})
export class WorkstationsComponent implements OnInit {
  title: string;
  userName: string;
  userDetails: any;
  dataObject: any;
  updatedetails: any;
  rowid: any;
  states: string[] = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];
  Company = new FormControl('', [Validators.required]);
  designation = new FormControl('', [Validators.required]);
  startDate = new FormControl('', [Validators.required]);
  bloodGroup = new FormControl('', [Validators.required]);
  endDate = new FormControl('', [Validators.required]);
  state = new FormControl('', [Validators.required]);
  city = new FormControl('', [Validators.required]);
  country = new FormControl('', [Validators.required]);
  employeeObject: any;

  constructor(
    private commonService: CommonService,
    private httpService: HomeService
  ) {
    this.userDetails = this.commonService.getItem('currentUserInfo');
    this.userName = (this.userDetails) ? this.userDetails['displayName'] : '';
    this.title = 'Workstations';
    this.employeeObject = {
      info: [
        {
          attr: 'Joining Date',
          val: '10/06/2018',
          cols: 2
        },
        {
          attr: 'Job Status',
          val: 'Offer Rolled Out',
          cols: 2
        },
        {
          attr: 'Request#',
          val: '004',
          cols: 2
        },
        {
          attr: 'Requested Workstation',
          val: 'W-489',
          cols: 2
        },
        {
          attr: 'Workstation Location',
          val: 'Waverock, 2.1',
          cols: 2
        }
      ],
      name: 'Charan Kumar Marasani',
      id: 123,
      image_path: 'test',
      cols: 16
    };
  }

  ngOnInit() {
    this.expinfodetails();
  }
  edit(id) {
    this.rowid = id;
    this.updatedetails = this.dataObject[id];
  }
  expinfodetails() {
    this.httpService.getTimelineMockdata().subscribe(response => {
      this.dataObject = JSON.parse(response._body).candidateExperiencedetails;
    });
  }
  cancel(id) {
  this.rowid = null;
  }
}
