import { Component, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatPaginator, MatDialog, MatTableDataSource, MatDatepickerInputEvent, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { ContactSelectDialogComponent } from '../../contact/contact-select-dialog/contact-select-dialog.component';
import { MainAPiServiceService } from 'app/_services';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material';
import { $ } from 'protractor';
import { BankingDialogComponent } from '../../banking/banking-dialog.component';

@Component({
  selector: 'app-receipt-dilog',
  templateUrl: './receipt-dilog.component.html',
  styleUrls: ['./receipt-dilog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ReceiptDilogComponent implements OnInit {
  AllocationAmout: any = 0;
  AllocationData: any = [];
  errorWarningData: any = {};
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  isShowchecked: string;
  getPayourarray: any = [];
  data: { 'Outstanding': string; };
  incomeType: any;
  note: any;
  incometype: any;
  amountExGST: any;
  amountReceived: any;
  dateReceived: any;
  receiptCode: any;
  gst: any;
  receiptData: any;
  formaction: string;
  val: any;
  displayedColumns: string[] = ['INVOICEDATE', 'INVOICETOTAL', 'AMOUNTOUTSTANDINGINCGST', 'ALLOCATED', 'MATTERGUID'];
  PrepareReceiptForm: FormGroup;
  PrepareReceiptData: any;
  PrepareReceiptTemp: any;
  isspiner: boolean = false;
  isLoadingResults: boolean = false;
  highlightedRows: any;
  currentInvoiceData: any;
  lastFilter: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  ShowData: any = [];
  matterData: any;
  @ViewChild(MatSort) sort: MatSort;
  isEdit: boolean = false;
  AMOUNT: any = 0;
  AllocationBtn: string;
  TotalInvoice: any;
  storeDataarray: any;

  constructor(
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ReceiptDilogComponent>,
    public datepipe: DatePipe,
    public MatDialog: MatDialog,
    public _matDialog: MatDialog,
    public _mainAPiServiceService: MainAPiServiceService,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.matterData = this._data.matterData;
    this.isEdit = this._data.action == 'edit' || this._data.action == 'view' ? true : false;
  }


  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit() {
    this._mainAPiServiceService.getSetData({ AccountClass: 'BANK ACCOUNT' }, 'GetAccount').subscribe(response => {
      this.storeDataarray = response.DATA.ACCOUNTS;
      console.log(response)
      this.showData(this.storeDataarray);
    }, err => {
    });
    this.AllocationBtn = 'auto';
    this.PrepareReceiptForm = this._formBuilder.group({
      INCOMECODE: [''],
      INCOMECLASS: ['Receipt'],
      INCOMETYPE: ['Cash'],
      PAYEE: [''],
      INCOMEDATE: [''],
      INCOMEDATETEXT: [new Date()],
      AMOUNT: [''],
      GST: [''],
      BANKACCOUNTGUID: [''],
      BANKACCOUNTGUIDTEXT: [''],
      NOTE: [''],
      INCOMEACCOUNTGUID: ['', Validators.required],
      INCOMEACCOUNTGUIDTEXT: [''],
      FIRMGUID: [''],
      FIRMGUIDTEXT: [''],
      Amount: [''],

      RECEIPTAMOUNTEXGST: [''],
      SHOW: [''],
      Unallocated: [''],
      allocatedSelected: ['']
    });
    ;
    this.getPayor({});
    console.log(this._data);
    let INCOMEDATEVAL = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
    this.PrepareReceiptForm.controls['INCOMEDATE'].setValue(INCOMEDATEVAL);
    this.isShowchecked = "false";
    //for invoice
    if (this._data.action == 'editForTB' || this._data.action == 'edit' || this._data.action == 'view') {
      this.receiptData = JSON.parse(localStorage.getItem('receiptData'));
      let TBdata = JSON.parse(localStorage.getItem('TBreceiptData'));
      if (this._data.action == 'editForTB')
        this.setInvoiceForReceipt(TBdata.INCOMEGUID);
      else if (this._data.action == 'edit' || this._data.action == 'view')
        this.setInvoiceForReceipt(this.receiptData.INCOMEGUID);
    } else if (this._data.action == 'add') {
      this.PrepareReceiptForm.controls['FIRMGUID'].setValue(this.matterData.FIRMGUID);
      this.PrepareReceiptForm.controls['FIRMGUIDTEXT'].setValue(this.matterData.CONTACTNAME);
      this.PrepareReceiptForm.controls['SHOW'].setValue(1);
      this.ShowData.push({ id: 1, text: 'Show unpaid invoices for matter : ' + this.matterData.SHORTNAME });
      this.ShowData.push({ id: 2, text: 'Show unpaid invoices for client : ' + this.matterData.CONTACTNAME });
      this.ShowData.push({ id: 3, text: 'Show all unpaid invoices' });
      this.GetInvoiceForReceipt({ CONTACTGUID: this.matterData.CONTACTGUID });
    }
    this._mainAPiServiceService.getSetData({ FormAction: 'default', VALIDATEONLY: false, Data: {} }, 'SetIncome').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let temincome = response.DATA.DEFAULTVALUES.INCOMECODE;
        this.PrepareReceiptForm.controls['INCOMECODE'].setValue(temincome.toString().padStart(8, "0"));
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  showData(element) {
    element.forEach(x => {
      if (x.ACCOUNTTYPENAME == "Bank Account") {
        // this.spendmoneyForm.controls['Bankac'].setValue(result.MainList.ACCOUNTCLASS + ' - ' + result.MainList.ACCOUNTNUMBER + ' ' + result.MainList.ACCOUNTNAME);
        x.EXPORTINFO.MYOBEXPORTACCOUNT;
        this.PrepareReceiptForm.controls['BANKACCOUNTGUIDTEXT'].setValue(x.ACCOUNTCLASS + ' - ' + x.ACCOUNTNUMBER );
        this.PrepareReceiptForm.controls['BANKACCOUNTGUID'].setValue(x.ACCOUNTGUID);
      }
      if (x.SUBACCOUNTS) {
        this.showData(x.SUBACCOUNTS);
      }
    });
  }
  setInvoiceForReceipt(INCOMEGUID) {
    this.PrepareReceiptData = [];
    this.isLoadingResults = true;
    let incomeGuid = { INCOMEGUID: INCOMEGUID }
    this._mainAPiServiceService.getSetData(incomeGuid, 'GetIncome').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.INCOMEITEMS[0]) {
          localStorage.setItem('receiptData', JSON.stringify(response.DATA.INCOMEITEMS[0]));
          let data = response.DATA.INCOMEITEMS[0];
          this.PrepareReceiptForm.controls['INCOMECODE'].setValue(data.INCOMECODE.toString().padStart(8, "0"));
          let FeeAgreementDate1 = data.INCOMEDATE.split("/");
          this.PrepareReceiptForm.controls['INCOMEDATETEXT'].setValue(new Date(FeeAgreementDate1[1] + '/' + FeeAgreementDate1[0] + '/' + FeeAgreementDate1[2]));
          this.PrepareReceiptForm.controls['INCOMEDATE'].setValue(data.INCOMEDATE);
          this.PrepareReceiptForm.controls['AMOUNT'].setValue(data.AMOUNT);
          this.PrepareReceiptForm.controls['BANKACCOUNTGUID'].setValue(data.BANKACCOUNTGUID);
          this.PrepareReceiptForm.controls['FIRMGUID'].setValue(data.FIRMGUID);
          this.PrepareReceiptForm.controls['FIRMGUIDTEXT'].setValue(data.PAYEE);
          this.PrepareReceiptForm.controls['INCOMETYPE'].setValue(data.INCOMETYPE);
          this.PrepareReceiptForm.controls['NOTE'].setValue(data.NOTE);
          this.PrepareReceiptForm.controls['PAYEE'].setValue(data.PAYEE);

          this.ShowData.push({ id: 2, text: 'Show unpaid invoices for client : ' + data.PAYEE });
          this.ShowData.push({ id: 3, text: 'Show all unpaid invoices' });
        }
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isLoadingResults = false;
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
    this.isLoadingResults = true;

    this._mainAPiServiceService.getSetData({ "RECEIPTGUID": INCOMEGUID }, 'GetReceiptAllocation').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.RECEIPTALLOCATIONS[0]) {
          this.highlightedRows = response.DATA.RECEIPTALLOCATIONS[0].INVOICEGUID;
          this.currentInvoiceData = response.DATA.RECEIPTALLOCATIONS[0];
        }
        this.PrepareReceiptData = new MatTableDataSource(response.DATA.RECEIPTALLOCATIONS)
        this.PrepareReceiptData.paginator = this.paginator;
        this.PrepareReceiptData.sort = this.sort;
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isLoadingResults = false;
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });


  }
  BankingDialogOpen(type: any) {
    const dialogRef = this.MatDialog.open(BankingDialogComponent, {
      disableClose: true, width: '100%', data: { AccountType: type }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.PrepareReceiptForm.controls['BANKACCOUNTGUIDTEXT'].setValue(result.MainList.ACCOUNTCLASS + ' - ' + result.MainList.ACCOUNTNUMBER + ' ' + result.MainList.ACCOUNTNAME);
        this.PrepareReceiptForm.controls['BANKACCOUNTGUID'].setValue(result.ACCOUNTGUID);
      }
    });
  }
  GetInvoiceForReceipt(data) {
    this.PrepareReceiptData = [];
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(data, 'GetInvoice').subscribe(response => {
      if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
        this.TotalInvoice = response.DATA.TOTALINVOICES;
        if (response.DATA.INVOICES[0]) {
          this.highlightedRows = response.DATA.INVOICES[0].INVOICEGUID;
          this.currentInvoiceData = response.DATA.INVOICES[0];
        }
        this.PrepareReceiptData = new MatTableDataSource(response.DATA.INVOICES)
        this.PrepareReceiptData.paginator = this.paginator;
        this.PrepareReceiptData.sort = this.sort;
        this.isLoadingResults = false;
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
    }, error => {
      this.isLoadingResults = false;
      this.toastr.error(error);
    });
  }
  getPayor(postData) {
    this._mainAPiServiceService.getSetData(postData, 'GetContact').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        response.DATA.CONTACTS.forEach(element => {
          this.getPayourarray.push(element.CONTACTNAME);
        });
      }
    }, err => {
      this.toastr.error(err);
    });
  }
  get f() {
    return this.PrepareReceiptForm.controls;
  }
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.PrepareReceiptForm.controls['INCOMEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  editContact(row: any) {
    this.currentInvoiceData = row;
    this.PrepareReceiptForm.controls['allocatedSelected'].setValue(row.AMOUNTOUTSTANDINGINCGST);
  }
  onChangeShow(val) {
    let data = {};
    if (val == 3) {
      this.AllocationBtn = "clear"
      data = { 'Outstanding': 'Yes' };
    } else if (val == 1) {
      data = { MATTERGUID: this.matterData.MATTERGUID };
    } else if (val == 2) {
      data = { CONTACTGUID: this.matterData.CONTACTGUID };
    }
    this.GetInvoiceForReceipt(data);
  }
  revivedAmount() {
    if (this.f.AMOUNT.value > this.TotalInvoice) {
      let val = this.f.AMOUNT.value - this.TotalInvoice;
      this.PrepareReceiptForm.controls['Unallocated'].setValue(val.toFixed(2));
    } else {
      if (this.AllocationBtn == 'clear') {
        this.PrepareReceiptForm.controls['Unallocated'].setValue(this.f.AMOUNT.value);
      } else {
        this.PrepareReceiptForm.controls['Unallocated'].setValue(0);
      }

    }
    this.AMOUNT = parseFloat(this.f.AMOUNT.value).toFixed(2);
    this.AllocationData = [];
    
    this.PrepareReceiptTemp = this.PrepareReceiptData.data;
    this.AllocationAmout = Number(this.f.AMOUNT.value);
    this.getClosetInvoiceForAllocation();
    console.log(this.AllocationData);
    // this.PrepareReceiptData=[];
    // this.PrepareReceiptData.data.push(this.AllocationData);
  }
  getClosetInvoiceForAllocation() {
    var closest = 0;
    let currentInvoiceId: any = "";
    let lastindex = null;
    if (Object.keys(this.PrepareReceiptTemp).length == 0) {
      if (this.AllocationAmout != 0)
        this.AllocationData.push({ INVOICEGUID: "", AMOUNTAPPLIED: this.AllocationAmout });
      this.AllocationAmout = 0;
    } else {
      this.PrepareReceiptTemp.forEach((element, index) => {
        if (closest == 0 || Math.abs(element.AMOUNTOUTSTANDINGINCGST - this.AllocationAmout) < Math.abs(closest - this.AllocationAmout)) {
          if (this.AllocationAmout != 0 && this.AllocationAmout > 0) {
            closest = Number(element.AMOUNTOUTSTANDINGINCGST);
            currentInvoiceId = element.INVOICEGUID;
            lastindex = index;
          }
        }
      });
      if (lastindex != null)
        this.PrepareReceiptTemp.splice(lastindex, 1);
      if (this.AllocationAmout != 0 && this.AllocationAmout > 0) {
        closest = Number(this.AllocationAmout) > Number(closest) ? Number(closest) : Number(this.AllocationAmout);
        this.AllocationAmout = this.AllocationAmout - closest;
        this.AllocationData.push({ INVOICEGUID: currentInvoiceId, AMOUNTAPPLIED: closest });
        this.getClosetInvoiceForAllocation();
      }
    }
  }
  clickAutoAllocation() {
    this.AllocationBtn = 'auto';
    if (this.f.AMOUNT.value > this.TotalInvoice) {
      let val = this.f.AMOUNT.value - this.TotalInvoice;
      this.PrepareReceiptForm.controls['Unallocated'].setValue(val.toFixed(2));
    } else {
      this.PrepareReceiptForm.controls['Unallocated'].setValue(0.00);
    }

  }
  clickClearAllocation() {
    this.AllocationBtn = 'clear';
    this.PrepareReceiptForm.controls['Unallocated'].setValue(this.f.AMOUNT.value);
  }
  SaveReceipt() {
    console.log(this.PrepareReceiptData);
    this.isspiner = true;
    this.AllocationData = [];
    this.PrepareReceiptTemp = this.PrepareReceiptData.data;
    this.AllocationAmout = Number(this.f.AMOUNT.value);

    this.getClosetInvoiceForAllocation();
    console.log(this.PrepareReceiptData);
    let AllocationDataInsert = {
      INCOMECODE: this.f.INCOMECODE.value,
      INCOMECLASS: this.f.INCOMECLASS.value,
      INCOMETYPE: this.f.INCOMETYPE.value,
      FIRMGUID: this.f.FIRMGUID.value,
      INCOMEDATE: this.f.INCOMEDATE.value,
      PAYEE: this.f.PAYEE.value,
      AMOUNT: this.f.AMOUNT.value,
      GST: this.f.GST.value,
      BANKACCOUNTGUID: this.f.BANKACCOUNTGUID.value,
      INCOMEACCOUNTGUID: "ACCAAAAAAAAAAAA9",
      NOTE: this.f.NOTE.value,
      MATTERGUID: this.matterData.MATTERGUID,
      // CLERKFEE: "",
      ALLOCATIONS: this.AllocationData
    }
    let setReceiptPostData: any = { FormAction: 'insert', VALIDATEONLY: true, DATA: AllocationDataInsert };
    this._mainAPiServiceService.getSetData(setReceiptPostData, 'SetIncome').subscribe(response => {
      if (response.DATA.INCOMECODE && response.DATA.INCOMECODE != '') {
        this.PrepareReceiptForm.controls['INCOMECODE'].setValue(response.DATA.INCOMECODE.toString().padStart(8, "0"));
        AllocationDataInsert.INCOMECODE = response.DATA.INCOMECODE;
      } else {
        AllocationDataInsert.INCOMECODE = this.f.INCOMECODE.value;
      }
      setReceiptPostData = { FormAction: 'insert', VALIDATEONLY: true, DATA: AllocationDataInsert };
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, setReceiptPostData);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.checkValidation(response.DATA.VALIDATIONS, setReceiptPostData);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.checkValidation(response.DATA.VALIDATIONS, setReceiptPostData);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
    }, error => {
      this.isspiner = false;
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
      } else if (value.VALUEVALID == 'Warning') {
        if (value.FIELDNAME != "INCOMECODE") {
          warningData.push(value.ERRORDESCRIPTION);
        }
        tempWarning[value.FIELDNAME] = value;
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
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.SaveReceiptAfterVAlidation(details);
      this.isspiner = false;
    }
  }
  SaveReceiptAfterVAlidation(data: any) {
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetIncome').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        // $('#refreshReceiceMoany').click();
        this.toastr.success('Receipt save successfully');
        this.isspiner = false;

        this.dialogRef.close(true);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      } else {
        this.isspiner = false;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  selectClient() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, { width: '100%', disableClose: true, data: { type: '' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.PrepareReceiptForm.controls['FIRMGUIDTEXT'].setValue(result.CONTACTNAME);
        this.PrepareReceiptForm.controls['FIRMGUID'].setValue(result.CONTACTGUID);
      }
    });
  }

}
