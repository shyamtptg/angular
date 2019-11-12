import { Component, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Tab } from './tab';

@Component({
  selector: 'tabs',
  template: `
    <ul class="nav nav-pills">
      <li *ngFor="let tab of tabs" (click)="selectTab(tab)" [class.active]="tab.active" [class.hide]="tab.hide">
        <a>{{tab.title}}</a>
      </li>
    </ul>
    <ng-content></ng-content>
  `
})
export class Tabs implements AfterContentInit {
  @ContentChildren(Tab) tabs: QueryList<Tab>;
  @Output() tabSelect: EventEmitter<Tab> = new EventEmitter<Tab>();
  constructor(private cdr: ChangeDetectorRef) { }
  // contentChildren are set
  ngAfterContentInit() {
    this.cdr.detectChanges();
    // get all active tabs
    let activeTabs = this.tabs.filter((tab) => tab.active);
    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }
  selectTab(tab: Tab) {
     if (!tab.disabled) {
      // deactivate all tabs
      this.tabs.toArray().forEach(tab => tab.active = false);
      // activate the tab the user has clicked on.
      tab.active = true;
      this.tabSelect.next(tab);
    }
  }
  getCurrentTab() {
    return this.tabs.toArray().filter(tab => tab.active == true);
  }
  getTabByTitle(label: any) {
    return this.tabs.toArray().filter(tab => tab.title == label);
  }
  getAllTabs() {
    return this.tabs.toArray();
  }

}
