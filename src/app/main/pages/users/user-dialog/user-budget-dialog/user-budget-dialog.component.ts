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
  budgetsData: any = [];
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
  }

  ngOnInit() {
    this.userBudget = this._formBuilder.group({
      PERIODSTARTTEXT: [new Date()],
      PERIODSTART: [''],
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
      MONTHBUDGETDOLLARS_1: [],
      MONTHBUDGETDOLLARS_2: [],
      MONTHBUDGETDOLLARS_3: [],
      MONTHBUDGETDOLLARS_4: [],
      MONTHBUDGETDOLLARS_5: [],
      MONTHBUDGETDOLLARS_6: [],
      MONTHBUDGETDOLLARS_7: [],
      MONTHBUDGETDOLLARS_8: [],
      MONTHBUDGETDOLLARS_9: [],
      MONTHBUDGETDOLLARS_10: [],
      MONTHBUDGETDOLLARS_11: [],
      MONTHBUDGETDOLLARS_12: []
    });
    if (this.action == 'edit') {
      this.dialogTitle = 'Edit Budget';
      this.budgetsData = JSON.parse(localStorage.getItem('current_budgets'));
      this.NowDate(new Date());
      this.userBudget.controls['USERBUDGETGUID'].setValue(this.budgetsData.USERBUDGETGUID);
      this.userBudget.controls['TOTALBUDGETHOURS'].setValue(parseFloat(this.budgetsData.TOTALBUDGETHOURS).toFixed(2));
      this.userBudget.controls['TOTALBUDGETDOLLARS'].setValue(parseFloat(this.budgetsData.TOTALBUDGETDOLLARS).toFixed(2));
      this.userBudget.controls['MONTHBUDGETHOURS_1'].setValue(parseFloat(this.budgetsData.MONTHBUDGETHOURS_GROUP['MONTHBUDGETHOURS_1']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETHOURS_2'].setValue(parseFloat(this.budgetsData.MONTHBUDGETHOURS_GROUP['MONTHBUDGETHOURS_2']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETHOURS_3'].setValue(parseFloat(this.budgetsData.MONTHBUDGETHOURS_GROUP['MONTHBUDGETHOURS_3']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETHOURS_4'].setValue(parseFloat(this.budgetsData.MONTHBUDGETHOURS_GROUP['MONTHBUDGETHOURS_4']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETHOURS_5'].setValue(parseFloat(this.budgetsData.MONTHBUDGETHOURS_GROUP['MONTHBUDGETHOURS_5']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETHOURS_6'].setValue(parseFloat(this.budgetsData.MONTHBUDGETHOURS_GROUP['MONTHBUDGETHOURS_6']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETHOURS_7'].setValue(parseFloat(this.budgetsData.MONTHBUDGETHOURS_GROUP['MONTHBUDGETHOURS_7']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETHOURS_8'].setValue(parseFloat(this.budgetsData.MONTHBUDGETHOURS_GROUP['MONTHBUDGETHOURS_8']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETHOURS_9'].setValue(parseFloat(this.budgetsData.MONTHBUDGETHOURS_GROUP['MONTHBUDGETHOURS_9']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETHOURS_10'].setValue(parseFloat(this.budgetsData.MONTHBUDGETHOURS_GROUP['MONTHBUDGETHOURS_10']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETHOURS_11'].setValue(parseFloat(this.budgetsData.MONTHBUDGETHOURS_GROUP['MONTHBUDGETHOURS_11']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETHOURS_12'].setValue(parseFloat(this.budgetsData.MONTHBUDGETHOURS_GROUP['MONTHBUDGETHOURS_12']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETDOLLARS_1'].setValue(parseFloat(this.budgetsData.MONTHBUDGETDOLLARS_GROUP['MONTHBUDGETDOLLARS_1']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETDOLLARS_2'].setValue(parseFloat(this.budgetsData.MONTHBUDGETDOLLARS_GROUP['MONTHBUDGETDOLLARS_2']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETDOLLARS_3'].setValue(parseFloat(this.budgetsData.MONTHBUDGETDOLLARS_GROUP['MONTHBUDGETDOLLARS_3']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETDOLLARS_4'].setValue(parseFloat(this.budgetsData.MONTHBUDGETDOLLARS_GROUP['MONTHBUDGETDOLLARS_4']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETDOLLARS_5'].setValue(parseFloat(this.budgetsData.MONTHBUDGETDOLLARS_GROUP['MONTHBUDGETDOLLARS_5']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETDOLLARS_6'].setValue(parseFloat(this.budgetsData.MONTHBUDGETDOLLARS_GROUP['MONTHBUDGETDOLLARS_6']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETDOLLARS_7'].setValue(parseFloat(this.budgetsData.MONTHBUDGETDOLLARS_GROUP['MONTHBUDGETDOLLARS_7']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETDOLLARS_8'].setValue(parseFloat(this.budgetsData.MONTHBUDGETDOLLARS_GROUP['MONTHBUDGETDOLLARS_8']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETDOLLARS_9'].setValue(parseFloat(this.budgetsData.MONTHBUDGETDOLLARS_GROUP['MONTHBUDGETDOLLARS_9']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETDOLLARS_10'].setValue(parseFloat(this.budgetsData.MONTHBUDGETDOLLARS_GROUP['MONTHBUDGETDOLLARS_10']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETDOLLARS_11'].setValue(parseFloat(this.budgetsData.MONTHBUDGETDOLLARS_GROUP['MONTHBUDGETDOLLARS_11']).toFixed(2));
      this.userBudget.controls['MONTHBUDGETDOLLARS_12'].setValue(parseFloat(this.budgetsData.MONTHBUDGETDOLLARS_GROUP['MONTHBUDGETDOLLARS_12']).toFixed(2));
    } else {
      this.dialogTitle = 'New Budget';
      this.NowDate(new Date());
      let PERIODSTARTtemp = (new Date());
      PERIODSTARTtemp = new Date(PERIODSTARTtemp.getFullYear(), PERIODSTARTtemp.getMonth(), 1);
      this.userBudget.controls['PERIODSTART'].setValue(this.datepipe.transform(PERIODSTARTtemp, 'dd/MM/yyyy'));
    }

  }

  NowDate(value) {
    let PERIODSTARTtemp = (new Date(value));
    PERIODSTARTtemp = new Date(PERIODSTARTtemp.getFullYear(), PERIODSTARTtemp.getMonth(), 1);
    this.userBudget.controls['PERIODSTART'].setValue(this.datepipe.transform(PERIODSTARTtemp, 'dd/MM/yyyy'));
    this.Months = [];
    for (let i = 0; i < 12; i++) {
      let nowdate = (new Date(value));
      nowdate = new Date(nowdate.getFullYear(), nowdate.getMonth(), 1);
      nowdate.setMonth(nowdate.getMonth() + i);
      this.Months.push(nowdate);
    }
  }
  get f() {
    return this.userBudget.controls;
  }
  MONTHBUDGETHOURS_GROUP() {
    let Obj = this.userBudget.value;
    var O = {};
    for (let i = 1; i <= 12; i++) {
      let key = 'MONTHBUDGETHOURS_' + i;
      O[key] = Obj[key];
    }
    return O;
  }
  MONTHBUDGETDOLLARS_GROUP() {
    let Obj = this.userBudget.value;
    var O = {};
    for (let i = 1; i <= 12; i++) {
      let key = 'MONTHBUDGETDOLLARS_' + i;
      O[key] = Obj[key];
    }
    return O;
  }
  dollaresOnCahneg() {
    let TOTALBUDGETDOLLARS_TEMP: any = this.f.TOTALBUDGETDOLLARS.value / 12;
    this.userBudget.controls['MONTHBUDGETDOLLARS_1'].setValue(parseFloat(TOTALBUDGETDOLLARS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETDOLLARS_2'].setValue(parseFloat(TOTALBUDGETDOLLARS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETDOLLARS_3'].setValue(parseFloat(TOTALBUDGETDOLLARS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETDOLLARS_4'].setValue(parseFloat(TOTALBUDGETDOLLARS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETDOLLARS_5'].setValue(parseFloat(TOTALBUDGETDOLLARS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETDOLLARS_6'].setValue(parseFloat(TOTALBUDGETDOLLARS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETDOLLARS_7'].setValue(parseFloat(TOTALBUDGETDOLLARS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETDOLLARS_8'].setValue(parseFloat(TOTALBUDGETDOLLARS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETDOLLARS_9'].setValue(parseFloat(TOTALBUDGETDOLLARS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETDOLLARS_10'].setValue(parseFloat(TOTALBUDGETDOLLARS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETDOLLARS_11'].setValue(parseFloat(TOTALBUDGETDOLLARS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETDOLLARS_12'].setValue(parseFloat(TOTALBUDGETDOLLARS_TEMP).toFixed(2));
  }
  hoursOnChange() {
    let TOTALBUDGETHOURS_TEMP: any = this.f.TOTALBUDGETHOURS.value / 12;
    this.userBudget.controls['MONTHBUDGETHOURS_1'].setValue(parseFloat(TOTALBUDGETHOURS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETHOURS_2'].setValue(parseFloat(TOTALBUDGETHOURS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETHOURS_3'].setValue(parseFloat(TOTALBUDGETHOURS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETHOURS_4'].setValue(parseFloat(TOTALBUDGETHOURS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETHOURS_5'].setValue(parseFloat(TOTALBUDGETHOURS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETHOURS_6'].setValue(parseFloat(TOTALBUDGETHOURS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETHOURS_7'].setValue(parseFloat(TOTALBUDGETHOURS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETHOURS_8'].setValue(parseFloat(TOTALBUDGETHOURS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETHOURS_9'].setValue(parseFloat(TOTALBUDGETHOURS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETHOURS_10'].setValue(parseFloat(TOTALBUDGETHOURS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETHOURS_11'].setValue(parseFloat(TOTALBUDGETHOURS_TEMP).toFixed(2));
    this.userBudget.controls['MONTHBUDGETHOURS_12'].setValue(parseFloat(TOTALBUDGETHOURS_TEMP).toFixed(2));
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
    if (this.USERGUID == "") {
      PostData.USERBUDGETGUID = this.data.USERBUDGETGUIDIndex;
      this.dialogRef.close(PostData);
    } else {
      this.successMsg = 'Save successfully';
      let FormAction = this.action == 'edit' ? 'update' : 'insert';
      if (this.action == 'edit') {
        PostData.USERBUDGETGUID = this.f.USERBUDGETGUID.value;
        this.budgetsData = JSON.parse(localStorage.getItem('current_budgets'));
        this.successMsg = 'Update successfully';
      }
      let PostBudgetData: any = { FormAction: FormAction, VALIDATEONLY: true, Data: PostData };
      this._mainAPiServiceService.getSetData(PostBudgetData, 'SetUserBudget').subscribe(res => {
        if (res.CODE == 200 && res.STATUS == "success") {
          this.checkValidation(res.DATA.VALIDATIONS, PostBudgetData);
        } else if (res.CODE == 451 && res.STATUS == 'warning') {
          this.checkValidation(res.DATA.VALIDATIONS, PostBudgetData);
        } else if (res.CODE == 450 && res.STATUS == 'error') {
          this.checkValidation(res.DATA.VALIDATIONS, PostBudgetData);
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
    this._mainAPiServiceService.getSetData(PostBudgetData, 'SetUserBudget').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.toastr.success(this.successMsg);
        this.dialogRef.close(true);
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.toastr.warning(this.successMsg);
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.toastr.error(res.STATUS);
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
