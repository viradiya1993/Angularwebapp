import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog, MatTabChangeEvent } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MainAPiServiceService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
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
  USERGUID: any;
  userinfoDatah: any = [];
  tempPermission: any;
  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
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
      USERID: [''],
      //Info Track
      SEARCHUSERNAME: [''],
      SEARCHUSERPASSWORD: [''],
      allowaccess: [''],
      USERGUID: [''],
    });
    if (this.action === 'edit' || this.action === 'duplicate') {
      this.isLoadingResults = true;
      this._mainAPiServiceService.getSetData({ USERGUID: this.data.USERGUID, 'GETALLFIELDS': true }, 'GetUsers').subscribe(response => {
        if (response.CODE === 200 && response.STATUS === 'success') {
          let userinfoData = response.DATA.USERS[0];
          this.tempPermission = userinfoData.PERMISSIONS;
          this.USERGUID = userinfoData.USERGUID;
          this.userForm.controls['USERGUID'].setValue(userinfoData.USERGUID);
          this.userForm.controls['USERNAME'].setValue(userinfoData.USERNAME);
          this.userForm.controls['FULLNAME'].setValue(userinfoData.FULLNAME);
          this.userForm.controls['USERID'].setValue(userinfoData.USERID);
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
  onLinkClick(event: MatTabChangeEvent) {
    if (event.index == 1) {
      let tempPermission = this.tempPermission;
      let PermissionsCons = ['MATTER DETAILS', 'DAY BOOK / TIME ENTRIES', 'CONTACTS', 'ESTIMATES', 'DOCUMENT/EMAIL GENERATION', 'DOCUMENT REGISTER', 'INVOICING', 'RECEIVE MONEY', 'SPEND MONEY', 'CHRONOLOGY', 'TOPICS', 'AUTHORITIES', 'FILE NOTES', 'SAFE CUSTODY', 'SAFE CUSTODY PACKET', 'SEARCHING', 'DIARY', 'TASKS', 'CHART OF ACCOUNTS', 'GENERAL JOURNAL', 'OTHER ACCOUNTING', 'TRUST MONEY', 'TRUST CHART OF ACCOUNTS', 'TRUST GENERAL JOURNAL', 'TRUST REPORTS', 'ACCOUNTING REPORTS', 'MANAGEMENT REPORTS', 'SYSTEM', 'USERS', 'ACTIVITIES/SUNDRIES'];
      let userPermissiontemp: any = [];
      PermissionsCons.forEach(function (value) {
        if (tempPermission[value]) {
          let subPermissions: any = [];
          tempPermission[value].forEach(function (value2) {
            subPermissions.push(value2.NAME);
          });
          userPermissiontemp[value] = subPermissions;
        }
      });
      this.userinfoDatah = userPermissiontemp;
      console.log(this.userinfoDatah);
    }
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
    this._mainAPiServiceService.getSetData(userPostData, 'SetUser').subscribe(res => {
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
    this._mainAPiServiceService.getSetData(data, 'SetUser').subscribe(response => {
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
  permissionConvert(tempData: any) {
    let PermissionsCons = ['MATTER DETAILS', 'DAY BOOK / TIME ENTRIES', 'CONTACTS', 'ESTIMATES', 'DOCUMENT/EMAIL GENERATION', 'DOCUMENT REGISTER', 'INVOICING', 'RECEIVE MONEY', 'SPEND MONEY', 'CHRONOLOGY', 'TOPICS', 'AUTHORITIES', 'FILE NOTES', 'SAFE CUSTODY', 'SAFE CUSTODY PACKET', 'SEARCHING', 'DIARY', 'TASKS', 'CHART OF ACCOUNTS', 'GENERAL JOURNAL', 'OTHER ACCOUNTING', 'TRUST MONEY', 'TRUST CHART OF ACCOUNTS', 'TRUST GENERAL JOURNAL', 'TRUST REPORTS', 'ACCOUNTING REPORTS', 'MANAGEMENT REPORTS', 'SYSTEM', 'USERS', 'ACTIVITIES/SUNDRIES'];
    let userPermissiontemp: any = [];
    PermissionsCons.forEach(function (value) {
      if (tempData[value]) {
        let subPermissions: any = [];
        tempData[value].forEach(function (value2) {
          subPermissions.push(value2.NAME);
        });
        userPermissiontemp[value] = subPermissions;
      }
    });
    this.userinfoDatah = userPermissiontemp;
  }

}
