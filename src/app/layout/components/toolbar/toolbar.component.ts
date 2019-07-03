import { Component, OnDestroy, OnInit, ViewEncapsulation, Injectable, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import * as $ from 'jquery';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Location } from '@angular/common';
import { navigation } from 'app/navigation/navigation';
import { AuthenticationService, ReportlistService, UsersService, TimersService, SpendmoneyService, ContactService, MattersService, MatterInvoicesService, GetReceptData } from '../../../_services';
import { Router } from '@angular/router';
import { ContactDialogComponent } from './../../../main/pages/contact/contact-dialog/contact-dialog.component';
import { LicenceAgreementComponent } from '../../../main/licence-agreement/licence-agreement.component';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ContactCorresDetailsComponent } from 'app/main/pages/contact/contact-corres-details/contact-corres-details.component';
import { ReportsComponent } from 'app/main/reports/reports.component';
import { ToastrService } from 'ngx-toastr';
import { TimeEntriesComponent } from 'app/main/pages/time-entries/time-entries.component';
import { TimeEntryDialogComponent } from 'app/main/pages/time-entries/time-entry-dialog/time-entry-dialog.component';
import { MatterPopupComponent } from 'app/main/pages/matters/matter-popup/matter-popup.component';
import { MatterDialogComponent } from 'app/main/pages/time-entries/matter-dialog/matter-dialog.component';
import { ReceiptDilogComponent } from 'app/main/pages/invoice/receipt-dilog/receipt-dilog.component';
import { InvoiceDetailComponent } from 'app/main/pages/invoice/invoice-detail/invoice-detail.component';
import { SpendMoneyAddComponent } from 'app/main/pages/spend-money/spend-money-add-dialog/spend-money-add.component';
import { GeneralReceiptDilogComponent } from 'app/main/pages/receive-money/general-receipt-dilog/general-receipt-dilog.component';
import { InstantInvoiceDailogComponent } from 'app/main/pages/invoice/instant-invoice-dailog/instant-invoice-dailog.component';
import { InvoiceAddDailogComponent } from 'app/main/pages/invoice/invoice-add-dailog/invoice-add-dailog.component';
import { MatterDialogComponentForTemplate } from 'app/main/pages/template/matter-dialog/matter-dialog.component';
import { MatterReceiptDialogComponentForTemplate } from 'app/main/pages/receive-money/matter-dialog/matter-dialog.component';

import { UserDialogComponent } from './../../../main/pages/users/user-dialog/user-dialog.component';
import { ActivityDialogComponent } from './../../../main/pages/activities/activity-dialog/activity-dialog.component';
import { ChangePasswordComponent } from 'app/main/change-password/change-password.component';
import { NewfilenoteComponent } from './../../../main/pages/newfilenote/newfilenote.component';
import { DocumentDailogComponent } from './../../../main/pages/document-register/document-dailog/document-dailog.component';
import { EmailDailogComponent } from './../../../main/pages/template/email-templete/email-dailog/email-dailog.component';
import { PacksDailogComponent } from './../../../main/pages/template/packs/packs-dailog/packs-dailog.component';


@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
@Injectable()
export class ToolbarComponent implements OnInit, OnDestroy {
    appPermissions: any = JSON.parse(localStorage.getItem('app_permissions'));
    @ViewChild(TimeEntriesComponent) TimeEntrieschild: TimeEntriesComponent;
    horizontalNavbar: boolean; isTabShow: number = 1; rightNavbar: boolean; hiddenNavbar: boolean; navigation: any; selectedLanguage: any; selectedIndex: number;
    currentUser: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
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
    isInvoice: any;
    greenTheme: any = false;
    CreatDocumentChild: any;




