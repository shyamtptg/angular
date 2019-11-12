import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid/main';
import { HiringComponent } from '../../hiring.component';
import { NewHiringRequestDataService1 } from '../new-hiring-request-1/new-hiring-request-service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { CommonService } from '../../../../shared/services/common.service';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import 'ag-grid-angular/main';

@Component({
  templateUrl: './my-hiring-requests.component.html'
})
export class HiringRequestsComponent {
  columnDefs: any;
  gridOptions: GridOptions;
  allOfTheData: any;
  public recordsCount: number;
  public successMessage: string;
  public departmentOptions: any[];
  public practiceOptions: any[];
  public priorityOptions: any[];
  public statusOptions: any[];
  public statsModal: boolean = false;
  public hiringReqStats: any = {
    interviewStatistics: {},
    offerStatistics: {},
    profileStatistics: {},
    showStats: false
  };
  nextDisable: boolean = true;
  prevDisable: boolean = true;
  pageNum: number = 0;
  pageSize: number = 20;
  totalPages: number;
  enableConfirm: boolean = false;
  public buttonModes: any = {};
  public filterData: any = {};
  constructor(
    private hiringComponent: HiringComponent,
    private router: Router,
    private route: ActivatedRoute,
    private hiringRequestDataService: NewHiringRequestDataService1,
    private loaderService: LoaderService,
    public commonService: CommonService,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) {
    this.gridOptions = <GridOptions>{};
    this.hiringComponent.URLtitle = "Hiring Requests / My Hiring Requests";
    this.columnDefs = [
      {headerName: "Id", field: "uid", minWidth: 70, tooltipField: "uid", headerTooltip: "Id" },
      { headerName: "Purpose", field: "purpose", minWidth: 270, tooltipField: "purpose", headerTooltip: "Purpose" },
      { headerName: "Department", field: "departmentName", minWidth: 100, tooltipField: "departmentName", headerTooltip: "Department" },
      { headerName: "Practice", field: "practiceName", minWidth: 150, tooltipField: "practiceName", headerTooltip: "Practice" },
      { headerName: "Competency", field: "competencyName", minWidth: 150, tooltipField: "competencyName", headerTooltip: "Competency" },
      { headerName: "Client Name", field: "clientName", minWidth: 150, tooltipField: "clientName", headerTooltip: "Client Name" },
      { headerName: "Model", field: "operatingModel", minWidth: 80, tooltipField: "operatingModel", headerTooltip: "Model" },
      { headerName: "Status", field: "statusDisplayName", minWidth: 110, tooltipField: "statusDisplayName", headerTooltip: "Status" },
      { headerName: "Hiring Type", field: "typeDisplayName", minWidth: 100 },
      { headerName: "Priority", field: "priorityDisplayName", minWidth: 100 },
      { headerName: "Resources", field: "resourcesCount", minWidth: 80 },
      { headerName: "Created Date", field: "creationTimestamp", minWidth: 100, cellRenderer: this.formatDate }
    ];
    this.gridOptions = {
      columnDefs: this.columnDefs,
      rowData: [],
      enableSorting: true,
      rowSelection: 'single',
      sortingOrder: ['desc', 'asc', null]
    };
    this.priorityOptions = [];
    this.statusOptions = [];
    this.filterData.department = "";
    this.filterData.practice = "";
    this.filterData.priority = "";
    this.filterData.status = "";
  }
  formatId(id: any) {
    return 'HR' + id.value.split('-')[0].toUpperCase();
  }
  formatDate(data: any) {
    var time = new Date(data.value),
      result, year, month, today;
    year = time.getFullYear();
    month = time.getMonth() + 1;
    today = time.getDate();
    result = today + '/' + month + '/' + year;
    return result;
  }
  dateComparator(date1: any, date2: any) {
    // eg 29/08/2004 gets converted to 2004082
    return this.commonService.dateComparator(date1, date2);
}

