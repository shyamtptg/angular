import { Component, Input, Output, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppConstants } from '../../../../config/app.constants';
import { SkillProficiency } from '../models/SkillProficiency';
import {CommonService} from '../../../../shared/services/common.service'
@Component({
    selector: 'skill',
    templateUrl: './skill.component.html'
})
export class SkillComponent implements OnChanges {
  //@Input skillDetails:Array<string>;
  @Input() headers: any;
  @Input() allSkills: any;
  @Input() currentSkills: any;
  @Input() skillDetails: string[];
  @Input() isViewMode: boolean;
  maxProficiency: number = 5;
  ngOnChanges(changes: any) {
    //this.headers = changes.headers && changes.headers.currentValue;
    //this.skillDetails = changes.skillProficiency && changes.skillProficiency.currentValue;
    //this.allSkills = changes.allSkills && changes.allSkills.currentValue;       
  };
  constructor(private commonService:CommonService) {}
  deleteSkill(rowIndex: number): void {
    this.skillDetails.splice(rowIndex, 1);
  }
  restrictFloatnumber(e: any) {
    return this.commonService.restrictFloatnumber(e);
  }
  validateExperience(value:any){
    this.commonService.validateExperience(value);
  }
}