import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HiringComponent } from '../../hiring.component';
import { NewHiringRequestDataService1 } from '../new-hiring-request-1/new-hiring-request-service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { DialogService } from '../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../shared/services/errorhandle.service';

@Component({
  templateUrl: './open-requests.component.html'
})
export class OpenRequests {
   hiringReqList: Array<any> = [];
   pageNum: number = 0;
   pageSize: number = 20;
   totalPages: number;
   noRecords: boolean = false;
   public recordsCount: number;
   constructor(
     private hiringComponent: HiringComponent,
     private loaderService: LoaderService,
     private hiringRequestDataService: NewHiringRequestDataService1,
     private dialogService: DialogService,
     private errorHandleService: ErrorHandleService
    ){
    this.hiringComponent.URLtitle = "Hiring Requests / Open Positions";
  }
  ngOnInit(){
    this.pageNum = 0;
    this.loadOpenRequests();
  }
  loadOpenRequests(){
  	var self = this;
    self.loaderService.showLoading();
    this.hiringRequestDataService.getOpenHiringRequests(this.pageNum, this.pageSize).subscribe(data=>{
      self.hiringReqList = data['content'];
      self.totalPages = data.totalPages;
      self.recordsCount = data.totalElements;
      self.loaderService.hideLoading();
      if(data['content'] && data['content'].length == 0 && self.hiringReqList.length == 0){
        self.noRecords = true;
      }
    }, error => {
       self.errorHandleService.handleErrors(error);
    });
  }
  setPageNum(pageNum: any) {
    this.pageNum = pageNum;
    this.loadOpenRequests();
  }
}