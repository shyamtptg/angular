import { Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { InterviewDataService } from '../../interviews.service';

@Component({
  selector: 'panel-details',
  templateUrl: './panel-details.component.html'
})

export class FeedbackPanelDetails {
  @Input() needData: any;
  @Input() needIndex: any;
  @Input() comboData: any;
  @Input() hiringReqId: any;
  public panelList: any;
  public modalId: any = 'modal';
  public expectedStartingDate: string;
  public disableState: boolean;
  public interviewCriterion: any;
  public interviewPanelComboData: any;
  public successMessage: string;
  public jobDescriptionId: any;
  public needNum: any;
  public viewMode: boolean = true;
  public criterionList: any;
  @Output() remove = new EventEmitter<number>();
  @ViewChild('hiringNeed') hiringNeed: ElementRef;
  constructor(private interviewDataService: InterviewDataService) { }
  ngOnInit() {
    this.loadDetails();
  }
  formatDate(date: any) {
    var time = new Date(date),
      result, year, month, today;
    year = time.getFullYear();
    month = time.getMonth() + 1;
    today = time.getDate();
    month = ((month < 10) ? ('0' + month) : month);
    today = ((today < 10) ? ('0' + today) : today);
    result = year + '-' + month + '-' + today;
    return result;
  }
  toggleHiringNeedDetails() {
    var plusIcon = $('.plus-icon'),
      minusIcon = $('.minus-icon'),
      hiringNeedDetails = $('.hiring-need-details');
    $('.job-desc-content').fadeOut(700);
    if (hiringNeedDetails.eq(this.needIndex).hasClass('close')) {
      hiringNeedDetails.each(function (ind: any, elem: any) {
        elem.style.display = 'none';
      });
      plusIcon.css("display", "block");
      minusIcon.css("display", "none");
      hiringNeedDetails.addClass('close');
      hiringNeedDetails.removeClass('open');
      plusIcon.eq(this.needIndex).css("display", "none");
      minusIcon.eq(this.needIndex).css("display", "block");
      hiringNeedDetails.eq(this.needIndex).addClass('open');
      hiringNeedDetails.eq(this.needIndex).removeClass('close');
      hiringNeedDetails.eq(this.needIndex).slideToggle(700);
      var self = this;
      setTimeout(() => {
        var body = $("html");
        body.stop().animate({ scrollTop: $('panel-details').eq(self.needIndex).offset().top + 56 * (self.needIndex) }, 500, 'swing');
      }, 650);
    } else {
      hiringNeedDetails.eq(this.needIndex).slideToggle(700);
      setTimeout(() => {
        plusIcon.eq(this.needIndex).css("display", "block");
        minusIcon.eq(this.needIndex).css("display", "none");
        hiringNeedDetails.eq(this.needIndex).addClass('close');
        hiringNeedDetails.eq(this.needIndex).addClass('open');
      }, 650);
    }
  }
  loadDetails() {
    this.needData.interviewDate = this.formatDate(this.needData.interviewDate);
    this.criterionList = this.needData.feedback && JSON.parse(this.needData.feedback);
  }
}