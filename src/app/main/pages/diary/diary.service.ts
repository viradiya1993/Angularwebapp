import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {  MainAPiServiceService } from '../../../_services';

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
        private _mainAPiServiceService: MainAPiServiceService,
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
            let tempEvent: any[] = [];
            this._mainAPiServiceService.getSetData({}, 'GetAppointment').subscribe(res => {
                if (res.CODE == 200 && res.STATUS == "success") {
                    res.DATA.APPOINTMENTS.forEach(itemsdata => {
                        tempEvent.push({ start: dateformat(changeformat(itemsdata.DATE) + ' ' + itemsdata.TIME), title: '(' + this.tConvert(itemsdata.TIME) + ') -' + itemsdata.SUBJECT, allDay: false });
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
    tConvert(timeString) {
        let hourEnd: any = timeString.indexOf(":");
        let H: any = +timeString.substr(0, hourEnd);
        let h: any = H % 12 || 12;
        let ampm: any = H < 12 ? "AM" : "PM";
        return h + timeString.substr(hourEnd, 3) + ' ' + ampm;
    };

}
//Format Change
function changeformat(dates) {
    var d = dates;
    var datess = d.split("/").reverse().join("/");
    var year = datess.substring(0, 4);
    var month = datess.substring(5, 7)
    var day = datess.substring(8, 10)
    return month + '/' + day + '/' + year;
}
//Iso Type Convert
function dateformat(d) {
    let date = new Date(d);
    return date.toISOString()
}
