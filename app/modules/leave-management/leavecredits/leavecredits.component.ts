import { Component, OnInit } from '@angular/core';
import { LeaveManagementService } from '../leave-management.service';
import { LeaveManagement } from '../leave-management.component';
import * as moment from 'moment';
var FileSaver= require('filesaver.js-npm');
import { ErrorHandleService } from './../../../shared/services/errorhandle.service';
import { LoaderService } from './../../../shared/services/loader.service';
import { UtilService } from '../../../util.service';

@Component({
  selector: 'app-leavecredits',
  templateUrl: './leavecredits.component.html',
  styleUrls: ['./leavecredits.component.scss']
})
export class LeavecreditsComponent implements OnInit {
  public columnDefs;
  public paginationPageSize;
  public getRowHeight;
  public gridColumnApi;
  public DefaultDate;
  public gridParams;
  pageNum: number = 0;
  pageSize: number = 10;
  totalPages: number;
  currentUrl;
  minDate: any;
  maxDate: any;
  holidaysList: any;
  constructor(
    private appService: LeaveManagementService,
    public loaderService: LoaderService,
    private errorHandleService: ErrorHandleService,
    private leaveManagement: LeaveManagement,
    private utilService: UtilService
  ) {
    leaveManagement.URLtitle = "Leave Credits History";
    this.columnDefs=[
      {headerName: "Employee code", field: "employeeCode", minWidth: 130},
      {headerName: "Name", field: "employeeName", minWidth: 175},
      {headerName: "Date of Join", field: "dateOfJoining", minWidth: 130},
      {headerName: "Earned Leave", field: "earnLeave", minWidth: 120},
      {headerName: "Casual Leave", field: "casualLeave", minWidth: 120},
      {headerName: "Optional Holiday", field: "optionalLeave", minWidth: 130}
    ],
    this.paginationPageSize=10;
    this.DefaultDate=new Date();
   }
  public reportData;
  public modalData:any;
  public gridApi;
  public leaveBalanceSummaryData={};
  public leavesSummary: any;
  public leavesSummaryManager: any;
  public user;
  public date= this.dateToEpoch(new Date());
  public export:Boolean;
  public employeeCredits;
  ngOnInit() {
        this.user = { 'role': '' }
    this.modalData={};
    this.currentUrl = "api/me/lms/employees/leaveCreditedHistory/" + this.dateToEpoch(this.DefaultDate);
    this.leavesSummary={
      "leaveBalanceSummary":
      [
       {"description":null,"leaveTypeCode":null,"balance":null},
       {"description":null,"leaveTypeCode":null,"balance":null},
       {"description":null,"leaveTypeCode":null,"balance":null},
       {"description":null,"leaveTypeCode":null,"balance":null}
     ],
   "leaveRequestSummaryDto":{"employeeLeaveRequestSummary":{"content":[]}}, "pendingLeaves":{"content":[]},"leaveRequestStatusSummary":{"content":[]}};
   this.leavesSummaryManager={
     "leaveBalanceSummary":
     [{"description":null,"leaveTypeCode":null,"balance":null},
      {"description":null,"leaveTypeCode":null,"balance":null},
      {"description":null,"leaveTypeCode":null,"balance":null},
      {"description":null,"leaveTypeCode":null,"balance":null}],
  "leaveRequestSummary":{"content":[]}, "pendingLeaves":{"content":[]},"leaveRequestStatusSummary":{"content":[]}};
  this.appService.getService('api/me/lms/requests/PENDING/calendar/1513036800000').subscribe(res => {

    for(let i=0; i<res.leaveBalanceSummary.length;i++){
      this.leaveBalanceSummaryData[res.leaveBalanceSummary[i].leaveTypeCode]=res.leaveBalanceSummary[i];
    }
    this.leaveManagement.leave = this.leaveBalanceSummaryData;
    this.modalData.leaveBalance=this.leaveBalanceSummaryData;
    if(this.user.role=="employee"){
      this.leavesSummary=res;
    }else{
      this.leavesSummaryManager=res;
    }
  },error => {
    this.errorHandleService.handleErrors(error);
  });
    this.leaveBalanceSummaryData={"CO":{},"CL":{},"EL":{},"OL":{}};
    this.export=true; 
    
  }
    resizeColumns() {
        this.gridApi && this.gridApi.sizeColumnsToFit();
    }
    onGridReady(params) {
      this.loaderService.showLoading();
      this.appService
      .paginationRequest(this.pageNum, this.pageSize, this.currentUrl)
      .subscribe(
          res => {
            this.loaderService.hideLoading();
              this.employeeCredits = res;
              this.totalPages = res.totalPages * 10;
              this.employeeCredits.content.forEach(element => {
                  element.dateOfJoining = this.utilService.epochToDate(element.dateOfJoining);
              });
              this.gridParams = params;
              this.gridApi = params.api;
              this.gridColumnApi = params.columnApi;
              this.gridApi.setRowData(this.employeeCredits.content);

    }, error => {
      this.errorHandleService.handleErrors(error);
    });
  }

  selectDate(date) {
  this.date = this.dateToEpoch(date);
  this.currentUrl = 'api/me/lms/employees/leaveCreditedHistory/' + this.date;
        this.onGridReady(this.gridParams)
}

dateToEpoch(date){
  let y=date.getFullYear(),
  m=date.getMonth()+1,
  d=date.getDate();
  let dateStr=[y, (m>9?'':'0')+m, (d>9?'':'0')+d].join('-')
  let epochDate = new Date(dateStr).getTime();
  return epochDate;
}
exportData() {
  this.loaderService.showLoading();
  const url = 'api/me/lms/leaveCreditHistory/export/' + this.date;
  this.appService.exportService(url).subscribe(res => {
    this.loaderService.hideLoading();
    this.reportData = res['_body'];
    var blob = new Blob([this.reportData], {type: 'application/octet-stream'});
    FileSaver.saveAs(blob, 'Reports.csv');
   this.export = true;
  }, error => {
      this.errorHandleService.handleErrors(error);
  });
  this.export = false;
}
paginate(e) {
  this.pageNum = e.page;
  this.onGridReady(this.gridParams);
}
}
