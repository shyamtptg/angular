import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridOptions } from 'ag-grid/main';
import { CommonService } from '../../../../shared/services/common.service';
// import { CpoComponent } from '../cpo.component';
import 'ag-grid-angular/main';

@Component({
    templateUrl: './profiles.component.html'
})
export class CpoProfiles {
    columnDefs: any;
    gridOptions: GridOptions;
    allOfTheData: any;
    constructor(
        private router: Router,
        private commonService: CommonService
    ) {
        this.gridOptions = <GridOptions>{};
        //cpoComponent.URLtitle = "Dashboard / Profiles Summary";
        this.columnDefs = [
            { headerName: "Req#", field: "request", minWidth: 170, sort: 'desc', checkboxSelection: true },
            { headerName: "Department", field: "department", minWidth: 170 },
            { headerName: "Practice", field: "practice", minWidth: 170 },
            { headerName: "Status", field: "status", minWidth: 130, unSortIcon: true },
            { headerName: "Work Location", field: "workLocation", minWidth: 170 },
            { headerName: "Hiring Type", field: "hiringType", minWidth: 170 },
            { headerName: "Created Date", field: "createdDate", minWidth: 170, comparator: this.dateComparator }
        ];
        this.gridOptions = {
            columnDefs: this.columnDefs,
            rowData: [{
                "request": "HR123",
                "department": "UX",
                "practice": "Design",
                "status": "open",
                "workLocation": "Innominds Hyd",
                "hiringType": "Permanent",
                "createdDate": "08/08/2016"
            },
            {
                "request": "HR124",
                "department": "Engineering",
                "practice": "UI",
                "status": "open",
                "workLocation": "Innominds Hyd",
                "hiringType": "Permanent",
                "createdDate": "08/10/2016"
            },
            {
                "request": "HR125",
                "department": "Human Resources",
                "practice": "HR",
                "status": "open",
                "workLocation": "Innominds Hyd",
                "hiringType": "Permanent",
                "createdDate": "08/08/2016"
            },
            {
                "request": "HR126",
                "department": "UX",
                "practice": "Design",
                "status": "open",
                "workLocation": "Innominds Hyd",
                "hiringType": "Permanent",
                "createdDate": "08/10/2016"
            },
            {
                "request": "HR127",
                "department": "Engineering",
                "practice": "UI",
                "status": "Rejected",
                "workLocation": "Innominds Hyd",
                "hiringType": "Permanent",
                "createdDate": "08/08/2016"
            },
            {
                "request": "HR128",
                "department": "Engineering",
                "practice": "UI",
                "status": "On Hold",
                "workLocation": "Innominds Hyd",
                "hiringType": "Permanent",
                "createdDate": "08/10/2016"
            },
            {
                "request": "HR129",
                "department": "Finance",
                "practice": "Finance",
                "status": "open",
                "workLocation": "Innominds Hyd",
                "hiringType": "Permanent",
                "createdDate": "08/08/2016"
            }
            ],
            enableSorting: true,
            rowSelection: 'single',
            //rowModelType: 'infinite'
        };
    }
    dateComparator(date1: any, date2: any) {
        // eg 29/08/2004 gets converted to 2004082
        return this.commonService.dateComparator(date1, date2);
    }

    onCellClicked(value: any) {
        this.gridOptions.api.getSelectedRows();
    }
    createNewDatasource() {
        if (!this.allOfTheData) {
            // in case user selected 'onPageSizeChanged()' before the json was loaded
            return;
        }
        this.gridOptions.api.showLoadingOverlay();
        var allOfTheData = this.allOfTheData;
        var self = this;
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
        // this.gridOptions.api.setDatasource(dataSource);
    }
     resizeColumns() {
    this.gridOptions.api.sizeColumnsToFit();
  }
    
    onGridInitialize() {
        this.resizeColumns();
        this.setRowData(this.gridOptions.rowData);
    }
    setRowData(rowData: any) {
        this.allOfTheData = rowData;
        this.createNewDatasource();
    }
    createHiringRequest() {
        this.router.navigate(['hiring/12345/hiringmanager/new']);
    }
}