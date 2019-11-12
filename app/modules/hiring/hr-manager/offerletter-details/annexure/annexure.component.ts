import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'annexure',
  templateUrl: './annexure.component.html'
})
export class Annexure {  
  @Input() readonly: boolean;
  @Input() annexure: any;
  
  toggleHiringNeedDetails() {
    var plusIcon = $('.annexure-plus-icon'),
      minusIcon = $('.annexure-minus-icon'),
      annexureDetails = $('.annexure-details'),
      self = this;
    if (annexureDetails.hasClass('close')) {
      annexureDetails.each(function (ind: any, elem: any) {
        elem.style.display = 'none';
      });
      plusIcon.css("display", "block");
      minusIcon.css("display", "none");
      annexureDetails.addClass('close');
      annexureDetails.removeClass('open');
      plusIcon.css("display", "none");
      minusIcon.css("display", "block");
      annexureDetails.addClass('open');
      annexureDetails.removeClass('close');
      annexureDetails.slideToggle(700);
      setTimeout(() => {
        var body = $("html, body");
        body.stop().animate({ scrollTop: $('annexure').offset().top - 75 }, 500, 'swing');
      }, 650);
    } else {
      annexureDetails.slideToggle(700);
      setTimeout(() => {
        plusIcon.css("display", "block");
        minusIcon.css("display", "none");
        annexureDetails.addClass('close');
        annexureDetails.addClass('open');
      }, 650);
    }
  }
  
}