import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HiringComponent } from '../../hiring.component';
import { NewHiringRequestDataService1 } from '../new-hiring-request-1/new-hiring-request-service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { CommonService } from '../../../../shared/services/common.service';
import { GridOptions } from 'ag-grid/main';
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';
import 'ag-grid-angular/main';

@Component({
  templateUrl: './hiring-requests.component.html'
})

export class RecruiterHiringRequests {
  public departmentOptions: any[];
  public practiceOptions: any[];
  public priorityOptions: any[];
  public statusOptions: any[];
  columnDefs: any;
  gridOptions: GridOptions;
  disableShedule: boolean = true;
  allOfTheData: any;
  recordsCount: number;
  pageNum: number = 0;
  pageSize: number = 20;
  totalPages: number;
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

    this.hiringComponent.URLtitle = "Hiring Requests / Assigned Requests";
    this.gridOptions = <GridOptions>{};
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
      //rowModelType: 'infinite'
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

  onCellClicked(value: any) {
    this.setModes();
  }
  setModes() {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      this.disableShedule = false;
    } else {
      this.disableShedule = true;
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
    //  this.gridOptions.api.setDatasource(dataSource);
  }
   resizeColumns() {
    this.gridOptions.api.sizeColumnsToFit();
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
      //this.filterStatusOptions();
      this.loadGrid();
    }
    else {
      self.hiringRequestDataService.getHiringComboDetails().subscribe(data=>{
        self.departmentOptions = data['DEPARTMENT'];
        self.priorityOptions = data['HIRING_PRIORITY'];
        self.statusOptions = data['HIRING_REQUEST_STATUS'];
        //self.filterStatusOptions();
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
    self.loaderService.showLoading();
    setTimeout(() => {
      this.hiringRequestDataService.getAssignedHiringRequestsByFilters(self.pageNum, self.pageSize, self.filterData.status, self.filterData.priority, self.filterData.department, self.filterData.practice).subscribe(data => {
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
      self.hiringRequestDataService.exportAssignedHiringRequestsByFilters(self.filterData.status, self.filterData.priority, self.filterData.department, self.filterData.practice).subscribe(data => {
        self.commonService.downloadCsv('Assigned Hiring Requests', data['_body']);
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }, 100);
  }
  setPageNum(pageNum: any) {
    this.pageNum = pageNum;
    this.loadGrid();
  }
  setRowData(rowData: any) {
    this.allOfTheData = rowData;
    //this.gridOptions.api.setDatasource(rowData); 
    this.createNewDatasource();
  }
  navigateToHiringRequestDetails() {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      //this.recordNotSelected = false;
      var id = selectedRecords[0]['id'];
      this.router.navigate(['../view', id], { relativeTo: this.route });
    } else {
      //this.recordNotSelected = true;
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