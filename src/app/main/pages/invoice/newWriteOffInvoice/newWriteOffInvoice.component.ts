import { Component, OnInit, Input, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-newWriteOffInvoice',
  templateUrl: './newWriteOffInvoice.component.html',
  styleUrls: ['./newWriteOffInvoice.component.scss'],
  animations: fuseAnimations
})
export class WriteOffInvoiceComponent implements OnInit {
  isLoadingResults: boolean = false;
  addData: any = [];
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  errorWarningData: any = { "Error": [], 'Warning': [] };
  isspiner: boolean = false;
  WriteOffInvoice: any = {}
  constructor(private _mainAPiServiceService: MainAPiServiceService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<WriteOffInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any, public _matDialog: MatDialog, ) { }

  ngOnInit() {
    this.WriteOffInvoice = {
      matter: '', client: '', INVOICECODE: '', INVOICEDATE: '', DUEDATE: '', TOTALINVOICES: '', TOTALRECEIVED: '', TOTALOUSTANDING: '', WriteOffDate: '', AMOUNT: ''
    }
    this.EditPopUpOPen();
  }
  EditPopUpOPen() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({ 'INVOICEGUID': this._data.INVOICEGUID }, 'GetInvoice').subscribe(res => {
      if ((res.CODE == 200 || res.CODE == '200') && res.STATUS == "success") {
        let invoiceData = res.DATA.INVOICES[0];
        this.WriteOffInvoice.matter = invoiceData.SHORTNAME;
        this.WriteOffInvoice.client = invoiceData.CLIENTNAME;
        let temInvoice = invoiceData.INVOICECODE;
        this.WriteOffInvoice.INVOICECODE = temInvoice.toString().padStart(8, "0");
        let InvoiceDate = invoiceData.INVOICEDATE.split("/");
        let date = new Date(InvoiceDate[1] + '/' + InvoiceDate[0] + '/' + InvoiceDate[2]);
        this.WriteOffInvoice.INVOICEDATE = date;
        let DueDate = invoiceData.DUEDATE.split("/");
        let DUE = new Date(DueDate[1] + '/' + DueDate[0] + '/' + DueDate[2]);
        this.WriteOffInvoice.DUEDATE = DUE;
        this.WriteOffInvoice.TOTALINVOICES = res.DATA.TOTALINVOICES;
        this.WriteOffInvoice.TOTALRECEIVED = res.DATA.TOTALRECEIVED;
        this.WriteOffInvoice.TOTALOUSTANDING = res.DATA.TOTALOUSTANDING;
        this.WriteOffInvoice.WriteOffDate = new Date();
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
      this.isLoadingResults = false;
    });
  }

  saveWriteOff() {
    let matterdata = JSON.parse(localStorage.getItem('set_active_matters'));
    let data = {
      INVOICEGUID: this._data.INVOICEGUID,
      MATTERGUID: matterdata.MATTERGUID,
      WRITEOFFDATE: this.datepipe.transform(this.WriteOffInvoice.WriteOffDate, 'dd/MM/yyyy'),
      WRITEOFFAMOUNT: this.WriteOffInvoice.AMOUNT
    }
    this.isspiner = true;
    let finalData = { DATA: data, FormAction: 'write off', VALIDATEONLY: true }
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
      if (value.VALUEVALID == 'ERROR') {
        errorData.push(value.ERRORDESCRIPTION);
        tempError[value.FIELDNAME] = value;
      } else if (value.VALUEVALID == 'Warning') {
        tempWarning[value.FIELDNAME] = value;
        warningData.push(value.ERRORDESCRIPTION);
      }
    });
    this.errorWarningData = { "Error": tempError, 'Warning': tempWarning };
    if (Object.keys(errorData).length != 0) {
      this.toastr.error(errorData);
      this.isspiner = false;
    } else if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.InvoiceWriteoffSaveData(details);
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.InvoiceWriteoffSaveData(details);
      this.isspiner = false;
    }
  }
  InvoiceWriteoffSaveData(data: any) {
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
