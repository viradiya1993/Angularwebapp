import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
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
  errorWarningData: any = {};
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;
  phide: boolean = true;
  userForm: FormGroup;
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
    // this.action = data.USERGUID;
    if (this.action === 'new') {
      this.dialogTitle = 'New User';
    } else if (this.action === 'edit') {
      this.dialogTitle = 'Update User';
    } else {
      this.dialogTitle = 'Duplicate User';
    }

  }
  ngOnInit() {
    this.userForm = this._formBuilder.group({
      ISACTIVE: [true],
      ISPRINCIPAL: [''],
      USERNAME: [''],
      USERPASSWORD: [''],
      FULLNAME: [''],
      // Fee Earner
      PRACTICINGCERTIFICATENO: [''],
      PHONE1: [''],
      PHONE2: [''],
      FAX1: [''],
      FAX2: [''],
      MOBILE: [''],
      COMMENT: [''],
      GSTTYPE: [''],
      POSITION: [''],
      EMAIL: [''],
      RATEPERHOUR: [''],
      RATEPERDAY: [''],
      feeearnerid: [''],
      //Info Track
      SEARCHUSERNAME: [''],
      SEARCHUSERPASSWORD: [''],

      allowaccess: [''],
    });
    if (this.action === 'edit' || this.action === 'duplicate') {
      this.isLoadingResults = true;
      this._UsersService.getUserData({ USERGUID: this.data.USERGUID, 'GETALLFIELDS': true }).subscribe(response => {
        if (response.CODE === 200 && response.STATUS === 'success') {
          let userinfoData = response.DATA.USERS[0];
          this.userForm.controls['USERNAME'].setValue(userinfoData.USERNAME);
          this.userForm.controls['FULLNAME'].setValue(userinfoData.FULLNAME);
          this.userForm.controls['USERPASSWORD'].setValue(userinfoData.USERPASSWORD);
          this.userForm.controls['ISACTIVE'].setValue(userinfoData.ISACTIVE == 1 ? true : false);
          this.userForm.controls['ISPRINCIPAL'].setValue(userinfoData.ISPRINCIPAL == 1 ? true : false);
          this.userForm.controls['PHONE1'].setValue(userinfoData.PHONE1);
          this.userForm.controls['PHONE2'].setValue(userinfoData.PHONE2);
          this.userForm.controls['MOBILE'].setValue(userinfoData.MOBILE);
          this.userForm.controls['FAX2'].setValue(userinfoData.FAX2);
          this.userForm.controls['FAX1'].setValue(userinfoData.FAX1);
          this.userForm.controls['EMAIL'].setValue(userinfoData.EMAIL);
          this.userForm.controls['COMMENT'].setValue(userinfoData.COMMENT);
          this.userForm.controls['PRACTICINGCERTIFICATENO'].setValue(userinfoData.PRACTICINGCERTIFICATENO);
          this.userForm.controls['POSITION'].setValue(userinfoData.POSITION);
          this.userForm.controls['RATEPERHOUR'].setValue(userinfoData.RATEPERHOUR);
          this.userForm.controls['RATEPERDAY'].setValue(userinfoData.RATEPERDAY);
          this.userForm.controls['SEARCHUSERNAME'].setValue(userinfoData.SEARCHUSERNAME);
          this.userForm.controls['SEARCHUSERPASSWORD'].setValue(userinfoData.SEARCHUSERPASSWORD);
        } else if (response.MESSAGE == "Not logged in") {
          this.dialogRef.close(false);
        }
        this.isLoadingResults = false;
      }, error => {
        this.toastr.error(error);
      });
    }
  }
  get f() {
    return this.userForm.controls;
  }
  SaveUser(): void {
    this.isspiner = true;
    let data = {
      USERNAME: this.f.USERNAME.value,
      FULLNAME: this.f.FULLNAME.value,
      USERPASSWORD: this.f.USERPASSWORD.value,
      ISACTIVE: this.f.ISACTIVE.value == true ? 1 : 0,
      ISPRINCIPAL: this.f.ISPRINCIPAL.value == true ? 1 : 0,
      PHONE1: this.f.PHONE1.value,
      PHONE2: this.f.PHONE2.value,
      MOBILE: this.f.MOBILE.value,
      FAX2: this.f.FAX2.value,
      FAX1: this.f.FAX1.value,
      COMMENT: this.f.COMMENT.value,
      PRACTICINGCERTIFICATENO: this.f.PRACTICINGCERTIFICATENO.value,
      POSITION: this.f.POSITION.value,
      RATEPERHOUR: this.f.RATEPERHOUR.value,
      RATEPERDAY: this.f.RATEPERDAY.value,
      EMAIL: this.f.EMAIL.value,
      SEARCHUSERNAME: this.f.SEARCHUSERNAME.value,
      SEARCHUSERPASSWORD: this.f.SEARCHUSERPASSWORD.value
    }
    let userPostData: any = { FormAction: 'insert', VALIDATEONLY: true, DATA: data };
    this._UsersService.SetUserData(userPostData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.checkValidation(res.DATA.VALIDATIONS, userPostData);
      } else if (res.CODE == 451 && res.STATUS == "warning") {
        this.checkValidation(res.DATA.VALIDATIONS, userPostData);
      } else if (res.CODE == 450 && res.STATUS == "error") {
        this.checkValidation(res.DATA.VALIDATIONS, userPostData);
      } else if (res.MESSAGE == "Not logged in") {
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
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, { disableClose: true, width: '100%', data: warningData });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.SaveUserAfterVAlidation(details);
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
        this.toastr.success('User save successfully');
        this.isspiner = false;
        this.dialogRef.close(true);
      } else if (response.CODE == 451 && response.STATUS == "warning") {
        this.toastr.warning(response.MESSAGE);
      } else if (response.CODE == 450 && response.STATUS == "error") {
        this.toastr.error(response.MESSAGE);
      } else if (response.MESSAGE == "Not logged in") {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, error => {
      this.toastr.error(error);
    });
  }

}
