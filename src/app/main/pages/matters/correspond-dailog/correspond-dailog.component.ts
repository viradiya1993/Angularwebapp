import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ContactSelectDialogComponent } from '../../contact/contact-select-dialog/contact-select-dialog.component';
import { MattersService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-correspond-dailog',
  templateUrl: './correspond-dailog.component.html',
  styleUrls: ['./correspond-dailog.component.scss']
})
export class CorrespondDailogComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    public MatDialog: MatDialog,
    private _mattersService: MattersService,
    public dialogRef: MatDialogRef<CorrespondDailogComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) { }
  correspondForm: FormGroup;
  isLoadingResults: boolean = false;
  isspiner: boolean = false;
  isEditData = this._data.type == "edit" ? true : false;
  ngOnInit() {
    this.correspondForm = this._formBuilder.group({
      TYPE: ['General'],
      PERSONGUID: [''],
      PERSONGUIDTEXT: [''],
      SOLICITORGUID: [''],
      SOLICITORGUIDTEXT: [''],
      REFERENCE: [''],
      MATTERGUID: [''],
      MATTERCONTACTGUID: [''],
      //       MATTERCONTACTGUID - STRING(16)
      // PERSONGUID - STRING(16)
      // SOLICITORGUID - STRING(16)
      // RELATEDPERSONGUID - STRING(16)
      // ORDER - NUMBER
      // TYPE - LOOKUP -> ContactRole
      // RELATIONSHIP - STRING(50)
      // SHAREOFESTATE - NUMBER
    });
    if (this._data.type == "edit") {
      let editData = this._data.EditData;
      this.correspondForm.controls['SOLICITORGUID'].setValue(editData.SOLICITORGUID);
      this.correspondForm.controls['SOLICITORGUIDTEXT'].setValue(editData.SOLICITORNAME);
      this.correspondForm.controls['PERSONGUID'].setValue(editData.PERSONGUID);
      this.correspondForm.controls['PERSONGUIDTEXT'].setValue(editData.PERSONNAME);
      this.correspondForm.controls['REFERENCE'].setValue(editData.REFERENCE);
      this.correspondForm.controls['MATTERGUID'].setValue(editData.MATTERGUID);
      this.correspondForm.controls['TYPE'].setValue(editData.TYPE);
      this.correspondForm.controls['MATTERCONTACTGUID'].setValue(editData.MATTERCONTACTGUID);
    }
  }
  get f() {
    return this.correspondForm.controls;
  }
  selectContact() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, {
      width: '100%', disableClose: true, data: {
        type: ""
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.correspondForm.controls['MATTERGUID'].setValue(result.MATTERGUID);
        this.correspondForm.controls['PERSONGUID'].setValue(result.CONTACTGUID);
        this.correspondForm.controls['PERSONGUIDTEXT'].setValue(result.CONTACTNAME);
      }
    });
  }
  selectSolicitor() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, {
      width: '100%', disableClose: true, data: {
        type: ""
      }
    });
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
    let data = { 'showData': { 'type': this.f.TYPE.value, 'Text': this.f.PERSONGUIDTEXT.value + ' - ' + this.f.SOLICITORGUIDTEXT.value }, 'saveData': details };
    this.dialogRef.close(data);
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

    this._mattersService.AddMatterContact({ FORMACTION: 'update', VALIDATEONLY: false, DATA: details }).subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.toastr.success('Matter Contact update successfully');
        this.isspiner = false;
        this.dialogRef.close(true);
      } else if (response.CODE == 451 && response.STATUS == "warning") {
        this.toastr.warning(response.MESSAGE);
      } else if (response.CODE == 450 && response.STATUS == "error") {
        this.toastr.error(response.MESSAGE);
      } else if (response.MESSAGE == "Not logged in") {
        this.dialogRef.close(false);
      }
    }, (error: any) => {
      console.log(error);
    });
  }

}
