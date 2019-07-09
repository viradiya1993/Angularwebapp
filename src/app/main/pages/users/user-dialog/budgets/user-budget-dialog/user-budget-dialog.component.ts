import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { MainAPiServiceService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-budget-dialog',
  templateUrl: './user-budget-dialog.component.html',
  styleUrls: ['./user-budget-dialog.component.scss']
})
export class UserBudgetDialogComponent implements OnInit {
  Months: any = [];
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  action: any;
  errorWarningData: any = {};
  isspiner: boolean = false;
  dialogTitle: any;
  successMsg: string;
  userBudget: FormGroup;
  USERGUID: any;
  constructor(
    public dialogRef: MatDialogRef<UserBudgetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    public datepipe: DatePipe,
    public MatDialog: MatDialog,
    private toastr: ToastrService,
    private _mainAPiServiceService: MainAPiServiceService
  ) {
    this.action = data.action;
    this.USERGUID = data.USERGUID;
    if (this.action === 'new') {
      this.dialogTitle = 'New Budget';
      this.Months = [];
      for (let i = 0; i < 12; i++) {
        let nowdate = (new Date());
        nowdate = new Date(nowdate.getFullYear(), nowdate.getMonth(), 1);
        nowdate.setMonth(nowdate.getMonth() + i);
        this.Months.push(nowdate);
      }
    } else {
      this.dialogTitle = 'Edit Budget';
    }
  }

  ngOnInit() {
    this.userBudget = this._formBuilder.group({
      PERIODSTART: [new Date()],
      USERGUID: [this.USERGUID],
      USERBUDGETGUID: [],
      TOTALBUDGETHOURS: [],
      TOTALBUDGETDOLLARS: [],
      ratehr: [],
      MONTHBUDGETHOURS_1: [],
      MONTHBUDGETHOURS_2: [],
      MONTHBUDGETHOURS_3: [],
      MONTHBUDGETHOURS_4: [],
      MONTHBUDGETHOURS_5: [],
      MONTHBUDGETHOURS_6: [],
      MONTHBUDGETHOURS_7: [],
      MONTHBUDGETHOURS_8: [],
      MONTHBUDGETHOURS_9: [],
      MONTHBUDGETHOURS_10: [],
      MONTHBUDGETHOURS_11: [],
      MONTHBUDGETHOURS_12: [],
      MONTHLYBUDGETUNITS_1: [],
      MONTHLYBUDGETUNITS_2: [],
      MONTHLYBUDGETUNITS_3: [],
      MONTHLYBUDGETUNITS_4: [],
      MONTHLYBUDGETUNITS_5: [],
      MONTHLYBUDGETUNITS_6: [],
      MONTHLYBUDGETUNITS_7: [],
      MONTHLYBUDGETUNITS_8: [],
      MONTHLYBUDGETUNITS_9: [],
      MONTHLYBUDGETUNITS_10: [],
      MONTHLYBUDGETUNITS_11: [],
      MONTHLYBUDGETUNITS_12: []
    });
  }

  NowDate(value) {
    this.Months = [];
    for (let i = 0; i < 12; i++) {
      let nowdate = (new Date(value));
      nowdate = new Date(nowdate.getFullYear(), nowdate.getMonth(), 1);
      nowdate.setMonth(nowdate.getMonth() + i);
      this.Months.push(nowdate);
    }
    console.log(this.Months);
  }
  get f() {
    return this.userBudget.controls;
  }
  MONTHBUDGETHOURS_GROUP() {
    let DataArray: any = [];
    let Obj = this.userBudget.value;
    for (let i = 1; i <= 12; i++) {
      var O = {};
      let key = 'MONTHBUDGETHOURS_' + i;
      O[key] = Obj[key];
      DataArray.push(O);
    }
    return DataArray;
  }
  MONTHBUDGETDOLLARS_GROUP() {
    let DataArray: any = [];
    let Obj = this.userBudget.value;
    for (let i = 1; i <= 12; i++) {
      var O = {};
      let key = 'MONTHLYBUDGETUNITS_' + i;
      O[key] = Obj[key];
      DataArray.push(O);
    }
    return DataArray;
  }
  saveBudget() {
    this.isspiner = true;
    let PostData: any = {
      "USERGUID": this.f.USERGUID.value,
      "PERIODSTART": this.f.PERIODSTART.value,
      "TOTALBUDGETHOURS": this.f.TOTALBUDGETHOURS.value,
      "TOTALBUDGETDOLLARS": this.f.TOTALBUDGETDOLLARS.value,
      "MONTHBUDGETHOURS_GROUP": this.MONTHBUDGETHOURS_GROUP(),
      "MONTHBUDGETDOLLARS_GROUP": this.MONTHBUDGETDOLLARS_GROUP(),
    }
    this.successMsg = 'Save successfully';
    let FormAction = this.action == 'edit' ? 'update' : 'insert';
    if (this.action == 'edit') {
      PostData.USERBUDGETGUID = this.f.USERBUDGETGUID.value;
      this.successMsg = 'Update successfully';
    }
    let PostBudgetData: any = { FormAction: FormAction, VALIDATEONLY: true, Data: PostData };
    this._mainAPiServiceService.getSetData(PostBudgetData, 'SetUserBudget').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.checkValidation(res.DATA.VALIDATIONS, PostBudgetData);
      } else if (res.CODE == 451 && res.STATUS == "warning") {
        this.checkValidation(res.DATA.VALIDATIONS, PostBudgetData);
      } else if (res.CODE == 450 && res.STATUS == "error") {
        this.checkValidation(res.DATA.VALIDATIONS, PostBudgetData);
      } else if (res.MESSAGE == "Not logged in") {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
  checkValidation(bodyData: any, PostBudgetData: any) {
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
    this.errorWarningData = { "Error": tempError, "Warning": tempWarning };
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
          this.saveBudgetData(PostBudgetData);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.saveBudgetData(PostBudgetData);
    this.isspiner = false;
  }
  saveBudgetData(PostBudgetData: any) {
    PostBudgetData.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(PostBudgetData, 'SetActivity').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.toastr.success(this.successMsg);
        this.dialogRef.close(true);
      } else if (res.CODE == 451 && res.STATUS == "warning") {
        this.toastr.warning(this.successMsg);
      } else if (res.CODE == 450 && res.STATUS == "error") {
        this.toastr.error(res.STATUS);
      } else if (res.MESSAGE == "Not logged in") {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
}
