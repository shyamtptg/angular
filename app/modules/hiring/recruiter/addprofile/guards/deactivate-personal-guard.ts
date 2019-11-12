import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { PersonalComponent } from '../personal/personal.component';

@Injectable()
export class DeactivatePersonalGuard implements CanDeactivate<PersonalComponent> {
  canDeactivate(component: PersonalComponent, route: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): any {
    if (component.personalForm && component.personalForm.dirty && !component.formSaved) {
      return alert('Click on Confirm & continue to save the changes');
    }
    component.formSaved = false;
    return true;
  }
}

