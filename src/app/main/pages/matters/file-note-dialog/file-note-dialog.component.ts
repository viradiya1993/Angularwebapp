import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {  MainAPiServiceService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-file-note-dialog',
  templateUrl: './file-note-dialog.component.html',
  styleUrls: ['./file-note-dialog.component.scss']
})
export class FileNoteDialogComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  isspiner: boolean = false;
  NewFileNote: FormGroup;
  isLoadingResults: boolean = false;
  d: Date;
  errorWarningData: any = {};
  time: string;
  beginDate: string;
  selectDate: any;
  selectTime: string;
  ShortName: any;
  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<FileNoteDialogComponent>,
    private _formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private _mainAPiServiceService: MainAPiServiceService,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    let matterGuid = JSON.parse(localStorage.getItem('set_active_matters'));
    this.ShortName=matterGuid.SHORTNAME;
    this.NewFileNote = this._formBuilder.group({
      newfiledate: [new Date()],
      User: [''],
      newfiledate2: [this.datepipe.transform(new Date(), 'dd/MM/yyyy')],
      time: [new Date().getHours()],
      comment: ['']
    });
    var today = new Date();
    this.time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.NewFileNote.controls['time'].setValue(this.time);
    this.NewFileNote.controls['User'].setValue(matterGuid.CONTACTNAME);
  }
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.beginDate = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.NewFileNote.controls['newfiledate2'].setValue(new Date(), 'dd/MM/yyyy');
  }
  get f() {
    return this.NewFileNote.controls;
  }
  //Save File Note
  SaveFileNote() {
    let matterGuid = JSON.parse(localStorage.getItem('set_active_matters'));
    let passdata = {
      FILENOTEGUID: "",
      MATTERGUID: matterGuid.MATTERGUID,
      USERNAME: this.f.User.value,
      DATE: this.f.newfiledate2.value,
      TIME: this.f.time.value,
      NOTE: this.f.comment.value,
    }
    this.setValue(passdata);
  }
  setValue(passdata) {
    this.isspiner = true;
    let finalPassdata=
    { 'FormAction': 'insert', DATA: passdata }
    this._mainAPiServiceService.getSetData(finalPassdata, 'SetFileNote').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.checkValidation(res.DATA.VALIDATIONS, finalPassdata);
      } else if (res.CODE == 451 && res.STATUS == "warning") {
        this.checkValidation(res.DATA.VALIDATIONS, finalPassdata);
      } else if (res.CODE == 450 && res.STATUS == "error") {
        this.checkValidation(res.DATA.VALIDATIONS, finalPassdata);
      } else if (res.MESSAGE == "Login Failure") {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
  checkValidation(bodyData: any, PostFileNoteData: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'No') {
        errorData.push(value.ERRORDESCRIPTION);
        tempError[value.FIELDNAME] = value;
      } else if (value.VALUEVALID == 'Warning') {
        warningData.push(value.ERRORDESCRIPTION);
        tempWarning[value.FIELDNAME] = value;
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
          this.FinalsaveFileNote(PostFileNoteData);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.FinalsaveFileNote(PostFileNoteData);
      this.isspiner = false;
  }
  FinalsaveFileNote(PostFileNoteData: any) {
    PostFileNoteData.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(PostFileNoteData, 'SetFileNote').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
          this.toastr.success('Note save successfully');
        this.isspiner = false;
        this.dialogRef.close(false);
      } else if (response.CODE == 451 && response.STATUS == "warning") {
        this.toastr.warning(response.MESSAGE);
        this.isspiner = false;
      } else if (response.CODE == 450 && response.STATUS == "error") {
        this.toastr.error(response.MESSAGE);
        this.isspiner = false;
      } else if (response.MESSAGE == "Login Failure") {
        this.isspiner = false;
        this.dialogRef.close(false);
      }
    }, error => {
      this.toastr.error(error);
    });


  }

}
