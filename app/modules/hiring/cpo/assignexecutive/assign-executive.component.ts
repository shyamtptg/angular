import { Component } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { ActivatedRoute, Router } from '@angular/router';
import { HiringComponent } from './../../hiring.component';
import { AssignExecutiveDataService } from './assign-executive.service';
import { NewHiringRequestDataService1 } from '../../hiring-manager/new-hiring-request-1/new-hiring-request-service';
import { LoaderService } from '../../../../shared/services/loader.service';
import 'ag-grid-angular/main';
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';

@Component({
  templateUrl: './assign-executive.component.html'
})
export class CpoAssignExecutive {
  public departmentOptions: any[];
  public practiceOptions: any[];
  public priorityOptions: any[];
  public statusOptions: any[];
  columnDefs: any;
  gridOptions: GridOptions;
  allOfTheData: any;
  public successMessage: string;
  public departmentMap: any;
  public clientMap: any;
  public hiringReqId: string;
  public recordsCount: number;
  public buttonModes: any = {
    'isAssignDisable': true,
    'isEditAssignDisable': true
  };
  public recordNotSelected: boolean = false;
  pageNum: number = 0;
  pageSize: number = 20;
  totalPages: number;
  public filterData: any = {};
  constructor(
    private hiringComponent: HiringComponent,
    private loaderService: LoaderService,
    private assignExecutiveDataService: AssignExecutiveDataService,
    private hiringRequestDataService: NewHiringRequestDataService1,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute,
    private errorHandleService: ErrorHandleService
  ) {
    this.gridOptions = <GridOptions>{};
    this.hiringComponent.URLtitle = "Assign Executive";
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
      rowSelection: 'single'
    };
    this.priorityOptions = [
      { code: "LOW", description: 'Low' },
      { code: "NORMAL", description: 'Normal' },
      { code: "HIGH", description: 'High' },
      { code: "VERY_HIGH", description: 'Very High' },
      { code: "CRITICAL", description: 'Critical' },
      { code: "VERY_CRITICAL", description: 'Very Critical' }
    ];
    this.statusOptions = [
      { code: 'ACTIVE', description: 'Active' },
      { code: 'ASSIGNED', description: 'Assigned' },
      { code: 'UNASSIGNED', description: 'Unassigned' }
    ];
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
      this.loadGrid();
    }
    else {
      self.hiringRequestDataService.getHiringComboDetails().subscribe(data=>{
        self.departmentOptions = data['DEPARTMENT'];
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
    setTimeout(() => {
      self.loaderService.showLoading();
      self.assignExecutiveDataService.getAllHiringRequestsByFiltersForAssign(self.pageNum, self.pageSize, self.filterData.status, self.filterData.priority, self.filterData.department, self.filterData.practice, 'ASSIGNED,UNASSIGNED,ACTIVE').subscribe(data => {
        self.setRowData(data['content']);
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
  setRowData(rowData: any) {
    this.allOfTheData = rowData;
    this.createNewDatasource();
  }
  createHiringRequest() {
    this.router.navigate(['hiring/12345/hiringmanager/new']);
  }
  loadRecruiters(items: any) {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    var recruiterIds = items.map(function (x: any) {
      return x * 1;
    });
    if (selectedRecords.length > 0) {
      var hiringId: any = selectedRecords[0]['id'],
        self = this;
      var recruiterData = {
        recruiterIds: recruiterIds,
        isEditAssignment: ((this.buttonModes['isAssignDisable'])? true: false)
      }
      self.loaderService.showLoading();
      this.assignExecutiveDataService.assignRecruiter(hiringId, recruiterData).subscribe(data => {
        if (data.status == 200) {
          self.successMessage = 'Recruiters assigned to request successfully';
          self.loaderService.hideLoading();
          this.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }]
            ).subscribe(result => {
                this.loadGrid();
          });


        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  checkRecordSelection() {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      this.recordNotSelected = false;
    } else {
      this.recordNotSelected = true;
    }
  }
  setModes(){
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      var status = selectedRecords[0]['status'];
      this.hiringReqId = selectedRecords[0]['id'];
      this.buttonModes['isAssignDisable'] = (status == 'UNASSIGNED') ? false : true;
      this.buttonModes['isEditAssignDisable'] = (status == 'ASSIGNED' || status == 'ACTIVE') ? false : true;
      this.buttonModes['open'] = false;
      this.buttonModes['timeline'] = false;
    }else{
      this.resetModes();
    }
  }
  resetModes(){
    this.buttonModes = {
      'open': true,
      'timeline': true,
      'isAssignDisable': true,
      'isEditAssignDisable': true
    };
  }
  navigateToHiringRequestDetails() {
    var selectedRecords = this.gridOptions.api.getSelectedRows();
    if (selectedRecords.length > 0) {
      var id = selectedRecords[0]['id'];
      this.router.navigate(['../view', id], { relativeTo: this.route });
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