  checkModes() {
    var selectedRecords = this.gridOptions.api.getSelectedRows(),
      hiringManager: boolean, practiceHead: boolean, userDetails: any = this.commonService.getItem('currentUserInfo');
    if (userDetails) {
      hiringManager = (userDetails.roles.indexOf('Hiring Manager') != -1) ? true : false;
      practiceHead = (userDetails.roles.indexOf('Practice Head') != -1) ? true : false;
    }
    if (selectedRecords.length > 0) {
      var status = selectedRecords[0]['status'],
        needCount = selectedRecords[0]['needCount'];
        if(status == 'DRAFT'){
          this.buttonModes = {
            submitForApproval: false,
            submit: false,
            edit: false,
            timeline: false
          };
        }else if (status == 'PENDING_APPROVAL' || status == 'APPROVED') {
          this.buttonModes = {
            submitForApproval: true,
            submit: false,
            edit: false,
            timeline: false
          };
        }else if(status == 'REJECTED'){
          this.buttonModes = {
            submitForApproval: false,
            submit: false,
            edit: false,
            timeline: false
          };
        }else {
          this.buttonModes = {
            submitForApproval: true,
            submit: true,
            edit: false,
            timeline: false
          };
        }
        const STATUS_FOR_DELETE = ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'UNASSIGNED', 'ASSIGNED'];
        this.buttonModes['delete'] = !STATUS_FOR_DELETE.includes(status);

        const STATUS_FOR_COMPLETE = ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'UNASSIGNED', 'ASSIGNED', 'COMPLETED', 'DELETED'];
        this.buttonModes['close'] = STATUS_FOR_COMPLETE.includes(status);
        
