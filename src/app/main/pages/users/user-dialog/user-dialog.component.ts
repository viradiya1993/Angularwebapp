import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { UsersService } from 'app/_services';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  isLoadingResults: boolean = false;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;
  theCheckbox = true;
  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    private _UsersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.action = data.action;
    if (this.action === 'new') {
      this.dialogTitle = 'New User';
    } else if (this.action === 'edit') {
      this.dialogTitle = 'Update User';
    } else {
      this.dialogTitle = 'Duplicate User';
    }

  }
  userForm: FormGroup;
  ngOnInit() {
    this.userForm = this._formBuilder.group({
      username: ['', Validators.required],
      fullname: ['', Validators.required],
      password: ['', Validators.required],
      active: [''],
      isprocipal: [''],
      // Fee Earner
      feeearnerid: [''],
      posotion: [''],
      hours: [''],
      day: [''],
      // Redio left
      ph1: [''],
      ph2: [''],
      fax1: [''],
      fax2: [''],
      mobile: [''],
      pracno: [''],
      comment: [''],
      //Security
      allowaccess: [''],
      //Info Track
      usernameinfo: [''],
      passwordinfo: ['']
      //Budgets
    });
  }
  get f() {
    return this.userForm.controls;
  }
  SaveUser(): void {
    this.isspiner = true;
    let data = {
      INCOMECLASS: this.f.INCOMECLASS.value,
      INCOMETYPE: this.f.INCOMETYPE.value,
      // FIRMGUID: this.f.FIRMGUID.value,
      INCOMEDATE: this.f.INCOMEDATE.value,
      PAYEE: this.f.PAYEE.value,
      AMOUNT: this.f.AMOUNT.value,
      GST: this.f.GST.value,
      BANKACCOUNTGUID: "ACCAAAAAAAAAAAA4",
      INCOMEACCOUNTGUID: "ACCAAAAAAAAAAAA5",
      NOTE: this.f.NOTE.value,
    }
    let matterPostData: any = { FormAction: 'insert', VALIDATEONLY: true, Data: data };
    this._UsersService.SetUserData(matterPostData).subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, data);
      } else if (response.CODE == 451 && response.STATUS == "warning") {
        this.checkValidation(response.DATA.VALIDATIONS, data);
      } else if (response.MESSAGE == "Not logged in") {
        this.dialogRef.close(false);
      }
    }, error => {
      this.isspiner = false;
      this.toastr.error(error);
    });
  }
  checkValidation(bodyData: any, details: any) {
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
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.SaveUserAfterVAlidation(details);
    this.isspiner = false;
  }
  SaveUserAfterVAlidation(data: any) {
    data.VALIDATEONLY = false;
    this._UsersService.SetUserData(data).subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.toastr.success('Receipt save successfully');
        this.isspiner = false;
        this.dialogRef.close(true);
      }
      else if (response.MESSAGE == "Not logged in") {
        this.dialogRef.close(false);
      } else {
        this.isspiner = false;
      }
    }, error => {
      this.toastr.error(error);
    });
  }

}
