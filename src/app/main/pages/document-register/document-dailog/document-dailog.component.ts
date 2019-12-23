import { Component, OnInit, Inject } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import { DatePipe } from '@angular/common';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { $ } from 'protractor';

@Component({
  selector: 'app-document-dailog',
  templateUrl: './document-dailog.component.html',
  styleUrls: ['./document-dailog.component.scss']
})
export class DocumentDailogComponent implements OnInit {
  DocumentForm: FormGroup;
  isLoadingResults: boolean = false;
  action: string;
  DocRegData: any;
  errorWarningData: any = {};
  SendDataArray: any = {};
  dialogTitle: string;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>
  isspiner: boolean = false;
  public DocumentRegiData: any = {
    "GENERATEDATE": " ", "GENERATETIME": "", "DOCUMENTCLASS": 0, "DESCRIPTION": "", "DRAFTSTATUS": 0, "DOCUMENTNUMBER": 0, "DOCUMENTTYPE": 0, "DOCUMENTNAME": '',
    "KEYWORDS": '', "GENERATEDATESEND": " ", "DOCUMENTAUTHOR": "Diana Parkinson (no password)"
  };
  FormAction: string;
  DocGUID: string;

  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<DocumentDailogComponent>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private behaviorService: BehaviorService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    public _matDialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.action = data.action;
    if (this.action === 'new') {
      this.dialogTitle = 'New Document';
    } else if (this.action === 'edit') {
      this.dialogTitle = 'Update Document';
    } else {
      this.dialogTitle = 'Duplicate Document';
    }
    this.behaviorService.dialogClose$.subscribe(result => {
      if(result != null){
        if(result.MESSAGE == 'Not logged in'){
          this.dialogRef.close(false);
        }
      }
     });

    this.behaviorService.DocumentRegisterData$.subscribe(result => {
      if (result) {
        this.DocRegData = result;
      }
    });
  }

  ngOnInit() {
    this.DocumentForm = this._formBuilder.group({
      Document: [''],
      time: [],
      Class: [],
      Description: [],
      Draft: [],
      DocNo: [],
      Type: [],
      author: ['', Validators.required],
      Recipients: [],
      DocumentName: [],
      Keywords: []
    });
    let begin = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
    this.DocumentRegiData.GENERATEDATESEND = begin;
    if (this.action == 'edit' || this.action == 'duplicate') {
      this.LoadData();
    } else {

      this._mainAPiServiceService.getSetData({ DOCUMENTGUID: this.DocRegData.DOCUMENTGUID }, 'GetDocument').subscribe(res => {
        if (res.CODE == 200 && res.STATUS == "success") {

          this.SendDataArray = res.DATA.DOCUMENTS[0];
        }
      }, err => {
        this.toastr.error(err);
      });
    }


  }

  LoadData() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({ DOCUMENTGUID: this.DocRegData.DOCUMENTGUID }, 'GetDocument').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.SendDataArray = res.DATA.DOCUMENTS[0];
        this.DocumentRegiData.GENERATETIME = res.DATA.DOCUMENTS[0].GENERATETIME;
        this.DocumentRegiData.DESCRIPTION = res.DATA.DOCUMENTS[0].DESCRIPTION;
        this.DocumentRegiData.DOCUMENTNUMBER = res.DATA.DOCUMENTS[0].DOCUMENTNUMBER;
        this.DocumentRegiData.DOCUMENTNAME = res.DATA.DOCUMENTS[0].DOCUMENTNAME;
        this.DocumentRegiData.KEYWORDS = res.DATA.DOCUMENTS[0].KEYWORDS;
        this.DocumentRegiData.DOCUMENTCLASS = res.DATA.DOCUMENTS[0].DOCUMENTCLASS.toString();
        this.DocumentRegiData.DRAFTSTATUS = res.DATA.DOCUMENTS[0].DRAFTSTATUS.toString();
        this.DocumentRegiData.DOCUMENTTYPE = res.DATA.DOCUMENTS[0].DOCUMENTTYPE.toString();
        this.DocumentRegiData.GENERATEDATE = new Date();

      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
      this.isLoadingResults = false;
    });
    // this.pageSize = localStorage.getItem('lastPageSize');
  }
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.DocumentRegiData.GENERATEDATESEND = begin;
  }

  //Class Drop Down
  ClassChange(value) {
    console.log(value);
  }
  //Draft Drop Down
  DraftChange(value) {
    console.log(value);
  }

  //Type Drop Down
  TypeChnage(value) {
    console.log(value);
  }

  //Dcoument Floder
  DcoumentFloder() {
    console.log('DcoumentFloder Work!!');
  }
  //Document Save
  DocumentSave() {
    this.isspiner = true;
    let MatterData = JSON.parse(localStorage.getItem('set_active_matters'));
    if (this.action == "edit") {
      this.FormAction = "update";
      this.DocGUID = this.SendDataArray.DOCUMENTGUID;
    } else if (this.action == 'new' || this.action == 'duplicate') {
      this.FormAction = "insert";
      this.DocGUID = "";
    }
    let Data = {
      CONTEXT: "Matter",
      CONTEXTGUID: this.SendDataArray.CONTEXTGUID,
      DESCRIPTION: this.DocumentRegiData.DESCRIPTION,
      DOCUMENTAUTHOR: this.DocumentRegiData.DOCUMENTAUTHOR,
      DOCUMENTCLASS: Number(this.DocumentRegiData.DOCUMENTCLASS),
      DOCUMENTGUID: this.DocGUID,
      DOCUMENTNAME: this.DocumentRegiData.DOCUMENTNAME,
      DOCUMENTNUMBER: this.DocumentRegiData.DOCUMENTNUMBER,
      DOCUMENTRECIPIENTS: this.SendDataArray.DOCUMENTRECIPIENTS,
      DOCUMENTTYPE: Number(this.DocumentRegiData.DOCUMENTTYPE),
      DRAFTSTATUS: Number(this.DocumentRegiData.DRAFTSTATUS),
      GENERATEDATE: this.DocumentRegiData.GENERATEDATESEND,
      GENERATETIME: this.DocumentRegiData.GENERATETIME,
      KEYWORDS: this.DocumentRegiData.KEYWORDS,
      MATTERGUID: MatterData.MATTERGUID,
      TEMPLATENAME: this.SendDataArray.TEMPLATENAME,
    }
    let finalData = { DATA: Data, FormAction: this.FormAction, VALIDATEONLY: true }
    console.log(finalData);
    this._mainAPiServiceService.getSetData(finalData, 'SetDocument').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, finalData);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.checkValidation(response.DATA.VALIDATIONS, finalData);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.checkValidation(response.DATA.VALIDATIONS, finalData);
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
    this.errorWarningData = { "Error": tempError, 'warning': tempWarning };
    if (Object.keys(errorData).length != 0) {
      this.toastr.error(errorData);
      this.isspiner = false;
    } else if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.DocRegiData(details);
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.DocRegiData(details);
      this.isspiner = false;
    }
  }
  DocRegiData(data: any) {
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetDocument').subscribe(response => {
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

  //Document Close
  CloseDocument(): void {
    this.dialogRef.close(false);
  }
}
