import { Component } from '@angular/core';
import { HiringComponent } from '../../hiring.component';
import { DownloadLink } from '../interviews/download-link/download-link.component';
import { JobDescPopup } from '../interviews/job-description/job-description.component';
import { GridOptions } from 'ag-grid/main';
import { Router, ActivatedRoute } from '@angular/router';
import { InterviewDataService } from '../interviews/interviews.service';
import { ProfilesDataService } from '../../recruiter/profiles/profile.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { CommonService } from '../../../../shared/services/common.service';
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';

import "ag-grid-angular/main";
@Component({
  templateUrl: './my-interviews.component.html'
})
export class MyInterviews {
  columnDefs: any;
  gridOptions: GridOptions;
  allOfTheData: any;
  public statusOptions: any[];
  public scheduleStatus: string;
  public resultStatusOptions: any[];
  public resultStatus: string;
  public recordsCount: number;
  public buttonModes: any = {};
  public successMessage: string;
  public frameworkComponents;
  public context;
  pageNum: number = 0;
  pageSize: number = 20;
  totalPages: number;
  display: boolean = false;
  jobDescData: any;
  constructor(
    private hiringComponent: HiringComponent,
    private profileDataService: ProfilesDataService,
    private router: Router,
    private route: ActivatedRoute,
    private interviewDataService: InterviewDataService,
    private loaderService: LoaderService,
    public commonService: CommonService,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) {
    this.hiringComponent.URLtitle = "Interviews / My Interviews";
    this.columnDefs = [
      { headerName: "Candidate Name", field: "prospect.displayName", minWidth: 170, sort: 'desc', tooltipField: "prospect.displayName", headerTooltip: "Candidate Name" },
      { headerName: "Job Description", field: "jobDescriptionTemplateName", minWidth: 140, cellRendererFramework: JobDescPopup, tooltipField: "jobDescriptionTemplateName", headerTooltip: "Job Description" },
      { headerName: "Mobile No.", field: "prospect.mobileNumber", minWidth: 100, tooltipField: "prospect.mobileNumber", headerTooltip: "Mobile Number" },
      { headerName: "Interview Level", field: "interviewLevel", minWidth: 115, tooltipField: "interviewLevel", headerTooltip: "Interview Level" },
      { headerName: "Interview Mode", field: "interviewMode", minWidth: 115, tooltipField: "interviewMode", headerTooltip: "Interview Mode" },
      { headerName: "Interview Date", field: "interviewDate", minWidth: 140, comparator: this.dateComparator, cellRenderer: this.formatDate },
      { headerName: "Scheduled By", field: "scheduledBy", minWidth: 150, tooltipField: "scheduledBy", headerTooltip: "Scheduled By" },
      { headerName: "Status", field: "interviewScheduledStatusDisplayName", minWidth: 140, unSortIcon: true, tooltipField: "interviewScheduledStatusDisplayName", headerTooltip: "Job Description" },
      { headerName: "Result Status", field: "interviewResultStatus", minWidth: 130, unSortIcon: true, tooltipField: "interviewResultStatus", headerTooltip: "Result Status" },
      { headerName: "Resume", field: "department", minWidth: 120, cellRendererFramework: DownloadLink }
    ];
    this.gridOptions = {
      columnDefs: this.columnDefs,
      rowData: [],
      enableSorting: true,
      rowSelection: 'single'
    };
    this.frameworkComponents = {
      jobDescPopup: JobDescPopup
    };
    this.context = { componentParent: this };
    this.statusOptions = [];
    this.resultStatusOptions = [];
    this.scheduleStatus = "ALL";
    this.resultStatus = "ALL";
  }
  dateComparator(date1: any, date2: any) {
    // eg 29/08/2004 gets converted to 2004082
    return this.commonService.dateComparator(date1, date2);
}

