import { Component, OnInit, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MainAPiServiceService, BehaviorService, TimersService } from 'app/_services';
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ContactSelectDialogComponent } from 'app/main/pages/contact/contact-select-dialog/contact-select-dialog.component';
import { isNull } from 'util';


@Component({
  selector: 'app-safe-custody-dialog',
  templateUrl: './safe-custody-dialog.component.html',
  styleUrls: ['./safe-custody-dialog.component.scss'],
  animations: fuseAnimations
})
export class SafeCustodyDialogeComponent implements OnInit {
  SafeCustody: FormGroup;
  isLoadingResults: boolean = false;
  errorWarningData: any = { "Error": [], 'Warning': [] };
  isspiner: boolean = false;
  action: any;
  dialogTitle: string;
  mattername: any;
  FormAction: any;
  safecustodydata: any = [];
  cuurentmatter = JSON.parse(localStorage.getItem('set_active_matters'));
  documnettype: any = [];
  packetcustody: any = [];
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(private _mainAPiServiceService: MainAPiServiceService,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private behaviorService: BehaviorService,
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<SafeCustodyDialogeComponent>,
    public _matDialog: MatDialog,
    private Timersservice: TimersService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.action = data.safeCustodyData.action;
    if (this.action === 'new client' || this.action === 'new matter' || this.action === 'newlegal') {
      this.dialogTitle = 'New Safe Custody';
    } else if (this.action === 'edit' || this.action === 'editlegal') {
      this.dialogTitle = 'Update Safe Custody';
    } else if (this.action === 'copy') {
      this.dialogTitle = 'Duplicate Safe Custody';
    }
    this.behaviorService.SafeCustody$.subscribe(result => {
      if (result) {
        this.safecustodydata = result;
      }
    });
  }

