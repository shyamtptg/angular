import { Component, OnInit } from '@angular/core';
import { NewHiringRequestDataService1 } from '../new-hiring-request-service';
import { Router, ActivatedRoute } from '@angular/router';
import {GridOptions} from 'ag-grid/main';
import { HiringComponent } from '../../../hiring.component';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';
import 'ag-grid-angular/main';

@Component({
  templateUrl: './job-description-list.component.html'
})

export class JobDescriptionList implements OnInit {
   columnDefs: any;
   gridOptions: GridOptions;
   allOfTheData: any;
   recordNotSelected: boolean = true;
   pageNum: number = 0;
   pageSize: number = 20;
   totalPages: number;
   public departmentMap: any;
   public practiceMap: any;
   public recordsCount: number;
   public departmentOptions: any;
   public practiceOptions: any;
   public isDisable: boolean = true;
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
   this.hiringComponent.URLtitle = "Hiring Requests / Job Descriptions";
    this.columnDefs = [
    {headerName: "Department Name", field: "departmentName", minWidth: 200 },
    {headerName: "Practice Name", field: "practiceName", minWidth: 270 },
    {headerName: "Job Description Title", field: "templateName", minWidth: 270},
    {headerName: "Owner", field: "createdBy", minWidth: 200}
   ];
    this.gridOptions = {
     columnDefs: this.columnDefs,
     rowData: [],
     enableFilter: true,
     enableSorting: true,
     rowSelection: 'single'
    };
    this.filterData.isDeprecated = false;
  }
  dateComparator(date1: any, date2: any) {
    // eg 29/08/2004 gets converted to 2004082
    return this.commonService.dateComparator(date1, date2);
}

 onSelection(){
  var selectedRecords = this.gridOptions.api.getSelectedRows();
  if (selectedRecords.length > 0) {
    var isOwner = selectedRecords[0]['isOwner'];
    this.isDisable = (isOwner)? false:true;
    this.recordNotSelected = false;
  }else{
    this.isDisable = true;
    this.recordNotSelected = true;
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
            setTimeout( function() {
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
resizeColumns(){
  this.gridOptions.api.sizeColumnsToFit();
}
ngOnInit() {
  const self = this,
  hiringCombos = self.hiringRequestDataService.getHiringCombos();
  if (hiringCombos) {
    self.departmentOptions = hiringCombos['DEPARTMENT'];
    self.practiceOptions = hiringCombos['PRACTICE'];
  } else {
    self.hiringRequestDataService.getHiringComboDetails().subscribe(data => {
      self.departmentOptions = data['DEPARTMENT'];
      self.practiceOptions = data['PRACTICE'];
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
}
loadPracticesByDepartment(){
  var depId = this.filterData.departmentId;
  this.practiceOptions = this.hiringRequestDataService.getDepartmentMap()['depPractices'][depId];
  this.filterData.practiceId = <any>"";
  this.filterChanged();
}
filterChanged(){
  this.pageNum = 0;
  this.loadGrid();
}
onGridInitialize(){
  this.loadGrid();
}
loadGrid(){
  var self = this;
  self.resizeColumns();
  self.loaderService.showLoading();
  self.hiringRequestDataService.getAllJobDescriptionsByFilters(self.pageNum, self.pageSize, self.filterData.departmentId, self.filterData.practiceId, self.filterData.isDeprecated).subscribe(data => {   
    if(data['content']){
      self.setRowData(data['content']);
      self.recordsCount = data.totalElements;
      self.totalPages = data.totalPages;
    }
    self.loaderService.hideLoading();
  }, error =>{
    self.errorHandleService.handleErrors(error);
  });
}
setPageNum(pageNum: any){
  this.pageNum = pageNum;
  this.loadGrid();
}
setRowData(rowData: any) {
  this.allOfTheData = rowData;
  this.createNewDatasource();
}
navigateToJobDescriptionCreation(){
  this.router.navigate(['../jobdesc'], { relativeTo: this.route });
}
editJobDescription() {
  this.hiringRequestDataService.jobDescMode = 'edit';
  this.loadJobDescriptionDetails();
}
viewJobDescription(){
  var selectedRecords = this.gridOptions.api.getSelectedRows();
  if(selectedRecords.length>0){
    var jobDescId = selectedRecords[0]['id'];
    this.hiringRequestDataService.jobDescId = selectedRecords[0]['id'];
    this.router.navigate(['../jobdesc-details', jobDescId], { relativeTo: this.route });
  }
}
loadJobDescriptionDetails() {
  var selectedRecords = this.gridOptions.api.getSelectedRows();
  if(selectedRecords.length>0){
    var jobDescId = selectedRecords[0]['id'];
    this.hiringRequestDataService.jobDescId = selectedRecords[0]['id'];
    this.router.navigate(['../jobdesc', jobDescId], { relativeTo: this.route });
  }
}
}
 