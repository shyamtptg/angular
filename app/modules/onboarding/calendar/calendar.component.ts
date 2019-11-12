import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, OnChanges } from '@angular/core';
import { Options } from 'fullcalendar';
import { LoaderService } from '../../../shared/services/loader.service';
import { CommonService } from '../../../shared/services/common.service';
import { Router } from '@angular/router';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import { CalendarComponent } from 'ng-fullcalendar';
import { OnboardingService } from './../onboarding.service';


let eventData: any;

@Component({
    selector: 'app-calendars',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})

export class CalendarViewComponent implements OnInit, AfterViewInit, OnChanges {
    @ViewChild(CalendarComponent) myCalendar: CalendarComponent;
    data: any;
    dataObject1: any;
    calendarOptions: Options;
    displayEvent: any;
    isLoaded = false;
    total = 0;
    i = 0;
    today: any;
    todayUTC: any;
    formattedCurrentDate: any;
    totalText: string;
    displayElements: string[];
    public time: string;
    startDateCalender: any;
    startDateCalenderCopy = null;
    endDateCalender: any;
    months = {
        'January': 0,
        'February': 1,
        'March': 2,
        'April': 3,
        'May': 4,
        'June': 5,
        'July': 6,
        'August': 7,
        'September': 8,
        'October': 9,
        'November': 10,
        'December': 11
    };
    currentDate: any;
    constructor(
        private commonService: CommonService,
        private router: Router,
        private loaderService: LoaderService,
        private errorHandleService: ErrorHandleService,
        private appService: OnboardingService,
        private changeDetectorRefs: ChangeDetectorRef
    ) { }

    ngOnInit() {
        eventData = [];
        this.today = new Date();
        this.todayUTC =  Date.UTC(this.today.getUTCFullYear(), this.today.getUTCMonth(), this.today.getUTCDate(),
        this.today.getUTCHours(), this.today.getUTCMinutes(), this.today.getUTCSeconds());
        this.formattedCurrentDate = Date.parse(this.today);
        this.geteventDetails();
    }

    ngAfterViewInit() {
    }

    ngOnChanges() {
    }

    geteventDetails() {
        this.calendarOptions = {
            height: 550,
            header: {
                left: 'prev',
                center: 'title',
                right: 'next'
            },
            dayNamesShort: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            events: (start, end, timezone, callback) => {
            const startDate = start.toDate().getTime();
            const endDate = end.subtract(1, 'd').toDate().getTime();
            if (this.startDateCalenderCopy !== startDate) {
                this.appService.getService(
                    'api/q/prospectivehires/calendar/newJoinee/statistics?startDate=' + startDate + '&endDate=' + endDate
                ).subscribe(res => {
                    this.dataObject1 = res;
                    this.total = 0;
                    this.getEvent();
                    if (eventData) {
                        callback(eventData);
                    }
                    this.dataObject1 = [];
                    this.loaderService.hideLoading();
                }, error => {
                    this.errorHandleService.handleErrors(error);
                });
            }
            this.startDateCalenderCopy = startDate;
            },
            defaultView: 'month',
            selectable: true,
            fixedWeekCount: false,
            eventLimit: true
        };
    }
    getEvent() {
        const c = 0;
        eventData = [];
        for (const key of Object.keys(this.dataObject1)) {
            this.total = this.total + this.dataObject1[key];
            if (this.dataObject1[key] >= 2) {
                eventData.push({
                    'title': this.dataObject1[key] + ' new joinees',
                    'start': key,
                    'end': key,
                    'allDay': true
                });
            } else {
                eventData.push({
                    'title': this.dataObject1[key] + ' new joinee',
                    'start': key,
                    'end': key,
                    'allDay': true
                });
            }
        }
        if (this.total >= 2) {
            this.totalText = ' New Joinees';
        } else {
            this.totalText = ' New Joinee';
        }
    }
    eventClick(model: any) {
        model = {
            event: {
                id: model.event.id,
                start: model.event.start,
                end: model.event.end,
                title: model.event.title,
                allDay: model.event.allDay
            },
            duration: {}
        },
        this.displayEvent = model;
        this.commonService.setItem('calendarData', model.event);
        localStorage.setItem('view', '0');
        const redirect: any = '/onboarding/employeestatistics';
        this.router.navigate([redirect]);
    }
    updateEvent(model: any) {
        model = {
            event: {
                id: model.event.id,
                start: model.event.start,
                end: model.event.end,
                title: model.event.title
            },
            duration: {
                _data: model.duration._data
            }
        },
            this.displayEvent = model;
    }
    navigateToJoineesTable(data: any) {
        localStorage.setItem('view', data);
        this.commonService.navigateToEmployeestatistics();
    }
    viewChange(currentView) {
        $('.fc-header-toolbar').css('margin-top', '10px');
        $('.fc-content').css('background-color', '#FFFFFF')
                        .css('color', '#2572C7')
                        .css('cursor', 'pointer')
                        .css('font-family', 'Lato')
                        .css('font-size', '10px')
                        .css('font-weight', '500')
                        .css('line-height', '12px')
                        .css('width', '82px')
                        .css('margin-left', '2px')
                        .css('box-shadow', '0 2px 10px 0 rgba(37,114,199,0.3)');
        $('.fc-event').css('width', '84px')
                      .css('margin-left', '11px')
                      .css('margin-top', '11px');
        $('.fc-day').css('border', '1px solid #EDECEC')
                    .css('box-shadow', '0 2px 4px 0 rgba(0,0,0,0.03), 0 1px 5px 0 rgba(0,0,0,0.13)');
        $('.fc-day-header').css('color', '#888888')
                           .css('font-family', 'Lato')
                           .css('font-size', '12px')
                           .css('line-height', '15px')
                           .css('padding-bottom', '9px');
        $('.fc-day-number').css('color', '#888888')
                           .css('font-family', 'Lato')
                           .css('font-size', '12px')
                           .css('line-height', '15px');
    }
}
