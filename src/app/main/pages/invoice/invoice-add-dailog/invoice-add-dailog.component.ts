import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { MattersService, MatterInvoicesService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-invoice-add-dailog',
  templateUrl: './invoice-add-dailog.component.html',
  styleUrls: ['./invoice-add-dailog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InvoiceAddDailogComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  addInvoiceForm: FormGroup;
  isLoadingResults: boolean = false;
  isspiner: boolean = false;
  isFixPrice: any = true;
  isMin: any = true;
  isMax: any = true;
  ORIEXTOTAL: any;
  ORIGSTTOTAL: any;
  ORIINTOTAL: any;
  OVEEXTOTAL: any;
  OVEGSTTOTAL: any;
  OVEINTOTAL: any;
  WORKITEMS: any;
  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<InvoiceAddDailogComponent>,
    public datepipe: DatePipe,
    public MatDialog: MatDialog,
    private toastr: ToastrService,
    private _mattersService: MattersService, private _matterInvoicesService: MatterInvoicesService) { }

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
      INVOICECODE: [''],
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
      //discount
      APPLYTOFEES: [''],
      ORIEXTOTAL: [''],
      ORIGSTTOTAL: [''],
      ORIINTOTAL: [''],
      OVEEXTOTAL: [''],
      OVEGSTTOTAL: [''],
      OVEINTOTAL: [''],
      WIPEXTOTAL: [''],
      WIPINTOTAL: [''],
      ActivityEXTOTAL: [''],
      ActivityINTOTAL: [''],
      SundryEXTOTAL: [''],
      SundryINTOTAL: [''],
      Percentage: [''],
      amount: [''],
      Percentage_type: [''],
      GST_type: [''],
      Discount_type: [''],
    });
    this._mattersService.getMattersDetail({ MATTERGUID: matterDetail.MATTERGUID, GetAllFields: true }).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let matterDate = response.DATA.MATTERS[0];
        let inValEx = matterDate.SUMMARYTOTALS.INVOICEDVALUEEXGST;
        let inValIN = matterDate.SUMMARYTOTALS.INVOICEDVALUEINCGST;
        this.addInvoiceForm.controls['APPLYTOFEES'].setValue(true);
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
    let EXTOTAL: number = 0;
    let INTOTAL: number = 0;
    let TOTALGST: number = 0;
    let WIPEXTOTAL: number = 0;
    let WIPINTOTAL: number = 0;
    let ActivityEXTOTAL: number = 0;
    let ActivityINTOTAL: number = 0;
    let SundryEXTOTAL: number = 0;
    let SundryINTOTAL: number = 0;
    let WORKITEMSData = [];
    event.forEach(function (value) {
      WORKITEMSData.push(value.WORKITEMGUID);
      EXTOTAL += Number(value.PRICE);
      INTOTAL += Number(value.PRICEINCGST);
      TOTALGST += Number(value.GST);
      if (value.ITEMTYPEDESC == "WIP") {
        WIPEXTOTAL += Number(value.PRICE);
        WIPINTOTAL += Number(value.PRICEINCGST);
      } else if (value.ITEMTYPEDESC == "Activity") {
        ActivityEXTOTAL += Number(value.PRICE);
        ActivityINTOTAL += Number(value.PRICEINCGST);
      } else if (value.ITEMTYPEDESC == "Sundry") {
        SundryEXTOTAL += Number(value.PRICE);
        SundryINTOTAL += Number(value.PRICEINCGST);
      }
    });
    this.WORKITEMS = WORKITEMSData;
    this.ORIEXTOTAL = EXTOTAL.toFixed(2);
    this.ORIGSTTOTAL = TOTALGST.toFixed(2);
    this.ORIINTOTAL = INTOTAL.toFixed(2);
    this.OVEEXTOTAL = EXTOTAL.toFixed(2);
    this.OVEGSTTOTAL = TOTALGST.toFixed(2);
    this.OVEINTOTAL = INTOTAL.toFixed(2);
    this.addInvoiceForm.controls['WIPEXTOTAL'].setValue(WIPEXTOTAL.toFixed(2));
    this.addInvoiceForm.controls['WIPINTOTAL'].setValue(WIPINTOTAL.toFixed(2));
    this.addInvoiceForm.controls['ActivityEXTOTAL'].setValue(ActivityEXTOTAL.toFixed(2));
    this.addInvoiceForm.controls['ActivityINTOTAL'].setValue(ActivityINTOTAL.toFixed(2));
    this.addInvoiceForm.controls['SundryEXTOTAL'].setValue(SundryEXTOTAL.toFixed(2));
    this.addInvoiceForm.controls['SundryINTOTAL'].setValue(SundryINTOTAL.toFixed(2));
  }
  selectDueDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.addInvoiceForm.controls['DUEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  SelectInvoiceDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.addInvoiceForm.controls['INVOICEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  get f() {
    return this.addInvoiceForm.controls;
  }
  SaveInvoice() {
    alert('save');
    this.isspiner = true;
    let PostData: any = {
      // "INVOICEGUID": this.f.ADDITIONALTEXT.value,
      "INVOICECODE": this.f.INVOICECODE.value,
      "MATTERGUID": this.f.MATTERGUID.value,
      "INVOICEDATE": this.f.INVOICEDATE.value,
      "DUEDATE": this.f.DUEDATE.value,
      "PRINTEDDATE": "",
      "INVOICETOTAL": this.f.OVEINTOTAL.value,
      "GST": this.f.OVEGSTTOTAL.value,
      "FOREIGNCURRENCYID": "",
      "COMMENT": this.f.COMMENT.value,
      "WORKITEMS": this.WORKITEMS
    }
    let PostInvoiceEntryData: any = { FormAction: 'insert', VALIDATEONLY: true, Data: PostData };
    this._matterInvoicesService.SetInvoiceData(PostInvoiceEntryData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.checkValidation(res.DATA.VALIDATIONS, PostInvoiceEntryData);
      } else if (res.CODE == 451 && res.STATUS == "warning") {
        this.checkValidation(res.DATA.VALIDATIONS, PostInvoiceEntryData);
      } else {
        if (res.CODE == 402 && res.STATUS == "error" && res.MESSAGE == "Not logged in")
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

    if (Object.keys(errorData).length != 0)
      this.toastr.error(errorData);
    if (Object.keys(warningData).length != 0) {
      // this.toastr.warning(warningData);
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
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.saveInvoice(PostInvoiceEntryData);
    this.isspiner = false;
  }
  saveInvoice(PostInvoiceEntryData: any) {
    PostInvoiceEntryData.VALIDATEONLY = false;
    this._matterInvoicesService.SetInvoiceData(PostInvoiceEntryData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.toastr.success('Save Success');
        this.dialogRef.close(true);
      } else {
        if (res.CODE == 402 && res.STATUS == "error" && res.MESSAGE == "Not logged in")
          this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
}
