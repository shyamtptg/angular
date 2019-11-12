import { NgModule } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tabs } from './tabs';
import { Tab } from './tab';

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [Tabs, Tab],
    providers: [],
    exports: [ Tabs, Tab ]
})
export class TabsModule { }