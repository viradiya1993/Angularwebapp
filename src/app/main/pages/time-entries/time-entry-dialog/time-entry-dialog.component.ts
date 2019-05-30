import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TimersService, MattersService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';
import { MatterDialogComponent } from '../matter-dialog/matter-dialog.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { round } from 'lodash';


@Component({
  selector: 'app-time-entry-dialog',
  templateUrl: './time-entry-dialog.component.html',
  styleUrls: ['./time-entry-dialog.component.scss'],
  providers: [DatePipe]
})
export class TimeEntryDialogComponent implements OnInit, AfterViewInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  private exportTime = { hour: 7, minute: 15, meriden: 'PM', format: 24 };
  LookupsList: any;
  userList: any;
  matterList: any = [];
  isspiner: boolean = false;
  isLoadingResults: boolean = false;
  ActivityList: any = [];
  successMsg: any;
  PRICEINCGSTVAL: any;
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
  actiontype: string;

  constructor(
    public dialogRef: MatDialogRef<TimeEntryDialogComponent>,
    public MatDialog: MatDialog,
    private Timersservice: TimersService,
    private MattersService: MattersService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
    private toasterService: ToastrService,
    public datepipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    if (_data.edit == 'Edit' || _data.edit == 'Add') {
      this.action = _data.edit;
      this.dialogTitle = _data.edit === 'Edit' ? 'Update Time Entry' : 'Add New Time Entry';
      this.buttonText = _data.edit === 'Edit' ? 'Update' : 'Save';
    } else {
      this.currentTimeMatter = _data.edit;
      this.matterTimerData = _data.matterData;
    }
  }
  timeEntryForm: FormGroup;
  matterautoVal: any;
  ngOnInit() {
    this.ActivityList = this.optionList;
    this.timeEntryForm = this._formBuilder.group({
      matterautoVal: [''],
      MATTERGUID: ['', Validators.required],
      ITEMTYPE: [''],
      QUANTITYTYPE: [''],
      ITEMDATE: ['', Validators.required],
      FEEEARNER: [''],
      QUANTITY: [''],
      PRICE: [''],
      PRICEINCGST: [''],
      ITEMTIME: [''],
      ADDITIONALTEXT: ['', Validators.required],
      COMMENT: [''],
    });
    this.ITEMDATEModel = new Date();
    this.timeEntryForm.controls['ITEMTYPE'].setValue('WIP');
    let userType = JSON.parse(localStorage.getItem('currentUser'));
    this.timeEntryForm.controls['FEEEARNER'].setValue(userType.UserId);
    this.timeEntryForm.controls['QUANTITYTYPE'].setValue('Hours');
    this.timeEntryForm.controls['QUANTITY'].setValue(0);
    this.isLoadingResults = true;
    this.Timersservice.GetLookupsData({}).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.LookupsList = res.DATA.LOOKUPS;
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
      } else {
        this.userList = [];
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
    });
    this.isLoadingResults = true;
    this.MattersService.getMatters({ "Active": "active" }).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        res.DATA.MATTERS.forEach(itemsdata => {
          if (this.currentTimeMatter == itemsdata.MATTERGUID) {
            this.matterautoVal = itemsdata.SHORTNAME + ' : ' + itemsdata.MATTER;
            this.timeEntryForm.controls['matterautoVal'].setValue(this.matterautoVal);
          }
          itemsdata.name = itemsdata.SHORTNAME + ' : ' + itemsdata.MATTER + ' : ' + itemsdata.CLIENT;
          this.matterList.push(itemsdata);
        });
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
    });
    if (this.action === 'Edit') {
      this.setTimeEntryData();
    } else if (this.currentTimeMatter != '') {
      this.timeEntryForm.controls['MATTERGUID'].setValue(this.currentTimeMatter);
      this.timeEntryForm.controls['QUANTITYTYPE'].setValue('hh:mm');
      this.timeEntryForm.controls['QUANTITY'].setValue(this.matterTimerData);
      this.timeEntryForm.controls['ITEMTYPE'].setValue('WIP');
      this.matterChange('MatterGuid', this.currentTimeMatter);
    }
  }
  calcPE() {
    this.PRICEINCGSTVAL = round(this.f.PRICE.value * 1.1);
  }
  calcPI() {
    this.PRICEVAL = round(this.f.PRICEINCGST.value / 1.1);
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
    this.Timersservice.getTimeEnrtyData({ 'WorkItemGuid': localStorage.getItem('edit_WORKITEMGUID') }).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        localStorage.setItem('edit_WORKITEMGUID', response.DATA.WORKITEMS[0].WORKITEMGUID);
        let timeEntryData = response.DATA.WORKITEMS[0];
        this.matterList.forEach(itemsdata => {
          if (response.DATA.WORKITEMS[0].MATTERGUID == itemsdata.MATTERGUID) {
            this.timeEntryForm.controls['matterautoVal'].setValue(itemsdata.SHORTNAME + ' : ' + itemsdata.MATTER);
          }
        });
        this.itemTypeChange(timeEntryData.ITEMTYPE);
        if (timeEntryData.ITEMTYPE == "Activity" || timeEntryData.ITEMTYPE == "Sundry") {
          this.timeEntryForm.controls['QUANTITYTYPE'].setValue(timeEntryData.FEETYPE);
        } else {
          this.timeEntryForm.controls['QUANTITYTYPE'].setValue(timeEntryData.QUANTITYTYPE);
        }
        this.timeEntryForm.controls['QUANTITY'].setValue(timeEntryData.QUANTITY);
        this.timeEntryForm.controls['MATTERGUID'].setValue(timeEntryData.MATTERGUID);
        this.timeEntryForm.controls['ITEMTYPE'].setValue(timeEntryData.ITEMTYPE);
        this.timeEntryForm.controls['ITEMTIME'].setValue(timeEntryData.ITEMTIME);
        this.timeEntryForm.controls['FEEEARNER'].setValue(timeEntryData.FEEEARNER);

        let tempDate = timeEntryData.ITEMDATE.split("/");
        this.ITEMDATEModel = new Date(tempDate[1] + '/' + tempDate[0] + '/' + tempDate[2]);
        this.timeEntryForm.controls['PRICEINCGST'].setValue(timeEntryData.PRICEINCGST);
        this.timeEntryForm.controls['PRICE'].setValue(timeEntryData.PRICE);
        this.timeEntryForm.controls['ADDITIONALTEXT'].setValue(timeEntryData.ADDITIONALTEXT);
        this.timeEntryForm.controls['COMMENT'].setValue(timeEntryData.COMMENT);

      }
      this.isLoadingResults = false;
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
  }
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.ITEMDATEVLAUE = this.datepipe.transform(event.value, 'dd/MM/yyyy');
  }
  ngAfterViewInit(): void {
    $('#time_Control').attr('placeholder', 'Select time');
  }
  matterChange(key: any, event: any) {
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
          this.timeEntryForm.controls['PRICE'].setValue(CalcWorkItemCharge.PRICE);
          this.timeEntryForm.controls['PRICEINCGST'].setValue(CalcWorkItemCharge.PRICEINCGST);
          this.isLoadingResults = false;
        }
      }, err => {
        this.isLoadingResults = false;
        this.toastr.error(err);
      });
    }
  }
  ondialogcloseClick(): void {
    this.dialogRef.close(false);
  }
  get f() {
    return this.timeEntryForm.controls;
  }
  itemTypeChange(value: any) {
    this.isLoadingResults = true;
    if (value == 'Activity' || value == 'Sundry') {
      this.QuantityTypeLabel = value == 'Activity' ? 'Activity' : 'Sundry';
      let callType = value == 'Activity' ? 'Activity' : 'Sundries';
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
    this.isspiner = true;
    let PostData: any = {
      "FormAction": "insert",
      "ADDITIONALTEXT": this.f.ADDITIONALTEXT.value,
      "COMMENT": this.f.COMMENT.value,
      "FEEEARNER": this.f.FEEEARNER.value,
      "ITEMTYPE": this.f.ITEMTYPE.value,
      "ITEMDATE": this.ITEMDATEVLAUE,
      "ITEMTIME": this.f.ITEMTIME.value,
      "MATTERGUID": this.f.MATTERGUID.value,
      "PRICE": this.f.PRICE.value,
      "PRICEINCGST": this.f.PRICEINCGST.value,
      "QUANTITY": this.f.QUANTITY.value,
      // "INVOICEGUID": "value",
      // "INVOICEORDER": "value",
      // "PRICECHARGED": "value",
      // "PRICEINCGSTCHARGED": "value",
      // "GST": "value",
      // "GSTCHARGED": "value",
      // "GSTTYPE": "value",
    }
    if (this.f.ITEMTYPE.value == "Activity" || this.f.ITEMTYPE.value == "Sundry") {
      PostData.FEETYPE = this.f.QUANTITYTYPE.value;
      PostData.QUANTITYTYPE = '';
    } else {
      PostData.QUANTITYTYPE = this.f.QUANTITYTYPE.value;
    }

    this.successMsg = 'Time entry added successfully';
    let FormAction = this.action == 'Edit' ? 'update' : 'insert';
    if (this.action == 'Edit') {
      PostData.WorkItemGuid = localStorage.getItem('edit_WORKITEMGUID');
      this.successMsg = 'Time entry update successfully';
    }
    let PostTimeEntryData: any = { FormAction: FormAction, VALIDATEONLY: true, Data: PostData };
    this.Timersservice.SetWorkItems(PostTimeEntryData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.checkValidation(res.DATA.VALIDATIONS, PostTimeEntryData);
      } else if (res.CODE == 451 && res.STATUS == "warning") {
        this.checkValidation(res.DATA.VALIDATIONS, PostTimeEntryData);
      } else {
        if (res.CODE == 402 && res.STATUS == "error" && res.MESSAGE == "Not logged in")
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
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'NO')
        errorData.push(value.ERRORDESCRIPTION);
      else if (value.VALUEVALID == 'WARNING')
        warningData.push(value.ERRORDESCRIPTION);
    });

    if (Object.keys(errorData).length != 0)
      this.toastr.error(errorData);
    if (Object.keys(warningData).length != 0) {
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
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.saveTimeEntry(PostTimeEntryData);
    this.isspiner = false;
  }
  saveTimeEntry(PostTimeEntryData: any) {
    PostTimeEntryData.VALIDATEONLY = false;
    this.Timersservice.SetWorkItems(PostTimeEntryData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.toasterService.success(this.successMsg);
        this.dialogRef.close(true);
      } else {
        if (res.CODE == 402 && res.STATUS == "error" && res.MESSAGE == "Not logged in")
          this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }

}
