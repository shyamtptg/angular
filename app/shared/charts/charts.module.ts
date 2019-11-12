import { NgModule } from '@angular/core';
import { AreaChart } from './areachart/area-chart.component';
import { DonutChart } from './donutchart/donut-chart.component';
import { BarChart } from './barchart/bar-chart-component';

@NgModule({
  declarations: [AreaChart, DonutChart, BarChart],
  providers: [],
  exports: [AreaChart, DonutChart, BarChart]
})

export class ChartsModule { }