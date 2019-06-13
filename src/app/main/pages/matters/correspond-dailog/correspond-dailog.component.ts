import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
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
  ) { }
  correspondForm: FormGroup;
  isLoadingResults: boolean = false;
  isspiner: boolean = false;
  ngOnInit() {
    this.correspondForm = this._formBuilder.group({
      TYPE: ['General'],
      PERSONGUID: [''],
      PERSONGUIDTEXT: [''],
      SOLICITORGUID: [''],
      SOLICITORGUIDTEXT: [''],
      REFERENCE: [''],
      MATTERGUID: [''],
      //       MATTERCONTACTGUID - STRING(16)
      // PERSONGUID - STRING(16)
      // SOLICITORGUID - STRING(16)
      // RELATEDPERSONGUID - STRING(16)
      // ORDER - NUMBER
      // TYPE - LOOKUP -> ContactRole
      // RELATIONSHIP - STRING(50)
      // SHAREOFESTATE - NUMBER
    });
  }
  get f() {
    return this.correspondForm.controls;
  }
  selectContact() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, { width: '100%', disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.correspondForm.controls['MATTERGUID'].setValue(result.MATTERGUID);
        this.correspondForm.controls['PERSONGUID'].setValue(result.CONTACTGUID);
        this.correspondForm.controls['PERSONGUIDTEXT'].setValue(result.CONTACTNAME);
      }
    });
  }
  selectSolicitor() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, { width: '100%', disableClose: true });
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

}
