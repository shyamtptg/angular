import { Component, Input } from '@angular/core';
import * as c3 from 'c3';

export interface AreaChartConfig {
    target: string;
    height: number;
    tickCount: number;
    data: Array<any>;
}

@Component({
    selector: 'area-chart',
    template: `
         <div [attr.id]="chartData.target" ></div>
	`
})

export class AreaChart {
    @Input() chartData: AreaChartConfig;
    ngOnInit() {
        (function (ref) {
            setTimeout(() => {
                var type = {};
                type[ref.chartData.data[0]] = 'area';
                c3.generate({
                    bindto: '#' + ref.chartData.target,
                    size: {
                        height: ref.chartData.height,
                    },
                    data: {
                        columns: [
                            ref.chartData.data
                        ],
                        types: type
                    },
                    axis: {
                        y: {
                            tick: {
                                count: ref.chartData.tickCount
                            }
                        }
                    }
                });
            }, 20);
        }(this));
    }
}