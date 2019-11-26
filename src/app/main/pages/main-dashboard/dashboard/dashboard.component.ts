import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import { DashboardService } from './dashboard.service';
import CanvasJS from 'canvasjs';
import * as shape from 'd3-shape';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: fuseAnimations
})
export class DashboardComponent implements OnInit {
    widgets: any;
    widget11:any;
    chart: any;
    widget2: any = {};
    widget1SelectedYear = '2016';
    widget5SelectedDay = 'today';
    isLoadingResults: boolean = false;
    UnbilledTotal: any;
    AgedDebatorTotal: any;
    TotalInvoice:any;
    getMonthNum:any=[];
    InvoiceInGst:any=[];
    Childwidget: any;
    widget12: any;
    widget13: any;
    getMonthNumForExpense:any=[];
    InvoiceInGstForExpense:any=[];
    getMonthNumForReceipt:any=[];
    InvoiceInGstForReceipt:any=[]
    widget5:any
    deviceValForAged:any=[];
    widget7:any;
    deviceValForUnbilled:any=[];
   
    /**
        * Constructor
        *
        * @param {AnalyticsDashboardService} _analyticsDashboardService
        */
    constructor(private _mainAPiServiceService: MainAPiServiceService,
        private toastr: ToastrService, private _analyticsDashboardService: DashboardService,
        private behaviorService: BehaviorService,
        public datepipe: DatePipe,) {

        //forTotal
        // this.behaviorService.totalDashboard$.subscribe(result => {
        //     console.log(result);
        //     this.UnbilledTotal=result
        //   });

        // Register the custom chart.js plugin
        // this.widget2 = {
        //     legend: false,
        //     explodeSlices: false,
        //     labels: true,
        //     doughnut: false,
        //     gradient: false,
        //     scheme: {
        //         domain: ['#f44336', '#9c27b0', '#03a9f4', '#e91e63', '#ffc107']
        //     },
        //     onSelect: (ev) => {
        //         console.log(ev);
        //     }
        // };
        this._registerCustomChartJSPlugin();
        this.chartPl();

    }
    chartPl() { }

