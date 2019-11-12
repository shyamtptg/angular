import { Component } from '@angular/core';
import { NewHiringRequestDataService1 } from './new-hiring-request-1/new-hiring-request-service';
@Component({
  templateUrl: './hiring-manager.component.html'
})
export class HiringManagerComponent {
   public URLtitle:string='Lalith';
   constructor(private hiringRequestDataService: NewHiringRequestDataService1){}
   ngOnInit(){
   	  this.hiringRequestDataService.loadHiringComboData();
   }
}