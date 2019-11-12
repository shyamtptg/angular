import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SkillComponent } from './skill.component';

@NgModule({
  imports: [CommonModule, FormsModule, NgbModule.forRoot()],
  declarations: [SkillComponent],
  providers: [],
  exports: [SkillComponent]
})

export class SkillModule {}