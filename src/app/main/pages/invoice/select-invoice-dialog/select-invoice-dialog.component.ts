import { Component, OnInit, Inject, AfterViewInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDatepickerInputEvent, MatPaginator, MatTableDataSource, MatDialogConfig } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MattersService, TimersService, TemplateListDetails, MatterInvoicesService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { MatterPopupComponent } from '../../matters/matter-popup/matter-popup.component';
import { InvoiceAddDailogComponent } from '../invoice-add-dailog/invoice-add-dailog.component';
// import { TemplateComponent } from '../template.component';

@Component({
  selector: 'app-select-invoice-dialog',
  templateUrl: './select-invoice-dialog.component.html',
  styleUrls: ['./select-invoice-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InvoiceDialogComponentForTemplate implements OnInit {
  message: string;
  displayedColumns: string[] = ['INVOICECODE', 'CLIENTNAME', 'INVOICETOTAL'];
  getDataForTable: any = [];
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  @ViewChild(MatPaginator) paginator: MatPaginator;
  matterFilterForm: FormGroup;
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  isLoadingResults: boolean = false;
  pageSize: any;
  currentInvoiceData: any;
  // currentMatterData: any;
  MatterDropData: any;
  filterVal: any = { 'Active': '', 'FeeEarner': '', 'SearchString': '' };
  @Input() mattersDetailData;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private mattersService: MattersService,
    private toastr: ToastrService,
    private Timersservice: TimersService,
    private TemplateListDetails: TemplateListDetails,
    private _MatterInvoicesService: MatterInvoicesService,
    public _matDialog: MatDialog,

    // private data:TemplateComponent
  ) {

    this.matterFilterForm = this.fb.group({ MatterFilter: [''], UserFilter: [''], searchFilter: [''], InvoiceFilter: [''], });
  }

  ngOnInit() {
    // this.getDropValue();
    // this.getMatterList();

    this.isLoadingResults = true;
    this._MatterInvoicesService.MatterInvoicesData(JSON.parse(localStorage.getItem('matter_invoice_filter'))).subscribe(response => {
      console.log(response);
      if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
        if (response.DATA.INVOICES[0]) {
          localStorage.setItem('edit_invoice_id', response.DATA.INVOICES[0].INVOICEGUID);
          this.highlightedRows = response.DATA.INVOICES[0].INVOICEGUID;
          this.currentInvoiceData = response.DATA.INVOICES[0];
        }
        this.getDataForTable = new MatTableDataSource(response.DATA.INVOICES);
        this.getDataForTable.paginator = this.paginator;
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
    let data = JSON.parse(localStorage.getItem('templateData'));
    //this.currentInvoiceData
    let passingData = {
      'Context': "Invoice",
      'ContextGuid': this.currentInvoiceData.INVOICEGUID,
      "Type": "Template",
      "Folder": 'abc',
      "Template": data.TEMPLATENAME
    }
    this.TemplateListDetails.getGenerateTemplate(passingData).subscribe(response => {
      console.log(response);
      if (response.CODE == 200 && response.STATUS == "success") {

      }
    }, error => {
      this.toastr.error(error);
    });
  }
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
    console.log("addInvoice");
    const dialogRef = this._matDialog.open(InvoiceAddDailogComponent, { width: '100%', disableClose: true, data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
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
