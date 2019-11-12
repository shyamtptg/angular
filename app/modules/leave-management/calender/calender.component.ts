import { Component, OnInit, OnChanges, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { LeaveManagementService } from '../leave-management.service';
import { ErrorHandleService } from '../../../shared/services/errorhandle.service';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { Options } from 'fullcalendar';
import { CalendarComponent } from 'ng-fullcalendar';
import { UtilService } from '../../../util.service';

@Component({
    selector: 'app-calender',
    templateUrl: './calender.component.html',
    styleUrls: ['./calender.component.scss']
})

export class CalenderComponent implements OnInit {
    @Output() myClick = new EventEmitter();
    @Input('dates') serverDate: Date;
    @ViewChild(CalendarComponent) myCalendar: CalendarComponent;
    public dateFormat: any;
    public start;
    public startDate;
    public endDate;
    public title;
    public dataLoaded: Boolean = false;
    public data: any = [];
    public errorMessage;
    public currentDate: any;
    private subscription: Subscription;
    constructor(private leaveManagementService: LeaveManagementService, private ErrorHandleService: ErrorHandleService, private utilService: UtilService) { }

    ngOnInit() {
        var time = moment(this.serverDate).toDate(); // This will return a copy of the Date that the moment uses
        // This process is to make sure that the date that is sending to the method in epoch format and also the time should be 5:30 as mentioned 
        // So to match that format in full calender we are setting the time accordingly.
        time.setHours(5);
        time.setMinutes(30);
        time.setSeconds(0);
        time.setMilliseconds(0);
        this.currentDate = time.getTime();
        this.loadDetails().then(res => this.getStatus(moment(this.currentDate)));
        this.subscription = this.leaveManagementService.updateCalObservable$.subscribe((res) => {
            if (res == 'updateCalendar' && this.myCalendar) {
                this.myCalendar.fullCalendar('refetchEvents');
            }
        });
    }
    loadDetails() {
        return new Promise(resolve => {
            this.calendarOptions.defaultDate = this.serverDate;
            this.dataLoaded = true;
            this.calendarOptions.events = (start, end, timezone, callback) => {
                var startDate = start.toDate().getTime(),
                    endDate = end.subtract(1, 'd').toDate().getTime();
                this.leaveManagementService.getService('api/me/lms/requests/calendar/events/?startDate=' + startDate + '&endDate=' + endDate).subscribe(res => {
                    var result = [];
                    this.data = [];
                    var leaves = res.leavesRequestSet,
                        holidays = res.holidaysDto,
                        wfh = res.wfhSet,
                        compOff = res.compOffLeaveDtoSet;
                    leaves.length && leaves.forEach(ele => {
                        if (ele.status == 'Pending' || ele.status == 'Approved') {
                            ele.start = this.utilService.epochToDate(ele.date);
                            ele.end = this.utilService.epochToDate(ele.date);
                            ele.title = ele.description;
                            ele.color = '#6d496d';
                            result.push(ele);
                            this.data.push(ele);
                        } else {
                            this.data.push(ele);
                        }
                    });
                    holidays.length && holidays.forEach(ele => {
                        ele.date = ele.holidayDate;
                        ele.start = this.utilService.epochToDate(ele.holidayDate);
                        ele.end = this.utilService.epochToDate(ele.holidayDate);
                        ele.title = ele.holidayName;
                        ele.color = 'teal';
                        result.push(ele);
                    });
                    wfh.length && wfh.forEach(ele => {
                        if (ele.status == 'Pending' || ele.status == 'Approved') {
                            ele.start = this.utilService.epochToDate(ele.date);
                            ele.end = this.utilService.epochToDate(ele.date);
                            ele.title = 'Work From Home';
                            ele.description = ele.title;
                            ele.color = 'maroon';
                            result.push(ele);
                            this.data.push(ele);
                        } else {
                            ele.title = 'Work From Home';
                            ele.description = ele.title;
                            this.data.push(ele);
                        }
                    });
                    compOff.length && compOff.forEach(ele => {
                        ele.date = ele.compOffDate;
                        if (ele.status == 'Pending' || ele.status == 'Approved') {
                            ele.start = this.utilService.epochToDate(ele.compOffDate);
                            ele.end = this.utilService.epochToDate(ele.compOffDate);
                            ele.title = 'Comp Off';
                            ele.description = ele.title;
                            ele.color = '#3B5988';
                            result.push(ele);
                            this.data.push(ele);
                        } else {
                            this.data.push(ele);
                        }
                    });
                    callback(result);
                    resolve(this.data)
                }, error => {
                    this.ErrorHandleService.handleErrors(error);
                });
            };
        });
    }
    getStatus(date) {
        if (this.data.length != 0) {
            var allLeaveDates = [];
            this.data.forEach(ele => {
                if (typeof (ele.date) == "string")
                    ele.date = parseInt(ele.date)
                else
                    ele.date = ele.date
                if (moment(date).isSame(moment(ele.date))) {
                    ele.dateDisplay = this.utilService.epochToDate(ele.start);
                    ele.title = ele.description;
                    allLeaveDates.push(ele);
                }
            });
            if (allLeaveDates.length == 0 || this.data.length == 0) {
                var selectedDate = date['_d'].toDateString();
                var selectDate = { 'today': '' }
                selectDate.today = selectedDate
                allLeaveDates.push(selectDate);
            }
            this.myClick.emit(allLeaveDates);
            return allLeaveDates;
        }
    };
    viewChange(currentView) {
        $(".fc-sat").prop('disabled', true);
        $(".fc-sat").addClass('fc-state-disabled');
        $(".fc-sun").prop('disabled', true);
        $(".fc-sun").addClass('fc-state-disabled');
        $(".fc-widget-content").css('cursor', 'pointer')
    }


    public calendarOptions: any = {
        default: true,
        height: 420,
        widht: 800,
        header: {
            left: 'prev',
            center: 'title',
            right: 'next'
        },
        selectable: true,
        select: (e) => {
            $(this).css('background', 'orange');
        },
        fixedWeekCount: false,
        eventLimit: true, // allow "more" link when too many events
    };

}