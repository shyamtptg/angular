import { Component, Input, Output, OnChanges, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { AddProfileDataService } from '../../../recruiter/addprofile/add-profile.service';
import { Subscription } from 'rxjs/Subscription';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';

var FileSaver = require('filesaver.js-npm');

@Component({
  selector: 'attachments',
  templateUrl: './attachments.component.html'
})
export class Attachments {
  addDocuments: any[] = [1];
  constructor(
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef,
    public commonService: CommonService,
    private addProfileDataService: AddProfileDataService,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) { }
  @Input() offerId: string;
  @Input() hiringId: string;
  @Input() needId: string;
  @Input() readonly: boolean;
  hideAttachments: boolean = false;
  private subscription: Subscription;
  file: any = {};
  uploaded: any = {
    'OTHERS': false,
    'HIKE_LETTER': false,
    'PAYSLIP1': false,
    'PAYSLIP2': false,
    'PAYSLIP3': false,
    'BANK_STATEMENT': false
  };
  attachMapLoaded: boolean = false;
  successMessage: string;
  setFileData(fileData: any, fileName: string) {
    if(fileData.length>0){
      this.file[fileName] = fileData[0];
    }
  }
  uploadDocument(docType: any) {
    var self = this, docId: string;
    if (self.hiringId && self.needId && self.file) {
      try {
        var isValid = this.commonService.validateFile(this.file[docType], 'offer attachments', 1048576, 69, ['doc', 'docx', 'rtf', 'pdf', 'ppt', 'pptx', 'xls', 'xlsx']);
        if(isValid && self.offerId){
          self.loaderService.showLoading();
          this.addProfileDataService.uploadAttachment(self.hiringId, self.needId, self.offerId, self.file[docType]).subscribe(data => {
            if (data.status == 201) {
              self.addProfileDataService.attachmentMap[docType] = { 'id': data['_body'], 'title': self.file[docType]['name'] };
              self.uploaded[docType] = true;
              $('.add-attachment-item').show();
              self.successMessage = 'Document uploaded successfully';
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
      } catch (e) {
        self.errorHandleService.handleErrors(e);
      }
    }
  }
  deleteDocument(docType: any) {
    var docMap = this.addProfileDataService.attachmentMap, self = this,
      docDetails = docMap && docMap[docType];
    if (self.hiringId && self.needId && self.offerId && docDetails && docDetails['id']) {
      self.loaderService.showLoading();
      this.addProfileDataService.deleteAttachment(self.hiringId, self.needId, self.offerId, docDetails['id']).subscribe(data => {
        if (data.status == 200) {
          delete self.addProfileDataService.attachmentMap[docType];
          self.uploaded[docType] = false;
          self.hideUploadItem(docType);
          self.successMessage = 'Document deleted successfully';
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
  /* This method temporarily hides attachment element when deleted */
  hideUploadItem(docType: string){
    var index: any = docType.split("OTHERS")[1];
    var elem = '#uploadDoc'+(index*1);
    $(elem).hide();
  }
  loadDocumentName(docType: any) {
    if (this.attachMapLoaded) {
      var docMap = this.addProfileDataService.attachmentMap, self = this,
        docDetails;
      if (docMap) {
        docDetails = docMap[docType];
        if (docDetails) {
          self.uploaded[docType] = true;
          return docDetails.attachmentName;
        } else {
          return '';
        }
      }
    }
  }
  ngOnInit() {
    var self = this;
    this.addDocuments.forEach(function (elem: any, ind: any) {
      self.uploaded['OTHERS' + (ind + 1)] = false;
    });
    $('.add-attachment-item').show();
    this.subscription = this.addProfileDataService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'loadAttachments') {
        self.loadDetails();
      }
    });
  }
  loadDetails() {
    this.attachMapLoaded = true;
    this.addDocuments = [1];
    var attachLength: any = this.addProfileDataService.attachLength;
    for (var i = 0; i < attachLength - 1; i++) {
      this.addDocuments.push(1);
    }
    if (!this.cdr['destroyed']) {
      this.cdr.detectChanges();
    }
    this.hideAttachments = ((attachLength*1 < 1) && this.readonly)? true: false;
  }
  addMore() {
    this.addDocuments.push(1);
    $('.add-attachment-item').hide();
  }
  remove(i: number) {
    this.addDocuments.splice(i, 1);
  }
  toggleHiringNeedDetails() {
    var plusIcon = $('.attachment-plus-icon'),
      minusIcon = $('.attachment-minus-icon'),
      attachmentDetails = $('.attachment-details'),
      self = this;
    if (attachmentDetails.hasClass('close')) {
      attachmentDetails.each(function (ind: any, elem: any) {
        elem.style.display = 'none';
      });
      plusIcon.css("display", "block");
      minusIcon.css("display", "none");
      attachmentDetails.addClass('close');
      attachmentDetails.removeClass('open');
      plusIcon.css("display", "none");
      minusIcon.css("display", "block");
      attachmentDetails.addClass('open');
      attachmentDetails.removeClass('close');
      attachmentDetails.slideToggle(700);
      setTimeout(() => {
        var body = $("html, body");
        body.stop().animate({ scrollTop: $('annexure').offset().top - 75 }, 500, 'swing');
      }, 650);
    } else {
      attachmentDetails.slideToggle(700);
      setTimeout(() => {
        plusIcon.css("display", "block");
        minusIcon.css("display", "none");
        attachmentDetails.addClass('close');
        attachmentDetails.addClass('open');
      }, 650);
    }
  } 
}