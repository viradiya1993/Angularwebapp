import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { MatterInvoicesService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InvoiceDetailComponent implements OnInit {
  invoiceDetailForm: FormGroup;
  invoiceData: any;
  IntersetChatgesData: any;
  ReceiptsData: any;
  paginator: any;
  isspiner: boolean;
  isLoadingResults: boolean;
  displayedColumnsTime: string[] = ['Date', 'FE', 'Text', 'Charge', 'GST'];
  displayedColumnsRecipt: string[] = ['Receipt', 'Received', 'Type', 'Amount'];
  displayedColumnsInterest: string[] = ['Invoice', 'Date', 'Total', 'Outstanding', 'Comment'];
  constructor(
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public _data: any,
    private matterInvoicesService: MatterInvoicesService,
    private toastr: ToastrService,
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
      AGENCYTOTAL: [''],
    });
    if (this._data.type == 'edit') {
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
          this.invoiceDetailForm.controls['AGENCYTOTAL'].setValue(invoiceData.AGENCYTOTAL);
        }
        this.isLoadingResults = false;
      }, error => {
        this.toastr.error(error);
      });
    }
    this.invoiceData = new MatTableDataSource([]);
    this.invoiceData.paginator = this.paginator;
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