    // Private
    private _unsubscribeAll: Subject<any>;
    activedocument: any;
    clickedBtn: string;
    hideShowDoc: string;
    isDocumentGenerateHide: string;
    templateRoter: string;
    spendMoneyMenu: string;


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
        private TimersServiceI: TimersService,
        private _mattersService: MattersService,
        private _usersService: UsersService,
        private matterInvoicesService: MatterInvoicesService,
        private _router: Router,
        private SpendmoneyService: SpendmoneyService,
        private _getReceptData: GetReceptData,
        private location: Location
    ) {
        if (this.appPermissions == null) {
            this.appPermissions = [];
        }
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

        //addedby web19
        let val = localStorage.getItem('handelGenerateDoc');
        if (val == 'Folder') {
            this.hideShowDoc = 'yes';
        } else {
            this.hideShowDoc = 'no';
        }
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
        this.detailwidth = wph - 280 - 5 + 'px';

        if ($(window).width() >= 992 && $(window).width() < 1280) {

            const wph = $(window).width();
            this.detailwidth = wph - 65 + 'px';

            const nvh = 56;
            $('.mat-tab-header').css({ 'width': wph - nvh - 280 + 'px' });
        } else if ($(window).width() <= 991) {

            const wph = $(window).width();
            this.detailwidth = wph - 65 + 'px';

            const nvh = 56;
            $('.mat-tab-header').css({ 'width': wph - nvh - 160 + 'px' });
        }

        $(window).resize(function () {

            if ($(window).width() >= 992 && $(window).width() < 1280) {

                const wph = $(window).width();
                this.detailwidth = wph - 65 + 'px';

                const nvh = 56;
                $('.mat-tab-header').css({ 'width': wph - nvh - 280 + 'px' });
            } else if ($(window).width() <= 991) {

                const wph = $(window).width();
                this.detailwidth = wph - 65 + 'px';

                const nvh = 56;
                $('.mat-tab-header').css({ 'width': wph - nvh - 160 + 'px' });
            }
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
        const dialogRef = this.dialog.open(TimeEntryDialogComponent, { width: '100%', disableClose: true, data: { 'edit': Data, 'matterData': matterData } });
        dialogRef.afterClosed().subscribe(result => {
            if (result)
                $('#refreshTimeEntryTab').click();
        });
    }
    //*----**************************************time enrt add end***************************************
    /* ---------------------------------------------------------------------end of timer add--------------------------------------------------------------------------  */
    // for new contact dialog
    AddContactsDialog() {
        const dialogRef = this.dialog.open(ContactDialogComponent, {
            disableClose: true,
            panelClass: 'contact-dialog',
            data: {
                action: 'new',
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result)
                $('#refreshContactTab').click();
        });
    }


    /* ---------------------------------------------------------------------help Licence start--------------------------------------------------------------------------  */
    openLicence(Data) {
        let w = Data == 'LI' ? '50%' : '25%';
        const dialogRef = this.dialog.open(LicenceAgreementComponent, {
            disableClose: true,
            //width: w,
            data: { action: Data }
        });
        dialogRef.afterClosed().subscribe(result => { });
    }
    /* ---------------------------------------------------------------------help Licence end--------------------------------------------------------------------------  */


    //client details from matter
    ClientDetailsDialog() {
        let getMatterContactGuId = JSON.parse(localStorage.getItem('set_active_matters'));
        if (getMatterContactGuId.COMPANYCONTACTGUID == "") {
            this.toastr.error('CONTACTGUID not available');
        } else {
            localStorage.setItem('contactGuid', getMatterContactGuId.COMPANYCONTACTGUID);
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
            dialogRef.afterClosed().subscribe(result => {
                if (result)
                    $('#refreshContactTab').click();
            });
        }

    }


    openCorresDialog() {
        let getMatterGuId = JSON.parse(localStorage.getItem('set_active_matters'));
        let getmatguid = getMatterGuId.MATTERGUID;
        const dialogRef = this.dialog.open(ContactCorresDetailsComponent, {
            disableClose: true,
            width: '100%',
            data: getmatguid,
        });
        dialogRef.afterClosed().subscribe(result => { });
    }

    //Reportpopup open
    Reportpopup(ReportData) {
        let type: number;
        if (ReportData.REPORTGROUP == 'Management')
            type = 27;
        else if (ReportData.REPORTGROUP == 'Accounts')
            type = 26;
        else if (ReportData.REPORTGROUP == 'Trust')
            type = 25;
        // if (this.appPermissions[type][ReportData.REPORTNAME]) {
        const dialogRef = this.dialog.open(ReportsComponent, { width: '100%', data: ReportData, disableClose: true });
        dialogRef.afterClosed().subscribe(result => { });
        // } else {
        //     this.toastr.error('Access Denied');
        // }
    }
    // New matter Pop-up
    AddNewmatterpopup() {
        const dialogConfig = new MatDialogConfig();
        const dialogRef = this.dialog.open(MatterPopupComponent, {
            width: '100%',
            disableClose: true,
            data: {
                action: 'new'
            }
        });

        dialogRef.afterClosed().subscribe(result => { });
    }
    // Edit matter Pop-up
    EditNewmatterpopup() {
        const dialogConfig = new MatDialogConfig();
        let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
        const dialogRef = this.dialog.open(MatterPopupComponent, {
            width: '100%',
            disableClose: true,
            data: { action: 'edit', 'matterGuid': mattersData.MATTERGUID }
        });
        dialogRef.afterClosed().subscribe(result => { });
    }
    // Delete matter Pop-up
    DeleteNewmatterpopup(): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: true,
            width: '100%',
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                let MatterData: any = JSON.parse(localStorage.getItem('set_active_matters'));
                let postData = { FormAction: "delete", data: { MATTERGUID: MatterData.MATTERGUID } }
                this._mattersService.AddNewMatter(postData).subscribe(res => {
                    if (res.STATUS == "success" && res.CODE == 200) {
                        $('#refreshMatterTab').click();
                        this.toastr.success('Delete successfully');
                    }
                });
            }
            this.confirmDialogRef = null;
        });
    }

    // Add Spend Money Pop-up
    Addspendmoneypopup() {
        const dialogConfig = new MatDialogConfig();
        const dialogRef = this.dialog.open(SpendMoneyAddComponent, {
            width: '100%',
            disableClose: true,
            data: {
                action: 'new'
            }
        });
        dialogRef.afterClosed().subscribe(result => { });
    }
    // Edit spendmoney Pop-up
    Editspendmoneypopup() {
        let SendMoney_data = JSON.parse(localStorage.getItem('spendMoney_data'));
        if (SendMoney_data == null) {
            this.toastr.error("No Data Selected");
        } else {
            const dialogConfig = new MatDialogConfig();
            const dialogRef = this.dialog.open(SpendMoneyAddComponent, {
                width: '100%',
                disableClose: true,
                data: {
                    action: 'edit'
                }
            });
            dialogRef.afterClosed().subscribe(result => { });
        }

    }

    // Delete matter Pop-up
    Deletespendmoneypopup(): void {
        let SendMoney_data = JSON.parse(localStorage.getItem('spendMoney_data'));
        if (SendMoney_data == null) {
            this.toastr.error("No Data Selected");
        } else {
            this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
                disableClose: true,
                width: '100%',
            });
            this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
            this.confirmDialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let postData = { FormAction: "delete", DATA: { EXPENDITUREGUID: SendMoney_data.EXPENDITUREGUID } }
                    this.SpendmoneyService.setSpendmonyData(postData).subscribe(res => {
                        if (res.STATUS == "success" && res.CODE == 200) {
                            $('#refreshTimeEntryTab').click();
                            this.toastr.success('Delete successfully');
                        }
                    });
                }
                this.confirmDialogRef = null;
            });
        }

    }


    deleteContact(): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: true,
            width: '100%',
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                let getContactGuId = localStorage.getItem('contactGuid');
                let postData = { FormAction: "delete", data: { CONTACTGUID: getContactGuId } }
                this._getContact.AddContactData(postData).subscribe(res => {
                    if (res.STATUS == "success") {
                        $('#refreshContactTab').click();
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
            disableClose: true,
            width: '100%',
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                let WORKITEMGUID = localStorage.getItem('edit_WORKITEMGUID');
                let postData = { FormAction: "delete", data: { WorkItemGuid: WORKITEMGUID } }
                this.TimersServiceI.SetWorkItems(postData).subscribe(res => {
                    if (res.STATUS == "success" && res.CODE == 200) {
                        $('#refreshTimeEntryTab').click();
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

    /* User Module Function's */

    // Add User Dialog
    AddNewUser() {
        const dialogRef = this.dialog.open(UserDialogComponent, {
            disableClose: true,
            panelClass: 'User-dialog',
            data: { action: 'new' }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }

    //EditUserDialog
    EditUserDialog() {
        const dialogRef = this.dialog.open(UserDialogComponent, {
            disableClose: true,
            panelClass: 'User-dialog',
            data: {
                action: 'edit',
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }

    //DeleteUser
    DeleteUser(): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: true,
            width: '100%',
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }

    //DuplicateUserDialog

    DuplicateUserDialog() {
        const dialogRef = this.dialog.open(UserDialogComponent, {
            disableClose: true,
            panelClass: 'User-dialog',
            data: {
                action: 'Duplicate',
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }

    /* Activity Module Function's */

    //add edit and duplicat ActivityDialog
    ActivityDialog(actionType) {
        let popupData: any = {};
        if (actionType == "new") {
            popupData = { action: actionType };
        } else if (actionType == "edit" || actionType == "Duplicate") {
            let ActivityData = JSON.parse(localStorage.getItem('current_ActivityData'));
            popupData = { action: actionType, ACTIVITYGUID: ActivityData.ACTIVITYGUID };
        }
        const dialogRef = this.dialog.open(ActivityDialogComponent, {
            disableClose: true, panelClass: 'Activity-dialog', data: popupData
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result)
                $('#refreshActivities').click();
        });
    }

    //DeleteActivity
    DeleteActivityDialog(): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: true,
            width: '100%',
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                let ActivityData = JSON.parse(localStorage.getItem('current_ActivityData'));
                let postData = { FormAction: "delete", data: { ACTIVITYGUID: ActivityData.ACTIVITYGUID } }
                this._usersService.SetActivityData(postData).subscribe(res => {
                    if (res.STATUS == "success" && res.CODE == 200) {
                        $('#refreshActivities').click();
                        this.toastr.success('Delete successfully');
                    }
                });
            }
            this.confirmDialogRef = null;
        });
    }
    /* End Activity Module Function's */

    //Change Password Dialog
    ChangePass() {
        const dialogRef = this.dialog.open(ChangePasswordComponent, { disableClose: true, panelClass: 'change-password' });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }

    //New File Note Dialog
    NewFileNote() {
        const dialogRef = this.dialog.open(NewfilenoteComponent, {

        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }

    /* Document Register Module */

    // New Record Document
    NewDocumnt() {
        const dialogRef = this.dialog.open(DocumentDailogComponent, {
            disableClose: true,
            panelClass: 'Document-dialog',
            data: {
                action: 'new',
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }

    // Edit Record Document
    EditDocument() {
        const dialogRef = this.dialog.open(DocumentDailogComponent, {
            disableClose: true,
            panelClass: 'Document-dialog',
            data: {
                action: 'edit',
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }

    // Delete Record Document
    DeleteDocument(): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: true,
            width: '100%',
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }

    // Duplicate Record Document
    DuplicateDocument() {
        const dialogRef = this.dialog.open(DocumentDailogComponent, {
            disableClose: true,
            panelClass: 'Document-dialog',
            data: {
                action: 'Duplicate',
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }

    //Open Matter Folder
    OpenMatter() {
        console.log('Matter Folder Work!!!');
    }

    //Open Document
    OpenDocument() {
        console.log('Document  Work!!!');
    }

    //Load Document
    LoadDocument() {
        console.log('Load Document Work!!!');
    }

    //PDF Document
    PdfDocument() {
        console.log('Pdf Document work!!!')
    }

    //Pdf Email Document
    PdfEmailDocument() {
        console.log('Pdf Email Document Work!!!');
    }

    /* Email Module */

    //SelectMatter 
    SelectMatter() {
        // alert('ok Work!!!');   
        const dialogRef = this._matDialog.open(MatterReceiptDialogComponentForTemplate, {
            width: '100%',
            disableClose: true,
            data: null
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }
    //New Email
    NewEmailTemplete() {
        const dialogRef = this.dialog.open(EmailDailogComponent, {
            disableClose: true,
            panelClass: 'Email-dialog',
            data: {
                action: 'new',
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }
    //Edit Email
    EditEmailTemplete() {
        const dialogRef = this.dialog.open(EmailDailogComponent, {
            disableClose: true,
            panelClass: 'Email-dialog',
            data: {
                action: 'edit',
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }
    //Copy Email
    CopyEmailTemplete() {
        const dialogRef = this.dialog.open(EmailDailogComponent, {
            disableClose: true,
            panelClass: 'Email-dialog',
            data: {
                action: 'copy',
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }
    //Delete Email
    DeleteEmailTemplete() {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: true,
            width: '100%',
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }

    /* Packs Module */

    // New Pack
    NewPack() {
        console.log('work!!1');
        const dialogRef = this.dialog.open(PacksDailogComponent, {
            disableClose: true,
            panelClass: 'Pack-dialog',
            data: {
                action: 'new',
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }
    //EditPack
    EditPack() {
        console.log('work!!2');
        const dialogRef = this.dialog.open(PacksDailogComponent, {
            disableClose: true,
            panelClass: 'Pack-dialog',
            data: {
                action: 'edit',
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }
    //DeletePack
    DeletePack(): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: true,
            width: '100%',
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    logOutUser() {
        this.authenticationService.logout();
    }

    navBarSetting(value: any) {
        let x = value.split("/");
        this.activeSubMenu = x[2] ? x[2] : '';
        this.isInvoice = x[3] ? x[3] : '';
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
        } else if (x[1] == "invoice") {
            this.isTabShow = 7;
        } else if (x[1] == "spend-money") {
            this.isTabShow = 8;
        } else if (x[1] == "receive-money") {
            this.isTabShow = 9;
        } else if (x[1] == "create-document") {
            this.activedocument = x[1];
            this.isTabShow = 10;
        } else if (x[1] == "system-setting") {
            this.isTabShow = 11;
        } else if (x[1] == "users") {
            this.isTabShow = 12;
        } else if (x[1] == "activities") {
            this.isTabShow = 13;
        } else if (x[1] == "document-register") {
            this.isTabShow = 14;
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

    // ****************************************** START Invoice related funtion like create update delete view*********************************************
    selectMatterInvoice() {
        const dialogRef = this._matDialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                localStorage.setItem('set_active_matters', JSON.stringify(result));
                this.router.navigate(['time-billing/work-in-progress/invoice']);
            }
        });
    }
    //web19
    isInvoiceClick() {
        this.clickedBtn = 'invoiceDoc';
    }
    isMatterClick() {
        this.clickedBtn = 'matterDoc';
    }

    createInstantInvoice() {
        return false;
        const dialogRef = this._matDialog.open(InstantInvoiceDailogComponent, { width: '100%', disableClose: true, data: null });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result);
            }
        });
    }

    createInvoice() {
        const dialogRef = this._matDialog.open(InvoiceAddDailogComponent, { width: '100%', disableClose: true, data: null });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result);
            }
        });
    }

    createReceiptForTimeBilling() {
        const dialogRef = this._matDialog.open(ReceiptDilogComponent, {
            width: '100%', disableClose: true,
            data: { action: 'add' }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                $('#refreshReceiceMoany').click();
            }
        });
    }

    ViewReceiptForTimeBilling() {
        const dialogRef = this._matDialog.open(ReceiptDilogComponent, {
            width: '100%', disableClose: true,
            data: {
                action: 'editForTB'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
            }
        });
    }

    deleteReceiceMoanyForTimeBilling() {

    }

    createReceipt() {
        const dialogRef = this._matDialog.open(MatterReceiptDialogComponentForTemplate, { width: '100%', disableClose: true, data: null });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const dialogRef = this._matDialog.open(ReceiptDilogComponent, {
                    width: '100%', disableClose: true,
                    data: { action: 'add', type: " ", matterData: result }
                });
                dialogRef.afterClosed().subscribe(result => { if (result) { } });
            }
        });
    }

    ViewReceipt() {
        const dialogRef = this._matDialog.open(ReceiptDilogComponent, {
            width: '100%', disableClose: true,
            data: { action: 'edit' }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                localStorage.removeItem('matterName');
            }
        });
    }
    //Invoice Detail for invoice
    InvoiceDetail() {
        const dialogRef = this._matDialog.open(InvoiceDetailComponent, { width: '100%', disableClose: true, data: { 'type': 'edit', INVOICEGUID: localStorage.getItem('edit_invoice_id') } });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result);
            }
        });
    }
    //delete invoice
    deleteInvoice(): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: true,
            width: '100%',
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                let INVOICEGUID = localStorage.getItem('edit_invoice_id');
                let postData = { FormAction: "delete", DATA: { INVOICEGUID: INVOICEGUID } }
                this.matterInvoicesService.SetInvoiceData(postData).subscribe(res => {
                    if (res.STATUS == "success" && res.CODE == 200) {
                        $('#refreshInvoiceTab').click();
                        this.toastr.success('Delete successfully');
                    }
                });
            }
            this.confirmDialogRef = null;
        });
    }
    //delete receicept
    deleteReceiceMoany(): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: true, width: '100%',
        });
        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                let receiptData = JSON.parse(localStorage.getItem('receiptData'));
                let postData = { FormAction: "delete", DATA: { INCOMEGUID: receiptData.INCOMEGUID } };
                this._getReceptData.setReceipt(postData).subscribe(res => {
                    if (res.STATUS == "success" && res.CODE == 200) {
                        $('#refreshReceiceMoany').click();
                        this.toastr.success('Delete successfully');
                    }
                });
            }
            this.confirmDialogRef = null;
        });
    }

    NewGeneralReceipt(): void {
        const dialogRef = this._matDialog.open(GeneralReceiptDilogComponent, { width: '100%', disableClose: true, data: null });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                $('#refreshReceiceMoany').click();
            }
        });
    }

    //hidden button
    clickToolbarbtn() {
        this.isDocumentGenerateHide = "yes";
    }
    clickToolbarbtn2() {
        this.isDocumentGenerateHide = "no";
    }
    // spendmoneyMenubtn(){
    // this.spendMoneyMenu="disabled"; 
    // }
    // ******************************************END Invoice related funtion like create update delete view*********************************************
    //***********************************************************START Select Matter Contact*************************************************************************
    SelectMatterContact() {
        let templateData = JSON.parse(localStorage.getItem('templateData'));
        if (this.router.url == "/create-document/invoice-template") {
            let invoiceGUid = localStorage.getItem('edit_invoice_id');
            let passdata = { 'Context': "Invoice", 'ContextGuid': invoiceGUid, "Type": "Template", "Folder": '', "Template": templateData.TEMPLATENAME }
            this.ForDocDialogOpen(passdata);
        } else if (this.router.url == "/create-document/matter-template") {
            let matterData = JSON.parse(localStorage.getItem('set_active_matters'));
            let passdata = { 'Context': "Matter", 'ContextGuid': matterData.MATTERGUID, "Type": "Template", "Folder": '', "Template": templateData.TEMPLATENAME }
            this.ForDocDialogOpen(passdata);
        } else if (this.router.url == "/create-document/receive-money-template") {
            let ReceiptData = JSON.parse(localStorage.getItem('receiptData'));
            let passdata = { 'Context': "Income", 'ContextGuid': ReceiptData.INCOMEGUID, "Type": "Template", "Folder": '', "Template": templateData.TEMPLATENAME }
            this.ForDocDialogOpen(passdata);
        } else if (this.router.url == "/create-document/contact-template") {
            let ContactGuID = localStorage.getItem('contactGuid');
            let passdata = { 'Context': "Contact", 'ContextGuid': ContactGuID, "Type": "Template", "Folder": '', "Template": templateData.TEMPLATENAME }
            this.ForDocDialogOpen(passdata);
        }
    }
    //***********************************************************END Select Matter Contact*************************************************************************
    ForDocDialogOpen(passdata) {
        const dialogRef = this._matDialog.open(MatterDialogComponentForTemplate, { width: '100%', disableClose: true, data: passdata });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // localStorage.setItem('set_active_matters', JSON.stringify(result));
            }
        });
    }

}

//2 pair Data Convert
function chunks(arr, size = 3) {
    return arr.map((x, i) => i % size == 0 && arr.slice(i, i + size)).filter(x => x);
}



