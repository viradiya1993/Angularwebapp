import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { MattersService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';

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
  isFixPrice: any = true;
  isMin: any = true;
  isMax: any = true;
  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<InvoiceAddDailogComponent>,
    public datepipe: DatePipe,
    public MatDialog: MatDialog,
    private toastr: ToastrService,
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
      MATTER: [matterDetail.MATTER],
      Invoiceno: [''],
      COMMENT: [''],
      INVOICEDVALUEEXGST: [''],
      INVOICEDVALUEINCGST: [''],
      FIXEDRATEEXGST: [''],
      FIXEDRATEINCGST: [''],
      FIXEDRATEEXGSTTOTAL: [''],
      FIXEDRATEINCGSTTOTAL: [''],
      ESTIMATETOTOTALEXGST: [''],
      ESTIMATETOTOTALINCGST: [''],
      ESTIMATEFROMTOTALEXGST: [''],
      ESTIMATEFROMTOTALINCGST: [''],
    });
    this._mattersService.getMattersDetail({ MATTERGUID: matterDetail.MATTERGUID, GetAllFields: true }).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let matterDate = response.DATA.MATTERS[0];
        let inValEx = matterDate.SUMMARYTOTALS.INVOICEDVALUEEXGST;
        let inValIN = matterDate.SUMMARYTOTALS.INVOICEDVALUEINCGST;
        // Total invoiced befor this invoice 
        this.addInvoiceForm.controls['INVOICEDVALUEEXGST'].setValue(inValEx);
        this.addInvoiceForm.controls['INVOICEDVALUEINCGST'].setValue(inValIN);
        // Total invoiced including this invoice ?
        this.addInvoiceForm.controls['FIXEDRATEEXGSTTOTAL'].setValue(matterDate.CONVEYANCINGGROUP.TOTALDUE + matterDate.SUMMARYTOTALS.INVOICEDVALUEEXGST);
        this.addInvoiceForm.controls['FIXEDRATEINCGSTTOTAL'].setValue(matterDate.CONVEYANCINGGROUP.TOTALDUE + matterDate.SUMMARYTOTALS.INVOICEDVALUEINCGST);
        //fix
        this.isFixPrice = ((inValEx > matterDate.BILLINGGROUP.FIXEDRATEEXGST || matterDate.BILLINGGROUP.FIXEDRATEEXGST <= 0) && (inValIN > matterDate.BILLINGGROUP.FIXEDRATEEXGST || matterDate.BILLINGGROUP.FIXEDRATEEXGST <= 0)) ? false : true;
        this.addInvoiceForm.controls['FIXEDRATEEXGST'].setValue(matterDate.BILLINGGROUP.FIXEDRATEEXGST);
        this.addInvoiceForm.controls['FIXEDRATEINCGST'].setValue(matterDate.BILLINGGROUP.FIXEDRATEINCGST);
        //Minimum
        this.isMin = ((inValEx > matterDate.SUMMARYTOTALS.ESTIMATETOTOTALEXGST || matterDate.SUMMARYTOTALS.ESTIMATETOTOTALEXGST <= 0) && (inValIN > matterDate.SUMMARYTOTALS.ESTIMATETOTOTALINCGST || matterDate.SUMMARYTOTALS.ESTIMATETOTOTALINCGST <= 0)) ? false : true;
        this.addInvoiceForm.controls['ESTIMATETOTOTALEXGST'].setValue(matterDate.SUMMARYTOTALS.ESTIMATETOTOTALEXGST);
        this.addInvoiceForm.controls['ESTIMATETOTOTALINCGST'].setValue(matterDate.SUMMARYTOTALS.ESTIMATETOTOTALINCGST);
        //Maximum
        this.isMax = ((inValEx > matterDate.SUMMARYTOTALS.ESTIMATEFROMTOTALEXGST || matterDate.SUMMARYTOTALS.ESTIMATEFROMTOTALEXGST <= 0) && (inValIN > matterDate.SUMMARYTOTALS.ESTIMATEFROMTOTALINCGST || matterDate.SUMMARYTOTALS.ESTIMATEFROMTOTALINCGST <= 0)) ? false : true;
        this.addInvoiceForm.controls['ESTIMATEFROMTOTALEXGST'].setValue(matterDate.SUMMARYTOTALS.ESTIMATEFROMTOTALEXGST);
        this.addInvoiceForm.controls['ESTIMATEFROMTOTALINCGST'].setValue(matterDate.SUMMARYTOTALS.ESTIMATEFROMTOTALINCGST);
      }
    }, error => {
      this.toastr.error(error);
    });
    this.isLoadingResults = false;
  }
  changeTotalDataOut(event) {
    console.log(event);
  }
  selectDueDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.addInvoiceForm.controls['DUEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  SelectInvoiceDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.addInvoiceForm.controls['INVOICEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }

}
