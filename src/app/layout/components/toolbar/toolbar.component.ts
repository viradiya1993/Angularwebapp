import { Component, OnDestroy, OnInit, ViewEncapsulation, Output, EventEmitter, Injectable, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import * as $ from 'jquery';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { navigation } from 'app/navigation/navigation';
import { AuthenticationService, ReportlistService, TimersService } from '../../../_services';
import { Router } from '@angular/router';
import { ContactDialogComponent } from './../../../main/pages/contact/contact-dialog/contact-dialog.component';
import { LicenceAgreementComponent } from '../../../main/licence-agreement/licence-agreement.component';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ContactCorresDetailsComponent } from 'app/main/pages/contact/contact-corres-details/contact-corres-details.component';
import { ContactService } from '../../../_services';
import { ReportsComponent } from 'app/main/reports/reports.component';
import { ToastrService } from 'ngx-toastr';
import { TimeEntriesComponent } from 'app/main/pages/time-entries/time-entries.component';
import { TimeEntryDialogComponent } from 'app/main/pages/time-entries/time-entry-dialog/time-entry-dialog.component';


@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
@Injectable()
export class ToolbarComponent implements OnInit, OnDestroy {
    @ViewChild(TimeEntriesComponent) TimeEntrieschild: TimeEntriesComponent;
    horizontalNavbar: boolean; isTabShow: number = 1; rightNavbar: boolean; hiddenNavbar: boolean; navigation: any; selectedLanguage: any; selectedIndex: number;
    currentUser: any; confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    //timer setting
    timerId: any;
    TotalTimer: number = 0;
    prevMatterArray: any[] = [];
    timerInterval: any;
    currentTimer: any = 0;
    currentTimerHMS: any;
    ReportListObj: any[] = [];
    getContactData: any;
    detailwidth: any;
    activeSubMenu: any = '';
    greenTheme: any = false;



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
        private toastr: ToastrService,
        public _getContact: ContactService, private TimersServiceI: TimersService,
    ) {
        this.navigation = navigation;
        if (localStorage.getItem('theme_type') == "theme-yellow-light")
            this.greenTheme = true;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.router.events.subscribe((res) => {
            this.navBarSetting(this.router.url);
        });
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (this.currentUser) {
            this.timerId = 'timer_' + this.currentUser.UserGuid;
        }
        //Report Listing
        this.reportlistService.allreportlist({}).subscribe(res => {
            if (res.CODE == 200 && res.STATUS == 'success') {
                res.DATA.REPORTS.forEach(element => {
                    if (!this.ReportListObj[element.REPORTGROUP]) {
                        let temp = [];
                        temp.push(element);
                        this.ReportListObj[element.REPORTGROUP] = temp;
                    } else {
                        let demo = this.ReportListObj[element.REPORTGROUP]
                        demo.push(element);
                        this.ReportListObj[element.REPORTGROUP] = demo;
                    }
                });
                let demoTemp = this.ReportListObj;
                let tem: any = [];
                for (let i in demoTemp) {
                    tem[i] = chunks(demoTemp[i]);
                }
                this.ReportListObj = tem;
            }
        }, err => {
            this.toastr.error(err);
        });
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
        this._fuseConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe((settings) => {
            this.horizontalNavbar = settings.layout.navbar.position === 'top';
            this.rightNavbar = settings.layout.navbar.position === 'right';
            this.hiddenNavbar = settings.layout.navbar.hidden === true;
        });
    }

    // ngAfterViewChecked() {
    ngAfterViewInit() {
        const wph = $(window).width();
        this.detailwidth = wph - 280 - 180 + 'px';
    }

    //for binding

    /* ---------------------------------------------------------------------------start of timer add-------------------------------------------------------------------------  */
    toggleSidebarOpen(key) {
        this.updateTimerCounter();
        this.displayMattterList();
        /*Keep open timer box once timer added*/
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }
    addTimerForMatter() {
        this.TimersServiceI.addTimeEnrtS();
    }

    displayMattterList() {
        this.prevMatterArray = [];
        if (localStorage.getItem(this.timerId)) {
            let timerObj = JSON.parse(localStorage.getItem(this.timerId));
            clearTimeout(this.timerInterval);
            timerObj.forEach(items => {
                this.prevMatterArray.push({ 'matter_id': items.matter_id, 'matterguid': items.matterguid, 'time': this.secondsToHms(items.time), 'isStart': items.isStart });
                if (localStorage.getItem('start_' + items.matter_id) && items.isStart) {
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
    secondsToHms(d: any) {
        d = Number(d);
        var hours = Math.floor(d / 3600) < 10 ? ("00" + Math.floor(d / 3600)).slice(-2) : Math.floor(d / 3600);
        var minutes = ("00" + Math.floor((d % 3600) / 60)).slice(-2);
        var seconds = ("00" + (d % 3600) % 60).slice(-2);
        return hours + ":" + minutes + ":" + seconds;
    }
    stopMatterBack(matterId: any) {
        clearTimeout(this.timerInterval);
        let tempArray: any[] = []
        let timerObj = JSON.parse(localStorage.getItem(this.timerId));
        timerObj.forEach(items => {
            if (items.matter_id === matterId) {
                items.isStart = false;
                items.time = this.currentTimer;
                tempArray.push(items);
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
        clearTimeout(this.timerInterval);
        this.currentTimer = 0;
        let tempArray: any[] = []
        let timerObj = JSON.parse(localStorage.getItem(this.timerId));
        timerObj.forEach(items => {
            if (items.isStart) {
                items.isStart = false;
                items.time = localStorage.getItem('start_' + items.matter_id);
                tempArray.push(items);
                localStorage.removeItem('start_' + items.matter_id);
            } else if (items.matter_id === matterId) {
                this.currentTimerHMS = this.secondsToHms(items.time);
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
    endMatterBack(matterId: any) {
        let AllTimer = JSON.parse(localStorage.getItem(this.timerId));
        let matterDataTime;
        for (var i = AllTimer.length - 1; i >= 0; --i) {
            if (AllTimer[i].matterguid == matterId) {
                if (localStorage.getItem('start_' + AllTimer[i].matter_id)) {
                    clearTimeout(this.timerInterval);
                    matterDataTime = this.secondsToHms(localStorage.getItem('start_' + AllTimer[i].matter_id));
                    localStorage.removeItem('start_' + AllTimer[i].matter_id);
                    this.currentTimer = 0;
                } else {
                    matterDataTime = this.secondsToHms(AllTimer[i].time);
                }
                AllTimer.splice(i, 1);
            }
        }
        localStorage.setItem(this.timerId, JSON.stringify(AllTimer));
        $('#sidebar_open_button').click();
        this.addNewTimeEntry(matterId, matterDataTime);

    }
    addNewTimeEntryNew() {
        let matterData = JSON.parse(localStorage.getItem('set_active_matters'));
        if (matterData.ACTIVE) {
            this.addNewTimeEntry(matterData.MATTERGUID, '');
        } else {
            this.toastr.error("You cannot time entry for Inactive matter. Please select active matter and try again.");
            return false;
        }

    }
    //*----**************************************time enrt add start***************************************
    public addNewTimeEntry(Data: any, matterData: any) {
        const dialogRef = this.dialog.open(TimeEntryDialogComponent, { width: '50%', disableClose: true, data: { 'edit': Data, 'matterData': matterData } });
        dialogRef.afterClosed().subscribe(result => { });
    }
    //*----**************************************time enrt add end***************************************
    /* ---------------------------------------------------------------------end of timer add--------------------------------------------------------------------------  */
    // for new contact dialog
    AddContactsDialog() {
        const dialogRef = this.dialog.open(ContactDialogComponent, {
            disableClose: true,
            panelClass: 'contact-dialog',
            data: {
                action: 'new'
            }
        });
        dialogRef.afterClosed().subscribe(result => { });
    }
    /* ---------------------------------------------------------------------help Licence start--------------------------------------------------------------------------  */
    openLicence(Data) {
        let w = Data == 'LI' ? '50%' : '25%';
        const dialogRef = this.dialog.open(LicenceAgreementComponent, {
            disableClose: true,
            width: w,
            data: { action: Data }
        });
        dialogRef.afterClosed().subscribe(result => { });
    }
    /* ---------------------------------------------------------------------help Licence end--------------------------------------------------------------------------  */


    //client details from matter
    ClientDetailsDialog() {
        let getMatterContactGuId = JSON.parse(localStorage.getItem('set_active_matters'));
        if (getMatterContactGuId.CONTACTGUID == "") {
            this.toastr.error('CONTACTGUID not available');
        } else {
            localStorage.setItem('contactGuid', getMatterContactGuId.CONTACTGUID);
            const dialogRef = this.dialog.open(ContactDialogComponent, { disableClose: true, data: { action: 'edit' } });
            dialogRef.afterClosed().subscribe(result => { });
        }
    }

    //edit Contact diloage
    EditContactsDialog() {
        if (!localStorage.getItem('contactGuid')) {
            this.toastr.error("Please Select Contact");
        } else {
            const dialogRef = this.dialog.open(ContactDialogComponent, { disableClose: true, data: { action: 'edit' } });
            dialogRef.afterClosed().subscribe(result => { });
        }

    }

    openCorresDialog() {
        let getMatterGuId = JSON.parse(localStorage.getItem('set_active_matters'));
        let getmatguid = getMatterGuId.MATTERGUID;
        const dialogRef = this.dialog.open(ContactCorresDetailsComponent, {
            disableClose: true,
            width: '50%',
            data: getmatguid,
        });
        dialogRef.afterClosed().subscribe(result => { });
    }


    //Reportpopup open
    Reportpopup(ReportData) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '40%';
        const dialogRef = this.dialog.open(ReportsComponent, {
            width: '40%',
            data: ReportData,
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe(result => { });
    }

    deleteContact(): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                let getContactGuId = localStorage.getItem('contactGuid');
                let postData = { FormAction: "delete", CONTACTGUID: getContactGuId }
                this._getContact.AddContactData(postData).subscribe(res => {
                    if (res.STATUS == "success") {
                        this.toastr.success(res.STATUS);
                    } else {
                        this.toastr.error("You Can't Delete Contact Which One Is To Related to Matters");
                    }
                });;
            }
            this.confirmDialogRef = null;
        });
    }
    deleteTimeEntry(): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                let WORKITEMGUID = localStorage.getItem('edit_WORKITEMGUID');
                let postData = { FormAction: "delete", WorkItemGuid: WORKITEMGUID }
                this.TimersServiceI.SetWorkItems(postData).subscribe(res => {
                    if (res.STATUS == "success" && res.CODE == 200) {
                        this.toastr.success('Delete successfully');
                    }
                });;
            }
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
        if (x[2]) {
            this.activeSubMenu = x[2];
        }
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
            this.isTabShow = 1;
        }

    }
    setTab(event: any) {
        this.selectedIndex = 0;
        setTimeout(() => {
            this.selectedIndex = undefined;
        }, 500);
    }

}
//2 pair Data Convert
function chunks(arr, size = 2) {
    return arr.map((x, i) => i % size == 0 && arr.slice(i, i + size)).filter(x => x);
}