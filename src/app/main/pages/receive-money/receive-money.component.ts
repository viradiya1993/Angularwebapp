import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { TableColumnsService, MainAPiServiceService } from '../../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig, MatDatepickerInputEvent } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import * as $ from 'jquery';
import { MatSort } from '@angular/material';

@Component({
  selector: 'app-receive-money',
  templateUrl: './receive-money.component.html',
  styleUrls: ['./receive-money.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ReceiveMoneyComponent implements OnInit {
  tempColobj: any;
  ColumnsObj: any;
  isLoadingResults: boolean;
  displayedColumns: any = [];
  receiveMoneydata: any;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  pageSize: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currentReciveMoneyData: any;
  lastFilter: any;
  constructor(
    private TableColumnsService: TableColumnsService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public _mainAPiServiceService:MainAPiServiceService,
    public datepipe: DatePipe,
  ) { }
  receiveMoneyForm: FormGroup;
  ngOnInit() {
    var dt = new Date();
    dt.setMonth(dt.getMonth() + 1);
    if (JSON.parse(localStorage.getItem('recive_money_DateFilter'))) {
      this.lastFilter = JSON.parse(localStorage.getItem('recive_money_DateFilter'));
    } else {
      this.lastFilter = { "INCOMECLASS": "Receipt", 'ItemDateStart': this.datepipe.transform(new Date(), 'dd/MM/yyyy'), 'ItemDateEnd': this.datepipe.transform(dt, 'dd/MM/yyyy') };
    }

    localStorage.setItem('recive_money_DateFilter', JSON.stringify(this.lastFilter));
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 130)) + 'px');
    this.receiveMoneyForm = this.fb.group({
      ShowWhat: [''],
      DateRange: [],
      ReceiptsTotalInc: [''],
      ReceiptsTotalEx: [''],
      ReceiveMoneyType: [''],
    });
    if (this.lastFilter.ItemDateStart && this.lastFilter.ItemDateEnd) {
      let Sd = new Date(this.lastFilter.ItemDateStart);
      let ed = new Date(this.lastFilter.ItemDateEnd);
      this.receiveMoneyForm.controls['DateRange'].setValue({ begin: Sd, end: ed });
    }
    this.receiveMoneyForm.controls['ShowWhat'].setValue(this.lastFilter.INCOMECLASS);
    this.getTableFilter();
    this.forListing(this.lastFilter);
  }
  forListing(data) {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(data, 'GetIncome').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.INCOMEITEMS[0]) {
          localStorage.setItem('receiptData', JSON.stringify(response.DATA.INCOMEITEMS[0]));
          this.highlightedRows = response.DATA.INCOMEITEMS[0].INCOMEGUID;
          this.currentReciveMoneyData = response.DATA.INCOMEITEMS[0];
        }
        this.receiveMoneydata = new MatTableDataSource(response.DATA.INCOMEITEMS)
        this.receiveMoneydata.paginator = this.paginator;
      }
      this.isLoadingResults = false;
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });

  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('receive money', '').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS);
        this.tempColobj = data.tempColobj;
        this.displayedColumns = data.showcol;
        this.ColumnsObj = data.colobj;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
    let end = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');
    this.lastFilter.ItemDateStart = begin;
    this.lastFilter.ItemDateEnd = end;

    localStorage.setItem('recive_money_DateFilter', JSON.stringify(this.lastFilter));
    this.forListing(this.lastFilter);
  }
  selectMatterId(row: any) {
    this.currentReciveMoneyData = row;
    localStorage.setItem('receiptData', JSON.stringify(row));
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  get f() {
    return this.receiveMoneyForm.controls;
  }
  onChange(value) {
    this.lastFilter.INCOMECLASS = value.value;

    localStorage.setItem('recive_money_DateFilter', JSON.stringify(this.lastFilter));
    this.forListing(this.lastFilter);
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'time entries', 'list': '' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tempColobj = result.tempColobj;
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        if (!result.columObj) {
          this.receiveMoneydata = new MatTableDataSource([]);
          this.receiveMoneydata.paginator = this.paginator;
          this.receiveMoneydata.sort = this.sort;
        } else {
          this.forListing(this.lastFilter);
        }
      }
    });
  }
}