  formatDate(data: any) {
    var time = new Date(data.value),
      result, year, month, today;
    year = time.getFullYear();
    month = time.getMonth() + 1;
    today = time.getDate();
    result = today + '/' + month + '/' + year;
    var hours: any = time.getHours();
      var minutes: any = time.getMinutes();
      var ampm: any = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime: any= hours + ':' + minutes + ' ' + ampm;
    return result + ' ' + strTime;
  }
  createNewDatasource() {
    if (!this.allOfTheData) {
      return;
    }
    this.gridOptions.api.showLoadingOverlay();
    var allOfTheData = this.allOfTheData,
      self = this;
    var dataSource = {
      getRows: function (params: any) {
        setTimeout(function () {
          var rowsThisPage = allOfTheData.slice(params.startRow, params.endRow);
          var lastRow = -1;
          if (allOfTheData.length <= params.endRow) {
            lastRow = allOfTheData.length;
          }
          params.successCallback(rowsThisPage, lastRow);
          self.gridOptions.api.hideOverlay();
          if (allOfTheData.length == 0) {
            self.gridOptions.api.showNoRowsOverlay();
          }
        }, 500);
      }
    };
    self.gridOptions.api.setRowData(this.allOfTheData);
  }
  onCellClicked(record: any) {
    this.checkModes();
  }
  checkModes() {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      var interviewStatus = selectedRecords[0]['interviewScheduledStatus'],
        previousInterview = selectedRecords[0]['previousInterviewId'],
        interviewDate = selectedRecords[0]['interviewDate'],
        prospectNeed = selectedRecords[0]['prospect']['prospectNeed'],
        status = prospectNeed && prospectNeed[0] && prospectNeed[0]['status'];
      if (interviewStatus == 'SCHEDULED' || interviewStatus == 'RESCHEDULED') {
        this.buttonModes = {
          accept: false,
          decline: false,
          submitFeedback: true,
          viewFeedback: true,
          open: false
        };
      } else if ((new Date().getTime() > interviewDate) && (interviewStatus == 'ACCEPTED' || interviewStatus == 'FEEDBACK_PENDING')) {
        this.buttonModes = {
          accept: true,
          decline: false,
          submitFeedback: false,
          viewFeedback: true,
          open: false
        };
      } else if (interviewStatus == 'ACCEPTED') {
        this.buttonModes = {
          accept: true,
          decline: false,
          submitFeedback: true,
          viewFeedback: true,
          open: false
        };
      } else {
        this.buttonModes = {
          accept: true,
          decline: true,
          submitFeedback: true,
          viewFeedback: true,
          open: false
        };
      }
      if((interviewStatus == 'FEEDBACK_SUBMITTED') || previousInterview){
        this.buttonModes['viewFeedback'] = false;
      }
    }else{
      this.resetModes();
    }
  }
  resizeColumns() {
    this.gridOptions.api.sizeColumnsToFit();
  }
  onGridInitialize() {
    this.resizeColumns();
    var self = this;
    this.interviewDataService.getCombos().subscribe(data => {
      self.statusOptions = data['INTERVIEW_SCHEDULE_STATUS'];
      self.resultStatusOptions = data['INTERVIEW_RESULT_STATUS'];
      self.loadGrid();
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  filterChanged(){
    this.pageNum = 0;
    this.loadGrid();
  }
  loadGrid() {
    var self = this;
    self.resetModes();
    self.loaderService.showLoading();
    self.interviewDataService.getMyInterviews(self.pageNum, self.pageSize, self.resultStatus, self.scheduleStatus).subscribe(data => {
      self.setRowData(data['content']);
      self.recordsCount = data.totalElements;
      self.totalPages = data.totalPages;
      self.loaderService.hideLoading();
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  setPageNum(pageNum: any) {
    this.pageNum = pageNum;
    this.loadGrid();
  }
  exportData() {
    var self = this;
    setTimeout(() => {
      self.interviewDataService.exportMyInterviews(self.resultStatus, self.scheduleStatus).subscribe(data => {
        self.commonService.downloadCsv('My Interviews', data['_body']);
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }, 100);
  }
  setRowData(rowData: any) {
    this.allOfTheData = rowData;
    this.createNewDatasource();
  }
  openFeedBack() {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      var hiringId = selectedRecords[0]['hiringRequestId'],
      needId = selectedRecords[0]['hiringRequestNeedId'],
      interviewId = selectedRecords[0]['id'];
      this.router.navigate(['../hiring/interviews/submit-feedback', interviewId, hiringId, needId]);
    }
  }
  viewFeedBack() {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['prospect']['id'],
      reqId = selectedRecords[0]['hiringRequestId'],
      needId = selectedRecords[0]['hiringRequestNeedId'];
      this.router.navigate(['../hiring/interviews/view-feedback', id, reqId, needId]);
    }
  }
  accept() {
    var selectedRecords = this.gridOptions.api.getSelectedRows(),
      self = this;
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['hiringRequestId'],
        needId = selectedRecords[0]['hiringRequestNeedId'],
        interviewId = selectedRecords[0]['id'];
      self.loaderService.showLoading();
      this.interviewDataService.acceptInterview(id, needId, interviewId, 'ACCEPTED').subscribe(data => {
        if (data.status == 200) {
          self.successMessage = 'Interview accepted successfully';
          self.loaderService.hideLoading();
          this.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }]).subscribe(result => {
                this.loadGrid();
          })
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  decline() {
    var selectedRecords = this.gridOptions.api.getSelectedRows(),
      self = this;
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['hiringRequestId'],
        needId = selectedRecords[0]['hiringRequestNeedId'],
        interviewId = selectedRecords[0]['id'];
      self.loaderService.showLoading();
      this.interviewDataService.declineInterview(id, needId, interviewId, 'DECLINED').subscribe(data => {
        if (data.status == 200) {
          self.successMessage = 'Interview declined successfully';
          self.loaderService.hideLoading();
          this.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }]).subscribe(result => {
                this.loadGrid();
          })
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  cancelInterview() {
    var selectedRecords = this.gridOptions.api.getSelectedRows(),
      self = this;
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['hiringRequestId'],
        needId = selectedRecords[0]['hiringRequestNeedId'],
        interviewId = selectedRecords[0]['id'];
      self.loaderService.showLoading();
      this.interviewDataService.cancelInterview(id, needId, interviewId).subscribe(data => {
        if (data.status == 200) {
          self.successMessage = 'Interview cancelled successfully';
          self.loaderService.hideLoading();
          this.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }]).subscribe(result => {
                this.loadGrid();
          })
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  reschedule(status: string) {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      var prospectName = selectedRecords[0]['prospect']['displayName'],
        id = selectedRecords[0]['prospect']['id'],
        hiringId = selectedRecords[0]['hiringRequestId'],
        needId = selectedRecords[0]['hiringRequestNeedId'],
        interviewId = selectedRecords[0]['id'];
      if (status == 'Recommended For Next Round') {
        this.profileDataService.prospectDetails = {
          'prospectName': prospectName,
          'hiringId': hiringId,
          'hiringNeedId': needId
        };
      } else {
        this.profileDataService.prospectDetails = {
          'prospectName': prospectName,
          'hiringId': hiringId,
          'hiringNeedId': needId,
          'interviewId': interviewId
        };
      }
      this.router.navigate(['../hiring/interviews/schedule', id]);
    }
  }
  //open profile details of interviewer 
  showProfileDetails() {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['prospect']['id'];
      this.router.navigate(['../hiring/profiles/profile-details', id]);
    }
  }
  ngOnInit() {
    this.resetModes();
  }
  resetModes(){
    this.buttonModes = {
      accept: true,
      decline: true,
      submitFeedback: true,
      viewFeedback: true,
      open: true
    };
  }
  showJobDesc(data: any){
   this.jobDescData = data;
   this.display = true;
  }
}