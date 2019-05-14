import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatterInvoicesService, TableColumnsService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  animations: fuseAnimations
})
export class InvoiceComponent implements OnInit {
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
  currentMatterData: any;


  constructor(
    private _MatterInvoicesService: MatterInvoicesService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private TableColumnsService: TableColumnsService,
  ) { }
  MatterInvoicesdata;
  ngOnInit() {
    this.getTableFilter();
    this.loadData();

  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('time and billing', 'matter invoices').subscribe(response => {
      //  console.log(response);
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS, 'invoicesColumns');
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

  loadData() {
    this.isLoadingResults = true;
    let potData = { 'MatterGuid': this.currentMatter.MATTERGUID };
    this._MatterInvoicesService.MatterInvoicesData(potData).subscribe(response => {
      if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
        if (response.DATA.INVOICES[0]) {
          this.highlightedRows = response.DATA.INVOICES[0].INVOICEGUID;
          this.currentMatterData = response.DATA.INVOICES[0];
        }
        this.MatterInvoicesdata = new MatTableDataSource(response.DATA.INVOICES)
        this.MatterInvoicesdata.paginator = this.paginator;
      }
      this.isLoadingResults = false;
    }, error => {
      this.toastr.error(error);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  selectMatterId(Row: any) {
    this.currentMatterData = Row;
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
        } else {
          this.loadData();
        }
      }
    });
  }
  choosedDate(s, ss) {

  }
  onSearch(scss) {

  }
} 
