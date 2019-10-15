import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { BankingDialogComponent } from '../../banking/banking-dialog.component';
import { BehaviorService, MainAPiServiceService } from 'app/_services';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-general-dailog',
  templateUrl: './general-dailog.component.html',
  styleUrls: ['./general-dailog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class GeneralDailogComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  isLoadingResults: boolean = false;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  Number = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  displayedColumns: string[] = ['Number', 'Account', 'Debit', 'Credit'];
  disabledField: any;
  btnhide: any;
  craditDEbitData = { DRCR: '', AMOUNT: '', ACCOUNTGUID: '' };
  isDisable: boolean = true;
  GeneralForm: FormGroup;
  errorWarningData: any = {};
  ButtonText = 'Save';

  //buttonDisabled: boolean = true;
  successMsg: any;
  Slice: any;
  Slice2: any;
  JournalData: any = [];
  FormAction: string;
  DEBITSTOTAL: any = 0;
  CREDITSTOTAL: any = 0;
  CREDITDEBITDATA: any = [];
  generalTempData: any = [];
  CREDITDATAARRY: any = [];
  DEBITDATAARRAY: any = [];

  Accountguid: any;
  Accountname: any;
  FinalDebitTotal: any;
  FinalCreditTotal: any;
  CREDITTOTALFINAL: any = [];
  DEBITSTOTALFINAL: any = [];
  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<GeneralDailogComponent>,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private behaviorService: BehaviorService,
    public _mainAPiServiceService: MainAPiServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.action = data.action;
    if (this.action === 'new') {
      this.dialogTitle = 'New General Journal Entry';
    } else if (this.action === 'edit') {
      this.ButtonText = 'Update';
      this.dialogTitle = 'Update General Journal Entry';
    } else {
      this.ButtonText = 'Duplicate';
      this.dialogTitle = 'Duplicate General Journal Entry';
    }
    this.behaviorService.GeneralData$.subscribe(result => {
      if (result) {
        this.JournalData = result;
      }
    });
  }

  ngOnInit() {
    this.btnhide = 'NewDelete';
    this.GeneralForm = this._formBuilder.group({
      DATEGENERAL: [new Date()],
      DESCRIPTION: [''],
      TOTALDEBIT: [''],
      TOTALCREDITS: [''],
      GAMOUNT: [''],
      ACCOUNT: [''],
      AccountGuid: [''],
      CRDR: [''],
      NEWDATE: [this.datepipe.transform(new Date(), 'dd/MM/yyyy')],
    });
    if (this.action == 'edit' || this.action == 'duplicate') {
      this.EditGeneral();
    }
  }

  get f() {
    return this.GeneralForm.controls;
  }

  //choosedDate
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.GeneralForm.controls['NEWDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  //SelecteAccount
  SelecteAccount() {
    const dialogRef = this.MatDialog.open(BankingDialogComponent, {
      disableClose: true, width: '100%', data: { AccountType: '' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let AccountName = result.name;
        this.Slice = AccountName.slice(0, 8);
        this.Slice2 = AccountName.slice(9);
        this.GeneralForm.controls['ACCOUNT'].setValue(result.name);
        this.Accountguid = result.ACCOUNTGUID;
      }
    });
  }
  //NewItem
  NewItem() {
    this.btnhide = 'AddCancel';
    this.isDisable = false;
  }
  //DeleteItem
  DeleteItem() {

  }
  //AddItem
  AddItem() {
    this.btnhide = 'NewDelete';
    this.isDisable = true;
    if (this.craditDEbitData.AMOUNT == '' || this.craditDEbitData.AMOUNT == null) {
      this.toastr.error('Please enter amount.');
      return false;
    } else if (this.craditDEbitData.ACCOUNTGUID == '' || this.craditDEbitData.ACCOUNTGUID == null) {
      this.toastr.error('Please select account.');
      return false;
    }
    if (this.craditDEbitData.DRCR === 'CR') {
      this.CREDITDEBITDATA.push({
        ACCOUNTNUMBER: this.Slice,
        ACCOUNTNAME: this.Slice2,
        CREDITAMOUNT: this.craditDEbitData.AMOUNT,
        DEBITAMOUNT: 0,
      });
      this.CREDITSTOTAL += this.craditDEbitData.AMOUNT;
      this.CREDITDATAARRY.push({
        ACCOUNTGUID: this.Accountguid,
        AMOUNT: this.craditDEbitData.AMOUNT
      });
      this.GeneralForm.controls['ACCOUNT'].setValue('');
      this.craditDEbitData.AMOUNT = '';
    } else {
      this.CREDITDEBITDATA.push({
        ACCOUNTNUMBER: this.Slice,
        ACCOUNTNAME: this.Slice2,
        CREDITAMOUNT: 0,
        DEBITAMOUNT: this.craditDEbitData.AMOUNT,
      });
      this.DEBITSTOTAL += this.craditDEbitData.AMOUNT;
      this.DEBITDATAARRAY.push({
        ACCOUNTGUID: this.Accountguid,
        AMOUNT: this.craditDEbitData.AMOUNT
      });
      this.GeneralForm.controls['ACCOUNT'].setValue('');
      this.craditDEbitData.AMOUNT = '';
    }
    this.generalTempData = new MatTableDataSource(this.CREDITDEBITDATA);
  }
  //CancelItem
  CancelItem() {
    this.btnhide = 'NewDelete';
    this.isDisable = true;
  }
  //SaveGeneral
  SaveGeneral() {
    let PostData: any = {
      DATE: this.f.NEWDATE.value,
      JOURNALTIME: "",
      DESCRIPTION: this.f.DESCRIPTION.value,
      DEBITS: this.DEBITDATAARRAY,
      CREDITS: this.CREDITDATAARRY
    }
    if (this.action === 'new' || this.action === 'duplicate') {
      this.FormAction = 'insert';
      PostData.JOURNALGUID = '';
    } else {
      this.FormAction = 'update';
      PostData.JOURNALGUID = this.JournalData.JOURNALGUID;
    }
    // return;
    this.isspiner = true;
    if (this.CREDITSTOTAL === this.DEBITSTOTAL) {
      console.log(PostData);
      this.successMsg = 'Save successfully';
      let details = { FormAction: this.FormAction, VALIDATEONLY: true, Data: PostData };
      this._mainAPiServiceService.getSetData(details, 'SetJournal').subscribe(response => {
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
    } else {
      this.toastr.error('Credit Amount total and Debit Amount total not equal.');
    }
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
    this.errorWarningData = { "Error": tempError, 'warning': tempWarning };
    if (Object.keys(errorData).length != 0)
      this.toastr.error(errorData);
    if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef = this.MatDialog.open(FuseConfirmDialogComponent, {
        disableClose: true, width: '100%', data: warningData
      });
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
    this._mainAPiServiceService.getSetData(PostActivityData, 'SetJournal').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.toastr.success(this.successMsg);
        this.dialogRef.close(true);
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.toastr.warning(this.successMsg);
        this.isspiner = false;
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.toastr.error(res.STATUS);
        this.isspiner = false;
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
  //EditGeneral
  EditGeneral() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({ JOURNALGUID: this.JournalData.JOURNALGUID }, 'GetJournal').subscribe(result => {
      if (result.CODE == 200 && result.STATUS == "success") {
        if (result.DATA.JOURNALS[0].DATE) {
          let DATE1 = result.DATA.JOURNALS[0].DATE.split("/");
          this.GeneralForm.controls['DATEGENERAL'].setValue(new Date(DATE1[1] + '/' + DATE1[0] + '/' + DATE1[2]));
          this.GeneralForm.controls['NEWDATE'].setValue(result.DATA.JOURNALS[0].DATE);
        }
        this.GeneralForm.controls['DESCRIPTION'].setValue(result.DATA.JOURNALS[0].DESCRIPTION);
        this.CREDITDEBITDATA = result.DATA.JOURNALS[0].JOURNALITEMS;
        this.CREDITDEBITDATA.forEach(element => {
          if (element.DEBITCREDIT == 'CR') {
            this.CREDITDATAARRY.push({
              ACCOUNTGUID: element.ACCOUNTGUID,
              AMOUNT: element.AMOUNT
            });
            this.DEBITSTOTAL += element.AMOUNT
          } else if (element.DEBITCREDIT == 'DR') {
            this.DEBITDATAARRAY.push({
              ACCOUNTGUID: element.ACCOUNTGUID,
              AMOUNT: element.AMOUNT
            });
            this.CREDITSTOTAL += element.AMOUNT
          }
        });
        this.generalTempData = new MatTableDataSource(this.CREDITDEBITDATA);
        this.isLoadingResults = false;
      }
    }, err => {
      this.toastr.error(err);
      this.isLoadingResults = false;
    });
  }
}
