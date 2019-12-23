import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from '../../../sorting-dialog/sorting-dialog.component';
import { TableColumnsService, MainAPiServiceService, BehaviorService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-matter-invoices',
  templateUrl: './matter-invoices.component.html',
  styleUrls: ['./matter-invoices.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MatterInvoicesComponent implements OnInit {
  MatterinvoiceData = { invoicetotal: 0, recevived: 0, outstanding: 0 };
  ColumnsObj: any = [];
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  displayedColumns: string[];
  tempColobj: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pageSize: any;
  isLoadingResults: boolean = false;
  isDisplay: boolean = false;
  constructor(private dialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    private TableColumnsService: TableColumnsService,
    private behaviorService: BehaviorService,
    private toastr: ToastrService) { }

  MatterInvoicesdata:any=[];
  ngOnInit() {
    this.behaviorService.matterInvoice$.subscribe(matterInvoiceData => {
      if (matterInvoiceData)
        this.highlightedRows = matterInvoiceData.INVOICEGUID;
    });
    $('content').addClass('inner-scroll');
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + 140)) + 'px');
    this.getTableFilter();
    this.loadData();
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }

  loadData() {
    this.MatterInvoicesdata=[];
    this.isLoadingResults = true;
    let potData = { 'MatterGuid': this.currentMatter.MATTERGUID };
    this._mainAPiServiceService.getSetData(potData, 'GetInvoice').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.MatterinvoiceData = { invoicetotal: res.DATA.TOTALINVOICES, recevived: res.DATA.TOTALRECEIVED, outstanding: res.DATA.TOTALOUSTANDING };
        this.behaviorService.matterInvoiceData(null);
        if (res.DATA.INVOICES[0]){
          this.isDisplay = false;
          this.editmatterInvoive(res.DATA.INVOICES[0]);
        }else {
          this.isDisplay = true;
        }          
        this.MatterInvoicesdata = new MatTableDataSource(res.DATA.INVOICES);
        this.MatterInvoicesdata.paginator = this.paginator;
        this.sortingCLM();
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('time and billing', 'matter invoices').subscribe(response => {
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
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'time and billing', 'list': 'matter invoices' };
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
          this.isDisplay = true;
        } else {
          this.loadData();
        }
      }
    });
  }
  editmatterInvoive(matterinvoice: any) {
    localStorage.setItem('edit_invoice_id', matterinvoice.INVOICEGUID);
    this.behaviorService.matterInvoiceData(matterinvoice);
  }
  //onSearch
  onSearch(searchFilter: any) {
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
    // proper shorting for date 
    this.MatterInvoicesdata.sort = this.sort;
  }
  sortData(val){
  }
}
