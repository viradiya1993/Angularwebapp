import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { startOfDay, isSameDay, isSameMonth } from 'date-fns';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarWeekViewBeforeRenderEvent } from 'angular-calendar';
import { fuseAnimations } from '@fuse/animations';
import { DiaryService } from './diary.service';
import { DiaryEventModel } from './event.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { BehaviorService } from 'app/_services';

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
    events: CalendarEvent[];
    refresh: Subject<any> = new Subject();
    selectedDay: any;
    view: string;
    TimeScale: string;
    viewDate: Date;
    segmentIsValid: any;

    constructor(
        private _calendarService: DiaryService,
        private route: ActivatedRoute,
        private _httpClient: HttpClient,
        private behaviorService: BehaviorService
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