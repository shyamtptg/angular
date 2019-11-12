import { Component } from '@angular/core';
import { HiringComponent } from '../../hiring.component';
import { DownloadLink } from './download-link/download-link.component';
import { JobDescPopup } from './job-description/job-description.component';
import { GridOptions } from "ag-grid/main";
import { Router, ActivatedRoute } from '@angular/router';
import { InterviewDataService } from './interviews.service';
import { ProfilesDataService } from '../../recruiter/profiles/profile.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { CommonService } from '../../../../shared/services/common.service';
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';

import "ag-grid-angular/main";
@Component({
  templateUrl: './interviews.component.html'
})
export class InterviewerScheduledInterviews {
  columnDefs: any;
  gridOptions: GridOptions;
  allOfTheData: any;
  public statusOptions: any[];
  public scheduleStatus: string;
  public resultStatusOptions: any[];
  public resultStatus: string;
  public recordsCount: number;
  pageNum: number = 0;
  pageSize: number = 20;
  totalPages: number;
  public buttonModes: any = {};
  public successMessage: string;
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
    this.hiringComponent.URLtitle = "Interviews / Scheduled Interviews";
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
      rowSelection: 'single',
      //rowModelType: 'infinite'
    };
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
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime: any = hours + ':' + minutes + ' ' + ampm;
    return result + ' ' + strTime;
  }
  onCellClicked(record: any) {
    this.checkModes();
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
    // this.gridOptions.api.setDatasource(dataSource);
  }
  checkModes() {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      var interviewStatus = selectedRecords[0]['interviewScheduledStatus'],
        previousInterview = selectedRecords[0]['previousInterviewId'],
        interviewDate = selectedRecords[0]['interviewDate'],
        prospectNeed = selectedRecords[0]['prospect']['prospectNeed'],
        status = prospectNeed && prospectNeed[0] && prospectNeed[0]['status'];
      if ((interviewStatus == 'SCHEDULED') || (interviewStatus == 'DECLINED') || (interviewStatus == 'ACCEPTED') || (interviewStatus == 'FEEDBACK_PENDING')) {
        this.buttonModes = {
          accept: true,
          decline: true,
          submitFeedback: true,
          viewFeedback: true,
          schedule: true,
          reschedule: false,
          requestReschedule: true,
          cancel: false
        };
      } else if (/*recruiter && */interviewStatus == 'FEEDBACK_SUBMITTED' && status == 'INTERVIEW_IN_PROGRESS') {
        this.buttonModes = {
          accept: true,
          decline: true,
          submitFeedback: true,
          viewFeedback: true,
          schedule: false,
          reschedule: true,
          requestReschedule: true,
          cancel: true
        };
      } else {
        this.buttonModes = {
          accept: true,
          decline: true,
          submitFeedback: true,
          viewFeedback: true,
          schedule: true,
          reschedule: true,
          requestReschedule: true,
          cancel: true
        };
      }
      if ((interviewStatus == 'FEEDBACK_SUBMITTED') || previousInterview) {
        this.buttonModes['viewFeedback'] = false;
      } else {
        this.buttonModes['viewFeedback'] = true;
      }
      if (interviewStatus == 'CANCELLED') {
        this.buttonModes['cancel'] = true;
      }
      this.buttonModes['viewInterview'] = false;
      this.buttonModes['viewProfile'] = false;
    } else {
      this.buttonModes = {
        accept: true,
        decline: true,
        submitFeedback: true,
        viewFeedback: true,
        schedule: true,
        reschedule: true,
        requestReschedule: true,
        cancel: true,
        viewProfile: true,
        viewInterview: true
      };
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
  filterChanged() {
    this.pageNum = 0;
    this.buttonModes = {
      accept: true,
      decline: true,
      submitFeedback: true,
      viewFeedback: true,
      schedule: true,
      reschedule: true,
      requestReschedule: true,
      cancel: true,
      viewProfile: true,
      viewInterview: true
    };
    this.loadGrid();
  }
  loadGrid() {
    var self = this;
    setTimeout(() => {
      self.loaderService.showLoading();
      self.interviewDataService.getScheduledInterviews(self.pageNum, self.pageSize, self.resultStatus, self.scheduleStatus).subscribe(data => {
        self.setRowData(data);
        self.recordsCount = data.totalElements;
        self.totalPages = data.totalPages;
        self.loaderService.hideLoading();
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }, 100);
  }
  setPageNum(pageNum: any) {
    this.pageNum = pageNum;
    this.loadGrid();
  }
  exportData() {
    var self = this;
    setTimeout(() => {
      self.interviewDataService.exportScheduledInterviews(self.resultStatus, self.scheduleStatus).subscribe(data => {
        self.commonService.downloadCsv('Scheduled Interviews', data['_body']);
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }, 100);
  }
  setRowData(rowData: any) {
    this.allOfTheData = rowData;
    this.createNewDatasource();
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

  cancelInterview() {
    var selectedRecords = this.gridOptions.api.getSelectedRows(),
      self = this;
    self.successMessage = 'Do you want to cancel the interview?';
    setTimeout(() => {
      this.dialogService.render(
        [{
          title: 'Confirmation',
          message: self.successMessage,
          yesLabel: 'YES',
          noLabel: 'NO'
        }],
      ).subscribe(result => {
        if (result) {
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
                  });
              }
            }, error => {
              self.errorHandleService.handleErrors(error);
            });
          }
        }
      });
    }
      , 100);
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
        this.router.navigate(['../hiring/profiles/schedule', id, hiringId, needId]);
      } else {
        this.profileDataService.prospectDetails = {
          'prospectName': prospectName,
          'hiringId': hiringId,
          'hiringNeedId': needId,
          'interviewId': interviewId
        };
        this.router.navigate(['../hiring/profiles/reschedule', interviewId]);
      }
    }
  }
  requestReschedule() {
  }
  //open profile details of interviewer 
  showProfileDetails() {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['prospect']['id'];
      //this.router.navigate(['../interviews', id], { relativeTo: this.route });
      this.router.navigate(['../hiring/profiles/profile-details', id]);
    }
  }
  showInterviewDetails() {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['id'];
      this.router.navigate(['../hiring/interviews/view', id]);
    }
  }
  ngOnInit() {
    this.buttonModes = {
      accept: true,
      decline: true,
      submitFeedback: true,
      viewFeedback: true,
      schedule: true,
      reschedule: true,
      requestReschedule: true,
      cancel: true,
      viewProfile: true,
      viewInterview: true
    };
  }
}