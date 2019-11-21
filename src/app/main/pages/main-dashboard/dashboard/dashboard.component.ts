import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import { DashboardService } from './dashboard.service';
import CanvasJS from 'canvasjs';
import * as shape from 'd3-shape';
import { Chart } from 'chart.js';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: fuseAnimations
})
export class DashboardComponent implements OnInit {
    widgets: any;
    chart: any;
    widget2: any = {};
    widget1SelectedYear = '2016';
    widget5SelectedDay = 'today';
    isLoadingResults: boolean = false;
    UnbilledTotal: any;
    AgedDebatorTotal: any;

    //doughnut chart
    //   public chartType: string = 'doughnut';
    //   public chartLabels: Array<string> = ['January', 'February', 'March'];
    //   public chartData: Array<number> = [1, 1, 1];

    //   public chartOptions: any = {
    //     pieceLabel: {
    //       render: function (args) {
    //         const label = args.label,
    //               value = args.value;
    //         return label + ': ' + value;
    //       }
    //     },
    //     legend: {
    //         display: true,
    //         labels: {
    //             fontColor: 'rgb(255, 99, 132)',
    //             text:'jkhfgd',
    //         }~
    //     }   
    //   }


    ///

    /**
        * Constructor
        *
        * @param {AnalyticsDashboardService} _analyticsDashboardService
        */
    constructor(private _mainAPiServiceService: MainAPiServiceService,
        private toastr: ToastrService, private _analyticsDashboardService: DashboardService,
        private behaviorService: BehaviorService) {

        //forTotal
        // this.behaviorService.totalDashboard$.subscribe(result => {
        //     console.log(result);
        //     this.UnbilledTotal=result
        //   });

        // Register the custom chart.js plugin
        this.widget2 = {
            legend: false,
            explodeSlices: false,
            labels: true,
            doughnut: false,
            gradient: false,
            scheme: {
                domain: ['#f44336', '#9c27b0', '#03a9f4', '#e91e63', '#ffc107']
            },
            onSelect: (ev) => {
                console.log(ev);
            }
        };
        this._registerCustomChartJSPlugin();
        this.chartPl();

    }
    chartPl() { }
    ngOnInit() {






        // Get the widgets from the service
        this.widgets = this._analyticsDashboardService.widgets;
        this.AgedDebatorTotal = this._analyticsDashboardService.AgedDebatorTotal;
        this.UnbilledTotal = this._analyticsDashboardService.UnbilledTotal;
        // this.widgets.widget2 = {

        //     };

    }
    /**
     * Register a custom plugin
     */
    private _registerCustomChartJSPlugin(): void {
        (<any>window).Chart.plugins.register({
            afterDatasetsDraw: function (chart, easing): any {
                // Only activate the plugin if it's made available
                // in the options
                if (
                    !chart.options.plugins.xLabelsOnTop ||
                    (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
                ) {
                    return;
                }

                // To only draw at the end of animation, check for easing === 1
                const ctx = chart.ctx;

                chart.data.datasets.forEach(function (dataset, i): any {
                    const meta = chart.getDatasetMeta(i);
                    if (!meta.hidden) {

                        meta.data.forEach(function (element, index): any {

                            // Draw the text in black, with the specified font
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                            const fontSize = 13;
                            const fontStyle = 'normal';
                            const fontFamily = 'Roboto, Helvetica Neue, Arial';
                            ctx.font = (<any>window).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                            // Just naively convert to string for now
                            console.log(dataset);
                            const dataString = dataset.data[index].toString() + 'k';

                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            const padding = 15;
                            const startY = 24;
                            const position = element.tooltipPosition();
                            ctx.fillText(dataString, position.x, startY);

                            ctx.save();

                            ctx.beginPath();
                            ctx.setLineDash([5, 3]);
                            ctx.moveTo(position.x, startY + padding);
                            ctx.lineTo(position.x, position.y - padding);
                            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
                            ctx.stroke();
                            ctx.restore();
                        });
                    }
                });
            }
        });
    }
}