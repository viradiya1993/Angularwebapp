import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TableColumnsService, MainAPiServiceService, BehaviorService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import * as $ from 'jquery';
import { MatTableDataSource, MatPaginator, MatDialogConfig, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material';
// import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule } from 'saturn-datepicker'
// import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'



@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  animations: fuseAnimations

})
export class InvoiceComponent implements OnInit {
  resultPicker: any;
  matterInvoiceFilterForm: FormGroup;
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  isLoadingResults: boolean = false;
  displayedColumns: string[];
  ColumnsObj: any = [];
  tempColobj: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  highlightedRows: any;
  pageSize: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currentInvoiceData: any;
  lastFilter: any;
  MatterInvoicesdata;

  constructor(
    private _mainAPiServiceService: MainAPiServiceService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private behaviorService: BehaviorService,
    private TableColumnsService: TableColumnsService,
    private fb: FormBuilder,
    public datepipe: DatePipe,
  ) {
    this.matterInvoiceFilterForm = this.fb.group({ dateRang: [''], OUTSTANDING: [''], ENDDATE: [''], STARTDATE: [''], Outstanding: [0], Received: [0], TOTAL: [0] });
    let filterData = JSON.parse(localStorage.getItem('matter_invoice_filter'));
    if (filterData) {
      this.lastFilter = JSON.parse(localStorage.getItem('matter_invoice_filter'));
    } else {
      this.lastFilter = { OUTSTANDING: '', ENDDATE: '', STARTDATE: '' };
      localStorage.setItem('matter_invoice_filter', JSON.stringify(this.lastFilter));
    }
    if (this.lastFilter) {
      console.log(this.lastFilter);
      if (this.lastFilter.STARTDATE && this.lastFilter.ENDDATE) {
        let tempDate = this.lastFilter.STARTDATE.split("/");
        let tempDate2 = this.lastFilter.ENDDATE.split("/");
        let Sd = new Date(tempDate[1] + '/' + tempDate[0] + '/' + tempDate[2]);
        let ed = new Date(tempDate2[1] + '/' + tempDate2[0] + '/' + tempDate2[2]);
        this.matterInvoiceFilterForm.controls['dateRang'].setValue({ begin: Sd, end: ed });
      }
      this.matterInvoiceFilterForm.controls['OUTSTANDING'].setValue(this.lastFilter.OUTSTANDING);
    } else {
      this.matterInvoiceFilterForm.controls['OUTSTANDING'].setValue('Yes');
    }
  }
  get f() {
    return this.matterInvoiceFilterForm.controls;
  }
  ngOnInit() {
    this.behaviorService.resizeTableForAllView();
    const behaviorService = this.behaviorService;
    $(window).resize(function () {
      behaviorService.resizeTableForAllView();
    });
    this.getTableFilter();
    this.loadData(JSON.parse(localStorage.getItem('matter_invoice_filter')));

  }
  outstandingChange(val) {
    this.lastFilter.OUTSTANDING = val;
    localStorage.setItem('matter_invoice_filter', JSON.stringify(this.lastFilter));
    this.loadData(this.lastFilter);
  }
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
    let end = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');
    this.lastFilter = JSON.parse(localStorage.getItem('matter_invoice_filter'));
    if (this.lastFilter) {
      this.lastFilter.STARTDATE = begin;
      this.lastFilter.ENDDATE = end;
      localStorage.setItem('matter_invoice_filter', JSON.stringify(this.lastFilter));
    } else {
      let filterVal = { OUTSTANDING: '', STARTDATE: begin, ENDDATE: end }
      localStorage.setItem('matter_invoice_filter', JSON.stringify(filterVal));
    }
    this.loadData(JSON.parse(localStorage.getItem('matter_invoice_filter')));
  }

  getTableFilter() {
    this.TableColumnsService.getTableFilter('invoices', '').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS);
        this.displayedColumns = data.showcol;
        this.tempColobj = data.tempColobj;
        this.ColumnsObj = data.colobj;
      }
    }, error => {
      this.toastr.error(error);
    });

  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  refreshInvoiceTab() {
    this.loadData(JSON.parse(localStorage.getItem('matter_invoice_filter')));
  }
  loadData(filterData) {
    this.MatterInvoicesdata = [];
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(filterData, 'GetInvoice').subscribe(response => {
      if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
        this.matterInvoiceFilterForm.controls['TOTAL'].setValue(response.DATA.TOTALINVOICES);
        this.matterInvoiceFilterForm.controls['Received'].setValue(response.DATA.TOTALRECEIVED);
        this.matterInvoiceFilterForm.controls['Outstanding'].setValue(response.DATA.TOTALOUSTANDING);
        this.behaviorService.matterInvoiceData(null);
        if (response.DATA.INVOICES[0]) {
          this.behaviorService.matterInvoiceData(response.DATA.INVOICES[0])
          localStorage.setItem('edit_invoice_id', response.DATA.INVOICES[0].INVOICEGUID);
          // localStorage.setItem('set_active_Invoices', JSON.stringify(response.DATA.INVOICES[0]));
          this.highlightedRows = response.DATA.INVOICES[0].INVOICEGUID;
          this.currentInvoiceData = response.DATA.INVOICES[0];
        }
        this.MatterInvoicesdata = new MatTableDataSource(response.DATA.INVOICES);
        this.MatterInvoicesdata.paginator = this.paginator;
        this.MatterInvoicesdata.sort = this.sort;
        this.isLoadingResults = false;
        this.sortingCLM();
      }

    }, error => {
      this.toastr.error(error);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  selectInvoice(Row: any) {
    localStorage.setItem('edit_invoice_id', Row.INVOICEGUID);
    this.behaviorService.matterInvoiceData(Row);
    // localStorage.setItem('set_active_Invoices', JSON.stringify(Row));
    this.currentInvoiceData = Row;
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'invoices', 'list': '' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        this.tempColobj = result.tempColobj;
        if (!result.columObj) {
          this.MatterInvoicesdata = new MatTableDataSource([]);
          this.MatterInvoicesdata.paginator = this.paginator;
          this.MatterInvoicesdata.sort = this.sort;
        } else {
          this.loadData(JSON.parse(localStorage.getItem('matter_invoice_filter')));
        }
      }
    });
  }

  sortingCLM() {
    this.MatterInvoicesdata.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'INVOICEDATE': {
          let tempDate = item.INVOICEDATE.split("/");
          let Sd = new Date(tempDate[1] + '/' + tempDate[0] + '/' + tempDate[2]);
          let newDate = new Date(Sd);
          return newDate;
        }
        default: {
          return item[property];
        }
      }
    }
  }

} 
