
import { Component, Input } from '@angular/core';

@Component({
  selector: 'job-desc-view',
  templateUrl: './job-description-view.component.html'
})

export class JobDescriptionView {
  @Input() jobDescData: any;
  constructor() {} 
}