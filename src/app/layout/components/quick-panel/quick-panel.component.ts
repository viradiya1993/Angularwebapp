import { Component, OnDestroy, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import * as $ from 'jquery';
import { MatDialogRef, MatDialog } from '@angular/material';
import { TimersService } from 'app/_services';
import { MatterDialogComponent } from 'app/main/pages/time-entries/matter-dialog/matter-dialog.component';

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
    constructor(private TimersServiceI: TimersService, public MatDialog: MatDialog) {
        this._unsubscribeAll = new Subject();

    }


    ngOnInit(): void {
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
    AddTimer() {
        const dialogRef = this.MatDialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: {} });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                localStorage.setItem('set_active_matters', JSON.stringify(result));
                this.TimersServiceI.addTimeEnrtS('');
            }
        });

    }
}
