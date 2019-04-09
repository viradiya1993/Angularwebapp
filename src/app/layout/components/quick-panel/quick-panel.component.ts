import { Component, OnDestroy, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'quick-panel',
    templateUrl: './quick-panel.component.html',
    styleUrls: ['./quick-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QuickPanelComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any>;
    @Input() eventsData: any;
    @Input() currentTimerHMS: any;
    @Output() StopMatterId: EventEmitter<any> = new EventEmitter<any>();
    @Output() EndMatterId: EventEmitter<any> = new EventEmitter<any>();
    @Output() StartMatterId: EventEmitter<any> = new EventEmitter<any>();
    constructor() {
        this._unsubscribeAll = new Subject();
    }


    ngOnInit(): void {
        this.eventsData.push({ 'matter_id': 'demo', 'time': 0, 'isStart': true });
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    startTimer(MatterId: any) {
        this.StartMatterId.emit(MatterId);
    }

    stopTimer(MatterId: any) {
        this.StopMatterId.emit(MatterId);
    }
    endTimer(MatterId: any) {
        this.EndMatterId.emit(MatterId);
    }
}
