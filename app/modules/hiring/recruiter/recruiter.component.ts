import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddProfileDataService } from './addprofile/add-profile.service';
import { NewHiringRequestDataService1 } from '../hiring-manager/new-hiring-request-1/new-hiring-request-service';
@Component({
  templateUrl: './recruiter.component.html'
})
export class RecruiterComponent {
	public URLtitle:string;
	constructor(private hiringRequestDataService: NewHiringRequestDataService1, private addProfileDataService: AddProfileDataService){}
	ngOnInit(){
	    this.hiringRequestDataService.loadHiringComboData();
		this.addProfileDataService.loadHiringComboData();
		this.addProfileDataService.loadProspectComboData();
	}
}
