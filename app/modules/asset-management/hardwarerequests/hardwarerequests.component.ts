import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { HttpService } from '../../../shared/services/http.service';
import { Router } from '@angular/router';
import { reduce } from 'rxjs/operator/reduce';
import { LoaderService } from '../../../shared/services/loader.service';
import {AssetService} from '../asset.service';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import {UtilService} from '../../../util.service';

@Component({
    selector: 'app-hardwarerequests',
    templateUrl: './hardwarerequests.component.html',
    styleUrls: ['./hardwarerequests.component.scss']
})
export class HardwarerequestsComponent implements OnInit {
    title: string;
    userName: string;
    userDetails: any;
    helpDocUrl: string;
    numberofJoinees: any;
    div: any;
    employeeObject: any;
    dateToDisplay: any;
    employees: string = 'joiningThisWeek';
    /*variable declartion */
    displayedColumns1: string[] = ['src', 'name',
    'dateOfJoining', 'jobStatus', 'id', 'requestedHardware', 'hardwareAvailability', 'action'];
    dataSource1: any;
    public hardwareinfo: any;
    public url: any;
    public btnDisable = false;
    AllocationRequestsData: any[] = [];
    @ViewChild(MatSort) sort: MatSort;
    public currentDate: any;
    public hardwareobj: any;
    constructor(
        private commonService: CommonService,
        private httpService: HttpService,
        private router: Router,
        private loaderService: LoaderService,
        private assetService: AssetService,
        private errorHandleService: ErrorHandleService,
        private utilService: UtilService
        ) {
            this.userDetails = this.commonService.getItem('currentUserInfo');
            this.userName = (this.userDetails) ? this.userDetails['displayName'] : '';
            this.title = 'Asset Management';
            this.helpDocUrl = 'https://innomindssw.sharepoint.com/sites/InnomindsUniversity/MySpaceNx/SitePages/Employee.aspx';
            this.employeeObject = {
                info: [
                    {
                        attr: 'Joining Date',
                        val: '10/06/2018',
                        cols: 2
                    },
                    {
                        attr: 'Practice',
                        val: 'UI',
                        cols: 2
                    },
                    {
                        attr: 'Competency',
                        val: 'Angular',
                        cols: 2
                    },
                    {
                        attr: 'Designation',
                        val: 'Senior Engineer',
                        cols: 2
                    },
                    {
                        attr: 'Experience',
                        val: '1 yrs 3 mons',
                        cols: 2
                    },
                    {
                        attr: 'Onboarding Status',
                        val: 'Not Started',
                        cols: 2
                    }
                ],
                name: 'Charan Kumar Marasani',
                id: 123,
                image_path: 'test',
                cols: 17
            };
    }
    ngOnInit() {
        this.url = '../../../assets/Group 10.svg';
        this.getContents();
    }
    getContents() {
        this.loaderService.showLoading();
        this.assetService.getService('api/q/onboarding/hardwareRequests?view=' + this.employees).subscribe(res => {
            this.hardwareinfo = res;
            this.getTableData(res);
            this.dataSource1 = new MatTableDataSource(this.AllocationRequestsData);
            this.dataSource1.sort = this.sort;
            this.loaderService.hideLoading();
        }, error => {
            this.errorHandleService.handleErrors(error);

        });
    }
    getTableData(object: any) {
        this.AllocationRequestsData = [];
        for (let i = 0; i < object.length; i++) {
        this.AllocationRequestsData[i] = {};
        this.AllocationRequestsData[i].dateOfJoining = object[i].dateOfJoining;
        this.AllocationRequestsData[i].jobStatus = object[i].jobStatus;
        this.AllocationRequestsData[i].id = object[i].id;
        this.AllocationRequestsData[i].requestedHardware = object[i].requestedHardware;
        this.AllocationRequestsData[i].hardwareAvailability = object[i].hardwareAvailability;
        this.AllocationRequestsData[i].url = this.url;
        this.AllocationRequestsData[i].name = object[i].name;
        this.AllocationRequestsData[i].employeeId = object[i].employeeId;
        this.AllocationRequestsData[i].prospectId = object[i].prospectId;
        this.AllocationRequestsData[i].hardwareId = object[i].hardwareId;
        this.AllocationRequestsData[i].allocationType = object[i].allocationType;
        this.AllocationRequestsData[i].currentTime = object[i].currentTime;
        this.AllocationRequestsData[i].index = i;


        if ( object[i].dateOfJoining < this.AllocationRequestsData[i].currentTime &&
             ( this.AllocationRequestsData[i].allocationType === 2 ||  this.AllocationRequestsData[i].allocationType === 4 ||
                  this.AllocationRequestsData[i].allocationType === 5  )) {
                  this.AllocationRequestsData[i].action = 'Edit and Deallocate';
        } else if (object[i].dateOfJoining < this.AllocationRequestsData[i].currentTime
                  &&  this.AllocationRequestsData[i].allocationType === 1) {
                  this.AllocationRequestsData[i].action = 'Allocate';
        } else if (object[i].dateOfJoining >= this.AllocationRequestsData[i].currentTime
                &&  this.AllocationRequestsData[i].allocationType === 1) {
                this.AllocationRequestsData[i].action = 'Allocate';
        } else if (object[i].dateOfJoining >= this.AllocationRequestsData[i].currentTime &&
            ( this.AllocationRequestsData[i].allocationType === 2 ||  this.AllocationRequestsData[i].allocationType === 4 ||
                this.AllocationRequestsData[i].allocationType === 5  )) {
                this.AllocationRequestsData[i].action = 'Edit and Deallocate';
        }

        }
    }

    onChange(selectedemps: any) {
        this.employees = selectedemps;
        this.getContents();
    }
    navigateToAssignHardwareForms(obj: any, action: any, index: any) {
        if (!(( this.hardwareinfo[index].dateOfJoining < this.hardwareinfo[index].currentTime
                && (obj.allocationType === 2 || obj.allocationType === 4 || obj.allocationType === 5) ))) {
                    obj.action = action;
                    localStorage.setItem('hardwardrequestObj', JSON.stringify(obj));
                    this.router.navigate(['/assets/assignhardware']);
                }
    }
}
