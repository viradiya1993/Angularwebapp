import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TimersService, MattersService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';


@Component({
  selector: 'app-time-entry-dialog',
  templateUrl: './time-entry-dialog.component.html',
  styleUrls: ['./time-entry-dialog.component.scss']
})
export class TimeEntryDialogComponent implements OnInit, AfterViewInit {

  private exportTime = { hour: 7, minute: 15, meriden: 'PM', format: 24 };
  LookupsList: any;
  userList: any;
  matterList: any;
  isspiner: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TimeEntryDialogComponent>,
    private Timersservice: TimersService,
    private MattersService: MattersService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder
  ) { }
  timeEntryForm: FormGroup;
  ngOnInit() {

    this.timeEntryForm = this._formBuilder.group({
      MATTERGUID: ['', Validators.required],
      ITEMTYPE: ['', Validators.required],
      QUANTITYTYPE: ['', Validators.required],
      ITEMDATE: ['', Validators.required],
      FEEEARNER: ['', Validators.required],
      QUANTITY: ['', Validators.required],
      PRICE: ['', Validators.required],
      PRICEINCGST: ['', Validators.required],
      ADDITIONALTEXT: ['', Validators.required],
      COMMENT: ['', Validators.required],
    });
    this.Timersservice.GetLookupsData({}).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.LookupsList = res.DATA.LOOKUPS;
      } else
        this.LookupsList = [];
    }, err => {
      this.toastr.error(err);
    });
    this.Timersservice.GetUsers({}).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.userList = res.DATA.USERS;
      } else
        this.userList = [];
    }, err => {
      this.toastr.error(err);
    });
    this.MattersService.getMatters({ "Active": "active" }).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.matterList = res.DATA.MATTERS;
      } else
        this.matterList = [];
    }, err => {
      this.toastr.error(err);
    });
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
    console.log(value);
  }
  SaveClickTimeEntry() {
    this.isspiner = true;
    // 4
    let PostTimeEntryData = {
      "FormAction": "insert",
      "ADDITIONALTEXT": this.f.ADDITIONALTEXT.value,
      "COMMENT": this.f.COMMENT.value,
      "FEEEARNER": this.f.FEEEARNER.value,
      // "FEETYPE": "value",
      // "INVOICEGUID": "value",
      // "INVOICEORDER": "value",
      "ITEMDATE": this.f.FEEEARNER.value,
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
    console.log(PostTimeEntryData);
    console.log('SaveClickTimeEntry');
  }

}
