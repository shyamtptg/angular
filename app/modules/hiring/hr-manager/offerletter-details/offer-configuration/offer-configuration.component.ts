import { Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'offer-config-details',
  templateUrl: './offer-configuration.component.html'
})

export class OfferConfigurationDetails {
  @Input() configData: any;
  @Input() configIndex: any;
  @Input() comboData: any;
  @Input() hiringReqId: any;
  public panelList: any;
  public modalId: any = 'modal';
  public disableState: boolean;
  public interviewCriterion: any;
  public interviewPanelComboData: any;
  public successMessage: string;
  public jobDescriptionId: any;
  public needNum: any;
  public viewMode: boolean = true;
  public criterionList: any;
  public hideEdit: boolean = true;
  @Output() remove = new EventEmitter<number>();
  @ViewChild('hiringNeed') hiringNeed: ElementRef;
  constructor() { }
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
      configDetails = $('.config-details');
    $('.job-desc-content').fadeOut(700);
    if (configDetails.eq(this.configIndex).hasClass('close')) {
      configDetails.each(function (ind: any, elem: any) {
        elem.style.display = 'none';
      });
      plusIcon.css("display", "block");
      minusIcon.css("display", "none");
      configDetails.addClass('close');
      configDetails.removeClass('open');
      plusIcon.eq(this.configIndex).css("display", "none");
      minusIcon.eq(this.configIndex).css("display", "block");
      configDetails.eq(this.configIndex).addClass('open');
      configDetails.eq(this.configIndex).removeClass('close');
      configDetails.eq(this.configIndex).slideToggle(700);
      var self = this;
      setTimeout(() => {
        var body = $("html");
        body.stop().animate({ scrollTop: $('offer-config-details').eq(self.configIndex).offset().top + 56 * (self.configIndex) - 75 }, 500, 'swing');
      }, 650);
    } else {
      configDetails.eq(this.configIndex).slideToggle(700);
      setTimeout(() => {
        plusIcon.eq(this.configIndex).css("display", "block");
        minusIcon.eq(this.configIndex).css("display", "none");
        configDetails.eq(this.configIndex).addClass('close');
        configDetails.eq(this.configIndex).addClass('open');
        this.viewMode = true;
      }, 650);
    }
  }
  enableConfig() {
    this.viewMode = !this.viewMode;
  }
  loadDetails() {
  }
}