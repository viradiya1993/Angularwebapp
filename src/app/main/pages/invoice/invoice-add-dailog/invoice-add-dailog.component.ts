import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { MattersService } from 'app/_services';

@Component({
  selector: 'app-invoice-add-dailog',
  templateUrl: './invoice-add-dailog.component.html',
  styleUrls: ['./invoice-add-dailog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InvoiceAddDailogComponent implements OnInit {
  addInvoiceForm: FormGroup;
  isLoadingResults: boolean = false;
  LookupsList: any;
  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<InvoiceAddDailogComponent>,
    public datepipe: DatePipe,
    public MatDialog: MatDialog,
    private _mattersService: MattersService, ) { }

  ngOnInit() {
    this.isLoadingResults = true;
    let matterDetail = JSON.parse(localStorage.getItem('set_active_matters'));
    var dt = new Date();
    dt.setMonth(dt.getMonth() + 1);
    this.addInvoiceForm = this._formBuilder.group({
      INVOICEDATETEXT: [new Date()],
      INVOICEDATE: [new Date()],
      DUEDATETEXT: [dt],
      DUEDATE: [dt],
      MATTERGUID: [matterDetail.MATTERGUID],
      client: [matterDetail.CLIENT],
      matter: [matterDetail.MATTER],
      Invoiceno: [''],
      Duration: ['0'],
      Type: ['U'],
      Totalexgst: [''],
      Totalincgst: [''],
      GST: [''],
      INVOICECOMMENT: [''],
      ADDITIONALTEXT: [''],
    });
    this._mattersService.getMattersClasstype({ 'LookupType': 'time entry' }).subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.LookupsList = responses.DATA.LOOKUPS;
      }
    });
    this.isLoadingResults = false;
  }

}
