import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ProfessionalComponent } from '../professional/professional.component';
import { AddProfileDataService } from '../add-profile.service';

@Injectable()
export class DeactivateProfessionalGuard implements CanDeactivate<ProfessionalComponent> {
  constructor(private addProfileDataService: AddProfileDataService) { }
  canDeactivate(component: ProfessionalComponent, route: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): any {
    if (component.professionalForm && component.professionalForm.dirty) {
      this.addProfileDataService.updateProspectProfessionalData(component.ProfessionalDataFrmProspectData, component.file);
    }
    return true;
  }
}

