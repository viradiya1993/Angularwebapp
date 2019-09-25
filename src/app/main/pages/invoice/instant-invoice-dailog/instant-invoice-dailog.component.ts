import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { MainAPiServiceService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-instant-invoice-dailog',
  templateUrl: './instant-invoice-dailog.component.html',
  styleUrls: ['./instant-invoice-dailog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InstantInvoiceDailogComponent implements OnInit {
  addInvoiceForm: FormGroup;
  errorWarningData: any = {};
  isLoadingResults: boolean = false;
  isspiner: boolean = false;
  optionList: any = [
    { 'ACTIVITYID': 'X', 'DESCRIPTION': 'hh:mm' },
    { 'ACTIVITYID': 'H', 'DESCRIPTION': 'Hours' },
    { 'ACTIVITYID': 'M', 'DESCRIPTION': 'Minutes' },
    { 'ACTIVITYID': 'D', 'DESCRIPTION': 'Days' },
    { 'ACTIVITYID': 'U', 'DESCRIPTION': 'Units' },
    { 'ACTIVITYID': 'F', 'DESCRIPTION': 'Fixed' }
  ];
  LookupsList: any;
  TotalExGst: any;
  TotalIncGst: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  matterDetail = JSON.parse(localStorage.getItem('set_active_matters'));
  GstVal: any;
  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<InstantInvoiceDailogComponent>,
    public datepipe: DatePipe,
    public _matDialog: MatDialog,
    private toastr: ToastrService,
    private _mainAPiServiceService: MainAPiServiceService
  ) { }

  ngOnInit() {
    this.isLoadingResults = true;
    var dt = new Date();
    dt.setMonth(dt.getMonth() + 1);
    this.addInvoiceForm = this._formBuilder.group({
      INVOICEDATETEXT: [this.datepipe.transform(new Date(), 'dd/MM/yyyy')],
      INVOICEDATE: [new Date()],
      DUEDATETEXT: [this.datepipe.transform(dt, 'dd/MM/yyyy')],
      DUEDATE: [dt],
      MATTERGUID: [this.matterDetail.MATTERGUID],
      QUANTITYTYPE: [''],
      client: [this.matterDetail.CONTACTNAME],
      matter: [this.matterDetail.MATTER],
      Invoiceno: [''],
      QUANTITY: ['0'],
      Type: ['U'],
      Totalexgst: [''],
      Totalincgst: [''],
      GST: [''],
      INVOICECOMMENT: [''],
      ADDITIONALTEXT: [''],
    });
    let PostInvoiceEntryData: any = { FormAction: 'default', VALIDATEONLY: false, Data: {} };

    this._mainAPiServiceService.getSetData(PostInvoiceEntryData, 'SetInvoice').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.addInvoiceForm.controls['Invoiceno'].setValue(response.DATA.DEFAULTVALUES.INVOICECODE)
      }
    }, error => {
      this.toastr.error(error);
    });
    this._mainAPiServiceService.getSetData({ 'LookupType': 'time entry' }, 'GetLookups').subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.LookupsList = responses.DATA.LOOKUPS;
      }
    });
    this.isLoadingResults = false;
  }
  // selectDueDate(type: string, event: MatDatepickerInputEvent<Date>) {
  //   this.addInvoiceForm.controls['DUEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  // }
  // SelectInvoiceDate(type: string, event: MatDatepickerInputEvent<Date>) {
  //   this.addInvoiceForm.controls['INVOICEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  // }
  LookupsChange(value: any) {
    this.addInvoiceForm.controls['ADDITIONALTEXT'].setValue(value);
  }
  InvoiceStartDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.addInvoiceForm.controls['INVOICEDATETEXT'].setValue(begin);

  }
  InvoiceDueDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.addInvoiceForm.controls['DUEDATETEXT'].setValue(begin);
  }
  calcTotalEXGST() {
    this.GstVal = Number(this.TotalExGst) * 10 / 100;
    this.TotalIncGst = (Number(this.GstVal) + Number(this.TotalExGst)).toFixed(2);
  }
  get f() {
    return this.addInvoiceForm.controls;
  }
  calcTotalINGST() {
    let ExGSt = Number(this.TotalIncGst) / 1.1;
    this.TotalExGst = (ExGSt).toFixed(2);
    this.GstVal = (Number(this.TotalIncGst) - Number(ExGSt)).toFixed(2);

  }

  SaveInstaceInvoice() {
    let SendData = {
      INVOICEGUID: '',
      INVOICECODE: this.f.Invoiceno.value,
      MATTERGUID: this.matterDetail.MATTERGUID,
      INVOICEDATE: this.f.INVOICEDATETEXT.value,
      DUEDATE: this.f.DUEDATETEXT.value,
      INVOICETOTAL: this.TotalExGst,
      GST: this.GstVal,
      COMMENT: this.f.INVOICECOMMENT.value,
      PRINTEDDATE: '',
      FOREIGNCURRENCYID: '',
      WORKITEMS: {
        FEEEARNER: '',
        QUANTITY: this.f.QUANTITY.value,
        QUANTITYTYPE: this.f.QUANTITYTYPE.value,
        ADDITIONALTEXT: this.f.ADDITIONALTEXT.value,
      }




    }
    this.isspiner = true;
    let finalData = { DATA: SendData, FormAction: 'insert', VALIDATEONLY: true }
    this._mainAPiServiceService.getSetData(finalData, 'SetInvoice').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, finalData);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.checkValidation(response.DATA.VALIDATIONS, finalData);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.checkValidation(response.DATA.VALIDATIONS, finalData);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      } else {
        this.isspiner = false;
      }

    }, err => {
      this.toastr.error(err);
    });

  }
  checkValidation(bodyData: any, details: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'No') {
        errorData.push(value.ERRORDESCRIPTION);
        tempError[value.FIELDNAME] = value;
      }
      else if (value.VALUEVALID == 'Warning') {
        tempWarning[value.FIELDNAME] = value;
        warningData.push(value.ERRORDESCRIPTION);
      }
    });
    this.errorWarningData = { "Error": tempError, 'warning': tempWarning };
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
          this.InstantInvoiceData(details);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.InstantInvoiceData(details);
    this.isspiner = false;
  }
  InstantInvoiceData(data: any) {
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetInvoice').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.toastr.success(' save successfully');
        this.isspiner = false;
        this.dialogRef.close(true);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.toastr.warning(response.MESSAGE);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.toastr.error(response.MESSAGE);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, error => {
      this.toastr.error(error);
    });
  }

}
