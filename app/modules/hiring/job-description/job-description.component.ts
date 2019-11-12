import { Component, Input } from '@angular/core';

@Component({
    selector: 'job-description',
    templateUrl: './job-description.component.html'
})
export class jobDescriptionnComponent {
    constructor() {}
    @Input() code: string;
    @Input() description: string;
    @Input() location: string;
    @Input() country: string;
}
