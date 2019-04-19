import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DiaryDataService } from '../../../_services';

@Injectable()
export class DiaryService implements Resolve<any>
{
    events: any;
    onEventsUpdated: Subject<any>;
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * 
     */
    constructor(
        private _httpClient: HttpClient, 
        private toastr: ToastrService,
        private DiaryData: DiaryDataService      
    ) {
        // Set the defaults
        this.onEventsUpdated = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

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
                this.getEvents()
            ]).then(
                ([events]: [any]) => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get events
     *
     * @returns {Promise<any>}
     */
    getEvents(): Promise<any> {
        return new Promise((resolve, reject) => { 
            let tempEvent:any[]=[]; 
            this.DiaryData.DiaryData().subscribe(res => {  
                if(res.CODE==200 && res.STATUS=="success"){
                    res.DATA.APPOINTMENTS.forEach(itemsdata => {
                    tempEvent.push({start: dateformat(changeformat(itemsdata.DATE)+' '+itemsdata.TIME),title:itemsdata.SUBJECT,allDay: false});
                    });   
                    this.events = tempEvent;
                    this.onEventsUpdated.next(this.events);
                    resolve(this.events); 
                }
             },
             err => {
               this.toastr.error(err);
               
             }, reject);   
        });
    }
}
//Format Change
function changeformat(dates){
    var d = dates;  
    var datess = d.split("/").reverse().join("/");    
    var year=datess.substring(0,4);
    var month=datess.substring(5,7)
    var day=datess.substring(8,10)
    return month+'/'+day+'/'+year;
  }
//Iso Type Convert
function dateformat(d){
    let date=new Date(d);  
    return date.toISOString()
}
