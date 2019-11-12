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
    AmountUnBilled: any=[];
  
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
             console.log(this.widgets);
             this.AgedDebtorsArray=[];
           
            this._mainAPiServiceService.getSetData({Dashboard:'aged debtors',STARTDATE:'11/11/2010', ENDDATE:'11/11/2019'}, 'GetDashboard').subscribe(res => {
                console.log(res);
                if (res.CODE == 200 && res.STATUS == "success") {
                    this.AgedDebtorsArray=res.DATA.DASHBOARDDATA;
                    AnalyticsDashboardDb.widgets.widget7.devices[0].name=this.AgedDebtorsArray[0].DATEDESC;
                    AnalyticsDashboardDb.widgets.widget7.devices[1].name=this.AgedDebtorsArray[1].DATEDESC;
                    AnalyticsDashboardDb.widgets.widget7.devices[2].name=this.AgedDebtorsArray[2].DATEDESC;

                    AnalyticsDashboardDb.widgets.widget7.devices[0].value=this.AgedDebtorsArray[0].EXGST;
                    AnalyticsDashboardDb.widgets.widget7.devices[1].value=this.AgedDebtorsArray[1].EXGST;
                    AnalyticsDashboardDb.widgets.widget7.devices[2].value=this.AgedDebtorsArray[2].EXGST;
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
                        //this.itemVal.push({name:element.DATEDESC,value:element.EXGST})
                            this.AmountUnBilled.push(element.EXGST)
                        });
                       let FinalAmountUnBilled:any = Number(this.AmountUnBilled.reduce(function (a = 0, b = 0) { return a + b; }, 0));
                        this.behaviorService.totalDashboard((FinalAmountUnBilled).toFixed(2));
                    res.DATA.DASHBOARDDATA.forEach(element => {
                    this.itemVal.push({name:element.DATEDESC,value:Number(((element.EXGST).toFixed(2)*100/(FinalAmountUnBilled).toFixed(2)).toFixed(2))})
                    //this.itemVal.push({name:element.DATEDESC,value:element.EXGST})
                    });
                   
                    // AnalyticsDashboardDb.widgets.widget2.mainChart[0].value =0;
                    // AnalyticsDashboardDb.widgets.widget2.mainChart[1].value=this.UnbilledWIPArray[1].EXGST;
                    // AnalyticsDashboardDb.widgets.widget2.mainChart[2].value=this.UnbilledWIPArray[2].EXGST;
                    // AnalyticsDashboardDb.widgets.widget2.mainChart[3].value=this.UnbilledWIPArray[3].EXGST;
                    
                    // AnalyticsDashboardDb.widgets.widget2.mainChart[0].name=this.UnbilledWIPArray[0].DATEDESC;
                    // AnalyticsDashboardDb.widgets.widget2.mainChart[1].name=this.UnbilledWIPArray[1].DATEDESC;
                    // AnalyticsDashboardDb.widgets.widget2.mainChart[2].name=this.UnbilledWIPArray[2].DATEDESC;
                    // AnalyticsDashboardDb.widgets.widget2.mainChart[3].name=this.UnbilledWIPArray[3].DATEDESC;
                    AnalyticsDashboardDb.widgets.widget2.mainChart=this.itemVal;
                    // AnalyticsDashboardDb.widgets.widget2.conversion.value=((FinalAmountUnBilled).toFixed(2)).toString();
                    // AnalyticsDashboardDb.widgets.widget2.datasets.push({label:'hello', data:[1,2,3,4,5,,6,7,8,9,10,11,12,]})
                    // AnalyticsDashboardDb.widgets.widget2.datasets.forEach(element => {
                    //    element. 
                    // });
                    if(this.itemVal){
                        this.widgets = AnalyticsDashboardDb.widgets;
                        resolve(this.widgets);
                    }
                   
                }
               
            },reject);
      
        });
    }
    
}
