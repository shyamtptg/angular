import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignExecutiveDataService } from './assignexecutive/assign-executive.service';
@Component({
  templateUrl: './cpo.component.html'
})
export class CpoComponent {
	public URLtitle:string='Lalith';
	constructor(private assignExecutiveDataService: AssignExecutiveDataService){}
	ngOnInit(){
   	  this.assignExecutiveDataService.loadHiringComboData();
   }
}