import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { HttpService } from '../../shared/services/http.service';
import { Router } from '@angular/router';
export interface PeriodicElement1 {
    joinee: number;
    date: any;
    experience: string;
    JobStatus: string;
    Request: string;
    RequestedHardware: string;
    HardwareAvailability: string;
    action: number;
}
const HEADERS1 = [{
    key: 'joinee',
    label: 'Joinee'
}, {
    key: 'date',
    label: 'Joining Date'
}, {
    key: 'JobStatus',
    label: 'Job Status'
},
{
    key: 'Request',
    label: 'Request#'
},
{
    key: 'RequestedHardware',
    label: 'RequestedHardware/Workstation'
},
{
    key: 'HardwareAvailability',
    label: 'HardwareAvailability'
},
{
    key: 'action',
    btnLabel: 'Allocate'
}
];
@Component({
    selector: 'app-asset-management',
    templateUrl: './asset-management.component.html',
    styleUrls: ['./asset-management.component.scss']
})
export class AssetManagementComponent implements OnInit {
    title: string;
    userName: string;
    userDetails: any;
    helpDocUrl: string;
    div: any;
    employeeObject: any;
    /*variable declartion */
    dataSource1: any;
    displayedColumns1: string[] = HEADERS1.map(i => i.key);
    headers1 = HEADERS1;
    @ViewChild(MatSort) sort: MatSort;
    constructor(
        private commonService: CommonService, private httpService: HttpService, private router: Router
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
        this.getAssetManagement();
    }
    getAssetManagement() {
        this.getAssetDetails().subscribe(data => {
            this.dataSource1 = new MatTableDataSource(JSON.parse(data._body));
            this.dataSource1.sort = this.sort;
        });
    }
    getAssetDetails() {
        return this.httpService.getMockData('Assetmanagement.json').map(response => response);
    }

    navigateToAssignHardwareForms() {
        const redirect: any = '/assets/assignhardware';
        this.router.navigate([redirect]);
    }
}
