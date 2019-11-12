import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ctc-line-item',
  templateUrl: './ctc-line-item.component.html'
})
export class LineItemComponent implements OnChanges {
  @Input() configIndex: any;
  //@Input() configData: any;
  //@Input skillDetails:Array<string>;
  @Input() headers: any;
  //@Input() allSkills: any;
  //@Input() currentSkills:any;
  // @Input() skillDetails: any;
  //@Input() isViewMode: boolean;
  @Input() readonly: boolean;
  @Input() lineItems: any;
  @Input() paymentPeriods: any;
  @Input() configList: any;
  @Output() addItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();
  ngOnChanges(changes: any) {
    //this.headers = changes.headers && changes.headers.currentValue;
    //this.skillDetails = changes.skillProficiency && changes.skillProficiency.currentValue;
    //this.allSkills = changes.allSkills && changes.allSkills.currentValue;       
  };
  constructor() {
  }
  addLineItem() {
    this.addItem.emit();
  }
  deleteLineItem(index: any) {
    this.deleteItem.emit(index);
  }
  deleteSkill(rowIndex: number): void {
    //this.skillDetails.splice(rowIndex, 1);
  }
  toggleHiringNeedDetails() {
    var plusIcon = $('.plus-icon'),
      minusIcon = $('.minus-icon'),
      configDetails = $('.config-details'),
      self = this;
    $('.job-desc-content').fadeOut(700);
    if (configDetails.hasClass('close')) {
      configDetails.each(function (ind: any, elem: any) {
        elem.style.display = 'none';
      });
      plusIcon.css("display", "block");
      minusIcon.css("display", "none");
      configDetails.addClass('close');
      configDetails.removeClass('open');
      plusIcon.css("display", "none");
      minusIcon.css("display", "block");
      configDetails.addClass('open');
      configDetails.removeClass('close');
      configDetails.slideToggle(700);
      setTimeout(() => {
        var body = $("html, body");
        body.stop().animate({ scrollTop: $('ctc-line-item').offset().top - 75 }, 500, 'swing');
      }, 650);
    } else {
      configDetails.slideToggle(700);
      setTimeout(() => {
        plusIcon.css("display", "block");
        minusIcon.css("display", "none");
        configDetails.addClass('close');
        configDetails.addClass('open');
        // this.viewMode = true;
      }, 650);
    }
  }
  restrictNumeric = function (e: any) {
    var input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  }
}