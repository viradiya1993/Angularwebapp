import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource, MatDatepickerInputEvent } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ContactSelectDialogComponent } from '../../contact/contact-select-dialog/contact-select-dialog.component';
import { MatterDialogComponent } from '../../time-entries/matter-dialog/matter-dialog.component';
import * as $ from 'jquery';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material';
import { DatePipe } from '@angular/common';
import { round } from 'lodash';
import { BankingDialogComponent } from '../../banking/banking-dialog.component';

@Component({
  selector: 'app-spend-money-add',
  templateUrl: './spend-money-add.component.html',
  styleUrls: ['./spend-money-add.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SpendMoneyAddComponent implements OnInit {
  errorWarningData: any = {};
  dataSource: MatTableDataSource<UserData>;
  action: any;
  dialogTitle: string;
  isLoadingResults: boolean;
  spendmoneyForm: FormGroup;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  CurrentMatter = JSON.parse(localStorage.getItem('set_active_matters'));
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  displayedColumnsTime: string[] = ['AMOUNT', 'EXPENDITURECLASS', 'GST', 'NOTE'];
  getDataForTable: any = [];
  paginator: any;
  pageSize: any;
  isspiner: boolean = false;
  paidtype = 'paid';
  classtype: any;
  size = 33.33;
  Bankhide: boolean = true;
  hide: boolean = true;
  tdata: boolean;
  confirmDialogRef: any;
  expac: boolean;
  @ViewChild(MatSort) sort: MatSort;
  dataTableHide: string;
  sendItem: any = [];
  Main3btn: string;
  SubMain2btn: string;
  FormAction: string;
  FAmount: any = [];
  GSTValAfterCal: any;
  GstTypeDiff: any;
  GSTValForExGst: any;
  FinalTotal: any;
  FGst: any = [];
  FinalTotalGST: any;
  btnClickpurpose: string;
  INDEX: any;
  MainData: any;
  setMainAmount: number;
  setMainGST: number;
  multicheckboxval: number;
  isItemSaveClicked: string;
  FinalExGSTAmount: number;
  itemAmountExGST: number;
  SendMoney_data: any = [];
  SendMoney_dataGUID: any;
  arrayForIndex: any;
  storeDataarray: any = [];
  GSTValForInGst: any;
  constructor(
    public dialogRef: MatDialogRef<SpendMoneyAddComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any,
    private _formBuilder: FormBuilder,
    public MatDialog: MatDialog,
    private toastr: ToastrService,
    public behaviorService: BehaviorService,
    public _matDialog: MatDialog, public datepipe: DatePipe, public _mainAPiServiceService: MainAPiServiceService) {
    this.action = _data.action;
    console.log(_data);
    // this.dialogTitle = this.action === 'edit' ? 'Update Spend Money' : 'Add Spend Money';
    if (this.action === 'new') {
      this.dialogTitle = 'Add Spend Money ';
    } else if (this.action === 'edit') {
      this.dialogTitle = 'Update Spend Money';
    } else {
      this.dialogTitle = 'Duplicate Spend Money';
    }

    this.behaviorService.dialogClose$.subscribe(result => {
      if (result != null) {
        if (result.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
      }
    });

  }
  ngOnInit() {
    this.isLoadingResults = true;
    this.behaviorService.SpendMoneyData$.subscribe(result => {
      if (result) {
        this.SendMoney_dataGUID = result;
      }
    });
    //for Data Table hideshow 
    this.Main3btn = 'disabled';
    this.dataTableHide = "false";
    this.spendmoneyForm = this._formBuilder.group({
      DateIncurred: [''],
      Paid: [''],
      DatePaid: [''],
      Amount: [''],
      GST: [''],
      Bankac: [''],
      Notes: [''],
      Type: [''],
      ChequeNo: [''],
      Payee: [''],
      Invoice: [''],
      MultiLineExpense: [''],
      Class: [''],
      Matter: [''],
      AmountIncGST: [''],
      GSTType: [''],
      GST1: [''],
      BankacGUID: [''],
      AmountExGST: [''],
      Expenseac: [''],
      Note: [''],
      Assetacs: [''],
      Gstac: [''],
      taxac: [''],
      Equityac: [''],
      DatePaidForSend: [''],
      DateIncurredForSend: [''],
      MatterGUID: [''],
      ExpenseacGUID: [''],
      EXPENSEACCOUNTNUMBER:[''],
      BANKACCOUNTNUMBER:['']

    });
    this.isLoadingResults = true;
    if (this.action != 'new') {
      $('#expac').addClass('menu-disabled');
      this.expac = true;
      this._mainAPiServiceService.getSetData({ EXPENDITUREGUID: this.SendMoney_dataGUID.EXPENDITUREGUID }, 'GetExpenditure').subscribe(response => {
        if (response.CODE == 200 && response.STATUS == "success") {
          this.SendMoney_data = response.DATA.EXPENDITURES[0];
          let DATE: any;
          if (this.SendMoney_data.DATE) {
            let DatePaid = this.SendMoney_data.DATE.split("/");
            DATE = new Date(DatePaid[1] + '/' + DatePaid[0] + '/' + DatePaid[2]);
          }
          let ReceiveDATE: any;
          if (this.SendMoney_data.RECEIVEDDATE) {
            let DateIncurred = this.SendMoney_data.RECEIVEDDATE.split("/");
            ReceiveDATE = new Date(DateIncurred[1] + '/' + DateIncurred[0] + '/' + DateIncurred[2]);
          }
          this.spendmoneyForm.controls['DateIncurred'].setValue(ReceiveDATE);
          this.spendmoneyForm.controls['DatePaid'].setValue(DATE);
          //for sending date 
          this.spendmoneyForm.controls['DateIncurredForSend'].setValue(this.SendMoney_data.RECEIVEDDATE);
          this.spendmoneyForm.controls['DatePaidForSend'].setValue(this.SendMoney_data.DATE);
          //call first row and datatble -> start
          this.getDataForTable = this.SendMoney_data.EXPENDITUREITEMS;
          this.globallyCalculation();
          this.highlightedRows = 0;
          this.getDataForTable.paginator = this.paginator;
          this.getDataForTable.sort = this.sort;
          this.spendmoneyForm.controls['GST1'].disable();
          this.paidtype = this.SendMoney_data.STATUS
          //globally value set 
          this.spendmoneyForm.controls['Notes'].setValue(this.SendMoney_data.NOTE);
          this.spendmoneyForm.controls['ChequeNo'].setValue(this.SendMoney_data.CHEQUENO);
          this.spendmoneyForm.controls['Type'].setValue(this.SendMoney_data.EXPENDITURETYPE);
          this.spendmoneyForm.controls['Payee'].setValue(this.SendMoney_data.PAYEE);
          this.spendmoneyForm.controls['Amount'].setValue(this.SendMoney_data.AMOUNT + this.SendMoney_data.GST);
          this.spendmoneyForm.controls['GST'].setValue(this.SendMoney_data.GST);
          this.spendmoneyForm.controls['BankacGUID'].setValue(this.SendMoney_data.BANKACCOUNTGUID);
          this.spendmoneyForm.controls['Bankac'].setValue(this.SendMoney_data.BANKACCOUNTNUMBER);
          // inner item 
          if (this.SendMoney_data.EXPENDITUREITEMS.length != 0) {
            this.editMoney(this.SendMoney_data.EXPENDITUREITEMS[0], 0);
            this.spendmoneyForm.controls['Class'].setValue(this.SendMoney_data.EXPENDITUREITEMS[0].EXPENDITURECLASS);
            this.spendmoneyForm.controls['GST1'].setValue(this.SendMoney_data.EXPENDITUREITEMS[0].GST.toString());
            this.spendmoneyForm.controls['AmountIncGST'].setValue(this.SendMoney_data.EXPENDITUREITEMS[0].AMOUNT);
            this.spendmoneyForm.controls['Note'].setValue(this.SendMoney_data.EXPENDITUREITEMS[0].NOTE);
            this.spendmoneyForm.controls['Matter'].setValue(this.SendMoney_data.EXPENDITUREITEMS[0].SHORTNAME);
                console.log(this.SendMoney_data.EXPENDITUREITEMS[0].EXPENSEACCOUNTNUMBER);
            this.spendmoneyForm.controls['Expenseac'].setValue(this.SendMoney_data.EXPENDITUREITEMS[0].EXPENSEACCOUNTNUMBER);

            this.spendmoneyForm.controls['ExpenseacGUID'].setValue(this.SendMoney_data.EXPENDITUREITEMS[0].EXPENSEACCOUNTGUID);

            if (round(this.SendMoney_data.EXPENDITUREITEMS[0].AMOUNT / 10) == round(this.SendMoney_data.EXPENDITUREITEMS[0].GST)) {
              this.spendmoneyForm.controls['GSTType'].setValue("1.1");
              this.GstTypeDiff = "1.1";
              this.amountCal();
            } else if (this.SendMoney_data.EXPENDITUREITEMS[0].GST == 0) {
              this.spendmoneyForm.controls['GSTType'].setValue("No GST");
              this.GstTypeDiff = "No GST";
              this.amountCal();
            } else if (this.SendMoney_data.EXPENDITUREITEMS[0].AMOUNT / 10 != this.SendMoney_data.EXPENDITUREITEMS[0].GST) {
              this.spendmoneyForm.controls['GSTType'].setValue("LessThen 10% GST");
              this.GstTypeDiff = "LessThen 10% GST";
              this.amountCal();
            } else {
              this.amountCal();
            }

          } else {
            this.spendmoneyForm.controls['Class'].setValue("");
            this.spendmoneyForm.controls['GST1'].setValue(" ");
            this.spendmoneyForm.controls['AmountIncGST'].setValue("");
            this.spendmoneyForm.controls['Note'].setValue(" ");
            this.spendmoneyForm.controls['Matter'].setValue(" ");
          }
          if (this.SendMoney_data.MULTILINE == 0) {
            this.spendmoneyForm.controls['MultiLineExpense'].setValue(0);
            if (this.SendMoney_data.EXPENDITUREITEMS.length != 0) {
              this.multilineCheckbox();
            }
          } else {
            this.spendmoneyForm.controls['MultiLineExpense'].setValue(1);
            this.multilineCheckbox();
          }
          this.Classtype(this.SendMoney_data.EXPENDITUREITEMS[0].EXPENDITURECLASS);
        } else if (response.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
        this.isLoadingResults = false;
      }, error => {
        this.toastr.error(error);
      });
    } else {
      this.forAddshowpopupData();
    }
  }
  // ngAfterViewInit() {
  //   let tempError: any = [];
  //   let tempWarning: any = [];
  //   tempWarning['PAYEE'] = {};
  //   tempError['AMOUNT'] = {};
  //   tempError['NOTE'] = {};
  //   tempError['EXPENDITUREITEMS'] = {};
  //   this.errorWarningData = { "Error": tempError, 'Warning': tempWarning };
  // }
  AfterViewInitATADD() {
    let tempError: any = [];
    let tempWarning: any = [];
    tempWarning['PAYEE'] = {};
    tempError['AMOUNT'] = {};
    tempError['NOTE'] = {};
    tempError['EXPENDITUREITEMS'] = {};
    this.errorWarningData = { "Error": tempError, 'Warning': tempWarning };
  }
  showData(element) {
    element.forEach(x => {
      if (x.ACCOUNTTYPENAME == "Bank Account") {
        // this.spendmoneyForm.controls['Bankac'].setValue(result.MainList.ACCOUNTCLASS + ' - ' + result.MainList.ACCOUNTNUMBER + ' ' + result.MainList.ACCOUNTNAME);
        x.EXPORTINFO.MYOBEXPORTACCOUNT;
        this.spendmoneyForm.controls['Bankac'].setValue(x.ACCOUNTCLASS + ' - ' + x.ACCOUNTNUMBER);
        this.spendmoneyForm.controls['BankacGUID'].setValue(x.ACCOUNTGUID);
      }
      if (x.SUBACCOUNTS) {
        this.showData(x.SUBACCOUNTS);
      }
    });
  }
  forAddshowpopupData() {
    this.AfterViewInitATADD();
    this._mainAPiServiceService.getSetData({ AccountClass: 'BANK ACCOUNT' }, 'GetAccount').subscribe(response => {
      this.behaviorService.dialogClose(response);
      if (response) {
        this.storeDataarray = response.DATA.ACCOUNTS;
        this.showData(this.storeDataarray);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
    }, err => {
    });
    this.isItemSaveClicked = 'no';
    this.getDataForTable = [];
    this.spendmoneyForm.controls['DateIncurred'].setValue(new Date(), 'dd/MM/yyyy');
    this.spendmoneyForm.controls['DatePaid'].setValue(new Date(), 'dd/MM/yyyy');
    //for sending date 
    this.spendmoneyForm.controls['DateIncurredForSend'].setValue(this.datepipe.transform(new Date(), 'dd/MM/yyyy'));
    this.spendmoneyForm.controls['DatePaidForSend'].setValue(this.datepipe.transform(new Date(), 'dd/MM/yyyy'));
    this.spendmoneyForm.controls['ChequeNo'].setValue("0");
    this.spendmoneyForm.controls['Type'].setValue("Cash");


    this.spendmoneyForm.controls['GST1'].setValue("0.00");
    this.spendmoneyForm.controls['AmountIncGST'].setValue("0.00");
    this.spendmoneyForm.controls['AmountExGST'].setValue("0.00");

    this.spendmoneyForm.controls['GSTType'].setValue("1.1");
    this.GstTypeDiff = "1.1";
    this.spendmoneyForm.controls['GST1'].disable();
    this.spendmoneyForm.controls['GST'].setValue(0.0);
    this.spendmoneyForm.controls['Amount'].setValue(0.00);
    this.FinalTotal = 0.00;
    this.FinalTotalGST = 0.00;
    if (this._data.FromWhere == 'FromWIP') {
      this.Classtype("Matter Expense");
      this.spendmoneyForm.controls['Class'].setValue("Matter Expense");
    } else {
      this.Classtype("Expense");
      this.spendmoneyForm.controls['Class'].setValue("Expense");
    }
    this.Paidtype('Paid');
    this.spendmoneyForm.controls['Paid'].setValue("Paid");
    this.amountCal();
    this.isLoadingResults = false;
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  // paid Type Dropdown
  Paidtype(paidvalue) {
    if (paidvalue === 'Paid') {
      this.Bankhide = false;
      $('#bank').removeClass('menu-disabled');
      this.spendmoneyForm.controls['DatePaid'].enable();
      this.spendmoneyForm.controls['Bankac'].enable();
      this.spendmoneyForm.controls['Type'].enable();
      this.spendmoneyForm.controls['ChequeNo'].enable();
    } else if (paidvalue === 'Unpaid') {
      this.Bankhide = true;
      $('#bank').addClass('menu-disabled');
      this.spendmoneyForm.controls['DatePaid'].disable();
      this.spendmoneyForm.controls['Bankac'].disable();
      this.spendmoneyForm.controls['Type'].disable();
      this.spendmoneyForm.controls['ChequeNo'].disable();
      this.spendmoneyForm.controls['Bankac'].setValue('0-0000');
    }
  }
  Classtype(Classvalue) {
    this.classtype = Classvalue;
    if (Classvalue === 'Expense') {
      this.spendmoneyForm.controls['Matter'].setValue('');
      this.spendmoneyForm.controls['MatterGUID'].setValue('');
      if (this.action == 'new') {
        this.hide = true;
        $("#mattersnew").addClass("menu-disabled");
        this.spendmoneyForm.controls['Matter'].disable();
        this.spendmoneyForm.controls['GSTType'].enable();
        this.GstTypeforSelect('1.1');
      } else if (this.action != 'new') {
        this.hide = true;
        this.expac = false;
        $("#mattersnew").addClass("menu-disabled");
        this.spendmoneyForm.controls['Matter'].disable();

      }
      let tempError: any = this.errorWarningData.Error;
      if (tempError != undefined) { delete tempError['SHORTNAME']; }


    } else if (Classvalue === 'Matter Expense') {
      this.hide = false;
      this.expac = false;
      $("#mattersnew").removeClass("menu-disabled");

      if (this._data.FromWhere == "FromWIP") {
        this.spendmoneyForm.controls['Matter'].setValue(this.CurrentMatter.MATTER);
        this.spendmoneyForm.controls['MatterGUID'].setValue(this.CurrentMatter.MATTERGUID);
      } else {
        this.spendmoneyForm.controls['MatterGUID'].setValue('');
      }

      this.forCommonEnable();
      this.GstTypeforSelect('1.1');
    if(this.action == 'new'){
      let tempError: any = this.errorWarningData.Error;
      tempError['SHORTNAME'] = {};
      this.errorWarningData.Error = tempError;
    }
      // this.errorWarningData = { "Error": tempError };
    } else if (Classvalue === 'Capital') {
      this.hide = true;
      this.expac = false;
      $("#mattersnew").addClass("menu-disabled");
      this.spendmoneyForm.controls['Matter'].setValue('');
      this.spendmoneyForm.controls['MatterGUID'].setValue('');
      this.spendmoneyForm.controls['Matter'].disable();
      this.GstTypeforSelect('1.1');
      // this.spendmoneyForm.controls['GSTType'].disable();
      let tempError: any = this.errorWarningData.Error;
      if (tempError != undefined) { delete tempError['SHORTNAME']; }
    } else if (Classvalue === 'Pay GST') {
      this.hide = true;
      $("#mattersnew").addClass("menu-disabled");
      this.spendmoneyForm.controls['Matter'].setValue('');
      this.spendmoneyForm.controls['MatterGUID'].setValue('');
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['GSTType'].disable();
      this.GstTypeforSelect('No GST');
      let tempError: any = this.errorWarningData.Error;
      if (tempError != undefined) { delete tempError['SHORTNAME']; }
    } else if (Classvalue === 'Pay Tax') {
      this.hide = true;
      this.expac = false;
      $("#mattersnew").addClass("menu-disabled");
      this.spendmoneyForm.controls['Matter'].setValue('');
      this.spendmoneyForm.controls['MatterGUID'].setValue('');
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['GSTType'].disable();
      this.GstTypeforSelect('No GST');
      let tempError: any = this.errorWarningData.Error;
      if (tempError != undefined) { delete tempError['SHORTNAME']; }
    } else if (Classvalue === 'Personal') {
      this.hide = true;
      this.expac = false;
      $("#mattersnew").addClass("menu-disabled");
      this.spendmoneyForm.controls['Matter'].setValue('');
      this.spendmoneyForm.controls['MatterGUID'].setValue('');
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['GSTType'].disable();
      this.GstTypeforSelect('No GST');
      let tempError: any = this.errorWarningData.Error;
      if (tempError != undefined) { delete tempError['SHORTNAME']; }
    } else if (Classvalue === 'Description') {
      this.hide = true;
      this.expac = false;
      $("#mattersnew").addClass("menu-disabled");
      this.spendmoneyForm.controls['Matter'].setValue('');
      this.spendmoneyForm.controls['MatterGUID'].setValue('');
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['GSTType'].disable();
      this.GstTypeforSelect('No GST');
      let tempError: any = this.errorWarningData.Error;
      if (tempError != undefined) { delete tempError['SHORTNAME']; }
    } else if (Classvalue === 'Other') {
      this.hide = true;
      this.expac = false;
      $("#mattersnew").addClass("menu-disabled");
      this.spendmoneyForm.controls['Matter'].setValue('');
      this.spendmoneyForm.controls['MatterGUID'].setValue('');
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['GSTType'].disable();
      this.GstTypeforSelect('No GST');
      let tempError: any = this.errorWarningData.Error;
      if (tempError != undefined) { delete tempError['SHORTNAME']; }
    }
  }
  ContactMatter() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, {
      width: '100%', disableClose: true, data: {
        type: ""
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.spendmoneyForm.controls['Payee'].setValue(result.CONTACTNAME);
    });
  }
  public selectMatter() {
    const dialogRef = this.MatDialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spendmoneyForm.controls['Matter'].setValue(result.MATTER);
        this.spendmoneyForm.controls['MatterGUID'].setValue(result.MATTERGUID);
      }
    });
  }
  get f() {
    return this.spendmoneyForm.controls;
  }
  commmonDisabled() {
    this.spendmoneyForm.controls['Class'].disable();
    this.spendmoneyForm.controls['GSTType'].disable();
    this.spendmoneyForm.controls['Matter'].disable();
    this.spendmoneyForm.controls['Note'].disable();
    this.spendmoneyForm.controls['AmountIncGST'].disable();
    this.spendmoneyForm.controls['Expenseac'].disable();
  }
  forCommonEnable() {
    if (this.classtype == 'Matter Expense') {
      this.spendmoneyForm.controls['Matter'].enable();
    }
    this.spendmoneyForm.controls['Class'].enable();
    this.spendmoneyForm.controls['GSTType'].enable();
    this.spendmoneyForm.controls['Note'].enable();
    this.spendmoneyForm.controls['AmountIncGST'].enable();
    this.spendmoneyForm.controls['Expenseac'].enable();
  }
  multilineCheckbox() {
    this.size = 20;
    if (this.f.MultiLineExpense.value == true) {
      this.dataTableHide = "yes";
      this.Main3btn = 'enable';
      this.SubMain2btn = 'disabled';
      this.commmonDisabled();
    }
    else {
      this.size = 33.33;
      this.Main3btn = 'disabled';
      this.SubMain2btn = 'enable';
      this.dataTableHide = "false";
      if (this.action == 'new') {
        this.commonEmptyFiild();
        this.GstTypeforSelect('1.1');
        // this.spendmoneyForm.controls['Class'].setValue(this.f.Class.value);
        // this.spendmoneyForm.controls['GST1'].setValue(this.f.GST1.value);
        // this.spendmoneyForm.controls['AmountExGST'].setValue(this.f.AmountExGST.value);
        // this.spendmoneyForm.controls['Note'].setValue(this.f.Note.value);
        // this.spendmoneyForm.controls['AmountIncGST'].setValue(this.f.AmountIncGST.value);
        // this.spendmoneyForm.controls['Expenseac'].setValue(this.f.Expenseac.value);
      }
      // else if (this.action == 'edit' && SendMoney_data.MULTILINE == 1) {
      //   this.commonEmptyFiild();
      // }
      else {
        this.spendmoneyForm.controls['Class'].setValue(this.SendMoney_data.EXPENDITUREITEMS[0].EXPENDITURECLASS);
        this.spendmoneyForm.controls['GST1'].setValue(this.SendMoney_data.EXPENDITUREITEMS[0].GST.toString());
        this.spendmoneyForm.controls['Note'].setValue(this.SendMoney_data.EXPENDITUREITEMS[0].NOTE);
        this.spendmoneyForm.controls['AmountIncGST'].setValue(this.SendMoney_data.EXPENDITUREITEMS[0].AMOUNT.toString());
        // this.spendmoneyForm.controls['Expenseac'].setValue('');
        this.spendmoneyForm.controls['AmountExGST'].setValue(this.SendMoney_data.EXPENDITUREITEMS[0].AMOUNT - this.SendMoney_data.EXPENDITUREITEMS[0].GST);
        if (round(this.SendMoney_data.EXPENDITUREITEMS[0].AMOUNT / 10) == round(this.SendMoney_data.EXPENDITUREITEMS[0].GST)) {
          this.spendmoneyForm.controls['GSTType'].setValue("1.1");
          this.GstTypeDiff = "1.1"
          this.amountCal();
        } else if (this.SendMoney_data.EXPENDITUREITEMS[0].GST == 0) {
          this.spendmoneyForm.controls['GSTType'].setValue("No GST");
          this.GstTypeDiff = "No GST"
          this.amountCal();
        } else if (this.SendMoney_data.EXPENDITUREITEMS[0].AMOUNT / 10 == this.SendMoney_data.EXPENDITUREITEMS[0].GST) {
          this.spendmoneyForm.controls['GSTType'].setValue("LessThen 10% GST");
          this.GstTypeDiff = "LessThen 10% GST"
          this.amountCal();
        }
      }
      this.forCommonEnable();
      this.Classtype(this.classtype);
    }
  }
  GstTypeforSelect(val) {
    this.GstTypeDiff = val;
    this.amountCal();
    if (val == "LessThen 10% GST") {
      this.spendmoneyForm.controls['GST1'].enable();
    } else if (val == "No GST") {
      this.spendmoneyForm.controls['GST1'].disable();
      this.spendmoneyForm.controls['GST1'].setValue(0.00);
      this.spendmoneyForm.controls['GSTType'].setValue('No GST');
    } else if (val == "10") {
      this.spendmoneyForm.controls['GST1'].disable();
      this.spendmoneyForm.controls['GST1'].setValue("10");
    } else if (val == "1.1") {
      // this.spendmoneyForm.controls['GST1'].disable();
      this.spendmoneyForm.controls['GSTType'].enable();
      this.spendmoneyForm.controls['GSTType'].setValue("1.1");
    }
  }
  selectSpendMoneyId(row) {
  }
  commonEmptyFiild() {
    this.spendmoneyForm.controls['GSTType'].setValue("1.1");
    this.spendmoneyForm.controls['AmountIncGST'].setValue(0.00);
    this.spendmoneyForm.controls['GST1'].setValue(0.00);
    this.spendmoneyForm.controls['AmountExGST'].setValue(0.00);
    this.GSTValForExGst = 0.00;
    this.spendmoneyForm.controls['Class'].setValue("Expense");
    this.spendmoneyForm.controls['Note'].setValue("");
    this.spendmoneyForm.controls['Expenseac'].setValue(" ");
    this.spendmoneyForm.controls['ExpenseacGUID'].setValue(" ");
  }
  AddMoneyItem() {
    this.commonEmptyFiild();
    this.GstTypeDiff = "1.1";
    this.SubMain2btn = 'enable';
    this.Main3btn = 'disabled';
    this.forCommonEnable();
    this.Classtype(this.classtype);
  }
  SaveItemDialog() {
    this.isItemSaveClicked = 'yes';
    this.SubMain2btn = 'disabled';
    this.commmonDisabled();
    this.Main3btn = 'enable';
    if (this.btnClickpurpose == 'edit') {
      this.getDataForTable[this.INDEX].EXPENDITURECLASS = this.f.Class.value;
      this.getDataForTable[this.INDEX].GST = this.f.GST1.value;
      this.getDataForTable[this.INDEX].EXPENSEACCOUNTGUID = this.f.ExpenseacGUID.value;
      this.getDataForTable[this.INDEX].EXPENSEACCOUNT = this.f.Expenseac.value;
      this.getDataForTable[this.INDEX].AMOUNT = this.f.AmountIncGST.value;
      this.getDataForTable[this.INDEX].MATTERGUID = this.f.MatterGUID.value;
      this.getDataForTable[this.INDEX].SHORTNAME = this.f.Matter.value;
      this.getDataForTable[this.INDEX].NOTE = this.f.Note.value;
      this.btnClickpurpose = 'save';
      this.globallyCalculation();
    }
    else {
      this.getDataForTable.push({
        EXPENDITURECLASS: this.f.Class.value,
        AMOUNT: this.f.AmountIncGST.value,
        GST: this.f.GST1.value,
        EXPENDITUREGUID: '',
        EXPENSEACCOUNTGUID: this.f.ExpenseacGUID.value,
        EXPENSEACCOUNT: this.f.Expenseac.value,
        MATTERGUID: this.f.MatterGUID.value,
        SHORTNAME: this.f.Matter.value,
        NOTE: this.f.Note.value
      });
      this.globallyCalculation();

    }
    this.highlightedRows = 0;
    this.editMoney(this.getDataForTable[0], 0);
  }
  globallyCalculation() {
    this.FAmount = [];
    this.FGst = [];
    this.getDataForTable.forEach(element => {
      this.FAmount.push(element.AMOUNT);
      this.FGst.push(Number(element.GST));
    });
    this.FinalTotal = Number(this.FAmount.reduce(function (a = 0, b = 0) { return a + b; }, 0));
    this.FinalTotalGST = Number(this.FGst.reduce(function (a = 0, b = 0) { return a + b; }, 0));

    // if(this.FinalTotal==null || this.FinalTotal==null || this.FinalTotalGST==null || this.FinalTotalGST==null){
    //   this.spendmoneyForm.controls['Amount'].setValue(0.00);
    //   this.spendmoneyForm.controls['GST'].setValue(0.00);
    // }
    this.spendmoneyForm.controls['Amount'].setValue(parseFloat(this.FinalTotal).toFixed(2));
    this.spendmoneyForm.controls['GST'].setValue(parseFloat(this.FinalTotalGST).toFixed(2));
  }
  clicktitle() {
  }
  Cashtype(val) {
    if (val == "Cheque") {
      this.spendmoneyForm.controls['ChequeNo'].setValue("1");
    } else {
      this.spendmoneyForm.controls['ChequeNo'].setValue("0");
    }
  }
  editElement() {
    this.forCommonEnable();
    this.btnClickpurpose = "edit";
    this.SubMain2btn = 'enable';
  }
  editMoney(row, index) {
    this.MainData = row;
    this.INDEX = index;
    this.spendmoneyForm.controls['AmountIncGST'].setValue(row.AMOUNT);
    this.spendmoneyForm.controls['Class'].setValue(row.EXPENDITURECLASS);
    this.spendmoneyForm.controls['GST1'].setValue(row.GST);
    this.spendmoneyForm.controls['Note'].setValue(row.NOTE);
    this.spendmoneyForm.controls['Matter'].setValue(row.SHORTNAME);
    this.spendmoneyForm.controls['Expenseac'].setValue(row.EXPENSEACCOUNTNUMBER);
    this.commmonDisabled();
  }
  deleteElement() {
    this.getDataForTable.splice(this.INDEX, 1);
    this.globallyCalculation();
    this.commonEmptyFiild();
    this.commmonDisabled();
    if (this.getDataForTable.length != 0) {
      this.highlightedRows = 0;
      this.editMoney(this.getDataForTable[0], 0);
    }
  }
  CancelItemDialog() {
    this.SubMain2btn = 'disabled';
    this.Main3btn = 'enable';
    this.commmonDisabled();
  }
  amountCal() {
    let amount = this.f.AmountIncGST.value;
    let cal: any = (this.f.AmountIncGST.value / 1.1).toFixed(2);
    if (this.GstTypeDiff == "No GST") {
      this.GSTValForExGst = amount;
      this.spendmoneyForm.controls['GST1'].setValue(0.00);
    } else if (this.GstTypeDiff == "1.1") {
      this.GSTValAfterCal = (amount - cal).toFixed(2);
      this.GSTValForExGst = cal;
    } else if (this.GstTypeDiff == "LessThen 10% GST") {
      this.GSTValAfterCal = 0;
      this.GSTValForExGst = amount;
    }
  }
ExamountCall(){
  let amount = this.f.AmountExGST.value;
  let cal: any = (this.f.AmountExGST.value * 1.1).toFixed(2);
  this.GSTValForInGst = cal;
  this.GSTValAfterCal = (cal - amount).toFixed(2);
}

  GSTCalFun() {
    this.GSTValForExGst = round(this.f.AmountIncGST.value - this.f.GST1.value).toFixed(2);
  }
  choosedDateForIncurred(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.spendmoneyForm.controls['DateIncurredForSend'].setValue(begin);
  }
  choosedDateForPaid(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.spendmoneyForm.controls['DatePaidForSend'].setValue(begin);
  }
  Addspendmoney() {
    this.forCommonEnable();
  }
  CommonSendOneLineData() {
    this.setMainAmount = Number(this.f.AmountIncGST.value);
    this.setMainGST = Number(this.f.GST1.value);
    this.sendItem.push({
      // AMOUNT: Number(this.f.AmountIncGST.value),
      EXPENDITURECLASS: this.f.Class.value,
      EXPENDITUREGUID: '',
      EXPENDITUREITEMGUID: "",
      EXPENSEACCOUNTGUID: this.f.ExpenseacGUID.value,
      GST: Number(this.f.GST1.value),
      MATTERGUID: this.f.MatterGUID.value,
      NOTE: this.f.Note.value,
      SHORTNAME: this.f.Matter.value,
      WORKITEMGUID: "",
      AMOUNTEXGST: Number(this.GSTValForExGst)
    });
  }
  commonSendMultiLineData() {
    this.setMainAmount = this.FinalTotal;
    this.setMainGST = this.FinalTotalGST;
    this.getDataForTable.forEach(element => {
      // this.itemAmountExGST=Number(element.AMOUNT)-Number(element.GST);
      this.sendItem.push({
        // AMOUNT: Number(element.AMOUNT),
        EXPENDITURECLASS: element.EXPENDITURECLASS,
        EXPENDITUREGUID: '',
        EXPENDITUREITEMGUID: "",
        EXPENSEACCOUNTGUID: element.EXPENSEACCOUNTGUID,
        GST: Number(element.GST),
        MATTERGUID: element.MATTERGUID,
        NOTE: element.NOTE,
        SHORTNAME: element.SHORTNAME,
        WORKITEMGUID: "",
        AMOUNTEXGST: Number(element.AMOUNT) - Number(element.GST)
      })
    });
  }
  FinalSaveData() {
    if (this.action == 'new' && this.f.MultiLineExpense.value == false) {
      this.CommonSendOneLineData();
    } else if (this.action == 'new' && this.f.MultiLineExpense.value == true && this.isItemSaveClicked == 'no') {
      this.CommonSendOneLineData();
    } else if (this.action == 'new' && this.f.MultiLineExpense.value == true && this.isItemSaveClicked == 'yes') {
      this.commonSendMultiLineData();
    } else if (this.action != 'new' && this.SendMoney_data.MULTILINE == 1 && this.f.MultiLineExpense.value == true) {
      this.commonSendMultiLineData();
    } else if (this.action != 'new' && this.SendMoney_data.MULTILINE == 1 && this.f.MultiLineExpense.value == false) {
      // first push and then get 
      // need to remove class from hml and show box 
      this.getDataForTable.push({
        // AMOUNT: Number(this.f.AmountIncGST.value),
        EXPENDITURECLASS: this.f.Class.value,
        EXPENDITUREGUID: '',
        EXPENDITUREITEMGUID: "",
        EXPENSEACCOUNTGUID: this.f.ExpenseacGUID.value,
        GST: Number(this.f.GST1.value),
        MATTERGUID: this.f.MatterGUID.value,
        NOTE: this.f.Note.value,
        SHORTNAME: this.f.Matter.value,
        WORKITEMGUID: "",
        AMOUNTEXGST: this.GSTValForExGst
      });
      this.commonSendMultiLineData();
    } else if (this.action != 'new' && this.SendMoney_data.MULTILINE == 0 && this.f.MultiLineExpense.value == false) {
      this.CommonSendOneLineData();

    } else if (this.action != 'new' && this.SendMoney_data.MULTILINE == 0 && this.f.MultiLineExpense.value == true) {
      this.commonSendMultiLineData();
    }
    // for multiline   
    if (this.f.MultiLineExpense.value == false) { this.multicheckboxval = 0; }
    else if (this.getDataForTable.length == 1 || this.getDataForTable.length == 0) { this.multicheckboxval = 0; }
    else { this.multicheckboxval = 1; }
    //ammount calculation
    // for ammount field 
    this.FinalExGSTAmount = this.setMainAmount - this.setMainGST;

    
    if (this.FinalExGSTAmount == 0 || this.f.Expenseac.value == '' || this.f.Notes.value == '') {
      this.toastr.error("Amount should not be 0 || You should select a Expense a/c  || You should enter Notes");
      this.sendItem=[];
      return;
    }
    let Data = {
      EXPENDITUREGUID: this.action == 'edit' ? this.SendMoney_data.EXPENDITUREGUID : " ",
      EXPENDITURETYPE: this.f.Type.value,
      STATUS: this.f.Paid.value,
      CHEQUENO: this.f.ChequeNo.value,
      PAYEE: this.f.Payee.value,
      MULTILINE: this.multicheckboxval,
      AMOUNT: this.FinalExGSTAmount,
      GST: Number((this.setMainGST).toFixed(2)),

      DATE: this.f.DatePaidForSend.value,
      RECEIVEDDATE: this.f.DateIncurredForSend.value,
      BANKACCOUNTGUID: this.f.BankacGUID.value,
      USERCODE: '',
      SOURCEREFERENCE: this.f.Invoice.value,
      NOTE: this.f.Notes.value,
      EXPENDITUREITEMS: this.sendItem
    }
    if (this.action == "edit") {
      this.FormAction = "update";
    } else if (this.action == "new" || this.action == "duplicate") {
      this.FormAction = "insert";
    }
    this.Setata(Data);
    this.isItemSaveClicked = 'no';
  }
  Setata(potData) {
    this.isspiner = true;
    let details = { FormAction: this.FormAction, VALIDATEONLY: true, Data: potData };
    this._mainAPiServiceService.getSetData(details, 'SetExpenditure').subscribe(response => {
      //array empty of save item
      this.sendItem = [];
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
    this.errorWarningData = { "Error": tempError, 'Warning': tempWarning };
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
          this.saveSpendMoneyData(details);
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.saveSpendMoneyData(details);
      this.isspiner = false;
    }
  }
  saveSpendMoneyData(data: any) {
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetExpenditure').subscribe(response => {
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
  BankingDialogOpen(type: any) {
    if (type == '') {
      if (this.classtype == "Expense" || this.classtype == "Matter Expense" || this.classtype == "Description") {
        type = "EXPENSE";
      } else if (this.classtype == "Capital") {
        type = "ASSET";
      } else if (this.classtype == "Pay GST") {
        type = "LIABILITY";
      } else if (this.classtype == "Pay Tax") {
        type = "LIABILITY";
      } else if (this.classtype == "Personal") {
        type = "EQUITY";
      } else if (this.classtype == "Other") {
        type = "All";
      }
    }
    const dialogRef = this.MatDialog.open(BankingDialogComponent, {
      disableClose: true, width: '100%', data: { AccountType: type, FromWhere: 'spendMonyExpense' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type == "EXPENSE") {
          this.spendmoneyForm.controls['Expenseac'].setValue(result.MainList.ACCOUNTCLASS + ' - ' + result.MainList.ACCOUNTNUMBER + ' ' + result.MainList.ACCOUNTNAME);
          this.spendmoneyForm.controls['ExpenseacGUID'].setValue(result.ACCOUNTGUID);
        } else {
          this.spendmoneyForm.controls['Bankac'].setValue(result.MainList.ACCOUNTCLASS + ' - ' + result.MainList.ACCOUNTNUMBER + ' ' + result.MainList.ACCOUNTNAME);
          this.spendmoneyForm.controls['BankacGUID'].setValue(result.ACCOUNTGUID);
        }
      }
    });
  }
}
export interface UserData {
  AMOUNT: string;
  EXPENDITURECLASS: string;
  GST: string;
  NOTE: string;
}