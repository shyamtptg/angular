import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { NewHiringRequestDataService1 } from '../../../modules/hiring/hiring-manager/new-hiring-request-1/new-hiring-request-service';

@Component({
  selector: 'multi-select-modal',
  templateUrl: 'multi-selection.component.html',
  styles: [`
		nav {
	 		height: 200px;
		}
		ul {
	 		list-style: none;
		}
    	.multi-select-data {
     		padding-right: 13em;
    	}
  `]
})

export class MultiSelectionModal {
  constructor(private loaderService: LoaderService, private hiringReqService: NewHiringRequestDataService1) { }
  display: boolean = false;
  @Input() items: any;
  resetItems: any;
  @Input() list: any;
  @Input() searchTitle: string;
  @Input() title: string;
  @Input() listName: string;
  @Output() loadSelectedItems = new EventEmitter<any>();
  search: string;
  disable: boolean = true;
  showDialog() {
    this.loaderService.showLoading();
    if (this.listName) {
      this.hiringReqService.getListData(this.listName).subscribe(data => {
        const listData: any = [];
        if (data['_embedded'] && data['_embedded']['employees']) {
          data['_embedded']['employees'].forEach(function(ele: any, ind: any) {
            listData.push({
              'id': ele.id,
              'name': ele.fullName
            });
          });
          this.items = listData;
        }
        this.loaderService.hideLoading();
        this.display = true;
      }, error => {
        this.loaderService.hideLoading();
        this.display = false;
        setTimeout(() => {
        }, 0);
      });
    } else {
      this.items = this.list;
      setTimeout(() => {
        this.loaderService.hideLoading();
        this.display = true;
      }, 1000 );
    }
  }
  itemSelected() {
    setTimeout(() => {
      let i = 0;
      this.items.forEach((element: any, indx: any) => {
       if (element.checked) {
          i = 1;
       }
     });
        if (i === 1) {
          this.disable = false;
        } else {
          this.disable = true;
        }
    });
}
reset() {
this.disable = true;
  this.items.forEach((element: any, indx: any) => {
    if (element.checked) {
      element.checked = false;
    }
  });

}
  addSelection(value: any) {
    this.loadSelectedItems.emit(this.getSelectedItems());
    this.display = false;
  }
  getSelectedItems(): any {
    const selectedItems: string[] = [],
    selectedNames: string[] = [];
    this.items.forEach(function (element: any, indx: any) {
      if (element.checked) {
        selectedNames.push(element.name);
        selectedItems.push(element);
        element.checked = false;
      }
    });
    return {'items': selectedItems, 'itemNames': selectedNames};
  }
}
