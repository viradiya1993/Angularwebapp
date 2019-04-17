import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TimersService, MattersService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-time-entry-dialog',
  templateUrl: './time-entry-dialog.component.html',
  styleUrls: ['./time-entry-dialog.component.scss'],
  providers: [DatePipe]
})
export class TimeEntryDialogComponent implements OnInit, AfterViewInit {

  private exportTime = { hour: 7, minute: 15, meriden: 'PM', format: 24 };
  LookupsList: any;
  userList: any;
  matterList: any;
  isspiner: boolean = false;
  isLoadingResults: boolean = false;
  ActivityList: any = [];
  successMsg: any;
  optionList: any = [
    { 'ACTIVITYID': 'hh:mm', 'DESCRIPTION': 'hh:mm' },
    { 'ACTIVITYID': 'Hours', 'DESCRIPTION': 'Hours' },
    { 'ACTIVITYID': 'Minutes', 'DESCRIPTION': 'Minutes' },
    { 'ACTIVITYID': 'Days', 'DESCRIPTION': 'Days' },
    { 'ACTIVITYID': 'Units', 'DESCRIPTION': 'Units' },
    { 'ACTIVITYID': 'Fixed', 'DESCRIPTION': 'Fixed' }
  ];
  ITEMDATEVLAUE: any;
  action: any;
  dialogTitle: any;
  buttonText: any;
  ITEMDATEModel: Date = new Date();

  QuantityTypeLabel: any = 'Quantity Type';

  constructor(
    public dialogRef: MatDialogRef<TimeEntryDialogComponent>,
    private Timersservice: TimersService,
    private MattersService: MattersService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
    private toasterService: ToastrService,
    public datepipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.action = _data.edit;
    this.dialogTitle = _data.edit === 'Edit' ? 'Update Time Entry' : 'Add New Time Entry';
    this.buttonText = _data.edit === 'Edit' ? 'Update' : 'Save';
  }

  timeEntryForm: FormGroup;
  ngOnInit() {
    this.ActivityList = this.optionList;
    this.timeEntryForm = this._formBuilder.group({
      MATTERGUID: ['', Validators.required],
      ITEMTYPE: [''],
      QUANTITYTYPE: [''],
      ITEMDATE: ['', Validators.required],
      FEEEARNER: [''],
      QUANTITY: [''],
      PRICE: [''],
      PRICEINCGST: [''],
      ADDITIONALTEXT: ['', Validators.required],
      COMMENT: [''],
    });
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
        this.matterList = res.DATA.MATTERS;
      } else {
        this.matterList = [];
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
    });
    if (this.action === 'Edit') {
      this.setTimeEntryData();
    }
  }
  setTimeEntryData() {
    this.isLoadingResults = true;
    this.Timersservice.getTimeEnrtyData({ 'WorkItemGuid': localStorage.getItem('edit_WORKITEMGUID') }).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        localStorage.setItem('edit_WORKITEMGUID', response.DATA.WORKITEMS[0].WORKITEMGUID);
        let timeEntryData = response.DATA.WORKITEMS[0];
        this.timeEntryForm.controls['MATTERGUID'].setValue(timeEntryData.MATTERGUID);
        this.timeEntryForm.controls['ITEMTYPE'].setValue(timeEntryData.ITEMTYPE);
        // this.timeEntryForm.controls['ITEMTIME'].setValue(timeEntryData.ITEMTIME);
        this.timeEntryForm.controls['FEEEARNER'].setValue(timeEntryData.FEEEARNER);
        this.timeEntryForm.controls['QUANTITY'].setValue(timeEntryData.QUANTITY);
        let tempDate = timeEntryData.ITEMDATE.split("/");
        this.ITEMDATEModel = new Date(tempDate[1] + '/' + tempDate[0] + '/' + tempDate[2]);
        this.timeEntryForm.controls['PRICEINCGST'].setValue(timeEntryData.PRICEINCGST);
        this.timeEntryForm.controls['PRICE'].setValue(timeEntryData.PRICE);
        this.timeEntryForm.controls['ADDITIONALTEXT'].setValue(timeEntryData.ADDITIONALTEXT);
        this.timeEntryForm.controls['COMMENT'].setValue(timeEntryData.COMMENT);
        this.timeEntryForm.controls['QUANTITYTYPE'].setValue(timeEntryData.QUANTITYTYPE);

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
  onChangeHour(event) {
    console.log('event', event);
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
    let PostTimeEntryData: any = {
      "FormAction": "insert",
      "ADDITIONALTEXT": this.f.ADDITIONALTEXT.value,
      "COMMENT": this.f.COMMENT.value,
      "FEEEARNER": this.f.FEEEARNER.value,
      "FEETYPE": this.f.ITEMTYPE.value,
      // "INVOICEGUID": "value",
      // "INVOICEORDER": "value",
      "ITEMDATE": this.ITEMDATEVLAUE,
      "ITEMTIME": "value",
      "MATTERGUID": this.f.MATTERGUID.value,
      "PRICE": this.f.PRICE.value,
      // "PRICECHARGED": "value",
      // "PRICEINCGST": "value",
      // "PRICEINCGSTCHARGED": "value",
      // "GST": "value",
      // "GSTCHARGED": "value",
      // "GSTTYPE": "value",
      "QUANTITYTYPE": this.f.QUANTITYTYPE.value,
      "QUANTITY": this.f.QUANTITY.value,
    }
    this.successMsg = 'Time entry added successfully';
    if (this.action == 'Edit') {
      PostTimeEntryData.FormAction = 'update';
      PostTimeEntryData.WorkItemGuid = localStorage.getItem('edit_WORKITEMGUID');
      this.successMsg = 'Time entry update successfully';
    }
    this.Timersservice.SetWorkItems(PostTimeEntryData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.toasterService.success(this.successMsg);
        this.dialogRef.close(false);
      } else {
        if (res.CODE == 402 && res.STATUS == "error" && res.MESSAGE == "Not logged in")
          this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
    console.log(PostTimeEntryData);
  }

}
