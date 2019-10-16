import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { startOfDay, isSameDay, isSameMonth } from 'date-fns';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarWeekViewBeforeRenderEvent, CalendarEventAction } from 'angular-calendar';
import { fuseAnimations } from '@fuse/animations';
import { DiaryService } from './diary.service';
import { DiaryEventModel } from './event.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { BehaviorService, MainAPiServiceService } from 'app/_services';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DairyDailogComponent } from './dairy-dailog/dairy-dailog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-diary',
    templateUrl: './diary.component.html',
    styleUrls: ['./diary.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DiaryComponent implements OnInit {

    activeDayIsOpen: boolean;
    dialogRef: any;
    actions: CalendarEventAction[];
    events: CalendarEvent[];
    refresh: Subject<any> = new Subject();
    selectedDay: any;
    theme_type = localStorage.getItem('theme_type');
    selectedColore = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    view: string;
    TimeScale: string;
    viewDate: Date;
    segmentIsValid: any;
    DairyData: any;

    constructor(
        private _calendarService: DiaryService,
        private route: ActivatedRoute,
        private _httpClient: HttpClient,
        private behaviorService: BehaviorService,
        private _matDialog: MatDialog,
        private toastr: ToastrService,
        private _mainAPiServiceService:MainAPiServiceService
    ) {
        this.behaviorService.calanderViewType$.subscribe(result => {
            if (result) {
                this.view = result;
            }
        });
        this.behaviorService.TimeScale$.subscribe(result => {
            if (result) {
                this.TimeScale = result;
            }
        });
        // Set the defaults        
        this.viewDate = new Date();
        this.activeDayIsOpen = true;
        this.selectedDay = { date: startOfDay(new Date()) };
        /**
         * Get events from service/server
         */
      

        this.actions = [
            {
                label  : '<i class="material-icons s-16">edit</i>',
                onClick: ({event}: { event: CalendarEvent }): void => {
                    this.editEvent('edit', event);
                }
            },
            {
                label  : '<i class="material-icons s-16">delete</i>',
                onClick: ({event}: { event: CalendarEvent }): void => {
                    this.deleteEvent(event);
                }
            }
        ];
        this.setEvents();
        this.refresh.next();
        
    }
    ngOnInit(): void {
        $('content').addClass('inner-scroll');
        this.refresh.subscribe(updateDB => {
            if ( updateDB )
            {
                this._calendarService.getEvents();
            }
        });

        this._calendarService.onEventsUpdated.subscribe(events => {
            this.setEvents();
            this.refresh.next();
        });
        // console.log(this.tConvert('18:00:00')) ;
    }

      
     
    /**
       * Set events
       */
    setEvents(): void {
        this.events = this._calendarService.events.map(item => {
            item.actions = this.actions;
            return new DiaryEventModel(item);
        });
    }
    editEvent(action: string, event: CalendarEvent): void
    {
        this.selectedColore = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
        this.behaviorService.forDiaryRefersh(event);
        // console.log(this.events)
    //  const eventIndex = this.events.indexOf(event);

        this.dialogRef = this._matDialog.open(DairyDailogComponent, {
            panelClass: 'event-form-dialog',
            data      : {
                event : event,
                AppoitmentGuId:event.DairyRowClickData,
                action: action
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    this.refresh.next(true);
                }
      
            });
    }
    deleteEvent(event): void
    {
        this.behaviorService.forDiaryRefersh(event);
        this.behaviorService.forDiaryRefersh$.subscribe(result => {    
            this.DairyData=result;
                });
                this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
                    disableClose: true,
                    width: '100%',
                });
                this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
                this.confirmDialogRef.afterClosed().subscribe(result => { 
                    if (result) {
                        let postData = { FormAction: "delete", data: { APPOINTMENTGUID: this.DairyData.DairyRowClickData } }
                        this._mainAPiServiceService.getSetData(postData, 'SetAppointment').subscribe(res => {
                            if (res.STATUS == "success") {
                                this.behaviorService.forDiaryRefersh2("call");
                                // $('#refreshLegalChronology').click();
                                this.toastr.success(res.STATUS);
                                this.refresh.next(true);
                            } else {
                                // this.toastr.error("You Can't Delete Contact Which One Is To Related to Matters");
                            }
                        });;
                    }
                    this.confirmDialogRef = null;
                });
        ///////
    }

    /**
     * Before View Renderer
     *
     * @param {any} header
     * @param {any} body
     */
    beforeMonthViewRender({ header, body }): void {
        const _selectedDay = body.find((_day) => {
            return _day.date.getTime() === this.selectedDay.date.getTime();
        });
        if (_selectedDay) {
            _selectedDay.cssClass = 'cal-selected';
        }
    }
    beforeDayViewRender({ header, body }): void {
        let currentHours = new Date().getHours();
        body.hourGrid.forEach(day => {
            day['segments'].forEach(segment => {
                if (segment.date.getHours() == currentHours) {
                    let classdata = localStorage.getItem('theme_type') == "theme-yellow-light" ? 'green' : 'blue';
                    segment.cssClass = 'cal-day-segment-highlight-' + classdata;
                }
            });
        });
    }
    /**
     * Day clicked
     *
     * @param {MonthViewDay} day
     */
    dayClicked(day: CalendarMonthViewDay): void {
        const date: Date = day.date;
        const events: CalendarEvent[] = day.events;

        if (isSameMonth(date, this.viewDate)) {
            if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
                this.activeDayIsOpen = false;
            }
            else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
        this.selectedDay = day;
        this.refresh.next();
    }
    /**
     * Event times changed
     * Event dropped or resized
     *
     * @param {CalendarEvent} event
     * @param {Date} newStart
     * @param {Date} newEnd
     */
    eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        // console.warn('Dropped or resized', event);
        this.refresh.next(true);
    }
}