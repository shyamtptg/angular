import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AddProfileDataService } from '../add-profile.service';

@Injectable()
export class ActivatePersonalGuard implements CanActivate {
  constructor(private addProfileDataService: AddProfileDataService) { }
  canActivate(route: ActivatedRouteSnapshot, currentState: RouterStateSnapshot): any {
    var personalForm: any = this.addProfileDataService.personalForm;
    /*if ((personalForm && personalForm.dirty && !personalForm.valid) || (!this.addProfileDataService.personalFormSaved)) {
      return alert('Click on Confirm & continue to save the changes');
    }*/
    if(this.addProfileDataService.mode == 'view'){
      return true;
    }
    if((personalForm && personalForm.dirty && !personalForm.valid) || (personalForm && !personalForm.valid)){
      return alert('Please enter the mandatory fields before navigating');
    }
    if (personalForm && personalForm.dirty && !(this.addProfileDataService.personalFormSaved)) {
      return alert('Click on Confirm & continue to save the changes');
    }
    if (this.addProfileDataService.personalFormSaved) {
      this.addProfileDataService.personalFormSaved = false;
    }
    return true;
  }
}