import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SkillsetComponent } from '../skillset/skillset.component';

@Injectable()
export class DeactivateSkillGuard implements CanDeactivate<SkillsetComponent> {
  canDeactivate(component: SkillsetComponent) {
    if (component.skillForm && component.skillForm.dirty) {
      return confirm('Discard changes?');
    }
    return true;
  }
}
