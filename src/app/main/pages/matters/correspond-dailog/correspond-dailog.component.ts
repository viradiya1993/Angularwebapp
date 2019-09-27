import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ContactSelectDialogComponent } from '../../contact/contact-select-dialog/contact-select-dialog.component';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-correspond-dailog',
  templateUrl: './correspond-dailog.component.html',
  styleUrls: ['./correspond-dailog.component.scss']
})
export class CorrespondDailogComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    public MatDialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    public dialogRef: MatDialogRef<CorrespondDailogComponent>,
    private toastr: ToastrService,
    public behaviorService: BehaviorService,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.behaviorService.matterClassData$.subscribe(result => {
      if (result) {
        this.MatterClassData = result.LOOKUPFULLVALUE;
      }
    });
  }
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  correspondForm: FormGroup;
  MatterClassData: any = [];
  errorWarningData: any = {};
  CorrspondClassData: any = [];
  isLoadingResults: boolean = false;
  isspiner: boolean = false;
  isEdit: boolean = false;
  matterData: any;
  ngOnInit() {
    this.behaviorService.MatterEditData$.subscribe(result => {
      this.matterData = result;
    });
    this.correspondForm = this._formBuilder.group({
      TYPE: ['General'],
      PERSONGUID: [''],
      PERSONGUIDTEXT: [''],
      SOLICITORGUID: [''],
      SOLICITORGUIDTEXT: [''],
      REFERENCE: [''],
      MATTERGUID: [''],
      MATTERCONTACTGUID: [''],
    });
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({ 'LookupType': 'contact role', 'MatterClass': this.MatterClassData }, 'GetLookups').subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.CorrspondClassData = responses.DATA.LOOKUPS;
        this.isLoadingResults = false;
      }
    });
    this.isEdit = this._data.type == "edit" ? true : false;
    if (this._data.type == "edit") {
      let editData = this._data.EditData;
      this.correspondForm.controls['SOLICITORGUID'].setValue(editData.SOLICITORGUID);
      this.correspondForm.controls['SOLICITORGUIDTEXT'].setValue(editData.SOLICITORNAME);
      this.correspondForm.controls['PERSONGUID'].setValue(editData.PERSONGUID);
      this.correspondForm.controls['PERSONGUIDTEXT'].setValue(editData.CONTACTNAME);
      this.correspondForm.controls['REFERENCE'].setValue(editData.REFERENCE);
      this.correspondForm.controls['MATTERGUID'].setValue(editData.MATTERGUID);
      this.correspondForm.controls['TYPE'].setValue(editData.TYPENAME);
      this.correspondForm.controls['MATTERCONTACTGUID'].setValue(editData.MATTERCONTACTGUID);
    }
  }
  get f() {
    return this.correspondForm.controls;
  }
  selectContact() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, { width: '100%', disableClose: true, data: { type: "" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.correspondForm.controls['MATTERGUID'].setValue(result.MATTERGUID);
        this.correspondForm.controls['PERSONGUID'].setValue(result.CONTACTGUID);
        this.correspondForm.controls['PERSONGUIDTEXT'].setValue(result.CONTACTNAME);
      }
    });
  }
  selectSolicitor() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, { width: '100%', disableClose: true, data: { type: "" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.correspondForm.controls['SOLICITORGUID'].setValue(result.CONTACTGUID);
        this.correspondForm.controls['SOLICITORGUIDTEXT'].setValue(result.CONTACTNAME);
      }
    });
  }
  saveCorrespomndDetail() {
    this.isspiner = true;
    let details: any = {
      TYPE: this.f.TYPE.value,
      SOLICITORGUID: this.f.SOLICITORGUID.value,
      REFERENCE: this.f.REFERENCE.value,
      PERSONGUID: this.f.PERSONGUID.value,
      MATTERGUID: this.f.MATTERGUID.value,
    }
    if (this.matterData) {
      details.MATTERGUID = this.matterData.MATTERGUID;
      this._mainAPiServiceService.getSetData({ FORMACTION: 'insert', VALIDATEONLY: false, DATA: details }, 'SetMatterContact').subscribe(response => {
        if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
          this.toastr.success('Matter Contact save successfully');
          this.isspiner = false;
          this.dialogRef.close(true);
        } else if (response.CODE == 451 && response.STATUS == 'warning') {
          this.isspiner = false;
          this.toastr.warning(response.MESSAGE);
        } else if (response.CODE == 450 && response.STATUS == 'error') {
          this.isspiner = false;
          this.toastr.error(response.MESSAGE);
        } else if (response.MESSAGE == 'Not logged in') {
          this.isspiner = false;
          this.dialogRef.close(false);
        }
      }, (error: any) => {
        console.log(error);
      });
    } else {
      let data = { 'showData': { 'type': this.f.TYPE.value, 'Text': this.f.PERSONGUIDTEXT.value + ' - ' + this.f.SOLICITORGUIDTEXT.value }, 'saveData': details };
      console.log(data);
      this.dialogRef.close(data);
    }
  }

  updateCorrespomndDetail() {
    this.isspiner = true;
    let details: any = {
      TYPE: this.f.TYPE.value,
      SOLICITORGUID: this.f.SOLICITORGUID.value,
      REFERENCE: this.f.REFERENCE.value,
      PERSONGUID: this.f.PERSONGUID.value,
      MATTERGUID: this.f.MATTERGUID.value,
      MATTERCONTACTGUID: this.f.MATTERCONTACTGUID.value,
    }
    this._mainAPiServiceService.getSetData({ FORMACTION: 'update', VALIDATEONLY: false, DATA: details }, 'SetMatterContact').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.toastr.success('Matter Contact update successfully');
        this.isspiner = false;
        this.dialogRef.close(true);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.toastr.warning(response.MESSAGE);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.toastr.error(response.MESSAGE);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
    }, (error: any) => {
      console.log(error);
    });
  }

}
