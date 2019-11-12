import { Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NewHiringRequestDataService1 } from '../../../hiring-manager/new-hiring-request-1/new-hiring-request-service';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';

@Component({
  selector: 'cpo-hiring-request-need-details',
  templateUrl: './hiring-request-need-details.component.html'
})

export class CPOHiringNeedDetails {
  @Input() needData: any;
  @Input() needIndex: any;
  @Input() comboData: any;
  @Input() hiringReqId: any;
  public panelList: any;
  public modalId: any;
  public expectedStartingDate: string;
  public disableState: boolean;
  public interviewCriterion: any;
  public interviewPanelComboData: any;
  public successMessage: string;
  public jobDescriptionId: any;
  public needNum: any;
  public viewMode: boolean = true;
  public today: Date;
  @Output() remove = new EventEmitter<number>();
  @ViewChild('hiringNeed') hiringNeed: ElementRef;
  constructor(
    private hiringRequestDataService: NewHiringRequestDataService1,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) {
    this.today = new Date();
  }
  ngAfterViewChecked() {
    //var contentHeight = $('.content-wrapper').height();
    //$('.sidebar-menu').height(contentHeight+15);
  }
  ngOnDestroy() {
    //$('.sidebar-menu').height('100%');
  }
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
        body.stop().animate({ scrollTop: $('cpo-hiring-request-need-details').eq(self.needIndex).offset().top + 56 * (self.needIndex) - 75 }, 500, 'swing');
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
  loadCompetenciesByPractice() {
    var practiceId = this.needData.practiceId;
    this.comboData.competency = this.hiringRequestDataService.getPracticeMap()['pracCompetencies'][practiceId];
    var practiceName = this.hiringRequestDataService.getPracticeMap();
    this.needData.practiceName = practiceName['pracNames'][practiceId];
  }
  setDisableState(state: boolean) {
    this.disableState = state;
  }
  setJobId(jobId: any) {
    this.jobDescriptionId = jobId;
  }
  loadDetails() {
    this.panelList = this.needData.interviewPanels;
    this.modalId = "modal" + (new Date()).getMilliseconds() + Math.floor(Math.random() * 1000);
    var practiceName = this.hiringRequestDataService.getPracticeMap();
    this.needData.practiceName = practiceName['pracNames'][this.needData.practiceId];
    this.needData.expectedStartDate = this.formatDate(this.needData.expectedStartDate);
    this.jobDescriptionId = this.needData.jobDescriptionId;
    if (this.needData.practiceId) {
      this.loadCompetenciesByPractice();
    }
    this.interviewCriterion = this.comboData && this.comboData.criterion;
    var self = this;
    this.hiringRequestDataService.getPanelMembers().subscribe(data => {
      self.interviewPanelComboData = {
        'panelMembers': data['_embedded']['employees'],
        'panelCriterion': this.interviewCriterion
      };
      var panelMembers: any = [];
      self.interviewPanelComboData['panelMembers'] && self.interviewPanelComboData['panelMembers'].forEach(function (elem: any, ind: any) {
        panelMembers.push({
          'id': elem.id,
          'name': elem.fullName
        });
      });
      var panelCriterion: any = [];
      self.interviewPanelComboData['panelCriterion'] && self.interviewPanelComboData['panelCriterion'].forEach(function (elem: any, ind: any) {
        panelCriterion.push({
          'id': elem.id,
          'name': elem.title
        });
      });
      self.interviewPanelComboData['panelMembers'] = panelMembers;
      self.interviewPanelComboData['panelCriterion'] = panelCriterion;
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
}