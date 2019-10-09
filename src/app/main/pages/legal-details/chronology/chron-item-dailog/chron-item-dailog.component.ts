import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chron-item-dailog',
  templateUrl: './chron-item-dailog.component.html',
  styleUrls: ['./chron-item-dailog.component.scss']
})
export class ChronItemDailogComponent implements OnInit {
  ChroneItem: FormGroup;
  isLoadingResults: boolean = false;
  action: string;
  confirmDialogRef: any;
  dialogTitle: string;
  ChronologyADD: any = [];
  isspiner: boolean = false;
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  Chronology_data: any;
  ChronoGUID: any;
  Dateform: any;
  Dateto: string;
  timeform: string;
  timeto: string;
  FormAction: string;
  errorWarningData: any = {};
  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<ChronItemDailogComponent>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    public behaviorService: BehaviorService,
    public datepipe: DatePipe,
    private _mainAPiServiceService: MainAPiServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    this.action = data.action;
    if (this.action === 'new') {
      this.dialogTitle = 'New Chronology';
    } else if (this.action === 'edit') {
      this.dialogTitle = 'Update Chronology';
    } else {
      this.dialogTitle = 'Duplicate Chronology';
    }
    this.ChronologyADD = {
      'FORMAT': '',
      "DATEFROM": '',
      "TIMEFROM": '',
      "DATETO": '',
      "TIMETO": '',
      "REFERENCE": '',
      "BRIEFPAGENO": '',
      "WITNESSES": '',
      "COMMENT": '',
      "PRIVILEGED": '',
      "ADDITIONALTEXT": '',
      "TOPIC": '',
      "EVENTAGREED": '',
      "DOCUMENTNAME": '',
      "MATTERGUID": '',
      "CHRONOLOGYGUID": '',
      "FakeDateForm": '',
      "FakeDateTo": ''
    }
    this.behaviorService.LegalChronologyData$.subscribe(result => {
      if (result) {

        this.Chronology_data = result;
      }
    });
  }
  ngOnInit() {
    this.ChroneItem = this._formBuilder.group({
      Format: [],
      dateForm: [],
      timeForm: [],
      dateto: [],
      timeto: [],
      text: [],
      topic: [],
      COMMENT: [],
      Privileged: [],
      Reference: [],
      brif: [],
      Witnesses: [],
      eventAgereed: [],
      document: []
    });

    if (this.action == 'edit' || this.action == 'duplicate') {
      this.EditTimeadata();
    } else if (this.action == 'new') {
      this.ChronologyADD.FORMAT = '1';
      this.ChronologyADD.MATTERGUID = this.currentMatter.MATTERGUID;
      this.FormatChange(this.ChronologyADD.FORMAT);
    }
  }
  EditTimeadata() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({ CHRONOLOGYGUID: this.Chronology_data.CHRONOLOGYGUID }, 'GetChronology').subscribe(res => {
      console.log(res);
      if (res.CODE == 200 && res.STATUS == "success") {

        let Dateform = res.DATA.CHRONOLOGIES[0].DATEFROM.split("/");
        let DATE = new Date(Dateform[1] + '/' + Dateform[0] + '/' + Dateform[2]);
        this.ChronologyADD.DATEFROM = DATE;
        this.ChronologyADD.FakeDateForm = res.DATA.CHRONOLOGIES[0].DATEFROM;
        let DATETO = res.DATA.CHRONOLOGIES[0].DATETO.split("/");
        let DATE2 = new Date(DATETO[1] + '/' + DATETO[0] + '/' + DATETO[2]);
        this.ChronologyADD.DATETO = DATE2;
        this.ChronologyADD.FakeDateTo = res.DATA.CHRONOLOGIES[0].DATETO;
        this.ChronologyADD.FORMAT = res.DATA.CHRONOLOGIES[0].FORMAT
        this.ChronologyADD.TIMEFROM = res.DATA.CHRONOLOGIES[0].TIMEFROM
        this.ChronologyADD.TIMETO = res.DATA.CHRONOLOGIES[0].TIMETO
        this.ChronologyADD.REFERENCE = res.DATA.CHRONOLOGIES[0].REFERENCE
        this.ChronologyADD.BRIEFPAGENO = res.DATA.CHRONOLOGIES[0].BRIEFPAGENO
        this.ChronologyADD.WITNESSES = res.DATA.CHRONOLOGIES[0].WITNESSES
        this.ChronologyADD.COMMENT = res.DATA.CHRONOLOGIES[0].COMMENT
        this.ChronologyADD.PRIVILEGED = res.DATA.CHRONOLOGIES[0].PRIVILEGED
        this.ChronologyADD.ADDITIONALTEXT = res.DATA.CHRONOLOGIES[0].ADDITIONALTEXT
        this.ChronologyADD.TOPIC = res.DATA.CHRONOLOGIES[0].TOPIC
        this.ChronologyADD.EVENTAGREED = res.DATA.CHRONOLOGIES[0].EVENTAGREED
        this.ChronologyADD.DOCUMENTNAME = res.DATA.CHRONOLOGIES[0].DOCUMENTNAME;
        this.ChronologyADD.MATTERGUID = res.DATA.CHRONOLOGIES[0].MATTERGUID
        this.ChronologyADD.CHRONOLOGYGUID = res.DATA.CHRONOLOGIES[0].CHRONOLOGYGUID;
        this.FormatChange(res.DATA.CHRONOLOGIES[0].FORMAT);

      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
      this.isLoadingResults = false;
    });
  }

  commonOdd() {
    this.ChroneItem.controls['dateForm'].enable();
    this.ChroneItem.controls['timeForm'].disable();
    this.ChroneItem.controls['dateto'].disable();
    this.ChroneItem.controls['timeto'].disable();
  }
  commonEven() {
    this.ChroneItem.controls['dateForm'].enable();
    this.ChroneItem.controls['dateto'].enable();
    this.ChroneItem.controls['timeForm'].disable();
    this.ChroneItem.controls['timeto'].disable();
  }
  //FormatChange
  FormatChange(val) {
    console.log(val);
    if (val == '1') {
      this.commonOdd();

    } else if (val == '2') {
      this.commonEven();
    } else if (val == '3') {
      this.commonOdd();
    } else if (val == '4') {
      this.commonEven();
    } else if (val == '5') {
      this.commonOdd();
    } else if (val == '6') {
      this.commonEven();
    } else if (val == '7') {
      this.ChroneItem.controls['dateForm'].enable();
      this.ChroneItem.controls['timeForm'].enable();
      this.ChroneItem.controls['dateto'].disable();
      this.ChroneItem.controls['timeto'].disable();
    } else if (val == '8') {
      this.ChroneItem.controls['dateForm'].enable();
      this.ChroneItem.controls['timeForm'].enable();
      this.ChroneItem.controls['timeto'].enable();
      this.ChroneItem.controls['dateto'].disable();
    }
  }
  //choosedDate
  choosedDateFrom() {

  }
  //DateFrom
  choosedDateForm(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.ChronologyADD.FakeDateForm = begin;
  }
  //choosedDateTo
  choosedDateTo(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.ChronologyADD.FakeDateTo = begin;
  }
  //DateTo
  DateTo() {

  }
  //Event
  Event() {

  }
  //selectDoc
  selectDoc() {

  }
  commonSendOdd() {
    this.Dateform = this.ChronologyADD.FakeDateForm;
    this.Dateto = ""
    this.timeform = ""
    this.timeto = "";
  }
  commonSendEven() {
    this.Dateform = this.ChronologyADD.FakeDateForm;
    this.Dateto = this.ChronologyADD.FakeDateTo;
    this.timeform = ""
    this.timeto = "";
  }
  //ChroneItemSave
  ChroneItemSave() {
    this.isspiner = true;
    if (this.ChronologyADD.FORMAT == '1') {
      this.commonSendOdd();
    } else if (this.ChronologyADD.FORMAT == '2') {
      this.commonSendEven();
    } else if (this.ChronologyADD.FORMAT == '3') {
      this.commonSendOdd();
    } else if (this.ChronologyADD.FORMAT == '4') {
      this.commonSendEven();
    } else if (this.ChronologyADD.FORMAT == '5') {
      this.commonSendOdd();
    } else if (this.ChronologyADD.FORMAT == '6') {
      this.commonSendEven();
    } else if (this.ChronologyADD.FORMAT == '7') {
      this.Dateform = this.ChronologyADD.FakeDateForm;
      this.Dateto = ""
      this.timeform = this.ChronologyADD.TIMEFROM;
      this.timeto = "";
    } else if (this.ChronologyADD.FORMAT == '8') {
      this.Dateform = this.ChronologyADD.FakeDateForm;
      this.Dateto = ""
      this.timeform = this.ChronologyADD.TIMEFROM;
      this.timeto = this.ChronologyADD.TIMETO;
    }

    if (this.action == 'edit') {
      this.ChronoGUID = this.ChronologyADD.CHRONOLOGYGUID;
      this.FormAction = 'update';
    } else if (this.action == 'new') {
      this.ChronoGUID = '';
      this.FormAction = 'insert';
    } else if (this.action == 'duplicate') {
      this.ChronoGUID = '';
      this.FormAction = 'insert';
    }


    let Data = {
      DATEFROM: this.Dateform,
      TIMETO: this.timeto,
      FORMAT: this.ChronologyADD.FORMAT,
      TIMEFROM: this.timeform,
      DATETO: this.Dateto,
      REFERENCE: this.ChronologyADD.REFERENCE,
      BRIEFPAGENO: this.ChronologyADD.BRIEFPAGENO,
      WITNESSES: this.ChronologyADD.WITNESSES,
      COMMENT: this.ChronologyADD.COMMENT,
      PRIVILEGED: this.ChronologyADD.PRIVILEGED,
      ADDITIONALTEXT: this.ChronologyADD.ADDITIONALTEXT,
      TOPIC: this.ChronologyADD.TOPIC,
      EVENTAGREED: this.ChronologyADD.EVENTAGREED,
      DOCUMENTNAME: this.ChronologyADD.DOCUMENTNAME,
      MATTERGUID: this.ChronologyADD.MATTERGUID,
      CHRONOLOGYGUID: this.ChronoGUID,

    }
    let details = { FormAction: this.FormAction, VALIDATEONLY: true, Data: Data };
    this._mainAPiServiceService.getSetData(details, 'SetChronology').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, details);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.checkValidation(response.DATA.VALIDATIONS, details);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.checkValidation(response.DATA.VALIDATIONS, details);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      } else {
        this.isspiner = false;
      }
    }, error => {
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
          this.saveChronodata(details);
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.saveChronodata(details);
      this.isspiner = false;
    }
  }
  saveChronodata(data: any) {
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetChronology').subscribe(response => {
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
