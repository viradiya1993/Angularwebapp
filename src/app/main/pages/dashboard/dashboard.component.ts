import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { MainAPiServiceService } from 'app/_services';
import { DashboardService } from './dashboard.service';
import CanvasJS from 'canvasjs';
import * as shape from 'd3-shape';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: fuseAnimations
})
export class DashboardComponent implements OnInit {
    widgets: any;
    widget1SelectedYear = '2016';
    widget5SelectedDay = 'today';
  isLoadingResults: boolean = false;
 /**
     * Constructor
     *
     * @param {AnalyticsDashboardService} _analyticsDashboardService
     */
  constructor(private _mainAPiServiceService:MainAPiServiceService,
    private toastr: ToastrService, private _analyticsDashboardService: DashboardService) { 
      // Register the custom chart.js plugin

      this._registerCustomChartJSPlugin();
      this.chartPl();

    }
chartPl(){}
  ngOnInit() {
    // Get the widgets from the service
    this.widgets = this._analyticsDashboardService.widgets;
    console.log(this.widgets.widget2) 
    // this.widgets.widget2 = {

    //     };

}
    /**
     * Register a custom plugin
     */
    private _registerCustomChartJSPlugin(): void
    {
    
        (<any>window).Chart.plugins.register({
        
            afterDatasetsDraw: function (chart, easing): any {
                // Only activate the plugin if it's made available
                // in the options
                if (
                    !chart.options.plugins.xLabelsOnTop ||
                    (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
                )
                {
                    return;
                }

                // To only draw at the end of animation, check for easing === 1
                const ctx = chart.ctx;

                chart.data.datasets.forEach(function (dataset, i): any {
                    const meta = chart.getDatasetMeta(i);
                    if ( !meta.hidden )
                    {
                     
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