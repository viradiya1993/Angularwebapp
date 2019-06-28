import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { round } from 'lodash';

@Component({
  selector: 'app-activity-dialog',
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.scss']
})
export class ActivityDialogComponent implements OnInit {
  activityForm: FormGroup;
  isLoadingResults: boolean = false;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;
  RATEPERUNIT: any;

  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<ActivityDialogComponent>,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.action = data.action;
    if (this.action === 'new') {
      this.dialogTitle = 'New Activity';
    } else if (this.action === 'edit') {
      this.dialogTitle = 'Edit Activity';
    } else {
      this.dialogTitle = 'Duplicate Activity';
    }
  }

  ngOnInit() {
    this.activityForm = this._formBuilder.group({
      ACTIVITYGUID: [''],
      ACTIVITYTYPE: [''],
      ACTIVITYID: ['', Validators.required],
      DESCRIPTION: ['', Validators.required],
      GSTTYPE: [''],
      RATEPERUNIT: ['', Validators.required],
      UNITDESCRIPTIONPLURAL: [''],
      UNITDESCRIPTIONSINGLE: ['']
    });
  }
  RatePerUnitVal() {
    let am = this.f.RATEPERUNIT.value;
    this.RATEPERUNIT = am.toFixed(2);
  }
  get f() {
    return this.activityForm.controls;
  }

  // saveActivity() {
  //   this.isspiner = true;
  //   let PostData: any = {
  //     "ADDITIONALTEXT": this.f.ADDITIONALTEXT.value,
  //     "COMMENT": this.f.COMMENT.value,
  //     "FEEEARNER": this.f.FEEEARNER.value,
  //     "ITEMTYPE": this.f.ITEMTYPE.value,
  //     "ITEMDATE": this.ITEMDATEVLAUE,
  //     "ITEMTIME": this.f.ITEMTIME.value,
  //     "MATTERGUID": this.f.MATTERGUID.value,
  //     "PRICE": this.f.PRICE.value,
  //     "PRICEINCGST": this.f.PRICEINCGST.value,
  //     "QUANTITY": this.f.QUANTITY.value,
  //     // "INVOICEGUID": "value",
  //     // "INVOICEORDER": "value",
  //     // "PRICECHARGED": "value",
  //     // "PRICEINCGSTCHARGED": "value",
  //     // "GST": "value",
  //     // "GSTCHARGED": "value",
  //     // "GSTTYPE": "value",
  //   }

  //   this.successMsg = 'Time entry added successfully';
  //   let FormAction = this.action == 'Edit' ? 'update' : 'insert';
  //   if (this.action == 'Edit') {
  //     PostData.WorkItemGuid = localStorage.getItem('edit_WORKITEMGUID');
  //     this.successMsg = 'Time entry update successfully';
  //   }
  //   let PostTimeEntryData: any = { FormAction: FormAction, VALIDATEONLY: true, Data: PostData };
  //   this.Timersservice.SetActivityData(PostTimeEntryData).subscribe(res => {
  //     if (res.CODE == 200 && res.STATUS == "success") {
  //       this.checkValidation(res.DATA.VALIDATIONS, PostTimeEntryData);
  //     } else if (res.CODE == 451 && res.STATUS == "warning") {
  //       this.checkValidation(res.DATA.VALIDATIONS, PostTimeEntryData);
  //     } else if (res.CODE == 450 && res.STATUS == "error") {
  //       this.checkValidation(res.DATA.VALIDATIONS, PostTimeEntryData);
  //     } else if (res.MESSAGE == "Not logged in") {
  //       this.dialogRef.close(false);
  //     }
  //     this.isspiner = false;
  //   }, err => {
  //     this.isspiner = false;
  //     this.toastr.error(err);
  //   });
  // }
  // checkValidation(bodyData: any, PostTimeEntryData: any) {
  //   let errorData: any = [];
  //   let warningData: any = [];
  //   let tempError: any = [];
  //   let tempWarning: any = [];
  //   console.log(bodyData);
  //   // errorData
  //   bodyData.forEach(function (value) {
  //     if (value.VALUEVALID == 'NO') {
  //       errorData.push(value.ERRORDESCRIPTION);
  //       tempError[value.FIELDNAME] = value;
  //     } else if (value.VALUEVALID == 'WARNING') {
  //       tempWarning[value.FIELDNAME] = value;
  //       warningData.push(value.ERRORDESCRIPTION);
  //     }
  //   });
  //   this.errorWarningData = { "Error": tempError, "Warning": tempWarning };
  //   console.log(this.errorWarningData);
  //   if (Object.keys(errorData).length != 0)
  //     this.toastr.error(errorData);
  //   if (Object.keys(warningData).length != 0) {
  //     // this.toastr.warning(warningData);
  //     this.confirmDialogRef = this.MatDialog.open(FuseConfirmDialogComponent, {
  //       disableClose: true,
  //       width: '100%',
  //       data: warningData
  //     });
  //     this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
  //     this.confirmDialogRef.afterClosed().subscribe(result => {
  //       if (result) {
  //         this.isspiner = true;
  //         this.saveTimeEntry(PostTimeEntryData);
  //       }
  //       this.confirmDialogRef = null;
  //     });
  //   }
  //   if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
  //     this.saveTimeEntry(PostTimeEntryData);
  //   this.isspiner = false;
  // }
  // saveTimeEntry(PostTimeEntryData: any) {
  //   PostTimeEntryData.VALIDATEONLY = false;
  //   this.Timersservice.SetWorkItems(PostTimeEntryData).subscribe(res => {
  //     if (res.CODE == 200 && res.STATUS == "success") {
  //       this.toasterService.success(this.successMsg);
  //       this.dialogRef.close(true);
  //     } else if (res.CODE == 451 && res.STATUS == "warning") {
  //       this.toasterService.warning(this.successMsg);
  //     } else {
  //       if (res.CODE == 402 && res.STATUS == "error" && res.MESSAGE == "Not logged in")
  //         this.dialogRef.close(false);
  //     }
  //     this.isspiner = false;
  //   }, err => {
  //     this.isspiner = false;
  //     this.toastr.error(err);
  //   });
  // }

}
