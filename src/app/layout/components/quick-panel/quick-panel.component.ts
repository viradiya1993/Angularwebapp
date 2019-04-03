import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'quick-panel',
    templateUrl: './quick-panel.component.html',
    styleUrls: ['./quick-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QuickPanelComponent implements OnInit, OnDestroy {
    events: any[] = [
        { 'title': 'Group Meeting', 'detail': '00:00:00' },
        { 'title': 'Public Beta Release', 'detail': '00:00:00' },
        { 'title': 'Dinner with David', 'detail': '00:00:00' },
        
    ];
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _httpClient: HttpClient
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        console.log('her');
        this.events.push({ 'title': 'Q&A Session', 'detail': '00:00:00' });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
