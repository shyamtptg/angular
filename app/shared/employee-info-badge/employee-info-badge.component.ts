import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-employee-info-badge',
  templateUrl: './employee-info-badge.component.html',
  styleUrls: ['./employee-info-badge.component.scss']
})
export class EmployeeInfoBadgeComponent implements OnInit {
  @Input() employeeObject: any;
  public url: any;
  constructor() { }

  ngOnInit() {
    this.url = '../../../assets/Group 10.svg';
  }

  private setProfileWidth(info) {
    return (100 * (1 / this.employeeObject['cols'])) + '%';
  }

  private setEmployeeWidth(info) {
    return (100 * (2 / this.employeeObject['cols'])) + '%';
  }

  private setWidth(info) {
    return (100 * (info.cols / this.employeeObject['cols'])) + '%';
  }

}
