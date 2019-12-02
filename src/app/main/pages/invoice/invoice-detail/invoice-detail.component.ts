import { Component, OnInit, ViewEncapsulation, Inject, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDatepickerInputEvent, MatPaginator, MatDialog, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import * as $ from 'jquery';
import { MatSort } from '@angular/material';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InvoiceDetailComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  invoiceDetailForm: FormGroup;
  invoiceDatasor: any;
  IntersetChatgesData: any;
  ReceiptsData: any;
  isspiner: boolean;
  isLoadingResults: boolean;
  displayedColumnsTime: string[] = ['ITEMDATE', 'FEEEARNER', 'ADDITIONALTEXT', 'PRICE', 'GST'];
  displayedColumnsRecipt: string[] = ['RECEIPTCODE', 'RECEIPTDATE', 'Type', 'AMOUNT'];
  displayedColumnsInterest: string[] = ['INVOICECODE', 'INVOICEDATE', 'INVOICETOTAL', 'AMOUNTOUTSTANDINGEXGST', 'COMMENT'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator1: MatPaginator;
  @ViewChild(MatPaginator) paginator2: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort) sort1: MatSort;
  @ViewChild(MatSort) sort2: MatSort;
  isView: any;
  tabingVal: string;
  displayedColumns: any;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
 
  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<InvoiceDetailComponent>,
    public datepipe: DatePipe,
    public MatDialog: MatDialog,
    public behaviorService: BehaviorService,
    private _mainAPiServiceService: MainAPiServiceService,
    @Inject(MAT_DIALOG_DATA) public _data: any,
  ) { 
    this.behaviorService.dialogClose$.subscribe(result => {
      if(result != null){
        if(result.MESSAGE == 'Not logged in'){
          this.dialogRef.close(false);
        }
      }
     });
  }

  ngOnInit() {
    this.isView = this._data.type;
    this.invoiceDetailForm = this._formBuilder.group({
      CLIENTNAME: [''],
      SHORTNAME: [''],
      MATTERGUID: [''],
      INVOICEGUID: [''],
      INVOICECODE: [''],
      INVOICEDATE: [''],
      INVOICEDATETEXT: [],
      DUEDATE: [''],
      DUEDATETEXT: [''],
      COMMENT: [''],
      GST: [''],
      INVOICETOTAL: [''],
      AMOUNTOUTSTANDINGINCGST: [''],
      AMOUNTTOTAL: [''],
    });
    this.TabingClick('Time Entries');
    if (this._data.type == 'edit' || this._data.type == 'view') {
      this.isLoadingResults = true;
      this._mainAPiServiceService.getSetData({ 'INVOICEGUID': this._data.INVOICEGUID }, 'GetInvoice').subscribe(response => {
        if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
          let invoiceData = response.DATA.INVOICES[0];
          this.invoiceDetailForm.controls['CLIENTNAME'].setValue(invoiceData.CLIENTNAME);
          this.invoiceDetailForm.controls['SHORTNAME'].setValue(invoiceData.SHORTNAME);
          this.invoiceDetailForm.controls['MATTERGUID'].setValue(invoiceData.MATTERGUID);
          this.invoiceDetailForm.controls['INVOICEGUID'].setValue(invoiceData.INVOICEGUID);
          let temInvoice = invoiceData.INVOICECODE;
          this.invoiceDetailForm.controls['INVOICECODE'].setValue(temInvoice.toString().padStart(8, "0"));
          if (invoiceData.INVOICEDATE) {
            this.invoiceDetailForm.controls['INVOICEDATE'].setValue(invoiceData.INVOICEDATE);
            let INVOICEDATET = invoiceData.INVOICEDATE.split("/");
            this.invoiceDetailForm.controls['INVOICEDATETEXT'].setValue(new Date(INVOICEDATET[1] + '/' + INVOICEDATET[0] + '/' + INVOICEDATET[2]));
          }
          if (invoiceData.DUEDATE) {
            this.invoiceDetailForm.controls['DUEDATE'].setValue(invoiceData.DUEDATE);
            let DUEDATE1 = invoiceData.DUEDATE.split("/");
            this.invoiceDetailForm.controls['DUEDATETEXT'].setValue(new Date(DUEDATE1[1] + '/' + DUEDATE1[0] + '/' + DUEDATE1[2]));
          }
          this.invoiceDetailForm.controls['COMMENT'].setValue(invoiceData.COMMENT);
          this.invoiceDetailForm.controls['GST'].setValue(invoiceData.GST);
          this.invoiceDetailForm.controls['INVOICETOTAL'].setValue(invoiceData.INVOICETOTAL);
          this.invoiceDetailForm.controls['AMOUNTOUTSTANDINGINCGST'].setValue(invoiceData.AMOUNTOUTSTANDINGINCGST);
          let FinalTotal = Number(invoiceData.INVOICETOTALINCGST);
          this.invoiceDetailForm.controls['AMOUNTTOTAL'].setValue(FinalTotal.toFixed(2));
          // get time entry data for specifc invoice 

          this._mainAPiServiceService.getSetData({ 'INVOICEGUID': this._data.INVOICEGUID }, 'GetWorkItems').subscribe(response => {
            if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
              this.invoiceDatasor = new MatTableDataSource(response.DATA.WORKITEMS);
              this.invoiceDatasor.paginator = this.paginator;
              this.invoiceDatasor.sort = this.sort;
            } else if (response.MESSAGE == 'Not logged in') {
              this.dialogRef.close(false);
            }
          }, error => {
            this.toastr.error(error);
          });
          // get Receipts data.
          this._mainAPiServiceService.getSetData({ 'INVOICEGUID': this._data.INVOICEGUID }, 'GetReceiptAllocation').subscribe(ReceiptAllocationData => {
            if (ReceiptAllocationData.CODE == 200 && ReceiptAllocationData.STATUS == "success") {
              this.ReceiptsData = new MatTableDataSource(ReceiptAllocationData.DATA.RECEIPTALLOCATIONS);
              this.ReceiptsData.paginator = this.paginator1;
              this.ReceiptsData.sort = this.sort1;
            } else if (response.MESSAGE == 'Not logged in') {
              this.dialogRef.close(false);
            }
          }, error => {
            this.toastr.error(error);
          });
          // get Interest Charges data.
          this._mainAPiServiceService.getSetData({ 'ParentInvoiceGuid': this._data.INVOICEGUID }, 'GetInvoice').subscribe(response => {
            if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
              this.IntersetChatgesData = new MatTableDataSource(response.DATA.INVOICES);
              this.IntersetChatgesData.paginator = this.paginator2;
              this.IntersetChatgesData.sort = this.sort2;
            } else if (response.MESSAGE == 'Not logged in') {
              this.dialogRef.close(false);
            }
          }, error => {
            this.toastr.error(error);
          });
          this.isLoadingResults = false;
        } else if (response.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
      }, error => {
        this.toastr.error(error);
      });
    }
  }
  choosedInvoiceDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.invoiceDetailForm.controls['INVOICEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  choosedDueDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.invoiceDetailForm.controls['DUEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  get f() {
    return this.invoiceDetailForm.controls;
  }
  updateInvoice() {
    this.isspiner = true;
    let PostData: any = {
      "INVOICEGUID": this.f.INVOICEGUID.value,
      "COMMENT": this.f.COMMENT.value,
      "DUEDATE": this.f.DUEDATE.value,
    }
    let PostInvoiceEntryData: any = { FormAction: 'update', VALIDATEONLY: true, Data: PostData };
    this._mainAPiServiceService.getSetData(PostInvoiceEntryData, 'SetInvoice').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.checkValidation(res.DATA.VALIDATIONS, PostInvoiceEntryData);
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.checkValidation(res.DATA.VALIDATIONS, PostInvoiceEntryData);
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.checkValidation(res.DATA.VALIDATIONS, PostInvoiceEntryData);
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
  checkValidation(bodyData: any, PostInvoiceEntryData: any) {
    let errorData: any = [];
    let warningData: any = [];
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'NO')
        errorData.push(value.ERRORDESCRIPTION);
      else if (value.VALUEVALID == 'WARNING')
        warningData.push(value.ERRORDESCRIPTION);
    });

    if (Object.keys(errorData).length != 0) {
        this.toastr.error(errorData);
        this.isspiner = false;
    } else if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef = this.MatDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.saveInvoice(PostInvoiceEntryData);
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.saveInvoice(PostInvoiceEntryData);
      this.isspiner = false;
    }
  }
  saveInvoice(PostInvoiceEntryData: any) {
    PostInvoiceEntryData.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(PostInvoiceEntryData, 'SetInvoice').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        $('#refreshInvoiceTab').click();
        $('#refreshWorkInprogress').click();
        this.toastr.success('Update Success');
        this.dialogRef.close(true);
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.toastr.warning(res.MESSAGE);
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.toastr.error(res.MESSAGE);
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
  TabingClick(val){
    //console.log(val);
    if(val =='Time Entries'){
      this.tabingVal='Time Entries';
    }else if(val == 'Receipts'){
      this.tabingVal='Receipts';
    }else{
      this.tabingVal='InterChange';
    }
  }
  RowClick(row){
   console.log(row);
  }
  totalchange() {
   let ExGst =Number(this.f.INVOICETOTAL.value)/1.1;
    let Gst = Number(this.f.INVOICETOTAL.value) - Number(ExGst);
    let InGst =  Number(this.f.INVOICETOTAL.value) - Number(Gst);
    this.invoiceDetailForm.controls['INVOICETOTAL'].setValue(InGst);
    
  }
}
