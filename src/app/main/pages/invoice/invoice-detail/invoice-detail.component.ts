import { Component, OnInit, ViewEncapsulation, Inject, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDatepickerInputEvent, MatPaginator, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { MatterInvoicesService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import {MatSort} from '@angular/material';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InvoiceDetailComponent implements OnInit {
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
  constructor(
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public _data: any,
    private matterInvoicesService: MatterInvoicesService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<InvoiceDetailComponent>,
    public datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.invoiceDetailForm = this._formBuilder.group({
      CLIENTNAME: [''],
      SHORTNAME: [''],
      MATTERGUID: [''],
      INVOICEGUID: [''],
      INVOICECODE: [''],
      INVOICEDATE: [''],
      INVOICEDATETEXT: [''],
      DUEDATE: [''],
      DUEDATETEXT: [''],
      COMMENT: [''],
      GST: [''],
      INVOICETOTAL: [''],
      AMOUNTOUTSTANDINGINCGST: [''],
      AGENCYTOTAL: [''],
    });
    if (this._data.type == 'edit') {
      this.isLoadingResults = true;
      this.matterInvoicesService.MatterInvoicesData({ 'INVOICEGUID': this._data.INVOICEGUID }).subscribe(response => {
        if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
          let invoiceData = response.DATA.INVOICES[0];
          this.invoiceDetailForm.controls['CLIENTNAME'].setValue(invoiceData.CLIENTNAME);
          this.invoiceDetailForm.controls['SHORTNAME'].setValue(invoiceData.SHORTNAME);
          this.invoiceDetailForm.controls['MATTERGUID'].setValue(invoiceData.MATTERGUID);
          this.invoiceDetailForm.controls['INVOICEGUID'].setValue(invoiceData.INVOICEGUID);
          this.invoiceDetailForm.controls['INVOICECODE'].setValue(invoiceData.INVOICECODE);
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
          this.invoiceDetailForm.controls['AGENCYTOTAL'].setValue(invoiceData.AGENCYTOTAL);

          // get time entry data for specifc invoice 
          this.matterInvoicesService.GetWorkItemsData({ 'INVOICEGUID': this._data.INVOICEGUID }).subscribe(response => {
            if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
              this.invoiceDatasor = new MatTableDataSource(response.DATA.WORKITEMS);
              this.invoiceDatasor.paginator = this.paginator;
              this.invoiceDatasor.sort = this.sort;
            }
          }, error => {
            this.toastr.error(error);
          });
          // get Receipts data.
          this.matterInvoicesService.GetReceiptAllocationData({ 'INVOICEGUID': this._data.INVOICEGUID }).subscribe(ReceiptAllocationData => {
            if (ReceiptAllocationData.CODE == 200 && ReceiptAllocationData.STATUS == "success") {
              this.ReceiptsData = new MatTableDataSource(ReceiptAllocationData.DATA.RECEIPTALLOCATIONS);
              this.ReceiptsData.paginator = this.paginator1;
              this.ReceiptsData.sort = this.sort1;
            }
          }, error => {
            this.toastr.error(error);
          });
          // get Interest Charges data.
          this.matterInvoicesService.MatterInvoicesData({ 'ParentInvoiceGuid': this._data.INVOICEGUID }).subscribe(response => {
            if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
              this.IntersetChatgesData = new MatTableDataSource(response.DATA.INVOICES);
              this.IntersetChatgesData.paginator = this.paginator2;
              this.IntersetChatgesData.sort = this.sort2;
            }
          }, error => {
            this.toastr.error(error);
          });
          this.isLoadingResults = false;
        } else if (response.MESSAGE == "Not logged in") {
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
  SaveReceipt() {

  }

}
