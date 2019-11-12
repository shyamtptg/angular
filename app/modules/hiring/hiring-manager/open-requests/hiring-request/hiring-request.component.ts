import { Component, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewHiringRequestDataService1 } from '../../new-hiring-request-1/new-hiring-request-service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';

@Component({
  templateUrl: './hiring-request.component.html',
  selector: 'open-hiring-request'
})
export class OpenHiringRequest {
   @Input() hiringData: any;
   @Input() reqIndex: any;
   needList: Array<any> = [];
   public successMessage: string;
   constructor(
     private loaderService: LoaderService,
     private hiringRequestDataService: NewHiringRequestDataService1,
     private dialogService: DialogService,
     private errorHandleService: ErrorHandleService
    ){
    
  }
  toggleHiringNeedDetails(){
   
    var plusIcon = $('.plus-icon'),
    minusIcon = $('.minus-icon'),
    hiringNeedDetails = $('.hiring-need-details');
  	if(hiringNeedDetails.eq(this.reqIndex).hasClass('close')){
  	  hiringNeedDetails.each(function(ind:any, elem:any){
  		elem.style.display = 'none';
  	  });
  	  plusIcon.css("display","block");
  	  minusIcon.css("display","none");
  	  hiringNeedDetails.addClass('close');
  	  hiringNeedDetails.removeClass('open');
  	  plusIcon.eq(this.reqIndex).css("display","none");
  	  minusIcon.eq(this.reqIndex).css("display","block");
  	  hiringNeedDetails.eq(this.reqIndex).addClass('open');
  	  hiringNeedDetails.eq(this.reqIndex).removeClass('close');
  	  hiringNeedDetails.eq(this.reqIndex).slideToggle(600);
  	  var self = this;
  	  setTimeout(()=>{
		    var body = $("html");
		    body.stop().animate({scrollTop: $('open-hiring-request').eq(self.reqIndex).offset().top+56*(self.reqIndex)-75}, 500, 'swing');
  	  },650);
  	  self.hiringRequestDataService.loadHiringRequestDataById(self.hiringData.id).subscribe(data => {
        self.needList = (data ? data['needs']:undefined);
      }, error => {
          self.errorHandleService.handleErrors(error);
      });
  	}else{
  	  hiringNeedDetails.eq(this.reqIndex).slideToggle(600);
  	  setTimeout(()=>{
  	  plusIcon.eq(this.reqIndex).css("display","block");
  	  minusIcon.eq(this.reqIndex).css("display","none");
  	  hiringNeedDetails.eq(this.reqIndex).addClass('close');
  	  hiringNeedDetails.eq(this.reqIndex).addClass('open');
  	  },650);
  	}
  }
  applyRequest(need: any){
    var self = this;
    if(self.hiringData.id && need.id){
      self.loaderService.showLoading();
      self.hiringRequestDataService.applyRequest(self.hiringData.id, need.id).subscribe(data=>{
        if(data['status'] == 200){
          self.successMessage = 'Notification sent to the owner of the hiring request';
          self.loaderService.hideLoading();
          self.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }]
        );
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
}