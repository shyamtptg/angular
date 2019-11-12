import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { AddProfileDataService } from '../add-profile.service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';

var FileSaver = require('filesaver.js-npm');
@Component({
  templateUrl: './miscellaneous-uploads.component.html'
})
export class MiscellaneousuploadsComponent {
  addDocuments: any[] = [1];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private addProfileDataService: AddProfileDataService,
    private loaderService: LoaderService,
    public commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) { }
  file: any = {};
  prospectId: any;
  uploaded: any = {
    'OTHERS': false,
    'HIKE_LETTER': false,
    'PAYSLIP1': false,
    'PAYSLIP2': false,
    'PAYSLIP3': false,
    'BANK_STATEMENT': false
  };
  docMapLoaded: boolean = false;
  successMessage: string;
  setFileData(fileData: any, fileName: string) {
    if(fileData.length>0){
      this.file[fileName] = fileData[0];
    }
  }
  uploadDocument(docType: any) {
    var self = this, docId: string;
    if (self.prospectId) {
      try {
        var isValid = this.commonService.validateFile(this.file[docType], 'confidential documents', 2097152, 69, ['doc', 'docx', 'rtf', 'pdf', 'txt', 'png', 'jpg', 'jpeg', 'gif']);
        if (isValid && this.file[docType]) {
          self.loaderService.showLoading();
          docId = 'OTHERS';
          this.addProfileDataService.uploadDocumentData(docId, this.file[docType], self.prospectId).subscribe(data => {
            if (data.status == 200) {
              self.addProfileDataService.documentMap[docType] = { 'documentId': data['_body'], 'title': self.file[docType]['name'] };
              self.uploaded[docType] = true;
              $('.add-confidential-item').show();
              self.successMessage = 'Document uploaded successfully';
              self.loaderService.hideLoading();
              this.dialogService.render(
                [{
                    title: 'Success',
                    message: self.successMessage,
                    yesLabel: 'OK'
                }]);
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
    var docMap = this.addProfileDataService.documentMap, self = this,
      docDetails = docMap[docType];
    if (self.prospectId && docDetails['documentId']) {
      self.loaderService.showLoading();
      this.addProfileDataService.deleteDocumentData(self.prospectId, docDetails['documentId']).subscribe(data => {
        if (data.status == 200) {
          delete self.addProfileDataService.documentMap[docType];
          self.uploaded[docType] = false;
          self.hideConfidentialItem(docType);
          self.successMessage = 'Document deleted successfully';
          self.loaderService.hideLoading();
          this.dialogService.render(
            [{
                title: 'Success',
                message: self.successMessage,
                yesLabel: 'OK'
            }])
        }
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  downloadDocument(docType: any) {
    var docMap = this.addProfileDataService.documentMap, self = this,
      docDetails = docMap[docType];
    if (self.prospectId && docDetails['documentId']) {
      this.addProfileDataService.downloadResume(self.prospectId, docDetails['documentId']).subscribe(data => {
        var blob = new Blob([data['_body']], { type: "application/octet-stream" });
        FileSaver.saveAs(blob, docDetails['title']);
      }, error => {
        self.errorHandleService.handleErrors(error);
      });
    }
  }
  loadDocumentName(docType: any) {
    if (this.docMapLoaded) {
      var docMap = this.addProfileDataService.documentMap, self = this,
        docDetails;
      if (docMap) {
        docDetails = docMap[docType];
        if (docDetails) {
          self.uploaded[docType] = true;
          return docDetails.title;
        } else {
          return '';
        }
      }
    }
  }
  /* This method temporarily hides uploaded element when deleted */
  hideConfidentialItem(docType: string){
    var index: any = docType.split("OTHERS")[1];
    var elem = '#confidentialDoc'+(index*1);
    $(elem).hide();
  }
  ngOnInit() {
    $('.prospect-hire-feature').height('116%');
    var self = this;
    this.addDocuments.forEach(function (elem: any, ind: any) {
      self.uploaded['OTHERS' + (ind + 1)] = false;
    });
    $('.add-confidential-item').show();
    let currentUrl = this.router.url;
    var prospectId = currentUrl.split('/')[4];
    this.prospectId = prospectId;
    this.loadProfileDataWithId(prospectId);
  }
  public loadProfileDataWithId = (id: any) => {
    var self = this;
    this.addProfileDataService.loadProspectDataById(id).subscribe(data => {
      self.addProfileDataService.ProspectData = data;
      self.loadDetails(data);
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  loadDetails(data: any) {
    this.addProfileDataService.prospectData = data;
    this.addProfileDataService.createDocumentMap(data.documents);
    this.docMapLoaded = true;
    var docLength: any = this.addProfileDataService.docLength;
    for (var i = 0; i < docLength - 1; i++) {
      this.addDocuments.push(1);
    }
    this.cdr.detectChanges();
  }
  addMore() {
    this.addDocuments.push(1);
    $('.add-confidential-item').hide();
  }
  remove(i: number) {
    this.addDocuments.splice(i, 1);
  }
}