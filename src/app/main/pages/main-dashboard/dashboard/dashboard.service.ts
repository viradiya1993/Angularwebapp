import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
// import { AnalyticsDashboardDb } from './dashboard-analytics';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import { AnalyticsDashboardDb } from './dashboard-analytics';

@Injectable()
export class DashboardService implements Resolve<any>
{
    AgedDebtorsArray: any;
    itemVal:any=[];
    UnbilledWIPArray: any;
    deviceValForAged:any=[];
    AmountUnBilled: any=[];
    deviceValForUnbilled:any=[];
  
    createDb(): any
    {
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
        private behaviorService:BehaviorService
    )
    {
       this.createDb(); 
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
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

    /**
     * Get widgets
     *
     * @returns {Promise<any>}
     */
    getWidgets(): Promise<any>
    {
        return new Promise((resolve, reject) => {          
             this.AgedDebtorsArray=[];
             this.deviceValForAged=[];
            this._mainAPiServiceService.getSetData({Dashboard:'aged debtors'}, 'GetDashboard').subscribe(res => {
                console.log(res);
                if (res.CODE == 200 && res.STATUS == "success") {
                    this.AgedDebtorsArray=res.DATA.DASHBOARDDATA;
                    res.DATA.DASHBOARDDATA.forEach(element => {
                        this.deviceValForAged.push({name:element.DATEDESC,value:element.EXGST})
                    });
                    AnalyticsDashboardDb.widgets.widget7.devices=this.deviceValForAged
                    // AnalyticsDashboardDb.widgets.widget7.devices[0].name=this.AgedDebtorsArray[0].DATEDESC;
                    // AnalyticsDashboardDb.widgets.widget7.devices[1].name=this.AgedDebtorsArray[1].DATEDESC;
                    // AnalyticsDashboardDb.widgets.widget7.devices[2].name=this.AgedDebtorsArray[2].DATEDESC;

                    // AnalyticsDashboardDb.widgets.widget7.devices[0].value=this.AgedDebtorsArray[0].EXGST;
                    // AnalyticsDashboardDb.widgets.widget7.devices[1].value=this.AgedDebtorsArray[1].EXGST;
                    // AnalyticsDashboardDb.widgets.widget7.devices[2].value=this.AgedDebtorsArray[2].EXGST;
                    //   this.widgets = AnalyticsDashboardDb.widgets;
                    //     resolve(this.widgets);
                }
              
            },reject);
            this._mainAPiServiceService.getSetData({Dashboard:'unbilled WIP'}, 'GetDashboard').subscribe(res => {
                console.log(res);
                this.itemVal=[];
                this.AmountUnBilled=[];
                if (res.CODE == 200 && res.STATUS == "success") {
                    this.UnbilledWIPArray=res.DATA.DASHBOARDDATA;
                    res.DATA.DASHBOARDDATA.forEach(element => {
                        this.deviceValForUnbilled.push({name:element.DATEDESC,value:element.EXGST})
                    });
                    AnalyticsDashboardDb.widgets.widget2.devices=this.deviceValForUnbilled
                    // res.DATA.DASHBOARDDATA.forEach(element => {
                    //         this.AmountUnBilled.push(element.EXGST)
                    //     });
                    //    let FinalAmountUnBilled:any = Number(this.AmountUnBilled.reduce(function (a = 0, b = 0) { return a + b; }, 0));
                    //     this.behaviorService.totalDashboard((FinalAmountUnBilled).toFixed(2));
                    // res.DATA.DASHBOARDDATA.forEach(element => {
                    // this.itemVal.push({name:element.DATEDESC,value:Number(((element.EXGST).toFixed(2)*100/(FinalAmountUnBilled).toFixed(2)).toFixed(2))})
                  
                    // });;
                    this.widgets = AnalyticsDashboardDb.widgets;
                    resolve(this.widgets);
                    // if(this.itemVal){
                    //     this.widgets = AnalyticsDashboardDb.widgets;
                    //     resolve(this.widgets);
                    // }
                   
                }
               
            },reject);
      
        });
    }
    
}
