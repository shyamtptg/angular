import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HiringComponent } from '../../../hiring.component';
import { GridOptions } from "ag-grid/main";
import { CommonService } from '../../../../../shared/services/common.service';
import "ag-grid-angular/main";

@Component({
    templateUrl: './deactivated.component.html'
})

export class RecruiterDeactivated {
    columnDefs: any;
    gridOptions: GridOptions;
    allOfTheData: any;
    constructor(
        private hiringComponent: HiringComponent,
        private commonService: CommonService
    ) {
        this.hiringComponent.URLtitle = "Profiles / Deactivated Profiles";
        this.gridOptions = <GridOptions>{};
        this.columnDefs = [
            { headerName: "Req#", field: "request", minWidth: 180, sort: 'desc', checkboxSelection: true },
            { headerName: "Department", field: "department", minWidth: 180 },
            { headerName: "Practice", field: "practice", minWidth: 180 },
            { headerName: "Status", field: "status", minWidth: 150, unSortIcon: true },
            { headerName: "Work Location", field: "workLocation", minWidth: 200 },
            { headerName: "Hiring Type", field: "hiringType", minWidth: 180 },
            { headerName: "Created Date", field: "createdDate", minWidth: 180, comparator: this.dateComparator }
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
            rowSelection: 'single'
        };
    }
    dateComparator(date1: any, date2: any) {
        // eg 29/08/2004 gets converted to 2004082
        return this.commonService.dateComparator(date1, date2);
    }

    onCellClicked(value: any) {
    }
    createNewDatasource() {
        if (!this.allOfTheData) {
            return;
        }
        var allOfTheData = this.allOfTheData;
        var dataSource = {
            getRows: function (params: any) {
                setTimeout(function () {
                    var rowsThisPage = allOfTheData.slice(params.startRow, params.endRow);
                    var lastRow = -1;
                    if (allOfTheData.length <= params.endRow) {
                        lastRow = allOfTheData.length;
                    }
                    params.successCallback(rowsThisPage, lastRow);
                }, 500);
            }
        };
        this.gridOptions.api.setRowData(this.allOfTheData);
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
}