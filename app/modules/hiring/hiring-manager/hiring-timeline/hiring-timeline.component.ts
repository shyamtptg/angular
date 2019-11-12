import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HiringComponent } from '../../hiring.component';
import { NewHiringRequestDataService1 } from '../new-hiring-request-1/new-hiring-request-service';
import { InfiniteScrollDirective } from '../../../../shared/infinite-scrolling/infinite-scroll/infinite-scroll.directive';

@Component({
  templateUrl: './hiring-timeline.component.html'
})
export class HiringTimeline {
  commentHistory: Array<any> = [];
  pageNum: number = 0;
  pageSize: number = 20;
  hiringId: string;
  onScrollCallback: any;

  constructor(
    private hiringComponent: HiringComponent,
    private router: Router,
    private route: ActivatedRoute,
    private hiringRequestDataService: NewHiringRequestDataService1
  ) {
    this.hiringComponent.URLtitle = "Hiring Requests / Hiring Timeline";
    this.onScrollCallback = this.loadTimeLine.bind(this);
  }
  ngOnInit() {
    var self = this;
    self.route.params.subscribe(params => {
      if (params['id']) {
        self.hiringId = params['id'];
      }
    });
  }
  loadTimeLine() {
    return this.hiringRequestDataService.getHiringTimeline(this.hiringId, this.pageNum, this.pageSize).do(this.processHiringData);
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
    route = (route) ? route : '/hiring/hiring-requests/allrequests';
    this.router.navigate([route]);
  }
  private processHiringData = (data: any) => {
    this.pageNum++;
    this.commentHistory = this.commentHistory.concat(data['content']);
  }
}