        this.buttonModes['edit'] = status == 'DELETED' || status == 'COMPLETED';
    }else{
      this.resetModes();
    }
  }
  createNewDatasource() {
    if (!this.allOfTheData) {
      // in case user selected 'onPageSizeChanged()' before the json was loaded
      return;
    }
    this.gridOptions.api.showLoadingOverlay();
    var allOfTheData = this.allOfTheData,
      self = this;
    var dataSource = {
      //rowCount: ???, - not setting the row count, infinite paging will be used
      getRows: function (params: any) {
        // this code should contact the server for rows. however for the purposes of the demo,
        // the data is generated locally, a timer is used to give the experience of
        // an asynchronous call
        setTimeout(function () {
          // take a chunk of the array, matching the start and finish times
          var rowsThisPage = allOfTheData.slice(params.startRow, params.endRow);
          // see if we have come to the last page. if we have, set lastRow to
          // the very last row of the last page. if you are getting data from
          // a server, lastRow could be returned separately if the lastRow
          // is not in the current page.
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
   resizeColumns() {
    this.gridOptions.api.sizeColumnsToFit();
  }
  filterStatusOptions() {
    var count = 0;
     (this.statusOptions).forEach((ele:any)=>{
       if(ele.id == 1){
         count++;
       }
     });
     if(count ==0){
      this.statusOptions.splice(1,0,{id: 1, code: "DRAFT", description: "Draft", key: "1"});
     }
  }
  onGridInitialize() {
    this.resizeColumns();
    this.loadCombos();
  }
  loadCombos(){
    var data = this.hiringRequestDataService.getHiringCombos(), self = this;
    if (data) {
      this.departmentOptions = data['DEPARTMENT'];
      this.priorityOptions = data['HIRING_PRIORITY'];
      this.statusOptions = data['HIRING_REQUEST_STATUS'];
      this.filterStatusOptions();
      this.loadGrid();
    } else {
      self.hiringRequestDataService.getHiringComboDetails().subscribe(data=>{
        self.departmentOptions = data['DEPARTMENT'];
        self.priorityOptions = data['HIRING_PRIORITY'];
        self.statusOptions = data['HIRING_REQUEST_STATUS'];
        self.filterStatusOptions();
        self.loadGrid();
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  loadPracticesByDepartment(){
    var depId = this.filterData.department;
    this.practiceOptions = this.hiringRequestDataService.getDepartmentMap()['depPractices'][depId];
    this.filterData.practice = <any>"";
    this.filterChanged();
  }
  filterChanged(){
    this.pageNum = 0;
    this.loadGrid();
  }
  loadGrid() {
    var self = this;
    self.resetModes();
    self.loaderService.showLoading();
    setTimeout(() => {
      self.hiringRequestDataService.getMyHiringRequestsByFilters(self.pageNum, self.pageSize, self.filterData.status, self.filterData.priority, self.filterData.department, self.filterData.practice).subscribe(data => {
        self.setRowData(data['content']);
        self.recordsCount = data.totalElements;
        self.totalPages = data.totalPages;
        self.loaderService.hideLoading();
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }, 100);
  }
  exportData() {
    var self = this;
    setTimeout(() => {
      self.hiringRequestDataService.exportMyHiringRequestsByFilters(self.filterData.status, self.filterData.priority, self.filterData.department, self.filterData.practice).subscribe(data => {
        self.commonService.downloadCsv('My Hiring Requests', data['_body']);
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }, 100);
  }
  ngOnInit() {
    this.resetModes();
  }
  resetModes() {
    this.buttonModes = {
      submitForApproval: true,
      submit: true,
      edit: true,
      delete: true,
      close: true,
      timeline: true
    };
  }
  setPageNum(pageNum: any) {
    this.pageNum = pageNum;
    this.loadGrid();
  }
  setRowData(rowData: any) {
    this.allOfTheData = rowData;
    this.createNewDatasource();
  }
  createHiringRequest() {
    this.hiringRequestDataService.mode = 'new';
    this.router.navigate(['hiring/hiring-requests/new']);
  }
  updateHiringRequest() {
    this.hiringRequestDataService.mode = 'edit';
    this.loadHiringRequestDetails();
  }
  /*
  * Method to get stats about the hiring request
  */
  closeHiringRequest() {
    const selectedRecords = this.gridOptions.api.getSelectedRows();
    const self = this;
    if (selectedRecords.length <= 0) {
      return false;
    }
    const id = selectedRecords[0]['id'];
    self.loaderService.showLoading();

    this.hiringRequestDataService.getHiringRequestDetails(id).subscribe(data => {
      if(data.status === 200){
        self.loaderService.hideLoading();
        self.statsModal = true;
        self.hiringReqStats = JSON.parse(data._body);
        self.hiringReqStats.reqId = id;
        self.hiringReqStats.showStats = self.hiringReqStats.numberOfNeeds ||
                                        self.hiringReqStats.interviewStatistics.totalNumberOfUpcomingInterviews || self.hiringReqStats.interviewStatistics.totalNumberOfInterviews ||
                                        self.hiringReqStats.profileStatistics.numberOfProfilesProcessed || self.hiringReqStats.profileStatistics.numberOfCandidatesJoined ||
                                        self.hiringReqStats.offerStatistics.numberOfOffersReleased || self.hiringReqStats.offerStatistics.numberOfOffersAccepted || self.hiringReqStats.offerStatistics.numberOfOffersRejected;
      }
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  /*
  * Method which completes the deletion of hiring request.
  * @param id: hiring request id
  */
  close(id: string) {
    const self = this;
    self.loaderService.showLoading();
    this.hiringRequestDataService.closeHiringRequest(id).subscribe(data => {
      if(data.status === 200){
        self.loaderService.hideLoading();
        self.dialogService.render(
          [{
              title: 'Success',
              message: 'Hiring request closed successfully',
              yesLabel: 'OK'
          }]
      ).subscribe(result => {
            self.loadGrid();
      });
      }
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  
  loadHiringRequestDetails() {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      //this.recordNotSelected = false;
      var id = selectedRecords[0]['id'];
      this.router.navigate(['../new', id], { relativeTo: this.route });
    } else {
      //this.recordNotSelected = true;
    }
  }
  viewRequest() {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      //this.recordNotSelected = false;
      var id = selectedRecords[0]['id'];
      this.router.navigate(['../view', id], { relativeTo: this.route });
    } else {
      //this.recordNotSelected = true;
    }
  }
  deleteRequest(){
    var selectedRecords = this.gridOptions.api.getSelectedRows(),self = this;
    if (selectedRecords.length > 0) {
    var id = selectedRecords[0]['id'];
     this.enableConfirm = true;
      setTimeout(() => {
        this.dialogService.render(
          [{
              title: 'Delete Confirmation',
              message: 'Do you want to delete this record?',
              yesLabel: 'YES',
              noLabel: 'NO'
          }]
      ).subscribe(result => {
          if (result) {
            this.enableConfirm = false;
            self.delete(id);
          } else {
            this.enableConfirm = false;
          }
      });
      }, 100);
    }
  }
  delete(id: string){
    var self = this;
     self.loaderService.showLoading();
     this.hiringRequestDataService.deleteHiringReuest(id).subscribe(data => {
      if (data.status == 200) {
        self.loaderService.hideLoading();
        self.dialogService.render(
          [{
              title: 'Success',
              message: 'Hiring request deleted successfully',
              yesLabel: 'OK'
          }]
      ).subscribe(result => {
            self.loadGrid();
      });
      }
     }, error => {
      self.errorHandleService.handleErrors(error);
     });
  }
  submitHiringRequest() {
    var selectedRecords = this.gridOptions.api.getSelectedRows(),
      self = this;
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['id'],
      needCount = selectedRecords[0]['needCount'];
      if(!(needCount > 0)){
        self.dialogService.render(
          [{
              title: 'Warning',
              message: 'Please add a need before submitting the hiring request',
              yesLabel: 'OK'
          }]
      );
        return;
      }
      self.loaderService.showLoading();
      this.hiringRequestDataService.submitHiringRequest(id, 'SUBMIT').subscribe(data => {
        if (data.status == 200) {
          self.successMessage = 'Hiring request submitted successfully';
          self.loaderService.hideLoading();
          self.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }]
        ).subscribe(result => {
              self.loadGrid();
        });
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  submitForApproval() {
    var selectedRecords = this.gridOptions.api.getSelectedRows(),
      self = this;
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['id'],
      needCount = selectedRecords[0]['needCount'];
      if (!(needCount > 0)) {
        self.dialogService.render(
            [{
                title: 'Warning',
                message: 'Please add a need before submiting the hiring request',
                yesLabel: 'OK'
            }]
        );
        return;
      }
      self.loaderService.showLoading();
      this.hiringRequestDataService.submitHiringRequest(id, 'SUBMIT_FOR_APPROVAL').subscribe(data => {
        if (data.status == 200) {
          self.successMessage = 'Hiring request submitted for approval successfully';
          self.loaderService.hideLoading();
          self.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }]
        ).subscribe(result => {
              self.loadGrid();
        });
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  approve() {
    var selectedRecords = this.gridOptions.api.getSelectedRows(),
      self = this;
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['id'];
      self.loaderService.showLoading();
      this.hiringRequestDataService.submitHiringRequest(id, 'APPROVE').subscribe(data => {
        if (data.status == 200) {
          self.successMessage = 'Hiring request approved successfully';
          self.loaderService.hideLoading();
          self.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }]
        ).subscribe(result => {
              self.loadGrid();
        });
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  reject() {
    var selectedRecords = this.gridOptions.api.getSelectedRows(),
      self = this;
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['id'];
      self.loaderService.showLoading();
      this.hiringRequestDataService.submitHiringRequest(id, 'REJECT').subscribe(data => {
        if (data.status == 200) {
          self.successMessage = 'Hiring request rejected successfully';
          self.loaderService.hideLoading();
          self.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }]
        ).subscribe(result => {
              self.loadGrid();
        });
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  showHiringTimeline(){
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['id'];
      this.router.navigate(['hiring/hiring-requests/hiring-timeline', id]);
    }
  }
}