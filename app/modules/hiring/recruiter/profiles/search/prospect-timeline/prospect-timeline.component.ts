import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HiringComponent } from '../../../../hiring.component';
import { SearchService } from '../search.service';
import { DialogService } from '../../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../../shared/services/errorhandle.service';

@Component({
    templateUrl: './prospect-timeline.component.html'
})
export class ProspectTimelineComponent {
    commentHistory: Array<any> = [];
    pageNum: number = 0;
    pageSize: number = 20;
    prospectId: string;
    onScrollCallback: any;
    constructor(
        private hiringComponent: HiringComponent,
        private router: Router,
        private route: ActivatedRoute,
        private searchService: SearchService,
        private dialogService: DialogService,
        private errorHandleService: ErrorHandleService
    ) {
        this.hiringComponent.URLtitle = "Profiles / Prospect Timeline";
        this.onScrollCallback = this.loadTimeLine.bind(this);
    }
    ngAfterViewChecked() {
        var contentHeight = $('.content-wrapper').height();
        $('.sidebar-menu').height(contentHeight + 15);
    }
    ngOnDestroy() {
        $('.sidebar-menu').height('100%');
    }
    ngOnInit() {
        var route = localStorage.getItem('previousRoute');
        if (route == '/hiring/profiles/search') {
            localStorage.setItem('profileRoute', 'true');
        }
        var self = this;
        self.route.params.subscribe(params => {
            if (params['id']) {
                self.prospectId = params['id'];
            }
        });
    }
    loadTimeLine() {
        if (this.prospectId) {
            try {
                return this.searchService.getProspectTimeline(this.prospectId, this.pageNum, this.pageSize).do(this.processProspectData);
            } catch (error) {
                this.errorHandleService.handleErrors(error);
            }
        }
    }
    getTime(date: any) {
        date = new Date(date * 1);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    getDate(date: any) {
        date = new Date(date * 1);
        return date.toDateString();
    }
    navigateToPrevious() {
        var route = localStorage.getItem('previousRoute');
        route = (route) ? route : '/hiring/profiles/search';
        this.router.navigate([route]);
    }
    private processProspectData = (data: any) => {
        this.pageNum++;
        this.commentHistory = this.commentHistory.concat(data['content']);
    }
}