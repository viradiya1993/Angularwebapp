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
      TYPE: [''],
      PERSONGUID: [''],
      PERSONGUIDTEXT: [''],
      SOLICITORGUID: [''],
      SOLICITORGUIDTEXT: [''],
      REFERENCE: ['']
      //       MATTERCONTACTGUID - STRING(16)
      // MATTERGUID - STRING(16)
      // PERSONGUID - STRING(16)
      // SOLICITORGUID - STRING(16)
      // RELATEDPERSONGUID - STRING(16)
      // ORDER - NUMBER
      // TYPE - LOOKUP -> ContactRole
      // REFERENCE - STRING(50)
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
        console.log(result);
        this.correspondForm.controls['PERSONGUID'].setValue(result.CONTACTGUID);
        this.correspondForm.controls['PERSONGUIDTEXT'].setValue(result.CONTACTNAME);
      }
    });
  }
  selectSolicitor() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, { width: '100%', disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
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
    }
    let matterPostData: any = { FormAction: 'insert', VALIDATEONLY: true, Data: details };
    this._mattersService.AddMatterContact(matterPostData).subscribe(response => {

      let detailData = { 'type': this.f.TYPE.value, 'Text': this.f.PERSONGUIDTEXT.value + ' - ' + this.f.SOLICITORGUIDTEXT.value };
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, matterPostData, detailData);
      } else if (response.CODE == 451 && response.STATUS == "warning") {
        this.checkValidation(response.DATA.VALIDATIONS, matterPostData, detailData);
      } else {
        if (response.CODE == 402 && response.STATUS == "error" && response.MESSAGE == "Not logged in")
          this.dialogRef.close(false);
        this.isspiner = false;
      }
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
  checkValidation(bodyData: any, details: any, detailData: any) {
    let errorData: any = [];
    let warningData: any = [];
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'NO')
        errorData.push(value.ERRORDESCRIPTION);
      else if (value.VALUEVALID == 'WARNING')
        warningData.push(value.ERRORDESCRIPTION);
    });
    console.log(errorData);
    console.log(warningData);
    if (Object.keys(errorData).length != 0)
      this.toastr.error(errorData);
    if (Object.keys(warningData).length != 0) {
      this.isspiner = true;
      this.saveCorData(details, detailData);
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.saveCorData(details, detailData);
    this.isspiner = false;
  }
  saveCorData(matterPostData, detailData) {
    matterPostData.VALIDATEONLY = false;
    this._mattersService.AddMatterContact(matterPostData).subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.toastr.success('Contact save successfully');
        this.isspiner = false;
        this.dialogRef.close(detailData);
      } else {
        this.isspiner = false;
      }
    }, error => {
      this.toastr.error(error);
    });
  }


}
