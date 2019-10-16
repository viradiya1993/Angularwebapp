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
import { BehaviorService } from 'app/_services';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DairyDailogComponent } from './dairy-dailog/dairy-dailog.component';

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
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    view: string;
    TimeScale: string;
    viewDate: Date;
    segmentIsValid: any;

    constructor(
        private _calendarService: DiaryService,
        private route: ActivatedRoute,
        private _httpClient: HttpClient,
        private behaviorService: BehaviorService,
        private _matDialog: MatDialog,
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
                label: '<i class="material-icons s-16">edit</i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                    this.editEvent('edit', event);
                }
            },
            {
                label: '<i class="material-icons s-16">delete</i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                    this.deleteEvent(event);
                }
            }
        ];
        this.setEvents();

    }
    ngOnInit(): void {
        $('content').addClass('inner-scroll');
    }
    /**
       * Set events
       */
    setEvents(): void {
        this.events = this._calendarService.events.map(item => {
            return new DiaryEventModel(item);
        });
    }
    editEvent(action: string, event: CalendarEvent): void {
        const eventIndex = this.events.indexOf(event);

        this.dialogRef = this._matDialog.open(DairyDailogComponent, {
            panelClass: 'event-form-dialog',
            data: {
                event: event,
                action: action
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch (actionType) {
                    /**
                     * Save
                     */
                    case 'save':

                        this.events[eventIndex] = Object.assign(this.events[eventIndex], formData.getRawValue());
                        this.refresh.next(true);

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteEvent(event);

                        break;
                }
            });
    }
    deleteEvent(event): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                const eventIndex = this.events.indexOf(event);
                this.events.splice(eventIndex, 1);
                this.refresh.next(true);
            }
            this.confirmDialogRef = null;
        });

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