  ngOnInit() {
    this.SafeCustody = this._formBuilder.group({
      SAFECUSTODYGUID: [''],
      SAFECUSTODYPACKETGUID: [''],
      MATTERGUID: [""],
      SHORTNAME: [''],
      CONTACTGUID: [''],
      CONTACTNAME: [''],
      DOCUMENTTYPE: [''],
      SAFECUSTODYDESCRIPTION: [''],
      DOCUMENTNAME: [''],
      ADDITIONALTEXT: [''],
      REMINDERDATE: [this.datepipe.transform(new Date(), 'dd/MM/yyyy')],
      REMINDERDATETEXT: [new Date()],
      CHECKINDATE: [this.datepipe.transform(new Date(), 'dd/MM/yyyy')],
      CHECKINDATETEXT: [new Date()],
      CHECKINCONTACTNAME: [''],
    });
    if (this.action == 'edit' || this.action === 'copy' || this.action === 'editlegal') {
      this.isLoadingResults = true;
      this._mainAPiServiceService.getSetData({ SAFECUSTODYGUID: this.safecustodydata.SAFECUSTODYGUID }, 'GetSafeCustody').subscribe(res => {
        if (res.CODE == 200 && res.STATUS == "success") {
          let SAFECUSTODIESDATA = res.DATA.SAFECUSTODIES[0];
          // console.log(SAFECUSTODIESDATA);
          this.SafeCustody.controls['SAFECUSTODYGUID'].setValue(SAFECUSTODIESDATA.SAFECUSTODYGUID);
          this.SafeCustody.controls['MATTERGUID'].setValue(SAFECUSTODIESDATA.MATTERGUID);
          if (SAFECUSTODIESDATA.MATTERGUID != '')
            this.SafeCustody.controls['SHORTNAME'].setValue(SAFECUSTODIESDATA.SHORTNAME);
          else
            this.SafeCustody.controls['SHORTNAME'].setValue('No Matter');
          if (SAFECUSTODIESDATA.REMINDERDATE) {
            let tempDate = SAFECUSTODIESDATA.REMINDERDATE.split("/");
            this.SafeCustody.controls['REMINDERDATETEXT'].setValue(new Date(tempDate[1] + '/' + tempDate[0] + '/' + tempDate[2]));
            this.SafeCustody.controls['REMINDERDATE'].setValue(SAFECUSTODIESDATA.REMINDERDATE);
          }
          this.SafeCustody.controls['SAFECUSTODYPACKETGUID'].setValue(SAFECUSTODIESDATA.SAFECUSTODYPACKETGUID);
          if (this.action === 'copy') {
            this.SafeCustody.controls['CONTACTNAME'].setValue(this.data.safeCustodyData.result.CONTACTNAME);
            this.SafeCustody.controls['CONTACTGUID'].setValue(this.data.safeCustodyData.result.CONTACTGUID);
          } else {
            this.SafeCustody.controls['CONTACTGUID'].setValue(SAFECUSTODIESDATA.CONTACTGUID);
            this.SafeCustody.controls['CONTACTNAME'].setValue(SAFECUSTODIESDATA.CONTACTNAME);
          }
          this.SafeCustody.controls['ADDITIONALTEXT'].setValue(SAFECUSTODIESDATA.ADDITIONALTEXT);
          this.SafeCustody.controls['DOCUMENTTYPE'].setValue(SAFECUSTODIESDATA.DOCUMENTTYPE);
          this.SafeCustody.controls['DOCUMENTNAME'].setValue(SAFECUSTODIESDATA.DOCUMENTNAME);
          this.SafeCustody.controls['SAFECUSTODYDESCRIPTION'].setValue(SAFECUSTODIESDATA.SAFECUSTODYDESCRIPTION);
          this._mainAPiServiceService.getSetData({ SAFECUSTODYGUID: SAFECUSTODIESDATA.SAFECUSTODYGUID }, 'GetSafeCustodyMovement').subscribe(res => {
            console.log(res);
            if (res.CODE == 200 && res.STATUS == "success") {
              if (this.action == 'edit' || this.action === 'editlegal') {

              }
            }
          });
        } else if (res.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
        this.isLoadingResults = false;
      }, err => {
        this.toastr.error(err);
        this.isLoadingResults = false;
      });
    } else if (this.action === 'new client') {
      this.SafeCustody.controls['SHORTNAME'].setValue('No Matter');
      this.SafeCustody.controls['CONTACTNAME'].setValue(this.data.safeCustodyData.result.CONTACTNAME);
      this.SafeCustody.controls['CONTACTGUID'].setValue(this.data.safeCustodyData.result.CONTACTGUID);
    } else if (this.action === 'new matter') {
      this.SafeCustody.controls['SHORTNAME'].setValue(this.data.safeCustodyData.result.SHORTNAME);
      this.SafeCustody.controls['MATTERGUID'].setValue(this.data.safeCustodyData.result.MATTERGUID);
      this.SafeCustody.controls['CONTACTNAME'].setValue(this.data.safeCustodyData.result.CONTACTNAME);
      this.SafeCustody.controls['CONTACTGUID'].setValue(this.data.safeCustodyData.result.CONTACTGUID);
    } else if (this.action === 'newlegal') {
      this.SafeCustody.controls['SHORTNAME'].setValue(this.cuurentmatter.SHORTNAME);
      this.SafeCustody.controls['MATTERGUID'].setValue(this.cuurentmatter.MATTERGUID);
      this.SafeCustody.controls['CONTACTNAME'].setValue(this.cuurentmatter.CONTACTNAME);
      this.SafeCustody.controls['CONTACTGUID'].setValue(this.cuurentmatter.CONTACTGUID);
    }
    this.isLoadingResults = true;
    this.Timersservice.GetLookupsData({ LookupType: 'Document Type' }).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.documnettype = res.DATA.LOOKUPS;
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
      this.isLoadingResults = false;
    });
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({}, 'GetSafeCustodyPacket').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.packetcustody = res.DATA.SAFECUSTODYPACKETS;
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
      this.isLoadingResults = false;
    });
  }
  get f() {
    return this.SafeCustody.controls;
  }
  SelectContact() {
    const dialogRef = this._matDialog.open(ContactSelectDialogComponent, { width: '100%', disableClose: true, data: '' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.SafeCustody.controls['CONTACTGUID'].setValue(result.CONTACTGUID);
        this.SafeCustody.controls['CONTACTNAME'].setValue(result.CONTACTNAME);
      }
    });
  }
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.SafeCustody.controls['REMINDERDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  PersonDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.SafeCustody.controls['CHECKINDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }

  SaveSafeCustody() {
    let PostData: any = {
      "SAFECUSTODYPACKETGUID": this.f.SAFECUSTODYPACKETGUID.value,
      "CONTACTGUID": this.f.CONTACTGUID.value,
      "DOCUMENTTYPE": this.f.DOCUMENTTYPE.value,
      "SAFECUSTODYDESCRIPTION": this.f.SAFECUSTODYDESCRIPTION.value,
      "DOCUMENTNAME": this.f.DOCUMENTNAME.value,
      "ADDITIONALTEXT": this.f.ADDITIONALTEXT.value,
      "REMINDERDATE": this.f.REMINDERDATE.value,
      "CHECKINDATE": this.f.CHECKINDATE.value,
      "CHECKINCONTACTNAME": this.f.CHECKINCONTACTNAME.value,
      "REMINDERGROUP": {
        "REMINDER": '',
        "REMINDERDATE": this.datepipe.transform(new Date(), 'dd/MM/yyyy'),
        "REMINDERTIME": ''
      }
    }
    PostData.MATTERGUID = isNull(this.f.MATTERGUID.value) ? "" : this.f.MATTERGUID.value;
    if (this.action === 'edit') {
      this.FormAction = 'update'
      PostData.SAFECUSTODYGUID = this.f.SAFECUSTODYGUID.value;
    } else {
      this.FormAction = 'insert'
    }
    this.isspiner = true;
    let PostFinalData: any = { FormAction: this.FormAction, VALIDATEONLY: true, Data: PostData };
    this._mainAPiServiceService.getSetData(PostFinalData, 'SetSafeCustody').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, PostFinalData);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.checkValidation(response.DATA.VALIDATIONS, PostFinalData);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.checkValidation(response.DATA.VALIDATIONS, PostFinalData);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      } else {
        this.isspiner = false;
      }
    }, err => {
      this.toastr.error(err);
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
      }
      else if (value.VALUEVALID == 'Warning') {
        tempWarning[value.FIELDNAME] = value;
        warningData.push(value.ERRORDESCRIPTION);
      }

    });
    this.errorWarningData = { "Error": tempError, 'Warning': tempWarning };
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
          this.SafeCusodySave(details);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.SafeCusodySave(details);
    this.isspiner = false;
  }

  SafeCusodySave(data: any) {
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetSafeCustody').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        if (this.action !== 'edit') {
          this.toastr.success(' save successfully');
        } else {
          this.toastr.success(' update successfully');
        }
        this.isspiner = false;
        this.dialogRef.close(true);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.toastr.warning(response.MESSAGE);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.toastr.error(response.MESSAGE);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, error => {
      this.toastr.error(error);
    });
  }

}
