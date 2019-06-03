import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { MattersService } from 'app/_services';

@Component({
  selector: 'app-instant-invoice-dailog',
  templateUrl: './instant-invoice-dailog.component.html',
  styleUrls: ['./instant-invoice-dailog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InstantInvoiceDailogComponent implements OnInit {
  addInvoiceForm: FormGroup;
  isLoadingResults: boolean = false;
  optionList: any = [
    { 'ACTIVITYID': 'X', 'DESCRIPTION': 'hh:mm' },
    { 'ACTIVITYID': 'H', 'DESCRIPTION': 'Hours' },
    { 'ACTIVITYID': 'M', 'DESCRIPTION': 'Minutes' },
    { 'ACTIVITYID': 'D', 'DESCRIPTION': 'Days' },
    { 'ACTIVITYID': 'U', 'DESCRIPTION': 'Units' },
    { 'ACTIVITYID': 'F', 'DESCRIPTION': 'Fixed' }
  ];
  LookupsList: any;
  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<InstantInvoiceDailogComponent>,
    public datepipe: DatePipe,
    public MatDialog: MatDialog,
    private _mattersService: MattersService,
  ) { }

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
  selectDueDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.addInvoiceForm.controls['DUEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  LookupsChange(value: any) {
    this.addInvoiceForm.controls['ADDITIONALTEXT'].setValue(value);
  }

  SelectInvoiceDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.addInvoiceForm.controls['INVOICEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
}
