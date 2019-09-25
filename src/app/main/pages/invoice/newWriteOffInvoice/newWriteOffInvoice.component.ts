import { Component, OnInit, Input, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import {  MainAPiServiceService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-newWriteOffInvoice',
  templateUrl: './newWriteOffInvoice.component.html',
  styleUrls: ['./newWriteOffInvoice.component.scss'],
  animations: fuseAnimations
})
export class WriteOffInvoiceComponent implements OnInit {
  isLoadingResults: boolean = false;
  addData:any=[];
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  errorWarningData: any = { "Error": [], 'Warning': [] };
  isspiner: boolean = false;
   WriteOffInvoice:any={}
  constructor(private _mainAPiServiceService:MainAPiServiceService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<WriteOffInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any,public _matDialog: MatDialog,) { }

  ngOnInit() {
    this.WriteOffInvoice={
      INVOICECODE:'',INVOICEDATE:'',DUEDATE:'',TOTALINVOICES:'',AMOUNTOUTSTANDINGEXGST:'',TOTALOUSTANDING:'',SendInvoiceDate:''
    }
  this.EditPopUpOPen();
  }
  EditPopUpOPen() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData( {'INVOICEGUID': this._data.INVOICEGUID } , 'GetInvoice').subscribe(res => {
      console.log(res);
      if ((res.CODE == 200 ||  res.CODE == '200'  ) && res.STATUS == "success") {
        this.WriteOffInvoice.INVOICECODE=res.DATA.INVOICES[0].INVOICECODE;
        let DueDate = res.DATA.INVOICES[0].DUEDATE.split("/");
        let DUE = new Date(DueDate[1] + '/' + DueDate[0] + '/' + DueDate[2]);
        this.WriteOffInvoice.DUEDATE=DUE;
        let InvoiceDate = res.DATA.INVOICES[0].INVOICEDATE.split("/");
        let date = new Date(InvoiceDate[1] + '/' + InvoiceDate[0] + '/' + InvoiceDate[2]);
        this.WriteOffInvoice.INVOICEDATE=date;
       this.WriteOffInvoice.SendInvoiceDate=res.DATA.INVOICES[0].INVOICEDATE
        this.WriteOffInvoice.AMOUNTOUTSTANDINGEXGST=res.DATA.INVOICES[0].AMOUNTOUTSTANDINGEXGST;
        this.WriteOffInvoice.TOTALINVOICES=res.DATA.TOTALINVOICES;
        this.WriteOffInvoice.TOTALOUSTANDING=res.DATA.TOTALOUSTANDING;
        // this.TaskForm.controls['DUEDATE'].setValue(DUE);
        // this.TaskForm.controls['SendDUEDATE'].setValue(res.DATA.TASKS[0].DUEDATE);
        // let StartDate = res.DATA.TASKS[0].STARTDATE.split("/");
        // let Start = new Date(StartDate[1] + '/' + StartDate[0] + '/' + StartDate[2]);
        // this.TaskForm.controls['STARTDATE'].setValue(Start);
       
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
      this.isLoadingResults = false;
    });
  }

  saveWriteOff(){
    let matterdata=JSON.parse(localStorage.getItem('set_active_matters'));
    let data={
      INVOICEGUID:this._data.INVOICEGUID,
      MATTERGUID:matterdata.MATTERGUID,
      WRITEOFFDATE:this.WriteOffInvoice.SendInvoiceDate,
      WRITEOFFAMOUNT:this.WriteOffInvoice.AMOUNTOUTSTANDINGEXGST
    }
    this.isspiner = true;
    let finalData = { DATA: data, FormAction:'write off', VALIDATEONLY: true }
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
    this.errorWarningData = { "Error": tempError, 'Warning': tempWarning };
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
          this.InvoiceWriteoffSaveData(details);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.InvoiceWriteoffSaveData(details);
    this.isspiner = false;
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
