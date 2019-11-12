import { Component, OnInit } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd} from '@angular/router';
import { CommonService } from '../shared/services/common.service';
import { HomeService } from './home.service';
import { LoaderService } from './../shared/services/loader.service';
import { ErrorHandleService } from './../shared/services/errorhandle.service';


export interface IChartData {
    target: string;
    height: number;
    data: any;
    title: string;
    categories: string;
}

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    title: string;
    modules: any;
    userName: string;
    userDetails: any;
    dataObject: any = {
        offers: {},
        joinees: {},
        workstations: {},
        employeeid: {}
    };
    joineeStatistics: any = {
        offers: {},
        newJoinees: 0
    };
    idStatistics: any;
    wsStatistics: any;
    itStats: any = {};
    itSoftwareStats: any = {};
    joineeChartData: IChartData;
    assetChartData: IChartData;
    sortwareChartData: IChartData;
    roles: any;
    permissions: any = {};
    enabledFeatures: any;

    constructor(
        private router: Router,
        public commonService: CommonService,
        private homeService: HomeService,
        private errorHandleService: ErrorHandleService,
        private loaderService: LoaderService,

    ) {
        this.userDetails = this.commonService.getItem('currentUserInfo');
        this.userName = (this.userDetails) ? this.userDetails['displayName'] : '';
        this.title = 'Home';
        this.modules = [
            {
                name: 'Hiring',
                short_name: 'Hiring'
            },
            {
                name: 'Leave Management System',
                short_name: 'LMS'
            },
            {
                name: 'IT Admin Request',
                short_name: 'IAR'
            }
        ];
    }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart) {
                this.loaderService.showLoading();
            } else if (event instanceof RouteConfigLoadEnd) {
                this.loaderService.hideLoading();
            }
        });
        // this.getHomeStats();

        const userDetails: any = this.commonService.getItem('currentUserInfo');
        if (userDetails) {
            this.roles = userDetails.roles;
            this.enabledFeatures = userDetails.enabledFeatures;
        }
        this.permissions = {
            'onboarding': this.enabledFeatures.indexOf('EMPLOYEE_ONBOARD_HR') >= 0,
            'IT': this.enabledFeatures.indexOf('EMPLOYEE_ONBOARD_IT') >= 0,
            'Admin': this.enabledFeatures.indexOf('EMPLOYEE_ONBOARD_ADMIN') >= 0,
            'request':  this.enabledFeatures.indexOf('EMPLOYEE_ONBOARD_VIEW_NEW_JOINEES') >= 0,
        };

        if (this.permissions.onboarding) {
            this.getJoineeDetails();
        }
        if (this.permissions.Admin) {
            this.getWorkstationReqDetails();
            this.getEmployeeIDDetails();
        }

        if (this.permissions.IT) {
            this.getITStats();
        }
        /* if (this.permissions.onboarding) {
            this.getITSoftwareStats();
        } */
    }
    navigateToHiring() {
        this.commonService.navigateToHiring();
    }
    navigateToLeaveManagement() {
        this.commonService.navigateToLeaveManagement();
    }
    navigateToEmployeeOnboarding() {
        this.commonService.navigateToEmployeeOnboard();
    }
    navigateToWorkstations() {
        this.commonService.navigateToWorkstations();
    }
    navigateToEmployeeId() {
        this.commonService.navigateToEmployeeId();
    }
    navigateToAssets() {
        this.commonService.navigateToAssets();
    }
    navigateToJoineesTable(data: any) {
        localStorage.setItem('view', data);
        this.commonService.navigateToEmployeestatistics();
    }
    navigate(module) {
        switch (module) {
            case 'Hiring':
                this.commonService.navigateToHiring();
                break;
            case 'LMS':
                this.commonService.navigateToLeaveManagement();
                break;
            case 'IAR':
            this.commonService.navigateToManager();
            break;
            default:
                break;
        }
    }

    /* getHomeStats() {
        this.homeService.getDashboardStats().subscribe(data => {
            // this.dataObject = JSON.parse(data._body);
        });
    } */
    getEmployeeIDDetails() {
        this.loaderService.showLoading();
        this.homeService.executeService('api/q/onboarding/countidCardRequestDetails', 'get', null).subscribe(res => {
            this.idStatistics = {
                Pendingrequest: res.Pendingrequest,
                ActiveRequest: res.ActiveRequest
            };
            this.loaderService.hideLoading();
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }

    getWorkstationReqDetails() {
        this.loaderService.showLoading();
        this.homeService.executeService('api/q/onboarding/countWorkStationDetails', 'get', null).subscribe(res => {
            this.wsStatistics = {
                total: res.totalWorkStations,
                allocated: res.allocatedWorkStations,
                available: res.availableWorkStations,
                pending: res.pendingWorkStationsAllocationRequest,
            };
            this.loaderService.hideLoading();
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }

    getJoineeDetails() {
        this.loaderService.showLoading();
        this.homeService.executeService('api/q/prospectivehires/newJoinee/statistics', 'get', null).subscribe(res => {
            this.joineeStatistics = res;
            this.joineeChartData = {
                target: 'jonieeChart',
                categories: 'accepted,declined',
                height: 150,
                title: '',
                data: [
                    {
                        accepted: this.joineeStatistics.offers.accepted
                    },
                    {
                        declined: this.joineeStatistics.offers.declined
                    }
                ]
            };
            this.loaderService.hideLoading();
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }

    getITStats() {
        this.loaderService.showLoading();
        this.homeService.executeService('api/q/onboarding/hardware/request/statistics', 'get', null).subscribe(res => {
            this.itStats = {
                'totalAvailableSystems': res.totalAvailableSystems,
                'availableLaptops': res.availableLaptops,
                'availableDesktops': res.availableDesktops,
                'systemAllocationRequests': res.systemAllocationRequests,
                'pendingSoftwareRequests': res.pendingSoftwareRequests,
                'inProgressSoftwareRequests': res.inProgressSoftwareRequests
            };
            this.assetChartData = {
                target: 'assetChart',
                categories: 'laptops,desktops',
                height: 150,
                title: '',
                data: [
                    {
                        laptops: this.itStats.availableLaptops
                    },
                    {
                        desktops: this.itStats.availableDesktops
                    }
                ]
            };
            this.loaderService.hideLoading();
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }

  /*   getITSoftwareStats() {
        this.loaderService.showLoading();
        this.homeService.executeService('api/q/onboarding/hardware/request/statistics', 'get', null).subscribe(res => {
            this.itSoftwareStats = {
                'pendingRequests': res.pendingSoftwareRequests,
                'inProgress': res.inProgressSoftwareRequests,
            };
            this.sortwareChartData = {
                target: 'softwareChart',
                categories: 'pending,inProgress',
                height: 150,
                title: '',
                data: [
                    {
                        pending: this.itSoftwareStats.pendingRequests,
                    },
                    {
                        inProgress: this.itSoftwareStats.inProgress
                    }
                ]
            };
            this.loaderService.hideLoading();
        }, error => {
            this.errorHandleService.handleErrors(error);
        });

    } */
}
