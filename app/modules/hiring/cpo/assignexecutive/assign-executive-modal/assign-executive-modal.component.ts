import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AssignExecutiveDataService } from '../assign-executive.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { DialogService } from '../../../../../shared/dialogs/dialog.service';
import { ErrorHandleService } from '../../../../../shared/services/errorhandle.service';

@Component({
  selector: 'assign-executive-modal',
  templateUrl: 'assign-executive-modal.component.html'
})

export class AssignExecutiveModal {
  public display: boolean = false;
  public checked: boolean = true;
  @Input() buttonMode: boolean;
  public items: any;
  public recruiters: any;
  public disableButton: boolean = true;
  public search: any;
  @Input() title: string;
  @Input() requestId: string;
  @Output() opened = new EventEmitter<any>();
  @Output() showTimeline = new EventEmitter<any>();
  @Output() loadSelectedItems = new EventEmitter<any>();
  @Output() checkSelection = new EventEmitter<any>();
  constructor(
    private assignExecutiveDataService: AssignExecutiveDataService,
    private loaderService: LoaderService,
    public commonService: CommonService,
    private dialogService: DialogService,
    private errorHandleService: ErrorHandleService
  ) { }
  showDialog(mode: string) {
    this.checkSelection.emit();
    var self = this;
    self.loaderService.showLoading();
    this.assignExecutiveDataService.getRecruiters().subscribe(data => {
      self.items = [];
      self.recruiters = data;
      if (self.requestId) {
        self.items = [];
        if (mode == 'edit' && self.requestId) {
          setTimeout(() => {
            self.assignExecutiveDataService.getAssignedRecruiters(self.requestId).subscribe(data => {
              var reqId = self.requestId;
              var assignedRecruiters = (data[reqId]) ? data[reqId] : [];
              self.recruiters.forEach(function (elem: any, ind: any) {
                if (elem.checked == true || elem.checked == false) {
                  delete elem.checked;
                }
              });
              var items: any = [];
              for (var i = 0; i < assignedRecruiters.length; i++) {
                items = [];
                self.recruiters.forEach(function (elem: any, ind: any) {
                  if ((elem.checked == undefined) || (elem.checked == false)) {
                    if (assignedRecruiters[i]['id'] == elem.recruiterId) {
                      elem.checked = true;
                    } else {
                      elem.checked = false;
                    }
                  }
                  items.push(elem);
                });
              }
              self.items = items;
              self.checkModes(self.items);
              self.loaderService.hideLoading();
              self.display = true;
            }, error => {
              self.errorHandleService.handleErrors(error);
            });
          }, 100);
        } else {
          self.recruiters.forEach(function (elem: any, ind: any) {
            if (elem.checked == true || elem.checked == false) {
              delete elem.checked;
            }
          });
          self.items = self.recruiters;
          self.checkModes(self.items);
          self.loaderService.hideLoading();
          self.display = true;
        }
      }
    }, error => {
      self.errorHandleService.handleErrors(error);
    });
  }
  addSelection(value: any) {
    this.loadSelectedItems.emit(this.getSelectedItems());
    this.display = false;
  }
  checkModes(items: any) {
    if(this.getSelectedList(items).length > 0){
      this.disableButton = false;
    }else{
      this.disableButton = true;
    }
  }
  getSelectedItems(): string[] {
    var itemsSelected = $('[ng-reflect-visible] .selection-item'),
      selectedItems: string[] = [];
    /*itemsSelected.each(function (index: any, element: any) {
      if (element.checked == true) {
        selectedItems.push(element.id);
        element.checked = false;
      }
    });*/
    this.items.forEach(function (element: any, index: any) {
      if (element.checked == true) {
        selectedItems.push(element.recruiterId);
        element.checked = false;
      }
    });
    return selectedItems;
  }
  getSelectedList(items: any): string[] {
   var itemsSelected = $('.selection-item'),
      selectedItems: string[] = [];
    if(items){
      items.forEach(function (element: any, index: any) {
       if (element.checked == true) {
        selectedItems.push(element.id);
       }
      });
    }else{
      itemsSelected.each(function (index: any, element: any) {
       if (element.checked == true) {
         selectedItems.push(element.id);
       }
      });
    }
    return selectedItems;
  }
  open() {
    this.opened.emit();
  }
  showHiringTimeline(){
    this.showTimeline.emit();
  }
  hideDialog(){
    this.search = '';
    this.display = false;
  }
}