    selectStatus(val) {

    }
    addMonths(date, months) {
        date.setMonth(date.getMonth() + months);
        return date;
    }
    ngOnInit() {
        this.isLoadingResults = true;
        this.widget11="empty";
        this.widget12="empty";
        this.widget13="empty";
        this.widget5="empty";
        this.widget2="empty";
        this.widget7="empty";
        // Get the widgets from the service
        // this.AgedDebatorTotal = this._analyticsDashboardService.AgedDebatorTotal;
        // this.UnbilledTotal = this._analyticsDashboardService.UnbilledTotal;
        
        // this.widgets = this._analyticsDashboardService.widgets;
        // console.log(this._analyticsDashboardService);
        this.AgedDebetorData();
        this.UnbilledWIPData();
        this.TotalInvoiceData('invoices');
        this.TotalExpenseData('expenses');
        this.TotalReceiptData('receipts');
        // this.ComparisionChart();
        // this.TotalInvoiceData('expenses');
        // this.TotalInvoiceData('receipts');
        // this.widgets.widget2 = {
        //     };
    }
    AgedDebetorData(){
        this.deviceValForAged = [];
        this._mainAPiServiceService.getSetData({ Dashboard: 'aged debtors' }, 'GetDashboard').subscribe(res => {
            if (res.CODE == 200 && res.STATUS == "success") {
                this.AgedDebatorTotal = (res.DATA.DASHBOARDTOTALS.INCGST).toFixed(2);
                res.DATA.DASHBOARDDATA.forEach(element => {
                    this.deviceValForAged.push({ name: element.DATEDESC, value: element.INCGST })
                });
                this.widget7= {
                    scheme : {
                        domain: ['#4867d2', '#5c84f1', '#89a9f4','#c0caed']
                    },
                    devices: this.deviceValForAged
                }
            }

        });
    }
    UnbilledWIPData(){
        this.deviceValForUnbilled=[];
        this._mainAPiServiceService.getSetData({ Dashboard: 'unbilled WIP' }, 'GetDashboard').subscribe(res => {
            if (res.CODE == 200 && res.STATUS == "success") {
                this.UnbilledTotal = (res.DATA.DASHBOARDTOTALS.INCGST).toFixed(2);
                res.DATA.DASHBOARDDATA.forEach(element => {
                    this.deviceValForUnbilled.push({ name: element.DATEDESC, value: element.INCGST })
                });
                this.widget2= {
                    scheme : {
                        domain: ['#9205ff', '#b14dff','#d399ff','#6b00bd',]
                    },
                    devices:this.deviceValForUnbilled
                } 
                this.isLoadingResults = false;
            }
        });
    }
TotalInvoiceData(type){
    this.widget11="empty";
    this.getMonthNum=[];
    this.InvoiceInGst=[];
    let MonthStartDate= this.datepipe.transform(this.addMonths(new Date(), -6), 'dd/MM/yyyy');
    let MonthEndDate= this.datepipe.transform(new Date(), 'dd/MM/yyyy');
    this._mainAPiServiceService.getSetData({ Dashboard: type,StartDate:MonthStartDate,EndDate:MonthEndDate }, 'GetDashboard').subscribe(res => {
        console.log(res);
        if (res.CODE == 200 && res.STATUS == "success") {
            this.TotalInvoice=res.DATA.DASHBOARDTOTALS.INCGST;
            res.DATA.DASHBOARDDATA.forEach(element => {
                element.DATEDESC
                let MonthWiseDate = element.DATEDESC.split("/");
                var monthNum = MonthWiseDate[1];   // assuming Jan = 1
                var shortName = moment.monthsShort(monthNum - 1); 
                this.getMonthNum.push(shortName);
                this.InvoiceInGst.push(element.INCGST);
                
            });
            this.widget11= {
                chartType:"bar",
                colors:[{backgroundColor: "#42a5f5",
                borderColor: "#42a5f5"}],
                conversion:{
                    value:(res.DATA.DASHBOARDTOTALS.INCGST).toFixed(2)
                },
                datasets:[
                    {data:this.InvoiceInGst,
                    label:'Total Invoiced'}
                ],
                labels:this.getMonthNum,
                options:{
                    layout:{
                        padding:{
                            bottom: 16,
                            left: 16,
                            right: 16,
                            top: 24
                        }
                    },
                    legend:{display:false},
                    maintainAspectRatio:false,
                    scales:{
                        xAxes:[{display:true}],
                        yAxes:[
                            {
                            display:true ,
                            ticks:{
                            max:1000,
                            min:0,
                            stepSize: 500,
                            callback: function(value, index, values) {
                                return '$' + value; 
                            }
                        }},
                        ]
                    }

                },
                
            }
          
        }
    });
}
TotalExpenseData(type){
    this.widget12="empty";
    this.getMonthNumForExpense=[];
    this.InvoiceInGstForExpense=[];
    let MonthStartDate= this.datepipe.transform(this.addMonths(new Date(), -6), 'dd/MM/yyyy');
    let MonthEndDate= this.datepipe.transform(new Date(), 'dd/MM/yyyy');
    this._mainAPiServiceService.getSetData({ Dashboard: type,StartDate:MonthStartDate,EndDate:MonthEndDate }, 'GetDashboard').subscribe(res => {
        console.log(res);
        if (res.CODE == 200 && res.STATUS == "success") {
            this.TotalInvoice=res.DATA.DASHBOARDTOTALS.INCGST;
            res.DATA.DASHBOARDDATA.forEach(element => {
                element.DATEDESC
                let MonthWiseDate = element.DATEDESC.split("/");
                var monthNum = MonthWiseDate[1];   // assuming Jan = 1
                var shortName = moment.monthsShort(monthNum - 1); 
                this.getMonthNumForExpense.push(shortName);
                this.InvoiceInGstForExpense.push(element.INCGST);
                
                // invoice vs expense 
                this.ComparisionChart()
            });
            this.widget12= {
                chartType:"bar",
                colors:[{backgroundColor: "#ff0000",
                borderColor: "#42a5f5"}],
                conversion:{
                    value:(res.DATA.DASHBOARDTOTALS.INCGST).toFixed(2)
                },
                datasets:[
                    {data:this.InvoiceInGstForExpense,
                    label:'Total Expense'}
                ],
                labels:this.getMonthNumForExpense,
                options:{
                    layout:{
                        padding:{
                            bottom: 16,
                            left: 16,
                            right: 16,
                            top: 24
                        }
                    },
                    legend:{display:false},
                    maintainAspectRatio:false,

                    scales:{
                        xAxes:[{display:true}],
                        yAxes:[
                            {
                            display:true ,
                            ticks:{
                            max:1000,
                            min:0,
                            stepSize: 500,
                            callback: function(value, index, values) {
                                return '$' + value; 
                            }
                        }},
                        ]
                    }

                },

            
            }
           
        }
    });
}
TotalReceiptData(type){
    this.widget13="empty";
    this.getMonthNumForReceipt=[];
    this.InvoiceInGstForReceipt=[];
    let MonthStartDate= this.datepipe.transform(this.addMonths(new Date(), -6), 'dd/MM/yyyy');
    let MonthEndDate= this.datepipe.transform(new Date(), 'dd/MM/yyyy');
    this._mainAPiServiceService.getSetData({ Dashboard: type,StartDate:MonthStartDate,EndDate:MonthEndDate }, 'GetDashboard').subscribe(res => {
        console.log(res);
        if (res.CODE == 200 && res.STATUS == "success") {
            this.TotalInvoice=res.DATA.DASHBOARDTOTALS.INCGST;
            res.DATA.DASHBOARDDATA.forEach(element => {
                element.DATEDESC
                let MonthWiseDate = element.DATEDESC.split("/");
                var monthNum = MonthWiseDate[1];   // assuming Jan = 1
                var shortName = moment.monthsShort(monthNum - 1); 
                this.getMonthNumForReceipt.push(shortName);
                this.InvoiceInGstForReceipt.push(element.INCGST);
                
            });
            this.widget13= {
                chartType:"bar",
                colors:[{backgroundColor: "#43a047",
                borderColor: "#42a5f5"}],
                conversion:{
                    value:(res.DATA.DASHBOARDTOTALS.INCGST).toFixed(2)
                },
                datasets:[
                    {data:this.InvoiceInGstForReceipt,
                    label:'Total Receipt'}
                ],
                labels:this.getMonthNumForReceipt,
                options:{
                    layout:{
                        padding:{
                            bottom: 16,
                            left: 16,
                            right: 16,
                            top: 24
                        }
                    },
                    legend:{display:false},
                    maintainAspectRatio:false,
                    scales:{
                        xAxes:[{display:true}],
                        yAxes:[
                            {
                            display:true ,
                            ticks:{
                            max:1000,
                            min:0,
                            stepSize: 500,
                            callback: function(value, index, values) {
                                return '$' + value; 
                            }
                        }},
                        ]
                    }

                },
              
            
            }
           
        }
    });
}
ComparisionChart(){
 this.widget5="empty";
    this.widget5= {
        chartType: 'line',
        datasets : {
            'today'    : [
          
                {
                    label: 'Invoices',
                    data : this.InvoiceInGst,
                    fill : 'start'
                },
                {
                    label: 'Expenses',
                    data : this.InvoiceInGstForExpense,
                    fill : 'start'

                },
               
            ]
        },
        labels   : this.getMonthNumForExpense,
        colors   : [
            {
                borderColor              : '#3949ab',
                backgroundColor          : '#3949ab',
                pointBackgroundColor     : '#3949ab',
                pointHoverBackgroundColor: '#3949ab',
                pointBorderColor         : '#ffffff',
                pointHoverBorderColor    : '#ffffff'
            },
            {
                borderColor              : 'rgba(30, 136, 229, 0.87)',
                backgroundColor          : 'rgba(30, 136, 229, 0.87)',
                pointBackgroundColor     : 'rgba(30, 136, 229, 0.87)',
                pointHoverBackgroundColor: 'rgba(30, 136, 229, 0.87)',
                pointBorderColor         : '#ffffff',
                pointHoverBorderColor    : '#ffffff'
            }
        ],
        options  : {
            spanGaps           : false,
            legend             : {
                display: false
            },
            maintainAspectRatio: false,
            tooltips           : {
                position : 'nearest',
                mode     : 'index',
                intersect: false
            },
            layout             : {
                padding: {
                    left : 24,
                    right: 32
                }
            },
            elements           : {
                point: {
                    radius          : 4,
                    borderWidth     : 2,
                    hoverRadius     : 4,
                    hoverBorderWidth: 2
                }
            },
            scales             : {
                xAxes: [
                    {
                        gridLines: {
                            display: false
                        },
                        ticks    : {
                            fontColor: 'rgba(0,0,0,0.54)'
                        }
                    }
                ],
                yAxes: [
                    {
                        display:true ,
                        gridLines: {
                            tickMarkLength: 16
                        },
                        ticks    : {
                            max:10000,
                            min:0,
                            stepSize: 500,
                            callback: function(value, index, values) {
                                return '$' + value;
                            }
                        }
                    }
                ]
            },
            plugins            : {
                filler: {
                    propagate: false
                }
            }
        }
    }


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