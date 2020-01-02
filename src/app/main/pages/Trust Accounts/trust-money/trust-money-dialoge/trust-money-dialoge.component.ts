import { Component, OnInit, Input, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MainAPiServiceService } from 'app/_services';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatterDialogComponent } from 'app/main/pages/time-entries/matter-dialog/matter-dialog.component';
import { DatePipe } from '@angular/common';
import { ContactDialogComponent } from 'app/main/pages/contact/contact-dialog/contact-dialog.component';
import { ContactSelectDialogComponent } from 'app/main/pages/contact/contact-select-dialog/contact-select-dialog.component';
import { environment } from 'environments/environment';
import * as $ from 'jquery';
import { BankingDialogComponent } from 'app/main/pages/banking/banking-dialog.component';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-trust-money.dialoge',
  templateUrl: './trust-money-dialoge.component.html',
  styleUrls: ['./trust-money-dialoge.component.scss'],
  animations: fuseAnimations
})
export class TrustMoneyDialogeComponent implements OnInit {
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  getDataForTable: any = [];
  MatterAmmountArray: any = [];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  errorWarningData: any = { "Error": [], 'Warning': [] };
  isLoadingResults: boolean = false;
  TrustMoneyData = {
    "PaymentType": "Cheque", "CheckBox": false
  }
  addData: any = [];
  isspiner: boolean = false;
  PymentType: string = "Cheque";
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  matterType: boolean = false;
  action: any;
  title: string;
  ForDetailTab: string;
  TrustMoneyForm: FormGroup;
  highlightedRows: any;
  INDEX: any;
  SendDate: string;
  sendToAPI: string;
  PDFURL: any;
  showPDFPopup: string;
  base_url: string;
  forPDF: any;
  sendTransectionSubType: string;
  TranClassName: any;
  constructor(private _mainAPiServiceService: MainAPiServiceService,
    private _formBuilder: FormBuilder, private toastr: ToastrService,
    public dialogRef: MatDialogRef<TrustMoneyDialogeComponent>,
    private dialog: MatDialog,
    public _matDialog: MatDialog,
    private datepipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public _data: any, ) {

    this.base_url = environment.ReportUrl;
    this.TrustMoneyForm = this._formBuilder.group({
      FROMMATTER: [''],
      TrustAccount: [''],
      FROMMATTERGUID: [''],
      TRANSACTIONDATE: [''],
      AMOUNT: [''],
      PAYMENTTYPE: [''],
      PaymentType: [''],
      BANKCHEQUE: [''],
      BENEFICIARY: [''],
      AUTHORISEDBY: [''],
      PREPAREDBY: [''],
      TOMATTERGUID: [''],
      //item 
      SHORTNAME: [''],
      MATTERGUID: [''],
      PURPOSE: [''],
      //cheque details 
      CHEQUENO: [''],
      ACCOUNTNAME: [''],
      ACCOUNTNUMBER: [''],
      BSB: [''],
      EFTREFERENCE: [''],
      // cash 
      COINS: [''],
      FIFTYDOLLARS: [''],
      HUNDREDDOLLARS: [''],
      FIVEDOLLARS: [''],
      TENDOLLARS: [''],
      TWENTYDOLLARS: [''],
      // address
      PAYOR: [''],
      ADDRESS1: [''],
      POSTCODE: [''],
      STATE_: [''],
      SUBURB: [''],
      MatterAMOUNT: [''],
      // extra
      BankChequeChkBox: [''],
      CheckBox: [''],
      INVOICEDVALUEEXGST: [''],
      Unallocated: [''],
      Total: [''],
      Ledger: [''],
      BANKACCOUNTGUID: [''],
      BANKACCOUNTGUIDTEXT: ['']
    });
    this.TranClassName = '';
    this.sendTransectionSubType = 'Normal';
    this.TrustMoneyForm.controls['PREPAREDBY'].setValue('Claudine Parkinson (pwd=test)');
    this.TrustMoneyForm.controls['PAYMENTTYPE'].setValue('Cheque');
    this.TrustMoneyForm.controls['CheckBox'].setValue(false);
    this.action = _data.action;
    this.forPDF = _data.forPDF;
    if (this.action == "receipt") {
      $("#Contcat_id").removeClass("menu-disabled");
      this.title = "Add Trust Receipt"
      this.TranClassName = 'Trust Money'
      this.sendToAPI = 'Receipt';
    } else if (this.action == "withdrawal") {
      this.TranClassName = 'Trust Money'
      $("#Contcat_id").removeClass("menu-disabled");
      this.title = "Add Trust withdrawal";
      this.sendToAPI = 'Withdrawal';
    } else if (this.action == "Transfer") {
      this.TranClassName = 'Trust Money'
      $("#Contcat_id").removeClass("menu-disabled");
      this.title = "Add Trust Transfer";
      this.sendToAPI = 'Transfer';
      this.TrustMoneyForm.controls['PAYMENTTYPE'].setValue('Transfer');
      this.TrustMoneyData.PaymentType = "Transfer";
      this.PymentType = "Transfer";
    } else if (this.action == "office") {
      $("#Contcat_id").removeClass("menu-disabled");
      this.title = "Add Trust Office";
      this.matterType = true;
      this.TrustMoneyForm.controls['CheckBox'].setValue(true);
      this.TrustMoneyData.CheckBox = true;
      // this.PymentType="Office";
    } else if (this.action == "money receipt") {
      $("#Contcat_id").removeClass("menu-disabled");
      this.TranClassName = 'Controlled Money'
      this.sendToAPI = 'Receipt';
      this.sendTransectionSubType = 'Normal';
      this.title = "Add Controlled Money Receipt";
      // this.defaultCallAPI();
    } else if (this.action == "money withdrawal") {
      $("#Contcat_id").removeClass("menu-disabled");
      this.TranClassName = 'Controlled Money'
      this.sendTransectionSubType = 'Normal';
      this.title = "Add Controlled Money withdrawal";
      this.sendToAPI = 'Withdrawal';
      // this.defaultCallAPI();
    } else if (this.action == "Cancelled Cheque") {
      $("#Contcat_id").removeClass("menu-disabled");
      this.title = "Add Cancelled Cheque";
      this.sendToAPI = 'Receipt';
      this.TranClassName = 'Trust Money'
      this.sendTransectionSubType = 'Cancelled Cheque';
      $("#Contcat_id").addClass("menu-disabled");
      this.TrustMoneyForm.controls['Ledger'].setValue('Nill Values Ledger : $0.00');
      this.TrustMoneyForm.controls['PURPOSE'].setValue('Cancelled Cheque');
      this.TrustMoneyForm.controls['PAYMENTTYPE'].setValue('Cheque');
      this.TrustMoneyForm.controls['AMOUNT'].setValue(0.00);
      this.TrustMoneyForm.controls['PAYMENTTYPE'].disable();
      this.TrustMoneyForm.controls['PAYOR'].disable();
      this.TrustMoneyForm.controls['AMOUNT'].disable();
      this.TrustMoneyForm.controls['TRANSACTIONDATE'].disable();

    } else if (this.action == "Unknown Deposit") {
      this.TranClassName = 'Trust Money'
      $("#Contcat_id").removeClass("menu-disabled");
      this.PymentType = "EFT";
      this.sendToAPI = 'Receipt';
      this.title = "Add Unknown Deposit Receipt";
      this.sendTransectionSubType = 'Unknown Deposit';
      this.TrustMoneyForm.controls['PAYMENTTYPE'].setValue('EFT');
      this.defaultCallAPI();
    } else if (this.action == "Transfer Unknow Deposit") {
      $("#Contcat_id").removeClass("menu-disabled");
      this.TranClassName = 'Transfer'
      this.title = "Add Unknown Deposit Transfer";
      this.sendToAPI = 'Transfer';
      this.sendTransectionSubType = 'Unknown Deposit';
      this.TrustMoneyForm.controls['PAYMENTTYPE'].disable();
      this.TrustMoneyForm.controls['PAYMENTTYPE'].setValue('Transfer');
      this.TrustMoneyData.PaymentType = "Transfer";
      this.PymentType = "Transfer";
    } else if (this.action == "Statutory Deposit") {
      this.TranClassName = 'Trust Money'
      this.sendToAPI = 'Withdrawal';
      this.TrustMoneyForm.controls['PURPOSE'].setValue('Statutory Deposit');
      $("#Contcat_id").removeClass("menu-disabled");
      this.title = "Add Statutory Deposit";
      this.ForDetailTab = 'Statutory Deposit';
      this.sendTransectionSubType = 'Statutory Deposit';
      this.defaultCallAPI();
      // this.action = "withdrawal";
    } else if (this.action == "Statutory Receipt") {
      this.TranClassName = 'Trust Money'
      this.sendToAPI = 'Receipt';
      this.TrustMoneyForm.controls['PURPOSE'].setValue('Statutory Deposit');
      this.sendTransectionSubType = 'Statutory Deposit';
      this.defaultCallAPI();
      $("#Contcat_id").removeClass("menu-disabled");
      this.title = "Add Statutory Receipt";
      this.ForDetailTab = 'Statutory Receipt';
      // this.action = "receipt";
    } else if (this.action == "Release Trust") {
      $("#Contcat_id").removeClass("menu-disabled");
      this.title = "Add Release Trust";
    }

    if (this.forPDF == 'Yes') {
      if (_data.PDFURL) {
        this.PDFURL = _data.PDFURL;
      }
    }
  }
  ngOnInit() {
    this.TrustMoneyForm.controls['BANKACCOUNTGUID'].setValue('');
  }
  defaultCallAPI() {
    let data = {
      "TRANSACTIONCLASS": this.TranClassName,
      "TRANSACTIONTYPE": "Normal Item",
      "TRANSACTIONSUBTYPE": this.sendTransectionSubType,
      "CASHBOOK": this.sendToAPI,
    }

    this._mainAPiServiceService.getSetData({ Data: data, FormAction: 'default' }, 'SetTrustTransaction').subscribe(response => {
      this.TrustMoneyForm.controls['Ledger'].setValue(response.DATA.DEFAULTVALUES.MATTER);
      this.TrustMoneyForm.controls['MATTERGUID'].setValue(response.DATA.DEFAULTVALUES.MATTERLEDGERGUID);
      this.TrustMoneyForm.controls['BANKACCOUNTGUID'].setValue(response.DATA.DEFAULTVALUES.BANKACCOUNTGUID);
      this.TrustMoneyForm.controls['TrustAccount'].setValue(response.DATA.DEFAULTVALUES.BANKACCOUNT + '  ' + '$' + response.DATA.DEFAULTVALUES.BANKACCOUNTBALANCE);
    });
  }
  get f() {
    return this.TrustMoneyForm.controls;
  }
  PaymentTypeChange(val) {
    if (val == "Cheque") {
      this.PymentType = "Cheque";
    } else if (val == "EFT") {
      this.PymentType = "EFT";
    } else if (val == "Cash") {
      this.PymentType = "Cash";
    } else if (val == "Bank") {
      this.PymentType = "Bank";
    }
  }
  ChkDeltabx(val) {
  }

