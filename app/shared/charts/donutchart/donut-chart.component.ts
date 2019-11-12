import { Component, Input } from '@angular/core';
import * as c3 from 'c3';

export interface DonutChartConfig {
	target: string;
	title: string;
	height: number;
	data: Array<Object>;
	categories: string;
}

@Component({
	selector: 'donut-chart',
	template: `
         <div [attr.id]="chartData.target"></div>
	`
})

export class DonutChart {
	@Input() chartData: DonutChartConfig;
	ngOnInit() {
		setTimeout(() => {
			c3.generate({
				bindto: '#' + this.chartData.target,
				size: {
					height: this.chartData.height,
				},
				data: {
					json: this.chartData.data,
					keys: { value: this.chartData.categories.split(",") },
					type: 'donut'
				},
				donut: {
					title: this.chartData.title,
					label: {
						show: false
					}
				},
				legend: {
					show: false
				},
				tooltip: {
					show: false
				}
			});
		}, 20);
	}
}