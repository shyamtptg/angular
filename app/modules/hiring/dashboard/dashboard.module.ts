import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from '../../../shared/charts/charts.module';
import { dashboardRouting } from './dashboard.routing';
import { DashboardComponent } from './dashboard.component';
import { LoaderService } from '../../../shared/services/loader.service';

@NgModule({
    imports: [CommonModule, FormsModule, dashboardRouting, ChartsModule],
    declarations: [ DashboardComponent ],
    providers: [ LoaderService ]
})
export class DashboardModule { }
