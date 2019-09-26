import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { BehaviorService, MainAPiServiceService } from 'app/_services';
import * as $ from 'jquery';
@Component({
  selector: 'app-chart-ac-dailog',
  templateUrl: './chart-ac-dailog.component.html',
  styleUrls: ['./chart-ac-dailog.component.scss']
})
export class ChartAcDailogComponent implements OnInit {
  successMsg: any;
  accountType: any;
  errorWarningData: any = {};
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  isLoadingResults: boolean = false;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;
  AccountForm: FormGroup;
  AccountData: any = [];
  theCheckbox = true;
  sendtype: number;
  constructor(
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
    this.behaviorService.ChartAccountData$.subscribe(result => { if (result) {
      console.log(result);
       this.AccountData = result; } });
  }
  ngOnInit() {
    this.AccountForm = this._formBuilder.group({
      ACCOUNTGUID: [''],
      ACCOUNTCLASS: [''],
      ACCOUNTNAME: ['', Validators.required],
      //General
      ACCOUNTNUMBER: ['1-'],
      ACCOUNTTYPE: [''],
      ACTIVE: [''],
      ACCOUNTTYPENAME:[''],
      //EXPORTINFO 
      MYOBEXPORTACCOUNT: [''],
      //bank BANKDETAILS 
      BANKNAME: [''],
      BANKADDRESS: [''],
      BANKBSB: [''],
      SForSendACCNO:[''],
      BANKACCOUNTNUMBER: [''],
      BANKTERM: [''],
      BANKINTERESTRATE: [''],
    });
    if (this.action == "edit" || this.action == 'duplicate') {
      console.log("fgjhjkghkjdf");
      this.isLoadingResults = true;
      this._mainAPiServiceService.getSetData({ACCOUNTGUID:this.AccountData.ACCOUNTGUID },'GetAccount').subscribe(res => {
        console.log(res);
        if (res.CODE == 200 && res.STATUS == "success") {
          if (this.action != 'duplicate') {
            this.AccountForm.controls['ACCOUNTGUID'].setValue(res.DATA.ACCOUNTS[0].ACCOUNTGUID);
          }
          this.AccountForm.controls['ACCOUNTCLASS'].setValue(res.DATA.ACCOUNTS[0].ACCOUNTCLASSNAME);          // toString()
          this.AccountForm.controls['ACCOUNTNAME'].setValue(res.DATA.ACCOUNTS[0].ACCOUNTNAME);
          //General
          this.AccountForm.controls['SForSendACCNO'].setValue(res.DATA.ACCOUNTS[0].ACCOUNTNUMBER); 
          this.AccountForm.controls['ACCOUNTNUMBER'].setValue(res.DATA.ACCOUNTS[0].ACCOUNTCLASS + ' - ' + res.DATA.ACCOUNTS[0].ACCOUNTNUMBER);
          this.accountType = res.DATA.ACCOUNTS[0].ACCOUNTTYPENAME;
          this.AccountForm.controls['ACCOUNTTYPE'].setValue(res.DATA.ACCOUNTS[0].ACCOUNTTYPENAME);          // toString()
        
          this.AccountForm.controls['ACTIVE'].setValue(res.DATA.ACCOUNTS[0].ACTIVE);
          //EXPORTINFO
          this.AccountForm.controls['MYOBEXPORTACCOUNT'].setValue(res.DATA.ACCOUNTS[0].EXPORTINFO['MYOBEXPORTACCOUNT']);
          //BANKDETAILS
          this.AccountForm.controls['BANKNAME'].setValue(res.DATA.ACCOUNTS[0].BANKDETAILS['BANKNAME']);
          this.AccountForm.controls['BANKADDRESS'].setValue(res.DATA.ACCOUNTS[0].BANKDETAILS['BANKADDRESS']);
          this.AccountForm.controls['BANKBSB'].setValue(res.DATA.ACCOUNTS[0].BANKDETAILS['BANKBSB']);
          this.AccountForm.controls['BANKACCOUNTNUMBER'].setValue(res.DATA.ACCOUNTS[0].BANKDETAILS['BANKACCOUNTNUMBER']);
          this.AccountForm.controls['BANKTERM'].setValue(res.DATA.ACCOUNTS[0].BANKDETAILS['BANKTERM']);
          this.AccountForm.controls['BANKINTERESTRATE'].setValue(res.DATA.ACCOUNTS[0].BANKDETAILS['BANKINTERESTRATE']);
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
  if(this.f.ACCOUNTTYPE.value == 'Header'){
    this.sendtype=1;
  }else if(this.f.ACCOUNTTYPE.value == 'Detail'){
    this.sendtype=2;
  }else if(this.f.ACCOUNTTYPE.value == 'Bank Account'){
    this.sendtype=3;
  }
    this.isspiner = true;
    let PostData: any = {
      ACCOUNTCLASS: this.f.ACCOUNTCLASS.value,
      ACCOUNTNAME: this.f.ACCOUNTNAME.value,
      ACCOUNTNUMBER: this.f.ACCOUNTNUMBER.value,
      ACCOUNTTYPE: this.sendtype,
      // ACCOUNTTYPENAME:this.f.ACCOUNTTYPENAME.value,
      ACTIVE: this.f.ACTIVE.value,
      MYOBEXPORTACCOUNT: this.f.MYOBEXPORTACCOUNT.value,
      BANKDETAILS:{
        BANKNAME: this.f.BANKNAME.value,
        BANKADDRESS: this.f.BANKADDRESS.value,
        BANKBSB: this.f.BANKBSB.value,
        BANKACCOUNTNUMBER: this.f.BANKACCOUNTNUMBER.value,
        BANKTERM: this.f.BANKTERM.value,
        BANKINTERESTRATE: this.f.BANKINTERESTRATE.value,
      }
    }
    this.successMsg = 'Save successfully';
      let FormAction = this.action == 'edit' ? 'update' : 'insert';
    if (this.action == 'edit') {
      PostData.ACCOUNTGUID = this.f.ACCOUNTGUID.value;
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
  onACCOUNTTYPE(value) {
    this.accountType = value;
  }
  saveAccountData(PostAccountData: any) {
    PostAccountData.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(PostAccountData, 'SetAccount').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.toastr.success(this.successMsg);
        $('#refreshChartACCTab').click();
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
