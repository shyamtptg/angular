import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AddProfileDataService } from '../add-profile.service';

@Injectable()
export class ActivateProfessionalGuard implements CanActivate {
  constructor(private addProfileDataService: AddProfileDataService) { }
  canActivate(route: ActivatedRouteSnapshot, currentState: RouterStateSnapshot): any {
    var professionalForm: any = this.addProfileDataService.professionalForm,
      personalForm: any = this.addProfileDataService.personalForm;
    /*if (((professionalForm && professionalForm.dirty && !professionalForm.valid) || (!this.addProfileDataService.professionalFormSaved)) || ((personalForm && personalForm.dirty && !personalForm.valid) || (!this.addProfileDataService.personalFormSaved))) {
      return alert('Click on Confirm & continue to save the changes');
    }*/
    if(this.addProfileDataService.mode == 'view'){
      return true;
    }
    if(((professionalForm && professionalForm.dirty && !professionalForm.valid) || (professionalForm && !professionalForm.valid)) || ((personalForm && personalForm.dirty && !personalForm.valid) || (personalForm && !personalForm.valid))){
      return alert('Please enter the mandatory fields before navigating');
    }
    if ((personalForm && personalForm.dirty && (!this.addProfileDataService.personalFormSaved)) || (professionalForm && professionalForm.dirty && (!this.addProfileDataService.professionalFormSaved))) {
      return alert('Click on Confirm & continue to save the changes');
    }
    if (this.addProfileDataService.professionalFormSaved) {
      this.addProfileDataService.professionalFormSaved = false;
    }
    return true;
  }
}

