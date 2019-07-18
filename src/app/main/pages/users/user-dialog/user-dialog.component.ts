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
  public userData: any = { PERMISSIONS: {} };
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  isLoadingResults = false;
  errorWarningData: any = {};
  action: string;
  dialogTitle: string;
  isspiner = false;
  phide = true;
  USERGUID: any;
  public userinfoDatah: any = [];
  tempPermission: any;
  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
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
  ngOnInit(): void {
    if (this.action === 'edit' || this.action === 'duplicate') {
      this.isLoadingResults = true;
      this._mainAPiServiceService.getSetData({ USERGUID: this.data.USERGUID, 'GETALLFIELDS': true }, 'GetUsers').subscribe(response => {
        if (response.CODE === 200 && response.STATUS === 'success') {
          const userinfoData = response.DATA.USERS[0];
          console.log(userinfoData);
          this.tempPermission = userinfoData.PERMISSIONS;
          this.USERGUID = userinfoData.USERGUID;
          this.userData = userinfoData;
        } else if (response.MESSAGE == "Not logged in") {
          this.dialogRef.close(false);
        }
        this.isLoadingResults = false;
      }, error => {
        this.toastr.error(error);
      });
    } else {
      this.isLoadingResults = true;
      this._mainAPiServiceService.getSetData({ FormAction: 'default', VALIDATEONLY: true, DATA: {} }, 'SetUser').subscribe(res => {
        if (res.CODE == 200 && res.STATUS == "success") {
          this.tempPermission = res.DATA.DEFAULTVALUES.PERMISSIONS;
        } else if (res.MESSAGE === 'Not logged in') {
          this.dialogRef.close(false);
        }
      }, error => { this.toastr.error(error); });
      setTimeout(() => { this.isLoadingResults = false; }, 2000);
    }
  }

  RatePerHourVal() {
    // this.userForm.controls['RATEPERHOUR'].setValue(parseFloat(this.f.RATEPERHOUR.value).toFixed(2));
  }
  RatePerDayVal() {
    // this.userForm.controls['RATEPERDAY'].setValue(parseFloat(this.f.RATEPERDAY.value).toFixed(2));
  }
  onLinkClick(event: MatTabChangeEvent) {
    if (event.index === 1) {
      const tempPermission = this.tempPermission;
      const PermissionsCons = ['MATTER DETAILS', 'DAY BOOK / TIME ENTRIES', 'CONTACTS', 'ESTIMATES', 'DOCUMENT/EMAIL GENERATION', 'DOCUMENT REGISTER', 'INVOICING', 'RECEIVE MONEY', 'SPEND MONEY', 'CHRONOLOGY', 'TOPICS', 'AUTHORITIES', 'FILE NOTES', 'SAFE CUSTODY', 'SAFE CUSTODY PACKET', 'SEARCHING', 'DIARY', 'TASKS', 'CHART OF ACCOUNTS', 'GENERAL JOURNAL', 'OTHER ACCOUNTING', 'TRUST MONEY', 'TRUST CHART OF ACCOUNTS', 'TRUST GENERAL JOURNAL', 'TRUST REPORTS', 'ACCOUNTING REPORTS', 'MANAGEMENT REPORTS', 'SYSTEM', 'USERS', 'ACTIVITIES/SUNDRIES'];
      const userPermissiontemp: any = [];
      if (tempPermission) {
        PermissionsCons.forEach((value) => {
          if (tempPermission[value]) {
            const subPermissions = [];
            tempPermission[value].forEach((value2) => {
              subPermissions.push(value2);
            });
            userPermissiontemp.push({ key: value, val: subPermissions });
          }
        });
      }
      this.userinfoDatah = userPermissiontemp;
    }
  }
  SaveUser() {
    this.isspiner = true;
    if (this.action === 'edit') {
      // data.USERGUID = this.f.USERGUID.value;
    }
    const userPostData: any = { FormAction: 'insert', VALIDATEONLY: true, DATA: this.userData };
    console.log(userPostData);
    return false;
    this._mainAPiServiceService.getSetData(userPostData, 'SetUser').subscribe(res => {
      if (res.CODE === 200 && res.STATUS === "success") {
        this.checkValidation(res.DATA.VALIDATIONS, userPostData);
      } else if (res.CODE === 451 && res.STATUS === "warning") {
        this.checkValidation(res.DATA.VALIDATIONS, userPostData);
      } else if (res.CODE === 450 && res.STATUS === "error") {
        this.checkValidation(res.DATA.VALIDATIONS, userPostData);
      } else if (res.MESSAGE === 'Not logged in') {
        this.dialogRef.close(false);
      }
    }, error => {
      this.isspiner = false;
      this.toastr.error(error);
    });
  }
  checkValidation(bodyData: any, details: any): void {
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

}
