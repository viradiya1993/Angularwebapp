import { Component, OnDestroy, OnInit, ViewEncapsulation, Output, EventEmitter, Injectable, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
    horizontalNavbar: boolean; isTabShow: number = 0; rightNavbar: boolean; hiddenNavbar: boolean; navigation: any; selectedLanguage: any; selectedIndex: number;
    currentUser: any; confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    //timer setting
    timerId: any;
    TotalTimer: number = 0;
    prevMatterArray: any[] = [];
    timerInterval: any;
    currentTimer: any = 0;
    currentTimerHMS: any;
    ReportListObj: any[] = []
    getContactData: any;


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
        public _getContact: ContactService,
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
        this._fuseConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe((settings) => {
            this.horizontalNavbar = settings.layout.navbar.position === 'top';
            this.rightNavbar = settings.layout.navbar.position === 'right';
            this.hiddenNavbar = settings.layout.navbar.hidden === true;
        });
        //Report Listing


        this.reportlistService.allreportlist({}).subscribe(res => {
            if (res.Report_List_response.Respose != "error - not logged in") {
                res.Report_List_response.DataSet.forEach(element => {
                    if (!this.ReportListObj[element.REPORTGROUP]) {
                        let temp = [];
                        temp.push(element);
                        this.ReportListObj[element.REPORTGROUP] = temp;
                    } else {
                        let demo = this.ReportListObj[element.REPORTGROUP];
                        demo.push(element);
                        this.ReportListObj[element.REPORTGROUP] = demo;
                    }
                });
            }
        }, err => {
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
            clearTimeout(this.timerInterval);
            timerObj.forEach(items => {
                this.prevMatterArray.push({ 'matter_id': items.matter_id, 'time': this.secondsToHms(items.time), 'isStart': items.isStart });
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
    secondsToHms(d) {
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
        console.log(matterId);
        this.addNewTimeEntry(matterId);
    }
    //*----**************************************time enrt add start***************************************
    public addNewTimeEntry(Data: any) {
        const dialogRef = this.dialog.open(TimeEntryDialogComponent, { width: '50%', disableClose: true });
        dialogRef.afterClosed().subscribe(result => {
            console.log(`addNewTimeEntry result: ${result}`);

        });
    }
    //*----**************************************time enrt add end***************************************
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


    //client details from matter
    ClientDetailsDialog() {
        let getMatterContactGuId = JSON.parse(localStorage.getItem('set_active_matters'));
        // let getMatterContactGuId= localStorage.getItem('set_active_matters');
        let getmatguid = getMatterContactGuId.CONTACTGUID;

        //    this._getContact.getContact(getmatguid).subscribe(res => {
        //     this.getContactData = res.CONTACT.DATASET[0];
        //     console.log(this.getContactData);
        //     const dialogRef = this.dialog.open(ContactDialogComponent, {

        //         data: {
        //             contact: this.getContactData,-   
        //             action: 'edit'
        //         }
        //     });
        //     dialogRef.afterClosed().subscribe(result => {


        //         console.log(result);

        //     });
        // });
        // console.log(this.getmatguid);
    }

    //edit Contact diloage
    EditContactsDialog() {

        //get value from localstrorage
        let getContactGuId = localStorage.getItem('contactGuid');
        this._getContact.getContact(getContactGuId).subscribe(res => {
            this.getContactData = res.CONTACT.DATASET[0];
            console.log(this.getContactData);
            const dialogRef = this.dialog.open(ContactDialogComponent, {

                data: {
                    contact: this.getContactData,
                    action: 'edit'
                }
            });
            dialogRef.afterClosed().subscribe(result => {


                console.log(result);

            });
        });


        //const dialogRef = this.dialog.open(ContactDialogComponent, this.getContactData);
        //    console.log(this.getContactData);
        //         const dialogRef = this.dialog.open(ContactDialogComponent,{

        //             data      : {
        //                 contact:this.getContactData,
        //                 action : 'edit'
        //             }
        //         });
        //         dialogRef.afterClosed().subscribe(result => {


        //             console.log(result);

        //         });
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
    Reportpopup(ReportData) {
        console.log(ReportData);
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

            let getContactGuId = localStorage.getItem('contactGuid');
            let abc = {
                CONTACTGUID: getContactGuId,
                FormAction: "delete"
            }

            this._getContact.deleteContact(abc);
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
        localStorage.removeItem('contactGuid');
    }
    navBarSetting(value: any) {
        let x = value.split("/");
        // console.log(x[1]);
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
