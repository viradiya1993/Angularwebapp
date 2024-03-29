import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TimersService, BehaviorService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';
import { MatterDialogComponent } from '../matter-dialog/matter-dialog.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import * as moment from 'moment';


@Component({
  selector: 'app-time-entry-dialog',
  templateUrl: './time-entry-dialog.component.html',
  styleUrls: ['./time-entry-dialog.component.scss'],
  providers: [DatePipe]
})
export class TimeEntryDialogComponent implements OnInit, AfterViewInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  timeStops: any = [];
  LookupsList: any;
  errorWarningData: any = {};
  userList: any;
  matterList: any = [];
  isreadonly: boolean = false;
  isspiner: boolean = false;
  isLoadingResults: boolean = false;
  ActivityList: any = [];
  successMsg: any;
  PRICEINCGSTVAL: any;
  isDisable: boolean = false;
  PRICEVAL: any;
  optionList: any = [
    { 'ACTIVITYID': 'hh:mm', 'DESCRIPTION': 'hh:mm' },
    { 'ACTIVITYID': 'Hours', 'DESCRIPTION': 'Hours' },
    { 'ACTIVITYID': 'Minutes', 'DESCRIPTION': 'Minutes' },
    { 'ACTIVITYID': 'Days', 'DESCRIPTION': 'Days' },
    { 'ACTIVITYID': 'Units', 'DESCRIPTION': 'Units' },
    { 'ACTIVITYID': 'Fixed', 'DESCRIPTION': 'Fixed' }
  ];
  ITEMDATEVLAUE: any;
  action: any = 'Add';
  dialogTitle: any = 'Add New Time Entry';
  buttonText: any = 'Save';
  calculateData: any = {
    MatterGuid: '', QuantityType: '', Quantity: '', FeeEarner: '', FeeType: ''
  };
  ITEMDATEModel: Date;
  matterTimerData: any;
  QuantityTypeLabel: any = 'Quantity Type';
  currentTimeMatter: any = '';

  constructor(
    public dialogRef: MatDialogRef<TimeEntryDialogComponent>,
    public MatDialog: MatDialog,
    private Timersservice: TimersService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private behaviorService: BehaviorService,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    if (_data.edit == 'Edit' || _data.edit == 'Add' || _data.edit == "Duplicate") {
      this.isDisable = _data.edit == 'Edit' ? true : false;
      this.action = _data.edit;
      if (this.action === 'Edit') {
        this.dialogTitle = 'Update Time Entry';
      } else if (this.action == 'Duplicate') {
        this.dialogTitle = 'Duplicate Time Entry'
      } else {
        this.dialogTitle = 'Add New Time Entry';
        this.ITEMDATEModel = new Date();
      }
      this.buttonText = _data.edit === 'Edit' ? 'Update' : 'Save';
    } else {
      this.isDisable = false;
      this.currentTimeMatter = _data.edit;
      this.matterTimerData = _data.matterData;
      this.ITEMDATEModel = new Date();
    }
    this.behaviorService.dialogClose$.subscribe(result => {
      if (result != null) {
        if (result.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
      }
    });
  }
  timeEntryForm: FormGroup;
  matterautoVal: any;
  ngOnInit() {
    this.timeStops = this.getTimeStops('00:00', '23:30');
    let maaterguid = JSON.parse(localStorage.getItem('set_active_matters'));
    this.ActivityList = this.optionList;
    this.timeEntryForm = this._formBuilder.group({
      matterautoVal: [''],
      MATTERGUID: ['', Validators.required],
      ITEMTYPE: [''],
      QUANTITYTYPE: ['Hours'],
      ITEMDATE: ['', Validators.required],
      FEEEARNER: [''],
      QUANTITY: [''],
      PRICE: [''],
      PRICEINCGST: [''],
      SendPRICEINCGST: [''],
      SendPRICE: [''],
      ITEMTIME: [''],
      ADDITIONALTEXTSELECT: [''],
      ADDITIONALTEXT: ['', Validators.required],
      COMMENT: [''],
      INVOICEDATE: [this.datepipe.transform(new Date(), 'dd/MM/yyyy')],
    });
    this.timeEntryForm.controls['matterautoVal'].setValue(maaterguid.MATTER);
    this.calculateData.MatterGuid = maaterguid.MATTERGUID;
    this.timeEntryForm.controls['MATTERGUID'].setValue(maaterguid.MATTERGUID);
    this.calculateData.QuantityType = 'H';
   
    this.timeEntryForm.controls['ITEMTYPE'].setValue('wip');
    let userType = JSON.parse(localStorage.getItem('currentUser'));
    if (userType) {
      this.timeEntryForm.controls['FEEEARNER'].setValue(userType.UserId);
    }
    this.timeEntryForm.controls['QUANTITY'].setValue(0);
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
    if (this.action === 'Edit' || this.action == "Duplicate") {
      this.setTimeEntryData();
      this.isreadonly = false;
    } else if (this.currentTimeMatter != '') {
     
      this.isreadonly = true;
      if (this._data.isReadOnly) {
        this.isreadonly = false;
      }
      
      this.timeEntryForm.controls['MATTERGUID'].setValue(this.currentTimeMatter);
      let Qval = this.matterTimerData == '' ? 'Hours' : 'hh:mm';
      this.timeEntryForm.controls['QUANTITYTYPE'].setValue(Qval);
      this.calculateData.QuantityType = Qval == "Hours" ? 'H' : 'X';
      this.timeEntryForm.controls['QUANTITY'].setValue(this.matterTimerData);
      this.timeEntryForm.controls['ITEMTYPE'].setValue('wip');
      this.matterChange('MatterGuid', this.currentTimeMatter);
    }
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
  calcPE() {
    let priceTemp = this.f.PRICE.value;
    if (typeof priceTemp === 'undefined')
      priceTemp = 0;
    this.PRICEVAL = Number(priceTemp).toFixed(2);
    this.timeEntryForm.controls['SendPRICE'].setValue(Number(priceTemp));
    priceTemp = priceTemp * 1.1;
    this.timeEntryForm.controls['SendPRICEINCGST'].setValue(Number(priceTemp));
    this.PRICEINCGSTVAL = priceTemp.toFixed(2);
  }
  calcPI() {
    let temGst = this.f.PRICEINCGST.value;
    if (typeof temGst === 'undefined')
      temGst = 0;
    this.timeEntryForm.controls['SendPRICEINCGST'].setValue(Number(temGst));
    this.PRICEINCGSTVAL = Number(temGst).toFixed(2);
    temGst = temGst / 1.1;
    this.timeEntryForm.controls['SendPRICE'].setValue(Number(temGst));
    this.PRICEVAL = temGst.toFixed(2)

  }
  public selectMatter() {
    const dialogRef = this.MatDialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.timeEntryForm.controls['MATTERGUID'].setValue(result.MATTERGUID);
        this.timeEntryForm.controls['matterautoVal'].setValue(result.SHORTNAME + ' : ' + result.MATTER);
        this.matterChange('MatterGuid', result.MATTERGUID);
      }
    });
  }
  setTimeEntryData() {
    this.isLoadingResults = true;
    let workerGuid;
    this.behaviorService.workInProgress$.subscribe(workInProgressData => {
      if (workInProgressData) {
        workerGuid = workInProgressData.WORKITEMGUID;
      } else {
        workerGuid = localStorage.getItem('edit_WORKITEMGUID');
      }
    });
    this.Timersservice.getTimeEnrtyData({ 'WorkItemGuid': workerGuid }).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        // added by web19 19/06 
        this.matterChange('MatterGuid', response.DATA.WORKITEMS[0].MATTERGUID);
        this.matterChange('QuantityType', response.DATA.WORKITEMS[0].QUANTITYTYPE);
        this.timeEntryForm.controls['matterautoVal'].setValue(response.DATA.WORKITEMS[0].SHORTNAME);
        localStorage.setItem('edit_WORKITEMGUID', response.DATA.WORKITEMS[0].WORKITEMGUID);
        let timeEntryData = response.DATA.WORKITEMS[0];
        this.itemTypeChange(timeEntryData.ITEMTYPE);
        if (timeEntryData.ITEMTYPE == "activity" || timeEntryData.ITEMTYPE == "sundry") {
          this.timeEntryForm.controls['QUANTITYTYPE'].setValue(timeEntryData.FEETYPE);
        } else {
          this.timeEntryForm.controls['QUANTITYTYPE'].setValue(timeEntryData.QUANTITYTYPE);
        }
        this.timeEntryForm.controls['QUANTITY'].setValue(timeEntryData.QUANTITY);
        this.timeEntryForm.controls['MATTERGUID'].setValue(timeEntryData.MATTERGUID);
        this.timeEntryForm.controls['ITEMTYPE'].setValue(timeEntryData.ITEMTYPE);
        let ttyData = moment(timeEntryData.ITEMTIME, 'hh:mm');
        this.timeEntryForm.controls['ITEMTIME'].setValue(moment(ttyData).format('hh:mm A'));
        this.timeEntryForm.controls['FEEEARNER'].setValue(timeEntryData.FEEEARNER);

        let tempDate = timeEntryData.ITEMDATE.split("/");
        this.ITEMDATEModel = new Date(tempDate[1] + '/' + tempDate[0] + '/' + tempDate[2]);
        this.timeEntryForm.controls['INVOICEDATE'].setValue(timeEntryData.ITEMDATE);
        this.timeEntryForm.controls['SendPRICEINCGST'].setValue(timeEntryData.PRICEINCGST);
        this.timeEntryForm.controls['SendPRICE'].setValue(timeEntryData.PRICE);

        this.timeEntryForm.controls['PRICEINCGST'].setValue((Number(timeEntryData.PRICEINCGST)).toFixed(2));
        this.timeEntryForm.controls['PRICE'].setValue((Number(timeEntryData.PRICE)).toFixed(2));
        this.timeEntryForm.controls['ADDITIONALTEXT'].setValue(timeEntryData.ADDITIONALTEXT);
        this.timeEntryForm.controls['ADDITIONALTEXTSELECT'].setValue(timeEntryData.ADDITIONALTEXT);
        this.timeEntryForm.controls['COMMENT'].setValue(timeEntryData.COMMENT);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isLoadingResults = false;
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
  }
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    if(this.action != 'Edit')
    this.ITEMDATEVLAUE = this.datepipe.transform(event.value, 'dd/MM/yyyy');
  }
  ngAfterViewInit(): void {
    $('#time_Control').attr('placeholder', 'Select time');
  }
  matterChange(key: any, event: any) {
    if (this.f.FEEEARNER.value && key != "FeeEarner") {
      this.calculateData.FeeEarner = this.f.FEEEARNER.value;
    }
    if (key == "MatterGuid") {
      this.timeEntryForm.controls['MATTERGUID'].setValue(event);
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
          this.timeEntryForm.controls['PRICE'].setValue(Number(CalcWorkItemCharge.PRICE).toFixed(2));
          this.timeEntryForm.controls['PRICEINCGST'].setValue(Number(CalcWorkItemCharge.PRICEINCGST).toFixed(2));
          this.timeEntryForm.controls['SendPRICE'].setValue(Number(CalcWorkItemCharge.PRICE));
          this.timeEntryForm.controls['SendPRICEINCGST'].setValue(Number(CalcWorkItemCharge.PRICEINCGST));
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
    return this.timeEntryForm.controls;
  }
  itemTypeChange(value: any) {
    this.isLoadingResults = true;
    if (value == 'activity' || value == 'sundry') {
      this.QuantityTypeLabel = value == 'activity' ? 'Activity' : 'Sundry';
      let callType = value == 'activity' ? 'Activity' : 'Sundries';
      this.Timersservice.GetActivity({ "ActivityType": callType }).subscribe(res => {
        if (res.CODE == 200 && res.STATUS == "success") {
          this.ActivityList = res.DATA.ACTIVITIES;
          this.isLoadingResults = false;
        }
      }, err => {
        this.isLoadingResults = false;
        this.toastr.error(err);
      });
      this.timeEntryForm.controls['QUANTITY'].setValue(1);
    } else {
      this.QuantityTypeLabel = 'Quantity Type';
      this.ActivityList = this.optionList;
      this.isLoadingResults = false;
    }
  }
  LookupsChange(value: any) {
    this.timeEntryForm.controls['ADDITIONALTEXT'].setValue(value);
  }
  SaveClickTimeEntry() {
    if (this.ITEMDATEVLAUE == "" || this.ITEMDATEVLAUE == null || this.ITEMDATEVLAUE == undefined) {
      this.ITEMDATEVLAUE = this.f.INVOICEDATE.value;
    }
    this.isspiner = true;
    let PostData: any = {
      "ADDITIONALTEXT": this.f.ADDITIONALTEXT.value,
      "COMMENT": this.f.COMMENT.value,
      "FEEEARNER": this.f.FEEEARNER.value,
      "ITEMTYPE": this.f.ITEMTYPE.value,
      "ITEMDATE": this.ITEMDATEVLAUE,
      "ITEMTIME": this.f.ITEMTIME.value,
      "MATTERGUID": this.f.MATTERGUID.value,
      "PRICE": this.f.SendPRICE.value,
      "PRICEINCGST": this.f.SendPRICEINCGST.value,
      "QUANTITY": this.f.QUANTITY.value,
    }
    if (this.f.ITEMTYPE.value == "activity" || this.f.ITEMTYPE.value == "sundry") {
      PostData.FEETYPE = this.f.QUANTITYTYPE.value;
      PostData.QUANTITYTYPE = '';
    } else {
      PostData.QUANTITYTYPE = this.f.QUANTITYTYPE.value;
    }

    this.successMsg = 'Time entry added successfully';
    let FormAction = this.action == 'Edit' ? 'update' : 'insert';
    if (this.action == 'Edit' || this.action == "Duplicate") {
      PostData.WorkItemGuid = localStorage.getItem('edit_WORKITEMGUID');
      this.successMsg = 'Time entry update successfully';
    } else if (this.action == "Duplicate")
      this.successMsg = 'Time entry Duplicate successfully';
    let PostTimeEntryData: any = { FormAction: FormAction, VALIDATEONLY: true, Data: PostData };
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

}
