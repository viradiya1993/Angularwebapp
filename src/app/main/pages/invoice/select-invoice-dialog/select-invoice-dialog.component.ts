import { Component, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MainAPiServiceService, BehaviorService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { MatterPopupComponent } from '../../matters/matter-popup/matter-popup.component';
import { InvoiceAddDailogComponent } from '../invoice-add-dailog/invoice-add-dailog.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
// import { TemplateComponent } from '../template.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-select-invoice-dialog',
  templateUrl: './select-invoice-dialog.component.html',
  styleUrls: ['./select-invoice-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InvoiceDialogComponentForTemplate implements OnInit {
  appPermissions: any = JSON.parse(localStorage.getItem('app_permissions'));
  message: string;
  isspiner: boolean = false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  displayedColumns: string[] = ['INVOICECODE', 'CLIENTNAME', 'INVOICETOTAL'];
  getDataForTable: any = [];
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  matterFilterForm: FormGroup;
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  isLoadingResults: boolean = false;
  pageSize: any;
  currentInvoiceData: any;
  TemplateGenerateData: any = [];
  // currentMatterData: any;
  MatterDropData: any;
  filterVal: any = { 'Active': '', 'FeeEarner': '', 'SearchString': '' };
  @Input() mattersDetailData;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private _mainAPiServiceService: MainAPiServiceService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<InvoiceDialogComponentForTemplate>,
    public behaviorService: BehaviorService,


    // private data:TemplateComponent
  ) {

    this.matterFilterForm = this.fb.group({ MatterFilter: [''], UserFilter: [''], searchFilter: [''], InvoiceFilter: [''], });
    this.behaviorService.TemplateGenerateData$.subscribe(result => {
      if (result) {
        this.TemplateGenerateData = result;
      }
    });
  }

  ngOnInit() {
    this.appPermissions = [];
    // this.getDropValue();
    // this.getMatterList();

    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(JSON.parse(localStorage.getItem('matter_invoice_filter')), 'GetInvoice').subscribe(response => {
      if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
        if (response.DATA.INVOICES[0]) {
          localStorage.setItem('edit_invoice_id', response.DATA.INVOICES[0].INVOICEGUID);
          this.highlightedRows = response.DATA.INVOICES[0].INVOICEGUID;
          this.currentInvoiceData = response.DATA.INVOICES[0];
        }
        this.getDataForTable = new MatTableDataSource(response.DATA.INVOICES);
        this.getDataForTable.paginator = this.paginator;
        this.getDataForTable.sort = this.sort;
        // this.MatterInvoicesdata = new MatTableDataSource(response.DATA.INVOICES)
        // this.MatterInvoicesdata.paginator = this.paginator;
      }
      this.isLoadingResults = false;
    }, error => {
      this.toastr.error(error);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  // getDropValue() {
  //   let d = {};
  //   this.Timersservice.GetUsers(d).subscribe(response => {
  //     if (response.CODE == 200 && response.STATUS == "success") {
  //       this.MatterDropData = response.DATA.USERS;
  //     }
  //   }, err => {
  //     console.log(err);
  //   });
  // }
  selectMatterId(Row: any) {
    this.currentInvoiceData = Row;

  }
  selectInvoicve() {

    //this.currentInvoiceData
    let passingData = {
      'Context': "Invoice",
      'ContextGuid': this.currentInvoiceData.INVOICEGUID,
      "Type": "Template",
      "Folder": '',
      "Template": this.TemplateGenerateData.TEMPLATENAME
    }
    this._mainAPiServiceService.getSetData(passingData, 'TemplateGenerate').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.toastr.success('Template Generate successfully');
        this.dialogRef.close(true);
        //   this.checkValidation(response.DATA.VALIDATIONS, passingData);
        // } else if (response.CODE == 451 && response.STATUS == 'warning') {
        //   this.checkValidation(response.DATA.VALIDATIONS, passingData);
        // } else if (response.CODE == 450 && response.STATUS == 'error') {
        //   this.checkValidation(response.DATA.VALIDATIONS, passingData);
        // } else if (response.MESSAGE == 'Not logged in') {
        //   this.dialogRef.close(false);
        // } else {
        //   this.isspiner = false;
      }
    }, error => {
      this.toastr.error(error);
      this.dialogRef.close(true);
    });
  }

  // checkValidation(bodyData: any, details: any) {
  //   let errorData: any = [];
  //   let warningData: any = [];
  //   bodyData.forEach(function (value) {
  //     if (value.VALUEVALID == 'NO')
  //       errorData.push(value.ERRORDESCRIPTION);
  //     else if (value.VALUEVALID == 'WARNING')
  //       warningData.push(value.ERRORDESCRIPTION);
  //   });
  //   if (Object.keys(errorData).length != 0)
  //     this.toastr.error(errorData);
  //   if (Object.keys(warningData).length != 0) {
  //     this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
  //       disableClose: true,
  //       width: '100%',
  //       data: warningData
  //     });
  //     this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
  //     this.confirmDialogRef.afterClosed().subscribe(result => {
  //       if (result) {
  //         this.isspiner = true;
  //         this.saveTemplatetData(details);
  //       }
  //       this.confirmDialogRef = null;
  //     });
  //   }
  //   if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
  //     this.saveTemplatetData(details);
  //   this.isspiner = false;
  // }
  // saveTemplatetData(data: any) {
  //   data.VALIDATEONLY = false;
  //   this.TemplateListDetails.getGenerateTemplate(data).subscribe(response => {
  //     if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
  //       this.toastr.success('Template Generate successfully');
  //       this.isspiner = false;
  //       this.dialogRef.close(true);
  //     } else if (response.MESSAGE == 'Not logged in') {
  //       this.dialogRef.close(false);
  //     } else {
  //       this.isspiner = false;
  //     }
  //   }, error => {
  //     this.toastr.error(error);
  //   });

  // }
  // getMatterList() {
  //   this.getList(JSON.parse(localStorage.getItem('matter_invoice_filter')));
  //   this.pageSize = localStorage.getItem('lastPageSize');
  // }
  // get f() {
  //   return this.matterFilterForm.controls;
  // }
  // MatterChange(value) {
  //   this.filterVal.Active = value;
  //   this.getList(this.filterVal);
  // }
  // onSearch(searchFilter: any) {
  //   if (searchFilter['key'] === "Enter" || searchFilter == 'Enter') {
  //     this.filterVal.SearchString = this.f.searchFilter.value;
  //     this.getList(this.filterVal);
  //   }
  // }
  // MatterUserChange(value) {
  //   this.filterVal.FeeEarner = value;
  //   this.getList(this.filterVal);
  // }
  // getList(filterVal: any) {
  //   console.log(filterVal);
  //   this.isLoadingResults = true;
  //   this._MatterInvoicesService.MatterInvoicesData(filterData).subscribe(response => {
  //     if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
  //       if (response.DATA.INVOICES[0]) {
  //         localStorage.setItem('edit_invoice_id', response.DATA.INVOICES[0].INVOICEGUID);
  //         this.highlightedRows = response.DATA.INVOICES[0].INVOICEGUID;
  //         this.currentInvoiceData = response.DATA.INVOICES[0];
  //       }
  //       this.MatterInvoicesdata = new MatTableDataSource(response.DATA.INVOICES)
  //       this.MatterInvoicesdata.paginator = this.paginator;
  //     }
  //     this.isLoadingResults = false;
  //   }, error => {
  //     this.toastr.error(error);
  //   });
  //   this.pageSize = localStorage.getItem('lastPageSize');
  // }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  // //select matter
  // selectMatter(Row: any){
  // let data=JSON.parse(localStorage.getItem('templateData'));
  //  // console.log(this.currentMatterData.MATTERGUID);
  // let passingData={ 
  // 'Context':"Matter",
  // 'ContextGuid': this.currentMatterData.MATTERGUID ,
  // "Type":"Template",
  // "Folder":'abc',
  // "Template":data.TEMPLATENAME}
  // this.TemplateListDetails.getGenerateTemplate(passingData).subscribe(response => {
  //   console.log(response);
  //   if (response.CODE == 200 && response.STATUS == "success") {

  //   }
  // }, error => {
  //   this.toastr.error(error);
  // });
  // }
  //  // New matter Pop-up
  AddNewInvoicepopup() {
    const dialogRef = this._matDialog.open(InvoiceAddDailogComponent, { width: '100%', disableClose: true, data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }
  // Edit matter Pop-up
  EditNewInvoicepopup() {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(MatterPopupComponent, {
      width: '100%',
      disableClose: true,
      data: {
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => { });
  }
}
