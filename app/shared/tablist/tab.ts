import { Component, Input } from '@angular/core';
@Component({
  selector: 'tab',
  styles: [`
    .pane{
      padding: 1em;
    }
    .hide{
      visibility: hidden;
    }
  `],
  template: `
    <div [hidden]="!active" class="pane">
      <ng-content></ng-content>
    </div>
  `
})
export class Tab {
  @Input('tabTitle') title: string;
  @Input() active = false;
  @Input() disabled = false;
  @Input() hide = false;
}