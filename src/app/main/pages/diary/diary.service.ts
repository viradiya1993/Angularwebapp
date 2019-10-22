import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MainAPiServiceService, BehaviorService } from '../../../_services';
import * as $ from 'jquery';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Injectable()
export class DiaryService implements Resolve<any>
{
    events: any;
    
    SendParam: any = {};
    onEventsUpdated: Subject<any>;
    getCalenderDetails: any;
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
        private behaviorService: BehaviorService,
        public datepipe: DatePipe,
    ) {
        // Set the defaults
        this.onEventsUpdated = new Subject();

        this.behaviorService.forDiaryRefersh2$.subscribe(result => {
            this.getEvents();
        });

        this.behaviorService.calanderViewType$.subscribe(result => {
            if (result) {

                this.getCalenderDetails = result;
                this.getEvents();
            }
        });
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
        var curr = new Date; // get current date
        var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6
        
        var firstday = new Date(curr.setDate(first)).toUTCString();
        var lastday = new Date(curr.setDate(last)).toUTCString();
       

        let userData = JSON.parse(localStorage.getItem('currentUser'));
        if (this.getCalenderDetails == 'month') {
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            this.SendParam = {
                USERGUID: userData.UserGuid,
                DATESTART: this.datepipe.transform(firstDay, 'dd/MM/yyyy'),
                DATEEND: this.datepipe.transform(lastDay, 'dd/MM/yyyy')
            }
        } else if (this.getCalenderDetails == 'day') {
            var date = new Date();

            this.SendParam = {
                USERGUID: userData.UserGuid,
                DATESTART: this.datepipe.transform(date, 'dd/MM/yyyy'),
                DATEEND: this.datepipe.transform(date, 'dd/MM/yyyy')
            }
        } else if (this.getCalenderDetails == 'week') {
       
            var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
            var last = first + 6; // last day is the first day + 6
            var firstday = new Date(curr.setDate(first)).toUTCString();
            var lastday = new Date(curr.setDate(last)).toUTCString();

            this.SendParam = {
                USERGUID: userData.UserGuid,
                DATESTART: this.datepipe.transform(new Date(firstday), 'dd/MM/yyyy'),
                DATEEND: this.datepipe.transform(new Date(lastday), 'dd/MM/yyyy')
            }
        }
        return new Promise((resolve, reject) => {
            let tempEvent: any[] = [];
            this._mainAPiServiceService.getSetData(this.SendParam, 'GetAppointment').subscribe(res => {
                if (res.CODE == 200 && res.STATUS == "success") {
                    if ($.isEmptyObject(res.DATA) == true) {
                        tempEvent.push({});
                        this.events = tempEvent;
                        this.onEventsUpdated.next(this.events);
                        resolve(this.events);
                    } else {
                        res.DATA.APPOINTMENTS.forEach(itemsdata => {
                            tempEvent.push({ start: dateformat(changeformat(itemsdata.APPOINTMENTDATE) + ' ' + itemsdata.APPOINTMENTTIME), title: '(' + this.tConvert(itemsdata.APPOINTMENTTIME) + ') -' + itemsdata.SUBJECT, allDay: false, DairyRowClickData: itemsdata.APPOINTMENTGUID, id: "das" });
                        });
                        this.events = tempEvent;
                        this.onEventsUpdated.next(this.events);
                        resolve(this.events);
                    }

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
