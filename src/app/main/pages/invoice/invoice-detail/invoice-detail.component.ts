import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

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
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.invoiceData = new MatTableDataSource([]);
    this.invoiceData.paginator = this.paginator;

    this.invoiceDetailForm = this._formBuilder.group({
      client: [''],
      Matter: [''],
      InvoiceNo: [''],
      InvoiceDate: [''],
      DueDate: [''],
    });
  }
  SaveReceipt() {

  }

}