  CheckBoxClick(val) {
    this.matterType = val
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  SelectMatter(key) {
    const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (key == 'from matter') {
          this.TrustMoneyForm.controls['FROMMATTER'].setValue(result.MATTER);
          this.TrustMoneyForm.controls['FROMMATTERGUID'].setValue(result.MATTERGUID);
        } else {
          this.TrustMoneyForm.controls['SHORTNAME'].setValue(result.MATTER);
          this.TrustMoneyForm.controls['MATTERGUID'].setValue(result.MATTERGUID);
          this.TrustMoneyForm.controls['INVOICEDVALUEEXGST'].setValue(result.INVOICEDVALUEEXGST);
        }
      }
    });
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  choosedDateTranD(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.SendDate = begin
  }
  SaveTrustMoney() {



    let data = {


      TRANSACTIONDATE: this.SendDate,
      AMOUNT: this.f.AMOUNT.value,
      PAYMENTTYPE: this.f.PAYMENTTYPE.value,
      PURPOSE: this.f.PURPOSE.value,
      TOMATTERGUID: this.f.MATTERGUID.value,
      FROMMATTERGUID: this.f.FROMMATTERGUID.value,
      BANKCHEQUE: this.f.BANKCHEQUE.value,
      BENEFICIARY: this.f.BENEFICIARY.value,
      // new added 
      CASHBOOK: this.sendToAPI,
      // TRANSACTIONCLASS: "Trust Money",
      TRANSACTIONCLASS: this.TranClassName,
      TRANSACTIONTYPE: "Normal Item",
      TRANSACTIONSUBTYPE: this.sendTransectionSubType,

      PAYORGROUP: {
        PAYOR: this.f.PAYOR.value,
        ADDRESS1: this.f.ADDRESS1.value,
        // ADDRESS2: '',
        SUBURB: this.f.SUBURB.value,
        STATE: this.f.STATE_.value,
        POSTCODE: this.f.POSTCODE.value
      },
      AUTHORISEDBY: this.f.AUTHORISEDBY.value,
      PREPAREDBY: this.f.PREPAREDBY.value,

      CASHGROUP: {
        COINS: this.f.COINS.value,
        FIFTYDOLLARS: this.f.FIFTYDOLLARS.value,
        HUNDREDDOLLARS: this.f.HUNDREDDOLLARS.value,
        FIVEDOLLARS: this.f.FIVEDOLLARS.value,
        TENDOLLARS: this.f.TENDOLLARS.value,
        TWENTYDOLLARS: this.f.TWENTYDOLLARS.value,
      },
      BANKDETAILS: {
        CHEQUENO: this.f.CHEQUENO.value,
        ACCOUNTNAME: this.f.ACCOUNTNAME.value,
        ACCOUNTNUMBER: this.f.ACCOUNTNUMBER.value,
        BSB: this.f.BSB.value,
        EFTREFERENCE: this.f.EFTREFERENCE.value,
      },
      BANKACCOUNTGUID: this.f.BANKACCOUNTGUID.value,

      //for now extra
      // PaymentType: this.f.PaymentType.value,
      // //item 
      // SHORTNAME: this.f.SHORTNAME.value,
      // MATTERGUID: this.f.MATTERGUID.value,
      // // PURPOSE: this.f.PURPOSE.value,

    }
    if (this.action == "Statutory Receipt" || this.action == "Unknown Deposit" || this.action == "Statutory Deposit") {
      delete data.TOMATTERGUID;
      delete data.FROMMATTERGUID;

    }
    this.isspiner = true;
    let finalData = { DATA: data, FormAction: 'insert', VALIDATEONLY: true }
    this._mainAPiServiceService.getSetData(finalData, 'SetTrustTransaction').subscribe(response => {
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
          this.trustMoneyData(details);
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.trustMoneyData(details);
      this.isspiner = false;
    }
  }
  trustMoneyData(data: any) {
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetTrustTransaction').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        if (response.DATA.PDFFILENAME != '') {
          this.showPDFPopup = 'yes';

          this.dialog.open(TrustMoneyDialogeComponent, {
            width: '100%', data: {
              action: this.action,
              forPDF: "Yes",
              PDFURL: response.DATA.PDFFILENAME
            }
          });
        }
        this.toastr.success('save successfully');
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
  editInnerTable(val, Index) {
    this.INDEX = Index;
    this.highlightedRows = Index;
  }
  addMatterItem() {
    this.MatterAmmountArray = [];

    if (this.f.AMOUNT.value == '') {
      this.toastr.error("Please enter Ammount ");
      return false;
    } else if (Number(this.f.Unallocated.value) < Number(this.f.MatterAMOUNT.value)) {
      this.toastr.error("Ammount can not be larger then what is unallocated");
      return false;
    }
    else {
      if (this.f.SHORTNAME.value != '' && this.f.MatterAMOUNT.value != '') {
        // calculation total and unallocated 
        this.getDataForTable.push({
          Matter: this.f.SHORTNAME.value + ' :' + this.f.INVOICEDVALUEEXGST.value,
          Ammount: this.f.MatterAMOUNT.value
        })
        this.getDataForTable.forEach(element => {
          this.MatterAmmountArray.push(Number(element.Ammount))
        });
        let SumOfMatterAmmount = Number(this.MatterAmmountArray.reduce(function (a = 0, b = 0) { return a + b; }, 0));
        this.TrustMoneyForm.controls['Unallocated'].setValue(Number(this.f.AMOUNT.value) - Number(SumOfMatterAmmount))
        this.TrustMoneyForm.controls['Total'].setValue(Number(SumOfMatterAmmount))
        // empty field for another push 
        this.CommonEmptyField();
      } else {
        this.toastr.error("Please fill up Matter | Ammount fields");
      }
    }
  }
  CommonEmptyField() {
    this.TrustMoneyForm.controls['MatterAMOUNT'].setValue('');
    this.TrustMoneyForm.controls['PURPOSE'].setValue('');
    this.TrustMoneyForm.controls['SHORTNAME'].setValue('');
    this.TrustMoneyForm.controls['INVOICEDVALUEEXGST'].setValue('');
  }

  MainAmmountPress() {
    this.TrustMoneyForm.controls['Unallocated'].setValue(this.f.AMOUNT.value);
  }
  deleteMatterItem() {
    this.getDataForTable.splice(this.INDEX, 1);
  }
  SelectContact() {
    const dialogRef = this.dialog.open(ContactSelectDialogComponent, { width: '100%', disableClose: true, data: '' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.TrustMoneyForm.controls['PAYOR'].setValue(result.CONTACTNAME);
      }
    });
  }
  BankingDialogOpen(type: any,UseTrust) {
    const dialogRef = this._matDialog.open(BankingDialogComponent, {
      disableClose: true, width: '100%', data: { AccountType: type ,UseTrust: UseTrust}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // if (result.AccountType == "BANK ACCOUNT") {
        this.TrustMoneyForm.controls['BANKACCOUNTGUIDTEXT'].setValue(result.MainList.ACCOUNTCLASS + ' - ' + result.MainList.ACCOUNTNUMBER);
        this.TrustMoneyForm.controls['BANKACCOUNTGUID'].setValue(result.ACCOUNTGUID);
        // } else {
        //   this.generalReceiptForm.controls['INCOMEACCOUNTGUIDTEXT'].setValue(result.MainList.ACCOUNTCLASS + ' - ' + result.MainList.ACCOUNTNUMBER);
        //   this.generalReceiptForm.controls['INCOMEACCOUNTGUID'].setValue(result.ACCOUNTGUID);
        // }
      }
    });
  }

}
