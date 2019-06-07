import { Component, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatPaginator, MatDialog, MatTableDataSource, MatDatepickerInputEvent, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { ContactSelectDialogComponent } from '../../contact/contact-select-dialog/contact-select-dialog.component';
import { Pipe } from '@angular/compiler/src/core';
import { MatterInvoicesService, GetReceptData, ContactService } from 'app/_services';
//import { TableColumnsService,MattersService, TimersService, GetReceptData } from '../../../_services';

@Component({
  selector: 'app-receipt-dilog',
  templateUrl: './receipt-dilog.component.html',
  styleUrls: ['./receipt-dilog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ReceiptDilogComponent implements OnInit {
  isShowchecked: string;
  getPayourarray: any = [];
  data: { 'Outstanding': string; };

  constructor(
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ReceiptDilogComponent>,
    public datepipe: DatePipe,
    public MatDialog: MatDialog,
    private _MatterInvoicesService: MatterInvoicesService,
    private GetReceptData: GetReceptData,
    public _getContact: ContactService,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) { 
    console.log(_data);
  }
  displayedColumns: string[] = ['INVOICEDATE', 'INVOICETOTAL', 'AMOUNTOUTSTANDINGEXGST', 'MATTERGUID'];
  PrepareReceiptForm: FormGroup;
  PrepareReceiptData: any;
  isspiner: boolean;
  isLoadingResults: boolean;
  highlightedRows: any;
  currentInvoiceData: any;
  lastFilter: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit() {
    this.isShowchecked = "false";
    //for invoice
    if(this._data.action=="edit"){
      console.log("edit");
      let reciptGuid={RECEIPTGUID:localStorage.getItem('receiptGuid')}
      this.setInvoiceForReceipt(reciptGuid);
    }else{
      console.log("add");
      this.GetInvoiceForReceipt({});
    } 
   
    //for payor
    this.getPayor({});
    // this.pageSize = localStorage.getItem('lastPageSize');
    //Call get invoice api 
    this.PrepareReceiptData = new MatTableDataSource([]);
    this.PrepareReceiptData.paginator = this.paginator;

    this.PrepareReceiptForm = this._formBuilder.group({
      client: ['', Validators.required],
      ReceiptCode: [''],
      DateReceived: [new Date()],
      AmountReceived: [''],
      AmountExGST: [''],
      GST: [''],
      IncomeType: [''],
      Payor: [''],
      BankAccount: [''],
      Note: [''],
      Show: [''],
      Unallocated: [''],
      Amount: [''],
    });
  }
  receiptGuid
  setInvoiceForReceipt(reciptGuid){
    this.isLoadingResults = true;
    this.GetReceptData.getRecept(reciptGuid).subscribe(response => {
    console.log(localStorage.getItem('receiptGuid'));
    console.log(response);
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.RECEIPTALLOCATIONS[0]) {
          this.highlightedRows = response.DATA.RECEIPTALLOCATIONS[0].INVOICEGUID;
          this.currentInvoiceData = response.DATA.RECEIPTALLOCATIONS[0];
        }
        this.PrepareReceiptData = new MatTableDataSource(response.DATA.RECEIPTALLOCATIONS)
        this.PrepareReceiptData.paginator = this.paginator;
      }
      this.isLoadingResults = false;
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
  }
  GetInvoiceForReceipt(data) {
    if (this.isShowchecked != 'true') {
      this.data = {
        'Outstanding': 'Yes'
      }
    } else {

      this.data = data
    }

    this._MatterInvoicesService.MatterInvoicesData(this.data).subscribe(response => {
      console.log(response);
      if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
        if (response.DATA.INVOICES[0]) {
          // localStorage.setItem('edit_invoice_id', response.DATA.INVOICES[0].INVOICEGUID);
          this.highlightedRows = response.DATA.INVOICES[0].INVOICEGUID;
          this.currentInvoiceData = response.DATA.INVOICES[0];
        }
        this.PrepareReceiptData = new MatTableDataSource(response.DATA.INVOICES)
        this.PrepareReceiptData.paginator = this.paginator;
      }
      // this.isLoadingResults = false;
    }, error => {
      this.toastr.error(error);
    });
  }
  getPayor(postData) {
    this._getContact.ContactData(postData).subscribe(response => {
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
    //console.log(this.contactForm);
    return this.PrepareReceiptForm.controls;
  }
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    localStorage.setItem('preparReceiptDate', begin);
  }
  SaveReceipt() {
    let data = {
      RECEIPTGUID: localStorage.getItem('receiptGuid'),
      client: this.f.client.value,
      ReceiptCode: this.f.ReceiptCode.value,
      DateReceived: localStorage.getItem('preparReceiptDate'),
      AmountReceived: this.f.AmountReceived.value,
      AmountExGST: this.f.AmountExGST.value,
      GST: this.f.GST.value,
      IncomeType: this.f.IncomeType.value,
      Payor: this.f.Payor.value,
      BankAccount: this.f.BankAccount.value,
      Note: this.f.Note.value,
      Show: this.f.Show.value,
      Unallocated: this.f.Unallocated.value,
      Amount: this.f.Amount.value,
      Outstanding: 'Yes'
    }

    //another api call 
    this.GetReceptData.getRecept(data).subscribe(response => {

      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.RECEIPTALLOCATIONS[0]) {

        }

      }

    }, err => {
      this.toastr.error(err);
    });
    localStorage.removeItem('preparReceiptDate');
  }
  editContact(row: any) {
    this.currentInvoiceData = row;
  }
  onChangeShow(val) {
    if(this._data.action!='edit'){
      this.isShowchecked = "true";
      if (val == 3) {
        this.GetInvoiceForReceipt({ 'Outstanding': 'Yes' });
      } else {
        this.GetInvoiceForReceipt({MATTERGUID: this._data.MATTERGUID });
      }
    }
  }
  selectClient() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, { width: '100%', disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.PrepareReceiptForm.controls['client'].setValue(result.CONTACTNAME);
      }
    });
  }

}
