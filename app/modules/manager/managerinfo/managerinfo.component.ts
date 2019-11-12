import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { LoaderService } from '../../../shared/services/loader.service';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../shared/services/http.service';
import {ManagerService} from '../manager.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {ManagerDialogComponent} from '../manager-dialog/manager-dialog.component';

@Component({
  selector: 'app-managerinfo',
  templateUrl: './managerinfo.component.html',
  styleUrls: ['./managerinfo.component.scss']
})
export class ManagerinfoComponent implements OnInit {
  displayedColumns1: string[] = ['src', 'name',
  'joiningDate', 'designation', 'jobStatus', 'IT Request', 'Workstation Request'];
  dataSource1: any;
  @ViewChild(MatSort) sort: MatSort;
  public requestinfo: any;
  public url: any;
  public employees: string = 'joiningThisWeek';
  public prospectId: any;
  public edit: boolean = false;

  constructor(
    private commonService: CommonService,
    private httpService: HttpService,
    private router: Router,
    private loaderService: LoaderService,
    private errorHandleService: ErrorHandleService,
    private managerService: ManagerService,
    private dialog: MatDialog,
    ) {

  }

  ngOnInit() {
    this.getRequests();
    this.url = '../../../assets/Group 10.svg';
  }
  getRequests() {
    this.loaderService.showLoading();
        this.managerService.getService('api/q/prospectivehires/view/newJoinees/' + this.employees).subscribe(res => {
          if ( res[0] && res[0].prospectId && res[0].prospectId !== undefined) {
                this.prospectId = res[0].prospectId;
            }
            this.requestinfo = res;
            this.dataSource1 = new MatTableDataSource(this.requestinfo);
            this.dataSource1.sort = this.sort;
            this.loaderService.hideLoading();
        }, error => {
            this.errorHandleService.handleErrors(error);

        });

  }
change(selectedemps: any) {
    this.employees = selectedemps;
    this.getRequests();
}
openDialog(request: any) {
      this.loaderService.showLoading();
      const dialogRef = this.dialog.open(ManagerDialogComponent, {
      width: '500px',
      height: '500px',
      data: [{
        serviceData: request ? request : '',
      }
      ]
    });
     dialogRef.afterClosed().subscribe(result => {
  });
}
navigateToAllocateWS(request: any) {
    localStorage.setItem('request', JSON.stringify(request));
    const redirect: any = 'manager/workstationRequests';
    this.router.navigate([redirect]);
}

}
