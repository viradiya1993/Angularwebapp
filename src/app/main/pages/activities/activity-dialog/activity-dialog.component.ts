import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { UsersService } from 'app/_services';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-activity-dialog',
  templateUrl: './activity-dialog.component.html',
  styleUrls: ['./activity-dialog.component.scss']
})
export class ActivityDialogComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  activityForm: FormGroup;
  isLoadingResults: boolean = false;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;
  RATEPERUNIT: any;
  successMsg: any;
  errorWarningData: any = {};

  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<ActivityDialogComponent>,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _UsersService: UsersService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.action = data.action;
    if (this.action === 'new') {
      this.dialogTitle = 'New Activity';
    } else if (this.action === 'edit') {
      this.dialogTitle = 'edit Activity';
    } else {
      this.dialogTitle = 'Duplicate Activity';
    }
  }

  ngOnInit() {
    this.activityForm = this._formBuilder.group({
      ACTIVITYGUID: [''],
      ACTIVITYTYPE: [''],
      ACTIVITYID: [''],
      DESCRIPTION: [''],
      GSTTYPE: [''],
      RATEPERUNIT: ['', Validators.required],
      UNITDESCRIPTIONPLURAL: [''],
      UNITDESCRIPTIONSINGLE: ['']
    });
    if (this.action == 'edit' || this.action == "Duplicate") {
      this.activityForm.controls['ACTIVITYGUID'].setValue(this.data.ACTIVITYGUID);
      this.isLoadingResults = true;
      this._UsersService.GetActivityData({ ACTIVITYGUID: this.data.ACTIVITYGUID }).subscribe(response => {
        if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
          if (response.DATA.ACTIVITIES[0]) {
            let activityData = response.DATA.ACTIVITIES[0];
            this.activityForm.controls['ACTIVITYTYPE'].setValue(activityData.ACTIVITYTYPEDESC);
            this.activityForm.controls['ACTIVITYID'].setValue(activityData.ACTIVITYID);
            this.activityForm.controls['DESCRIPTION'].setValue(activityData.DESCRIPTION);
            this.activityForm.controls['GSTTYPE'].setValue(activityData.GSTTYPEDESC);
            this.activityForm.controls['RATEPERUNIT'].setValue(parseFloat(activityData.RATEPERUNIT).toFixed(2));
            this.activityForm.controls['UNITDESCRIPTIONPLURAL'].setValue(activityData.UNITDESCRIPTIONPLURAL);
            this.activityForm.controls['UNITDESCRIPTIONSINGLE'].setValue(activityData.UNITDESCRIPTIONSINGLE);
          } else {
            this.toastr.error('No data found please try again');
          }
        }
        this.isLoadingResults = false;
      }, error => {
        this.toastr.error(error);
      });
    }
  }
  RatePerUnitVal() {
    this.RATEPERUNIT = parseFloat(this.f.RATEPERUNIT.value).toFixed(2);
  }
  get f() {
    return this.activityForm.controls;
  }

  saveActivity() {
    this.isspiner = true;
    let PostData: any = {
      "ACTIVITYID": this.f.ACTIVITYID.value,
      "ACTIVITYTYPE": this.f.ACTIVITYTYPE.value,
      "DESCRIPTION": this.f.DESCRIPTION.value,
      "GSTTYPE": this.f.GSTTYPE.value,
      "RATEPERUNIT": this.f.RATEPERUNIT.value,
      "UNITDESCRIPTIONSINGLE": this.f.UNITDESCRIPTIONSINGLE.value,
      "UNITDESCRIPTIONPLURAL": this.f.UNITDESCRIPTIONPLURAL.value,
    }
    this.successMsg = 'Save successfully';
    let FormAction = this.action == 'edit' ? 'update' : 'insert';
    if (this.action == 'edit') {
      PostData.ACTIVITYGUID = this.f.ACTIVITYGUID.value;
      this.successMsg = 'Update successfully';
    }
    let PostActivityData: any = { FormAction: FormAction, VALIDATEONLY: true, Data: PostData };
    this._UsersService.SetActivityData(PostActivityData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.checkValidation(res.DATA.VALIDATIONS, PostActivityData);
      } else if (res.CODE == 451 && res.STATUS == "warning") {
        this.checkValidation(res.DATA.VALIDATIONS, PostActivityData);
      } else if (res.CODE == 450 && res.STATUS == "error") {
        this.checkValidation(res.DATA.VALIDATIONS, PostActivityData);
      } else if (res.MESSAGE == "Not logged in") {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
  checkValidation(bodyData: any, PostActivityData: any) {
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
      // this.toastr.warning(warningData);
      this.confirmDialogRef = this.MatDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.saveActivityData(PostActivityData);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.saveActivityData(PostActivityData);
    this.isspiner = false;
  }
  saveActivityData(PostActivityData: any) {
    PostActivityData.VALIDATEONLY = false;
    this._UsersService.SetActivityData(PostActivityData).subscribe(res => {
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
