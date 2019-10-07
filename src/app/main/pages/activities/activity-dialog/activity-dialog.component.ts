import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MainAPiServiceService } from 'app/_services';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatterDialogComponent } from '../../time-entries/matter-dialog/matter-dialog.component';
import { TimersService, BehaviorService } from '../../../../_services';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { round } from 'lodash';
@Component({
  selector: 'app-activity-dialog',
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.scss']
})
export class ActivityDialogComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  activityForm: FormGroup;
  isLoadingResults: boolean = false;
  isreadonly: boolean = false;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;
  RATEPERUNIT: any;
  successMsg: any;
  ActivityModel: Date;
  errorWarningData: any = {};
  ITEMDATEVLAUE: any;
  timeStops: any = [];
  userList: any;
  LookupsList: any;
  lookuptype: any;
  PRICEINCGSTVAL: any;
  PRICEVAL: any;
  calculateData: any = {
    MatterGuid: '', QuantityType: '', Quantity: '', FeeEarner: ''
  };

  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<ActivityDialogComponent>,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _mainAPiServiceService: MainAPiServiceService,
    public datepipe: DatePipe,
    private Timersservice: TimersService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    //console.log(data);
    this.lookuptype = data.popupname;
    this.action = data.popupData.action;

  }

  ngOnInit() {
    this.timeStops = this.getTimeStops('00:00', '23:30');
    let maaterguid = JSON.parse(localStorage.getItem('set_active_matters'));
    this.activityForm = this._formBuilder.group({
      matterautoVal: [''],
      MATTERGUID: ['', Validators.required],
      ITEMDATE: ['', Validators.required],
      ITEMTIME: [''],
      FEEEARNER: [''],
      QUANTITY: [''],
      ITEMTYPE: [''],
      QUANTITYTYPE: [],
      PRICE: [''],
      PRICEINCGST: [''],
      ADDITIONALTEXTSELECT: [''],
      ADDITIONALTEXT: ['', Validators.required],
      COMMENT: [''],
      INVOICEDATE: [this.datepipe.transform(new Date(), 'dd/MM/yyyy')],
    });
    this.activityForm.controls['matterautoVal'].setValue(maaterguid.MATTER);
    this.calculateData.MatterGuid = maaterguid.MATTERGUID;
    this.activityForm.controls['MATTERGUID'].setValue(maaterguid.MATTERGUID);
    this.ActivityModel = new Date();
    this.activityForm.controls['QUANTITY'].setValue(0);
    let userType = JSON.parse(localStorage.getItem('currentUser'));
    if (userType) {
      this.activityForm.controls['FEEEARNER'].setValue(userType.UserId);
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
    this.Timersservice.GetLookupsData({ LookupType: this.lookuptype }).subscribe(res => {
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
    if (this.lookuptype === 'Activity') {
      this.dialogTitle = 'New Activity';
      this.activityForm.controls['ITEMTYPE'].setValue(1);
    } else if (this.lookuptype === 'Sundry') {
      this.dialogTitle = 'New Sundry';
      this.activityForm.controls['ITEMTYPE'].setValue(2);
    } else {
      this.dialogTitle = 'New Activity';
      this.activityForm.controls['ITEMTYPE'].setValue(1);
    }

  }
  RatePerUnitVal() {
    this.RATEPERUNIT = parseFloat(this.f.RATEPERUNIT.value).toFixed(2);
  }
  get f() {
    return this.activityForm.controls;
  }
  public selectMatter() {
    const dialogRef = this.MatDialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.activityForm.controls['MATTERGUID'].setValue(result.MATTERGUID);
        this.activityForm.controls['matterautoVal'].setValue(result.SHORTNAME + ' : ' + result.MATTER);
      }
    });
  }
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.ITEMDATEVLAUE = this.datepipe.transform(event.value, 'dd/MM/yyyy');
  }
  getTimeStops(start, end) {
    var startTime = moment(start, 'hh:mm');
    var endTime = moment(end, 'hh:mm');
    if (endTime.isBefore(startTime)) {
      endTime.add(1, 'day');
    }
    var timeStops = [];
    while (startTime <= endTime) {
      timeStops.push(moment(startTime).format('hh:mm A'));
      startTime.add(30, 'minutes');
    }
    return timeStops;
  }
  matterChange(key: any, event: any) {
    if (key == "FeeEarner") {
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
    if (this.calculateData.Quantity != '' && this.calculateData.QuantityType != '') {
      this.isLoadingResults = true;
      this.Timersservice.calculateWorkItems(this.calculateData).subscribe(response => {
        if (response.CODE == 200 && response.STATUS == "success") {
          let CalcWorkItemCharge = response.DATA;
          this.activityForm.controls['PRICE'].setValue(CalcWorkItemCharge.PRICE);
          this.activityForm.controls['PRICEINCGST'].setValue(CalcWorkItemCharge.PRICEINCGST);
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
  LookupsChange(value: any) {
    this.activityForm.controls['ADDITIONALTEXT'].setValue(value);
  }
  calcPE() {
    this.PRICEINCGSTVAL = round(this.f.PRICE.value * 1.1).toFixed(2);
  }
  calcPI() {
    this.PRICEVAL = round(this.f.PRICEINCGST.value / 1.1).toFixed(2);
  }
  saveActivity() {
    if (this.ITEMDATEVLAUE == "" || this.ITEMDATEVLAUE == null || this.ITEMDATEVLAUE == undefined) {
      this.ITEMDATEVLAUE = this.f.INVOICEDATE.value;
    }
    this.isspiner = true;
    let PostData: any = {
      MATTERGUID: this.f.MATTERGUID.value,
      ITEMDATE: this.ITEMDATEVLAUE,
      ITEMTIME: this.f.ITEMTIME.value,
      FEEEARNER: this.f.FEEEARNER.value,
      QUANTITY: this.f.QUANTITY.value,
      ITEMTYPE: this.f.ITEMTYPE.value,
      PRICE: this.f.PRICE.value,
      PRICEINCGST: this.f.PRICEINCGST.value,
      ADDITIONALTEXT: this.f.ADDITIONALTEXT.value,
      COMMENT: this.f.COMMENT.value,
    }
    this.successMsg = 'Save successfully';
    let PostActivityData: any = { FormAction: "insert", VALIDATEONLY: true, Data: PostData };
    this._mainAPiServiceService.getSetData(PostActivityData, 'SetWorkItems').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.checkValidation(res.DATA.VALIDATIONS, PostActivityData);
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.checkValidation(res.DATA.VALIDATIONS, PostActivityData);
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.checkValidation(res.DATA.VALIDATIONS, PostActivityData);
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
  checkValidation(bodyData: any, PostActivityData: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'No') {
        errorData.push(value.ERRORDESCRIPTION);
        tempError[value.FIELDNAME] = value;
      } else if (value.VALUEVALID == 'Warning') {
        tempWarning[value.FIELDNAME] = value;
        warningData.push(value.ERRORDESCRIPTION);
      }
    });
    this.errorWarningData = { "Error": tempError, 'warning': tempWarning };
    if (Object.keys(errorData).length != 0) {
      this.toastr.error(errorData);
      this.isspiner = false;
    } else if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef = this.MatDialog.open(FuseConfirmDialogComponent, {
        disableClose: true, width: '100%', data: warningData
      });
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.saveActivityData(PostActivityData);
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.saveActivityData(PostActivityData);
      this.isspiner = false;
    }
  }
  saveActivityData(PostActivityData: any) {
    PostActivityData.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(PostActivityData, 'SetWorkItems').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.toastr.success(this.successMsg);
        this.dialogRef.close(true);
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.toastr.warning(this.successMsg);
        this.isspiner = false;
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.toastr.error(res.STATUS);
        this.isspiner = false;
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }

}
