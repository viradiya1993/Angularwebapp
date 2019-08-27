import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { BehaviorService, MainAPiServiceService } from 'app/_services';

@Component({
  selector: 'app-chart-ac-dailog',
  templateUrl: './chart-ac-dailog.component.html',
  styleUrls: ['./chart-ac-dailog.component.scss']
})
export class ChartAcDailogComponent implements OnInit {
  successMsg: any;
  errorWarningData: any = {};
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  isLoadingResults: boolean = false;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;
  AccountForm: FormGroup;
  AccountData: any = [];
  theCheckbox = true;

  constructor
    (
      public MatDialog: MatDialog,
      public dialogRef: MatDialogRef<ChartAcDailogComponent>,
      private _formBuilder: FormBuilder,
      private toastr: ToastrService,
      private behaviorService: BehaviorService,
      public _matDialog: MatDialog,
      private _mainAPiServiceService: MainAPiServiceService,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    this.action = data.action;
    if (this.action === 'new') {
      this.dialogTitle = 'New Account';
    } else if (this.action === 'edit') {
      this.dialogTitle = 'Update Account';
    } else if (this.action === 'duplicate') {
      this.dialogTitle = 'Duplicate Account';
    }
    this.behaviorService.ChartAccountData$.subscribe(result => { if (result) { this.AccountData = result; } });
  }

  ngOnInit() {
    this.AccountForm = this._formBuilder.group({
      ACCOUNTCLASS: [''],
      ACCOUNTNAME: ['', Validators.required],
      //General
      ACCOUNTNUMBER: ['1-'],
      ACCOUNTTYPE: [''],
      ACTIVE: [''],
      MYOBEXPORTACCOUNT: [''],
    });
    if (this.action == "edit") {
      this.isLoadingResults = true;
      this._mainAPiServiceService.getSetData({ ACCOUNTGUID: this.AccountData.ACCOUNTGUID }, 'GetAccount').subscribe(res => {
        if (res.CODE == 200 && res.STATUS == "success") {
          this.AccountForm.controls['ACCOUNTCLASS'].setValue(res.DATA.ACCOUNTS[0].ACCOUNTCLASS);
          this.AccountForm.controls['ACCOUNTNAME'].setValue(res.DATA.ACCOUNTS[0].ACCOUNTNAME);
          this.AccountForm.controls['ACCOUNTNUMBER'].setValue(res.DATA.ACCOUNTS[0].ACCOUNTCLASS + ' - ' + res.DATA.ACCOUNTS[0].ACCOUNTNUMBER);
          this.AccountForm.controls['ACCOUNTTYPE'].setValue(res.DATA.ACCOUNTS[0].ACCOUNTTYPE.toString());
        } else if (res.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
        this.isLoadingResults = false;
      }, err => {
        this.toastr.error(err);
        this.isLoadingResults = false;
      });
    }

  }
  get f() {
    return this.AccountForm.controls;
  }
  //SaveAccount
  SaveAccount() {
    this.isspiner = true;
    let PostData: any = {
      "ACCOUNTCLASS": this.f.ACCOUNTCLASS.value,
      "ACCOUNTNAME": this.f.ACCOUNTNAME.value,

      "ACCOUNTNUMBER": this.f.ACCOUNTNUMBER.value,
      "ACCOUNTTYPE": this.f.ACCOUNTTYPE.value,
      "ACTIVE": this.f.ACTIVE.value,
      "MYOBEXPORTACCOUNT": this.f.MYOBEXPORTACCOUNT.value,
    }
    this.successMsg = 'Save successfully';
    let FormAction = this.action == 'edit' ? 'update' : 'insert';
    if (this.action == 'edit') {
      PostData.ACTIVITYGUID = this.f.ACTIVITYGUID.value;
      this.successMsg = 'Update successfully';
    }
    let PostAccountData: any = { FormAction: FormAction, VALIDATEONLY: true, Data: PostData };
    this._mainAPiServiceService.getSetData(PostAccountData, 'SetAccount').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.checkValidation(res.DATA.VALIDATIONS, PostAccountData);
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.checkValidation(res.DATA.VALIDATIONS, PostAccountData);
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.checkValidation(res.DATA.VALIDATIONS, PostAccountData);
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });

  }
  checkValidation(bodyData: any, PostAccountData: any) {
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
    if (Object.keys(errorData).length != 0)
      this.toastr.error(errorData);
    if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef = this.MatDialog.open(FuseConfirmDialogComponent, {
        disableClose: true, width: '100%', data: warningData
      });
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.saveAccountData(PostAccountData);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.saveAccountData(PostAccountData);
    this.isspiner = false;
  }
  saveAccountData(PostAccountData: any) {
    PostAccountData.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(PostAccountData, 'SetAccount').subscribe(res => {
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
  FilterSearch(val) {

  }

}
