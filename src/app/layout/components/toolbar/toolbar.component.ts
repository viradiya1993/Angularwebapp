import { Component, OnDestroy, OnInit, ViewEncapsulation, Output, EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { navigation } from 'app/navigation/navigation';
import { AuthenticationService, ReportlistService } from '../../../_services';
import { Router } from '@angular/router';
import { ContactDialogComponent } from './../../../main/pages/contact/contact-dialog/contact-dialog.component';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ContactCorresDetailsComponent } from 'app/main/pages/contact/contact-corres-details/contact-corres-details.component';
import { TimeEntryDialogComponent } from 'app/main/pages/time-entries/time-entry-dialog/time-entry-dialog.component';
import { ReportsComponent } from 'app/main/reports/reports.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
@Injectable()
export class ToolbarComponent implements OnInit, OnDestroy {
    horizontalNavbar: boolean; isTabShow: number = 0; rightNavbar: boolean; hiddenNavbar: boolean; navigation: any; selectedLanguage: any; selectedIndex: number;
    currentUser: any; confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    //timer setting
    timerId: any;
    TotalTimer: number = 0;
    prevMatterArray: any[] = [];
    timerInterval: any;
    currentTimer: any = 0;
    currentTimerHMS: any;


    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private authenticationService: AuthenticationService,
        private router: Router,
        public dialog: MatDialog,
        public _matDialog: MatDialog,
        private reportlistService: ReportlistService,
        private toastr: ToastrService
    ) {
        this.navigation = navigation;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.router.events.subscribe((res) => {
            this.navBarSetting(this.router.url);
        });
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (this.currentUser)
            this.timerId = 'timer_' + this.currentUser.UserGuid;
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    ngOnInit(): void {
        this.updateTimerCounter();
        this.displayMattterList();
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });
        //Report Listing

        let ReportListName = [];
        this.reportlistService.allreportlist().subscribe(res => {
            if (res.Report_List_response.response != "error - not logged in") {
                res.Report_List_response.DataSet.forEach(element => {
                    if (!ReportListName[element.REPORTGROUP]) {
                        ReportListName.push(element.REPORTGROUP);
                    }
                    // ReportListName[element.REPORTGROUP].push(element);
                });
                console.log(ReportListName);
            } else {
                this.toastr.error(res.EstimateItem.response);
            }
        },
            err => {
                this.toastr.error(err);
            });
    }

    //for binding

    /* ---------------------------------------------------------------------------start of timer add-------------------------------------------------------------------------  */
    toggleSidebarOpen(key) {
        this.updateTimerCounter();
        this.displayMattterList();
        /*Keep open timer box once timer added*/
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    displayMattterList() {
        this.prevMatterArray = [];
        if (localStorage.getItem(this.timerId)) {
            let timerObj = JSON.parse(localStorage.getItem(this.timerId));
            timerObj.forEach(items => {
                this.prevMatterArray.push({ 'matter_id': items.matter_id, 'time': this.secondsToHms(items.time), 'isStart': items.isStart });
                if (localStorage.getItem('start_' + items.matter_id) && items.isStart) {
                    this.stopTimer();
                    this.currentTimer = localStorage.getItem('start_' + items.matter_id);
                    this.startTimer(items.matter_id);
                }
            });
        }
    }
    updateTimerCounter() {
        this.prevMatterArray = JSON.parse(localStorage.getItem(this.timerId));
        if (this.prevMatterArray)
            this.TotalTimer = this.prevMatterArray.length;
    }

    /*convert Secound to HMS*/
    secondsToHms(d) {
        d = Number(d);
        var hours = Math.floor(d / 3600) < 10 ? ("00" + Math.floor(d / 3600)).slice(-2) : Math.floor(d / 3600);
        var minutes = ("00" + Math.floor((d % 3600) / 60)).slice(-2);
        var seconds = ("00" + (d % 3600) % 60).slice(-2);
        return hours + ":" + minutes + ":" + seconds;
    }
    stopMatterBack(matterId: any) {
        let tempArray: any[] = []
        let timerObj = JSON.parse(localStorage.getItem(this.timerId));
        timerObj.forEach(items => {
            if (items.matter_id === matterId) {
                items.isStart = false;
                items.time = this.currentTimer;
                tempArray.push(items);
                this.stopTimer();
                localStorage.removeItem('start_' + items.matter_id);
            } else {
                tempArray.push(items);
            }
        });
        this.currentTimer = 0;
        localStorage.setItem(this.timerId, JSON.stringify(tempArray));
        this.prevMatterArray = tempArray;
        this.displayMattterList();
    }
    startMatterBack(matterId: any) {
        let tempArray: any[] = []
        let timerObj = JSON.parse(localStorage.getItem(this.timerId));
        timerObj.forEach(items => {
            if (items.isStart) {
                items.isStart = false;
                items.time = this.currentTimer;
                tempArray.push(items);
                localStorage.removeItem('start_' + items.matter_id);
                this.stopTimer();
            } else if (items.matter_id === matterId) {
                this.currentTimer = 0;
                items.isStart = true;
                tempArray.push(items);
                localStorage.setItem('start_' + items.matter_id, items.time);
                this.currentTimer = items.time;
                this.startTimer(items.matter_id);
            } else {
                tempArray.push(items);
            }
        });
        localStorage.setItem(this.timerId, JSON.stringify(tempArray));
        this.prevMatterArray = tempArray;
        this.displayMattterList();
    }
    startTimer(matterId: any) {
        if (localStorage.getItem('start_' + matterId)) {
            this.timerInterval = setInterval(() => {
                this.currentTimer++;
                this.currentTimerHMS = this.secondsToHms(this.currentTimer);
                localStorage.setItem('start_' + matterId, this.currentTimer);
            }, 1000);
        }
    }
    stopTimer() {
        clearTimeout(this.timerInterval);
    }

    /* ---------------------------------------------------------------------end of timer add--------------------------------------------------------------------------  */
    // for new contact dialog
    AddContactsDialog() {
        const dialogRef = this.dialog.open(ContactDialogComponent, {

            panelClass: 'contact-dialog',
            data: {
                action: 'new'
            }
        });
        dialogRef.afterClosed().subscribe(result => {


            console.log(result);

            console.log(`Dialog result: ${result}`);
        });
    }

    //edit Contact
    EditContactsDialog() {

        const dialogRef = this.dialog.open(ContactDialogComponent, {

            panelClass: 'contact-dialog',
            data: {
                action: 'edit'
            }
        });
        dialogRef.afterClosed().subscribe(result => {


            console.log(result);

        });

    }

    //time entry dialog
    addNewTimeEntry() {
        const dialogRef = this.dialog.open(TimeEntryDialogComponent, {
            width: '50%'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);

        });
    }
    // for new Corres Details dialog
    openCorresDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '50%';
        const dialogRef = this.dialog.open(ContactCorresDetailsComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);

        });
    }


    //Reportpopup open
    Reportpopup() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '40%';
        const dialogRef = this.dialog.open(ReportsComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            //console.log(`ReportsComponent result: ${result}`);
        });
    }

    deleteContact(contact): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });


        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            this.confirmDialogRef = null;
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    logOutUser() {
        this.authenticationService.logout();
    }
    navBarSetting(value: any) {
        let x = value.split("/");
        if (x[1] == "matters" || x[1] == "") {
            this.isTabShow = 1;
        } else if (x[1] == "contact") {
            this.isTabShow = 2;
        } else if (x[1] == "time-billing") {
            this.isTabShow = 3;
        } else if (x[1] == "legal-details") {
            this.isTabShow = 4;
        } else if (x[1] == "diary" || x[1] == 'diary?calander=day' || x[1] == 'diary?calander=week' || x[1] == 'diary?calander=month') {
            this.isTabShow = 5;
        } else if (x[1] == "time-entries") {
            this.isTabShow = 6;
        } else {
            this.isTabShow = 0;
        }

    }
    setTab(event: any) {
        this.selectedIndex = 0;
        setTimeout(() => {
            this.selectedIndex = undefined;
        }, 500);
    }

}
