import { Component, OnInit, Input, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BehaviorService, TimersService } from './../../../../_services';
import * as moment from 'moment';
import { MatDialogRef, MatDatepickerInputEvent, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { round } from 'lodash';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatterDialogComponent } from '../matter-dialog/matter-dialog.component';

@Component({
  selector: 'app-resume-timer',
  templateUrl: './resume-timer.component.html',
  styleUrls: ['./resume-timer.component.scss'],
  animations: fuseAnimations
})
export class ResumeTimerComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  resumeTimerForm: FormGroup;
  timerTime: any;
  errorWarningData: any = {};
  successMsg = 'Time entry update successfully';
  timeStops: any = [];
  isLoadingResults: any = false;
  isspiner: any = false;
  userList: any;
  matterShortName: any;
  ActiveTimerData: any = { SHORTNAME: '', MATTERGUID: '', secound: '', WORKITEMGUID: '' };
  ActivityList: any = [
    { 'ACTIVITYID': 'hh:mm', 'DESCRIPTION': 'hh:mm' },
    { 'ACTIVITYID': 'Hours', 'DESCRIPTION': 'Hours' },
    { 'ACTIVITYID': 'Minutes', 'DESCRIPTION': 'Minutes' },
    { 'ACTIVITYID': 'Days', 'DESCRIPTION': 'Days' },
    { 'ACTIVITYID': 'Units', 'DESCRIPTION': 'Units' },
    { 'ACTIVITYID': 'Fixed', 'DESCRIPTION': 'Fixed' }
  ];
  LookupsList: any = [];
  calculateData: any = { MatterGuid: '', QuantityType: '', Quantity: '', FeeEarner: '', FeeType: '' };
  constructor(public dialogRef: MatDialogRef<ResumeTimerComponent>,
    public MatDialog: MatDialog,
    private behaviorService: BehaviorService,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService, public datepipe: DatePipe,
    private Timersservice: TimersService,
    @Inject(MAT_DIALOG_DATA) public resumeTimerData: any
  ) {
    this.timeStops = this.getTimeStops('01:00', '23:59');
    this.behaviorService.dialogClose$.subscribe(result => {
      if(result != null){
        if(result.MESSAGE == 'Not logged in'){
          this.dialogRef.close(false);
        }
      }
     });
  }

  ngOnInit() {
    this.resumeTimerForm = this._formBuilder.group({
      MATTERGUID: ['', Validators.required],
      matterautoVal: [''],
      INVOICEGUID: [''],
      ITEMTYPE: [''],
      QUANTITYTYPE: ['Hours'],
      ITEMDATE: ['', Validators.required],
      ITEMDATETEXT: [''],
      FEEEARNER: [''],
      QUANTITY: [''],
      PRICE: [''],
      PRICEINCGST: [''],
      ITEMTIME: [''],
      ADDITIONALTEXTSELECT: [''],
      ADDITIONALTEXT: ['', Validators.required],
      COMMENT: [''],
    });
    this.isLoadingResults = true;
    let workerGuid;
    if (this.resumeTimerData.type != 'resume') {
      this.behaviorService.workInProgress$.subscribe(workInProgressData => {
        if (workInProgressData) {
          workerGuid = workInProgressData.WORKITEMGUID;
        } else {
          workerGuid = localStorage.getItem('edit_WORKITEMGUID');
        }
      });
    } else {
      workerGuid = this.resumeTimerData.matterData.WORKITEMGUID;
    }
    this.isLoadingResults = true;
    this.Timersservice.GetUsers({}).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.userList = res.DATA.USERS;
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      } else {
        this.userList = [];
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
    });
    this.isLoadingResults = true;
    this.Timersservice.GetLookupsData({}).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.LookupsList = res.DATA.LOOKUPS;
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      } else {
        this.LookupsList = [];
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
    });
    if (this.resumeTimerData.type !== 'new') {
      this.Timersservice.getTimeEnrtyData({ 'WorkItemGuid': workerGuid }).subscribe(response => {
        if (response.CODE == 200 && response.STATUS == "success") {
          let timeEntryData = response.DATA.WORKITEMS[0];
          let isT: boolean = timeEntryData.QUANTITYTYPE == "hh:mm" || timeEntryData.QUANTITYTYPE == "Hours" || timeEntryData.QUANTITYTYPE == "Minutes";
          if (!isT && timeEntryData.INVOICEGUID == "") {
            this.toastr.error("You can not resume a timer");
            this.dialogRef.close(false);
            return false;
          }
          let QUANTITYTEM: any;
          if (this.resumeTimerData.type == 'resume') {
            this.timerTime = this.resumeTimerData.matterData.time;
            let a = this.timerTime.split(':');
            (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
            if (timeEntryData.QUANTITYTYPE == "Hours") {
              QUANTITYTEM = (+a[0]) + ((+a[1]) / 60) + ((+a[2]) / 3600)
            } else if (timeEntryData.QUANTITYTYPE == 'Minutes') {
              QUANTITYTEM = ((+a[0]) * 60) + ((+a[1])) + '.' + a[2]
            } else {
              QUANTITYTEM = this.timerTime;
            }
          } else if (timeEntryData.QUANTITYTYPE == "Hours") {
            QUANTITYTEM = timeEntryData.QUANTITY;
            this.timerTime = this.secondsToHms(timeEntryData.QUANTITY * 60 * 60);
          } else if (timeEntryData.QUANTITYTYPE == 'Minutes') {
            QUANTITYTEM = timeEntryData.QUANTITY;
            this.timerTime = this.secondsToHms(timeEntryData.QUANTITY * 60);
          } else {
            QUANTITYTEM = timeEntryData.QUANTITY;
            this.timerTime = timeEntryData.QUANTITY + ':00';
          }
          let a = this.timerTime.split(':');
          let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
          this.ActiveTimerData = { SHORTNAME: timeEntryData.SHORTNAME, MATTERGUID: timeEntryData.MATTERGUID, secound: seconds, WORKITEMGUID: timeEntryData.WORKITEMGUID };
          this.matterChange('MatterGuid', response.DATA.WORKITEMS[0].MATTERGUID);
          this.matterShortName = response.DATA.WORKITEMS[0].SHORTNAME;
          localStorage.setItem('edit_WORKITEMGUID', response.DATA.WORKITEMS[0].WORKITEMGUID);
          if (timeEntryData.ITEMTYPE == "2" || timeEntryData.ITEMTYPE == "3") {
            this.resumeTimerForm.controls['QUANTITYTYPE'].setValue(timeEntryData.FEETYPE);
          } else {
            this.resumeTimerForm.controls['QUANTITYTYPE'].setValue(timeEntryData.QUANTITYTYPE);
          }
          this.resumeTimerForm.controls['matterautoVal'].setValue(timeEntryData.SHORTNAME + ' : ');
          this.resumeTimerForm.controls['QUANTITY'].setValue(QUANTITYTEM);
          this.resumeTimerForm.controls['MATTERGUID'].setValue(timeEntryData.MATTERGUID);
          this.resumeTimerForm.controls['ITEMTYPE'].setValue(timeEntryData.ITEMTYPE);
          this.resumeTimerForm.controls['INVOICEGUID'].setValue(timeEntryData.INVOICEGUID);
          let ttyData = moment(timeEntryData.ITEMTIME, 'hh:mm');
          this.resumeTimerForm.controls['ITEMTIME'].setValue(moment(ttyData).format('hh:mm A'));
          this.resumeTimerForm.controls['FEEEARNER'].setValue(timeEntryData.FEEEARNER);
          let tempDate = timeEntryData.ITEMDATE.split("/");
          this.resumeTimerForm.controls['ITEMDATE'].setValue(timeEntryData.ITEMDATE);
          this.resumeTimerForm.controls['ITEMDATETEXT'].setValue(new Date(tempDate[1] + '/' + tempDate[0] + '/' + tempDate[2]));
          this.resumeTimerForm.controls['PRICEINCGST'].setValue(timeEntryData.PRICEINCGST);
          this.resumeTimerForm.controls['PRICE'].setValue(timeEntryData.PRICE);
          this.resumeTimerForm.controls['ADDITIONALTEXT'].setValue(timeEntryData.ADDITIONALTEXT);
          this.resumeTimerForm.controls['ADDITIONALTEXTSELECT'].setValue(timeEntryData.ADDITIONALTEXT);
          this.resumeTimerForm.controls['COMMENT'].setValue(timeEntryData.COMMENT);
          this.matterChange('QuantityType', response.DATA.WORKITEMS[0].QUANTITYTYPE);
        } else if (response.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
        this.isLoadingResults = false;
      }, err => {
        this.isLoadingResults = false;
        this.toastr.error(err);
      });
    } else {
      this.matterShortName = this.resumeTimerData.matterData.SHORTNAME;
      this.resumeTimerForm.controls['matterautoVal'].setValue(this.resumeTimerData.matterData.SHORTNAME + ' : ' + this.resumeTimerData.matterData.MATTER);
      this.resumeTimerForm.controls['MATTERGUID'].setValue(this.resumeTimerData.matterData.MATTERGUID);
      this.timerTime = "00:00:00";
    }
  }
  secondsToHms(d: any) {
    d = Number(d);
    var hours = Math.floor(d / 3600) < 10 ? ("00" + Math.floor(d / 3600)).slice(-2) : Math.floor(d / 3600);
    var minutes = ("00" + Math.floor((d % 3600) / 60)).slice(-2);
    var seconds = ("00" + (d % 3600) % 60).slice(-2);
    return hours + ":" + minutes + ":" + seconds;
  }
  calcPE() {
    this.resumeTimerForm.controls['PRICEINCGST'].setValue(round(this.f.PRICE.value * 1.1).toFixed(2));
  }
  calcPI() {
    this.resumeTimerForm.controls['PRICE'].setValue(round(this.f.PRICEINCGST.value / 1.1).toFixed(2));
  }
  resumeDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.resumeTimerForm.controls['ITEMDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  getTimeStops(start, end) {
    const startTime = moment(start, 'HH:mm');
    const endTime = moment(end, 'HH:mm');
    if (endTime.isBefore(startTime)) {
      endTime.add(1, 'day');
    }
    const timeStops = [];
    while (startTime <= endTime) {
      timeStops.push(moment(startTime).format('HH:mm A'));
      startTime.add(15, 'minutes');
    }
    return timeStops;
  }
  matterChange(key: any, event: any) {
    if (key == "MatterGuid") {
      this.resumeTimerForm.controls['MATTERGUID'].setValue(event);
      this.calculateData.MatterGuid = event;
    } else if (key == "FeeEarner") {
      this.calculateData.FeeEarner = event;
    } else if (key == "QuantityType") {
      switch (event) {
        case 'hh:mm': {
          this.calculateData.QuantityType = 'X';
          break;
        }
        case 'Hours': {
          this.calculateData.QuantityType = 'H';
          break;
        }
        case 'Minutes': {
          this.calculateData.QuantityType = 'M';
          break;
        }
        case 'Days': {
          this.calculateData.QuantityType = 'D';
          break;
        }
        case 'Units': {
          this.calculateData.QuantityType = 'U';
          break;
        }
        case 'Fixed': {
          this.calculateData.QuantityType = 'F';
          break;
        }
        default: {
          this.calculateData.FeeType = event;
          this.calculateData.QuantityType = 'F';
          break;
        }
      }
    }
    this.calculateData.Quantity = this.f.QUANTITY.value;
    if (this.calculateData.MatterGuid != '' && this.calculateData.Quantity != '' && (this.calculateData.QuantityType != '' || this.calculateData.FeeType != '')) {
      this.isLoadingResults = true;
      this.Timersservice.calculateWorkItems(this.calculateData).subscribe(response => {
        if (response.CODE == 200 && response.STATUS == "success") {
          let CalcWorkItemCharge = response.DATA;
          this.resumeTimerForm.controls['PRICE'].setValue(CalcWorkItemCharge.PRICE);
          this.resumeTimerForm.controls['PRICEINCGST'].setValue(CalcWorkItemCharge.PRICEINCGST);
          this.isLoadingResults = false;
        } else if (response.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
      }, err => {
        this.isLoadingResults = false;
        this.toastr.error(err);
      });
    }
  }
  get f() {
    return this.resumeTimerForm.controls;
  }
  LookupsChange(val: any) {
    this.resumeTimerForm.controls['ADDITIONALTEXT'].setValue(val);
  }
  public selectMatter() {
    const dialogRef = this.MatDialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resumeTimerForm.controls['MATTERGUID'].setValue(result.MATTERGUID);
        this.resumeTimerForm.controls['matterautoVal'].setValue(result.SHORTNAME + ' : ' + result.MATTER);
        this.matterChange('MatterGuid', result.MATTERGUID);
      }
    });
  }
  SaveClickTimeEntry() {
    this.isspiner = true;
    let PostData: any = {
      ADDITIONALTEXT: this.f.ADDITIONALTEXT.value,
      COMMENT: this.f.COMMENT.value,
      // INVOICEGUID:this.f.INVOICEGUID.value,
      FEEEARNER: this.f.FEEEARNER.value,
      ITEMTYPE: this.f.ITEMTYPE.value,
      ITEMDATE: this.f.ITEMDATE.value,
      ITEMTIME: this.f.ITEMTIME.value,
      MATTERGUID: this.f.MATTERGUID.value,
      PRICE: this.f.PRICE.value,
      PRICEINCGST: this.f.PRICEINCGST.value,
      QUANTITY: this.f.QUANTITY.value,
      WorkItemGuid: localStorage.getItem('edit_WORKITEMGUID')
    }
    if (this.f.ITEMTYPE.value == "2" || this.f.ITEMTYPE.value == "3") {
      PostData.FEETYPE = this.f.QUANTITYTYPE.value;
      PostData.QUANTITYTYPE = '';
    } else {
      PostData.QUANTITYTYPE = this.f.QUANTITYTYPE.value;
    }
    let formAction = this.resumeTimerData.type == 'new' ? 'insert' : 'update';
    let PostTimeEntryData: any = { FormAction: formAction, VALIDATEONLY: true, Data: PostData };
    this.Timersservice.SetWorkItems(PostTimeEntryData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.checkValidation(res.DATA.VALIDATIONS, PostTimeEntryData);
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.checkValidation(res.DATA.VALIDATIONS, PostTimeEntryData);
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.checkValidation(res.DATA.VALIDATIONS, PostTimeEntryData);
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
  checkValidation(bodyData: any, PostTimeEntryData: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    // errorData
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'NO') {
        errorData.push(value.ERRORDESCRIPTION);
        tempError[value.FIELDNAME] = value;
      } else if (value.VALUEVALID == 'WARNING') {
        tempWarning[value.FIELDNAME] = value;
        warningData.push(value.ERRORDESCRIPTION);
      }
    });
    this.errorWarningData = { "Error": tempError, 'warning': tempWarning };
    if (Object.keys(errorData).length != 0) {
      this.toastr.error(errorData);
      this.isspiner = false;
    } else if (Object.keys(warningData).length != 0) {
      // this.toastr.warning(warningData);
      this.confirmDialogRef = this.MatDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.saveTimeEntry(PostTimeEntryData);
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.saveTimeEntry(PostTimeEntryData);
      this.isspiner = false;
    }
  }
  saveTimeEntry(PostTimeEntryData: any) {
    PostTimeEntryData.VALIDATEONLY = false;
    this.Timersservice.SetWorkItems(PostTimeEntryData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.toastr.success(this.successMsg);
        this.dialogRef.close(true);
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.toastr.warning(res.MESSAGE);
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.toastr.warning(res.MESSAGE);
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
  startTimer() {
    this.Timersservice.addTimeEnrtS(this.ActiveTimerData);
    this.dialogRef.close(false);
  }




}
