import { Component, OnInit, ViewChild, ViewEncapsulation, Inject, ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatPaginator, MatDialog, MatTableDataSource, MatDatepickerInputEvent, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { ContactSelectDialogComponent } from '../../contact/contact-select-dialog/contact-select-dialog.component';
import { Pipe } from '@angular/compiler/src/core';
import { MatterInvoicesService, GetReceptData, ContactService } from 'app/_services';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
//import { TableColumnsService,MattersService, TimersService, GetReceptData } from '../../../_services';

@Component({
  selector: 'app-receipt-dilog',
  templateUrl: './receipt-dilog.component.html',
  styleUrls: ['./receipt-dilog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ReceiptDilogComponent implements OnInit {
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

  constructor(
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ReceiptDilogComponent>,
    public datepipe: DatePipe,
    public MatDialog: MatDialog,
    private _MatterInvoicesService: MatterInvoicesService,
    private GetReceptData: GetReceptData,
    public _getContact: ContactService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) { 
    // console.log(this._data);
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
//console.log(JSON.parse(localStorage.getItem('receiptData')).RECEIPTGUID);
    //Call get invoice api 
   

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
    
        //  console.log(receiptData1.RECEIPTCODE);
        this.isShowchecked = "false";
        //for invoice
        if(this._data.action=='editForTB'){
          
           this.receiptData=JSON.parse(localStorage.getItem('TBreceiptData'));
           console.log(this.receiptData);
           this.GetInvoiceForReceipt({ 'Outstanding': 'Yes'});
          //  this.setInvoiceForReceipt(this.receiptData.RECEIPTGUID);
        }else if(this._data.action=='addForTB'){
          this.GetInvoiceForReceipt({ 'Outstanding': 'Yes'});
        }
        else if(this._data.action=='edit'){
          this.receiptData=JSON.parse(localStorage.getItem('receiptData'));
          this.setInvoiceForReceipt({"RECEIPTGUID":this.receiptData.INCOMEGUID});
        }else if(this._data.action=='add'){
          this.GetInvoiceForReceipt({ 'Outstanding': 'Yes'});
        }
        this.getPayor({});
    this.PrepareReceiptData = new MatTableDataSource([]);
    this.PrepareReceiptData.paginator = this.paginator;

    // }
   
   }
  // setOtherReceiptData(){

  // }
  setInvoiceForReceipt(reciptGuid){
 
    this.isLoadingResults = true;
    this.GetReceptData.getRecept(reciptGuid).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.RECEIPTALLOCATIONS[0]) {
          console.log(response.DATA.RECEIPTALLOCATIONS);
          localStorage.setItem('receiptData',JSON.stringify(response.DATA.RECEIPTALLOCATIONS[0]));
          this.highlightedRows = response.DATA.RECEIPTALLOCATIONS[0].INVOICEGUID;
           this.currentInvoiceData = response.DATA.RECEIPTALLOCATIONS[0];

           this.forViewRecepit(response.DATA.RECEIPTALLOCATIONS[0]);
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

  forViewRecepit(data){
    console.log(data);
    this.PrepareReceiptForm.controls['ReceiptCode'].setValue(data.RECEIPTCODE);
    let FeeAgreementDate1 = data.RECEIPTDATE.split("/");
    this.PrepareReceiptForm.controls['DateReceived'].setValue(new Date(FeeAgreementDate1[1] + '/' + FeeAgreementDate1[0] + '/' + FeeAgreementDate1[2]));
    this.PrepareReceiptForm.controls['AmountReceived'].setValue(data.AMOUNT);
    this.PrepareReceiptForm.controls['AmountExGST'].setValue(data.RECEIPTAMOUNTEXGST);
    this.PrepareReceiptForm.controls['GST'].setValue(data.RECEIPTGST);
    this.incomeType=this.incometype;
     this.PrepareReceiptForm.controls['IncomeType'].setValue(data.INCOMETYPE);
    this.PrepareReceiptForm.controls['Note'].setValue(data.NOTE);
    this.val=data.PAYEE
    this.PrepareReceiptForm.controls['Payor'].setValue(data.PAYEE);
    // this.PrepareReceiptForm.controls['Unallocated'].setValue(receiptData.RECEIPTCODE);
    

  }
  GetInvoiceForReceipt(data) {  
    this._MatterInvoicesService.MatterInvoicesData(data).subscribe(response => {
      if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
        if (response.DATA.INVOICES[0]) {
          // localStorage.setItem('edit_invoice_id', response.DATA.INVOICES[0].INVOICEGUID);
          this.highlightedRows = response.DATA.INVOICES[0].INVOICEGUID;
          this.currentInvoiceData = response.DATA.INVOICES[0];
        }
        this.PrepareReceiptData = new MatTableDataSource(response.DATA.INVOICES)
        this.PrepareReceiptData.paginator = this.paginator;
        this.PrepareReceiptData=response.DATA.INVOICES;
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
    if(this._data.action =='add' || this._data.action == "addForTB"){
    this.formaction='insert';
    }else{
      this.formaction='update';
    }
    this.receiptData=JSON.parse(localStorage.getItem('receiptData'));
    // RECEIPTGUID
    let data = {
  
           AMOUNT:this.f.Amount.value,
           BANKACCOUNTGUID: this.receiptData.BANKACCOUNTGUID,
           FIRMGUID: this.receiptData.FIRMGUID,
          //  FOREIGNCURRENCYAMOUNT: this.receiptData.FOREIGNCURRENCYAMOUNT,
          //  FOREIGNCURRENCYGST: this.receiptData.FOREIGNCURRENCYGST,
          //  FOREIGNCURRENCYID: this.receiptData.FOREIGNCURRENCYID,
          //  FOREIGNCURRENCYRATE: this.receiptData.FOREIGNCURRENCYRATE,
           GST: this.f.GST.value,
           INCOMEACCOUNTGUID: this.receiptData.INCOMEACCOUNTGUID,
          //  INCOMEACCOUNTGUID_COPY: this.receiptData.INCOMEACCOUNTGUID_COPY,
           INCOMECLASS: this.receiptData.INCOMECLASS,
           INCOMECODE: this.f.ReceiptCode.value,
           INCOMEDATE: localStorage.getItem('preparReceiptDate'),
           INCOMEGUID: this.receiptData.INCOMEGUID,
          //  INCOMEREVERSALGUID: this.receiptData.INCOMEREVERSALGUID,
           INCOMETYPE: this.f.IncomeType.value,
           NOTE: this.f.Note.value,
           PAYEE: this.f.Payor.value,
           ALLOCATIONS:'',
      
    }
    let matterPostData: any = { FormAction: 'insert', VALIDATEONLY: true, Data: data };
    this.GetReceptData.setReceipt(matterPostData).subscribe(response => {
      console.log(response);
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, data);
      } else if (response.CODE == 451 && response.STATUS == "warning") {
        this.checkValidation(response.DATA.VALIDATIONS, data);
      } else {
        if (response.CODE == 402 && response.STATUS == "error" && response.MESSAGE == "Not logged in")
          this.dialogRef.close(false);
        this.isspiner = false;
      }
    }, error => {
      this.toastr.error(error);
    });
    localStorage.removeItem('preparReceiptDate');
  }
  editContact(row: any) {
    this.currentInvoiceData = row;
  }
  onChangeShow(val) {

    if(this._data.action =='add' || this._data.action == "addForTB"){

      // this.isShowchecked = "true";
      if (val == 3) {
        this.GetInvoiceForReceipt({ 'Outstanding': 'Yes'});
      } else if(val == 1) {
        this.GetInvoiceForReceipt({MATTERGUID: this._data.matterGuid });
      } else if(val == 2){
        this.GetInvoiceForReceipt({MATTERGUID: this._data.clientName });
      }
    }
  }
  checkValidation(bodyData: any, details: any) {
    let errorData: any = [];
    let warningData: any = [];
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'NO')
        errorData.push(value.ERRORDESCRIPTION);
      else if (value.VALUEVALID == 'WARNING')
        warningData.push(value.ERRORDESCRIPTION);
    });
    if (Object.keys(errorData).length != 0)
      this.toastr.error(errorData);
    if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          // this.saveContectData(details);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.SaveReceiptAfterVAlidation(details);
    this.isspiner = false;
  }
  SaveReceiptAfterVAlidation(data: any){
   
      data.VALIDATEONLY = false;
      this.GetReceptData.getRecept(data).subscribe(response => {
        if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
          if (this._data.action !== 'edit') {
            this.toastr.success('Contact save successfully');
          } else {
            this.toastr.success('Contact update successfully');
          }
          this.isspiner = false;
          this.dialogRef.close(true);
        } 
        else if (response.MESSAGE == "Not logged in") {
          this.dialogRef.close(false);
        }
        else {
          this.isspiner = false;
        }
      }, error => {
        this.toastr.error(error);
      });

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
