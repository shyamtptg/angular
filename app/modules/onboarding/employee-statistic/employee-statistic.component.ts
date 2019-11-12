import { Component, ViewChild, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { CommonService } from '../../../shared/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../shared/services/http.service';
import { environment } from '../../../../environments/environment';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { UtilService } from '../../../util.service';
import { MatRadioChange } from '@angular/material';
import { OnboardingService } from './../onboarding.service';

export interface NewJoinees {
    src: string;
    experience: string;
    date: any;
    practice: string;
    joinee: string;
    competency: any;
    designation: any;
    onboardingStatus: any;
    action: number;
    joineeName: string;
    id: number;
}

const statisticsTableHeaders = [{
    key: 'src',
    label: 'Source'
}, {
    key: 'joinee',
    label: 'Joinee'
}, {
    key: 'date',
    label: 'Joining date'
}, {
    key: 'practice',
    label: 'Practice'
},
{
    key: 'competency',
    label: 'Competency'
},
{
    key: 'designation',
    label: 'Designation'
},
{
    key: 'experience',
    label: 'Experience'
},
{
    key: 'onboardingStatus',
    label: 'Onboarding Status'
},
{
    key: 'action',
    label: 'Action',
    btnLabel0: 'Initiate Onboarding',
    btnLabel1: 'Update Onboarding'
}
];

@Component({
    selector: 'app-employee-statistic',
    templateUrl: './employee-statistic.component.html',
    styleUrls: ['./employee-statistic.component.scss']
})
export class EmployeeStatisticComponent implements OnInit, AfterViewInit {
    statisticsTableColumns: string[] = statisticsTableHeaders.map(i => i.key);
    statisticsTableSource: any;
    statisticsTableData: NewJoinees[] = [];
    dataSize: any;
    statisticsTableHeaders = statisticsTableHeaders;
    reportData: any;
    ISODate: any;
    unformattedDate: any;
    dateToDisplay: string;
    numberofJoinees: string;
    navigationData: number;
    navigationData1: number;
    check: number;
    showPaginator = false;
    selectedAPI = ['All', 'joiningThisWeek', 'joiningNextWeek', 'joinedLastWeek'];
    public token: {};
    header: object = {};
    obj1: any;
    host = environment.serviceUrl + '/';
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private commonService: CommonService,
        private route: ActivatedRoute,
        private httpService: HttpService,
        private errorHandleService: ErrorHandleService,
        private loaderService: LoaderService,
        private utilService: UtilService,
        private changeDetectorRefs: ChangeDetectorRef,
        private appService: OnboardingService
    ) { }

    ngOnInit() {
        this.getNavigationData();
        this.reportData = this.commonService.getItem('calendarData');
        if (this.reportData) {
            this.unformattedDate = new Date(this.reportData.start);
            this.numberofJoinees = this.reportData.title;
            this.ISODate =  this.unformattedDate.toDateString();
            this.dateToDisplay = this.utilService.epochToDate(this.ISODate);
        }
    }
    ngAfterViewInit() {
        // this.displayPaginator();
    }
    navigateToEmployeeOnboardingForms(row: any) {
        localStorage.setItem('reviewFlag', 'false');
        localStorage.setItem('prospectId', row.joinee);
        localStorage.setItem('experience', row.experience);
        this.commonService.navigateToEmployeeOnboardingForms();
    }
    getNavigationData() {
        if (localStorage.getItem('view')) {
            this.check = parseInt(localStorage.getItem('view'), 10);
            if (this.check !== 0) {
                this.getJoineeDetails('/api/q/prospectivehires/newJoinees?view=' + this.selectedAPI[this.check - 1]);
            } else if (this.check === 0) {
                this.getJoineeDetails('/api/q/prospectivehires/newJoinees/', true);
            }
            localStorage.removeItem('view');
        } else {
            this.check = 2;
        }
    }
    changeDisplayData(a: number, event?: MatRadioChange) {
        this.getJoineeDetails('/api/q/prospectivehires/newJoinees?view=' + this.selectedAPI[a - 1]);
    }
    getJoineeDetails(url: string, takeDate?: boolean) {
        if (takeDate) {
            this.loaderService.showLoading();
            this.reportData = this.commonService.getItem('calendarData');
            this.unformattedDate = new Date(this.reportData.start);
            this.unformattedDate = new Date(parseInt(this.reportData.start.split('-')[0], 10),
            parseInt(this.reportData.start.split('-')[1], 10), (parseInt(this.reportData.start.split('-')[2], 10) + 1));
            this.ISODate =  this.unformattedDate.toDateString();
            url = url + Date.parse(this.ISODate);
        }
        let resObj;
        this.appService.getService(url).subscribe(res => {
            if (res.content) {
                this.getData(res.content);
                resObj = res.content;
            } else {
                this.getData(res);
                resObj = res;
            }
            this.loaderService.hideLoading();
        }, error => {
            this.errorHandleService.handleErrors(error);
        });
    }
    getData(obj: any) {
        let i;
        this.statisticsTableData = [];
        for (i = 0; i < obj.length; i++) {
            this.statisticsTableData[i] = {
                src: '../../../../assets/add_icon.png',
                experience: this.getExperience(obj[i].experience),
                date: this.utilService.epochToDate(obj[i].joiningDate),
                practice: obj[i].practice,
                joinee: obj[i].prospectId,
                competency: obj[i].competency,
                designation: obj[i].designation,
                onboardingStatus: obj[i].onboardingStatus,
                action: (obj[i].onboardingStatus === 'Started' ? 1 : 0) ,
                joineeName: obj[i].joinee,
                id: obj[i].employeeId ? obj[i].employeeId : 'Not available'
            };
        }
        if (this.statisticsTableData.length < 11 && document.getElementsByClassName('.paginator-div')) {
            $('.paginator-div').css('display', 'none');
            // this.showPaginator = false;
        } else if (document.getElementsByClassName('.paginator-div')) {
            $('.paginator-div').css('display', 'block');
            // this.showPaginator = true;
        }
        this.changeDetectorRefs.detectChanges();
        this.statisticsTableSource = new MatTableDataSource(this.statisticsTableData);
        this.statisticsTableSource.sort = this.sort;
        this.statisticsTableSource.paginator = this.paginator;
    }
    displayPaginator() {
        if (this.statisticsTableData.length < 11) {
            // $('.paginator-div').css('display', 'none');
            this.showPaginator = false;
        } else {
            // $('.paginator-div').css('display', 'block');
            this.showPaginator = true;
        }
    }
    getExperience(time: any) {
        if (Math.floor(time) !== NaN) {
            const text = time.toString();
            let  yrs: number, mts: number;
            yrs = parseInt(text.split('.')[0], 10);
            mts = parseInt(text.split('.')[1], 10);
            return (yrs + ' years ' + mts + ' mos');
        } else {
            return time;
        }
    }
}
