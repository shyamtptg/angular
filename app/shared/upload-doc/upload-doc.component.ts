import { Component, Directive, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';

// const URL = '/api/';
const URL = 'http://localhost:4001/api/';

@Component({
  selector: 'upload-doc',
  templateUrl: './upload-doc.html',
  inputs: ['labelText', 'uniqueId', 'docType']
})
export class UploadComponent {
  public labelText: String;
  public filesToUpload: Array<File>;
  public fileName: String;
  @Input() isUpload: boolean;
  @Input() docTitle: string;
  @Input() index: number;
  @Input() hideDownload: boolean;
  @Input() hideUpload: boolean;
  @Input() hideDelete: boolean;
  @Input() hideRemove: boolean;
  @Input() hideBrowse: boolean;
  @Output() onUpload = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onDownload = new EventEmitter<any>();
  @Output() onFileChange = new EventEmitter<any>();
  @Output() onRemove = new EventEmitter<any>();
  @ViewChild('docBrowse') docBrowse: ElementRef;
  @ViewChild('docUpload') docUpload: ElementRef;
  @ViewChild('uploadButton') uploadButton: ElementRef;
  @ViewChild('removeButton') removeButton: ElementRef;
  @ViewChild('downloadButton') downloadButton: ElementRef;
  //Create unique random strings for 'id'.
  public uniqueId: String = Math.random().toString(36).substr(2, 10);
  public fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    this.onFileChange.emit(this.filesToUpload);
    if(!(this.filesToUpload.length>0)){
      return;
    }
    this.fileName = this.filesToUpload[0].name;
    if (this.fileName) {
      this.uploadButton.nativeElement.disabled = false;
    }
    //var vm = this;

    /*setTimeout(function(){
      vm.fileName = vm.filesToUpload[0].name;
      vm.makeFileRequest(URL, [], vm.filesToUpload).then((result) => {
      }, (error) => {
      });
    },1000);  */
  }
  public uploadDocument() {
    var vm = this;
    vm.onUpload.emit();
    /* vm.makeFileRequest(URL, [], vm.filesToUpload).then((result) => {
     }, (error) => {
     });*/
  }
  deleteDocument() {
    var vm = this;
    vm.onDelete.emit();
  }
  downloadDocument() {
    var vm = this;
    vm.onDownload.emit();
  }
  removeIndexDocument() {
    var vm = this;
    vm.onRemove.emit();
  }
  public makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      for (var i = 0; i < files.length; i++) {
        formData.append("uploads[]", files[i], files[i].name);
      }
      /*xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
              if (xhr.status == 200) {
                  resolve(JSON.parse(xhr.response));
              } else {
                  reject(xhr.response);
              }
          }
      }*/
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }
  ngOnChanges(changes: any) {
    this.isUpload = changes.isUpload && changes.isUpload.currentValue;
    if (!this.isUpload) {
      this.fileName = changes.docTitle && changes.docTitle.currentValue;
    }
    if (changes.isUpload) {
      if (this.isUpload && this.fileName) {
        if (this.uploadButton && this.uploadButton.nativeElement && this.removeButton && this.removeButton.nativeElement) {
          this.uploadButton.nativeElement.disabled = true;
          this.removeButton.nativeElement.disabled = false;
          this.docBrowse.nativeElement.style.pointerEvents = 'none';
          this.docBrowse.nativeElement.style.opacity = 0.65;
          this.downloadButton.nativeElement.disabled = false;
        }
      } else {
        if (this.uploadButton && this.uploadButton.nativeElement && this.removeButton && this.removeButton.nativeElement) {
          if (this.fileName) {
            this.uploadButton.nativeElement.disabled = false;
          } else {
            this.uploadButton.nativeElement.disabled = true;
          }
          this.removeButton.nativeElement.disabled = true;
          this.docBrowse.nativeElement.style.pointerEvents = 'auto';
          this.docBrowse.nativeElement.style.opacity = 1;
          this.downloadButton.nativeElement.disabled = true;
          this.docUpload.nativeElement.value = "";
        }
      }
    }
  }
  ngOnInit() {
    this.fileName = this.docTitle;
  }
}

