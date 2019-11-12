import { Component, Input } from '@angular/core';
import * as c3 from 'c3';

export interface BarChartConfig {
	name: string;
	target: string;
	height: number;
	columns: Array<any>;
	categories: Array<any>;
	total: number;
	maxDataPoints: number
}

@Component({
	selector: 'bar-chart',
	template: `
         <div [attr.id]="chartData.target"></div>
	`
})

export class BarChart {
	@Input() chartData: BarChartConfig;

	ngOnInit() {
		setTimeout(() => {
			c3.generate({
				bindto: '#' + this.chartData.target,
				size: {
					height: this.chartData.height,
					width: 300
				},
				data: {
					columns: this.chartData.columns,
					type: 'bar'

				},
				axis: {
					x: {
						type: 'category',
						categories: this.chartData.categories
					}, y: {
						max: this.chartData.maxDataPoints + 1,
						tick: {
							count: (this.chartData.maxDataPoints >= 10) ? 11 : this.chartData.maxDataPoints + 2,
							format: function (d) { return Math.round(d).toString(); }
						}
					}
				},
				bar: {
					width: {
						ratio: 0.5,
					}
				}
			});
		}, 20);
	}

}