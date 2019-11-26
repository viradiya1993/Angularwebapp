import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
// import { AnalyticsDashboardDb } from './dashboard-analytics';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import { AnalyticsDashboardDb } from './dashboard-analytics';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Injectable()
export class DashboardService implements Resolve<any>
{
    AgedDebtorsArray: any;
    itemVal: any = [];
    UnbilledWIPArray: any;
    deviceValForAged: any = [];
    AmountUnBilled: any = [];
    deviceValForUnbilled: any = [];
    UnbilledTotal: any;
    AgedDebatorTotal: any;
    getMonthNum:any=[];
    InvoiceInGst:any=[];
    TotalInvoice: any;

    createDb(): any {
        return {
            // Dashboards
            'analytics-dashboard-widgets': AnalyticsDashboardDb.widgets,
        };
    }
    widgets: any;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _mainAPiServiceService: MainAPiServiceService,
        private behaviorService: BehaviorService,
        public datepipe: DatePipe,
    ) {
        this.createDb();
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getWidgets()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }
    
        // for 6 month date 
addMonths(date, months) {
            date.setMonth(date.getMonth() + months);
            return date;
}
        

    /**
     * Get widgets
     *
     * @returns {Promise<any>}
     */
    getWidgets(): Promise<any> {
       let MonthStartDate= this.datepipe.transform(this.addMonths(new Date(), -6), 'dd/MM/yyyy');
       let MonthEndDate= this.datepipe.transform(new Date(), 'dd/MM/yyyy');
        return new Promise((resolve, reject) => {
            // this.AgedDebtorsArray = [];
            // this.deviceValForAged = [];
            // this.deviceValForUnbilled = [];
            // this._mainAPiServiceService.getSetData({ Dashboard: 'aged debtors' }, 'GetDashboard').subscribe(res => {
            
            //     if (res.CODE == 200 && res.STATUS == "success") {
            //         this.AgedDebtorsArray = res.DATA.DASHBOARDDATA;
            //         res.DATA.DASHBOARDDATA.forEach(element => {
            //             this.deviceValForAged.push({ name: element.DATEDESC, value: element.INCGST })
            //         });
            //         AnalyticsDashboardDb.widgets.widget7.devices = this.deviceValForAged
            //         this.AgedDebatorTotal = (res.DATA.DASHBOARDTOTALS.INCGST).toFixed(2);
              
        
            //     }

            // }, reject);
            // this._mainAPiServiceService.getSetData({ Dashboard: 'unbilled WIP' }, 'GetDashboard').subscribe(res => {
    
            //     this.itemVal = [];
            //     this.AmountUnBilled = [];
            //     if (res.CODE == 200 && res.STATUS == "success") {
            //         this.UnbilledWIPArray = res.DATA.DASHBOARDDATA;
            //         res.DATA.DASHBOARDDATA.forEach(element => {
            //             this.deviceValForUnbilled.push({ name: element.DATEDESC, value: element.INCGST })
            //         });
            //         this.UnbilledTotal = (res.DATA.DASHBOARDTOTALS.INCGST).toFixed(2);
            //         // this.behaviorService.totalDashboard({UnbilledTotal:(res.DASHBOARDTOTALS.EXGST).toFixed(2)});
            //         AnalyticsDashboardDb.widgets.widget2.devices = this.deviceValForUnbilled;
            //         this.widgets = AnalyticsDashboardDb.widgets;
            //         resolve(this.widgets);
               

            //     }
            // }, reject);
            // this._mainAPiServiceService.getSetData({ Dashboard: 'invoices',StartDate:MonthStartDate,EndDate:MonthEndDate }, 'GetDashboard').subscribe(res => {
            //     console.log(res);
            //     if (res.CODE == 200 && res.STATUS == "success") {
            //         this.TotalInvoice=res.DATA.DASHBOARDTOTALS.INCGST;
            //         res.DATA.DASHBOARDDATA.forEach(element => {
            //             element.DATEDESC
            //             let MonthWiseDate = element.DATEDESC.split("/");
            //             var monthNum = MonthWiseDate[1];   // assuming Jan = 1
            //             var shortName = moment.monthsShort(monthNum - 1); 
            //             this.getMonthNum.push(shortName);
            //             this.InvoiceInGst.push(element.INCGST);
                        
            //         });
            //         let widget11= {
            //             chartType:"bar",
            //             colors:[{backgroundColor: "#ff0000",
            //             borderColor: "#42a5f5"}],
            //             conversion:{
            //                 value:res.DATA.DASHBOARDTOTALS.INCGST
            //             },
            //             datasets:[
            //                 this.InvoiceInGst,
            //                 {label:'TotalInvoiced'}
            //             ],
            //             labels:this.getMonthNum,
            //             options:{
            //                 layout:{
            //                     padding:{
            //                         bottom: 16,
            //                         left: 16,
            //                         right: 16,
            //                         top: 24
            //                     }
            //                 },
            //                 legend:{display:false},
            //                 maintainAspectRatio:false,

            //             },
            //             scales:{
            //                 xAxes:[{display:true}],
            //                 yAxes:[{display:true ,ticks:{
            //                     max:500,
            //                     min:100
            //                 }},
            //                 ]
            //             }
                    
            //         }
            //         console.log(widget11);
            //         this.widgets
            //         console.log(AnalyticsDashboardDb.widgets);    
            //     }
            // }, reject);
            // this._mainAPiServiceService.getSetData({ Dashboard: 'expenses',StartDate:MonthStartDate,EndDate: MonthEndDate }, 'GetDashboard').subscribe(res => {
            //     console.log(res);
            //     if (res.CODE == 200 && res.STATUS == "success") {

            //     }
            // }, reject);
            // this._mainAPiServiceService.getSetData({ Dashboard: 'receipts',StartDate:MonthStartDate,EndDate: MonthEndDate }, 'GetDashboard').subscribe(res => {
            //     console.log(res);
            //     if (res.CODE == 200 && res.STATUS == "success") {

            //     }
            // }, reject);

        });
    }

}
