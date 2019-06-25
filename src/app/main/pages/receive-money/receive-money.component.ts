import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { TableColumnsService, MattersService, TimersService, GetReceptData } from '../../../_services';
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
  lastFilter: { 'INCOMECLASS': string; 'ItemDateStart': string; 'ItemDateEnd': string; };
  constructor(
    private TableColumnsService: TableColumnsService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private Timersservice: TimersService,
    private GetReceptData: GetReceptData,
    public datepipe: DatePipe,
    private _mattersService: MattersService,
  ) { }
  receiveMoneyForm: FormGroup;
  ngOnInit() {
    var dt = new Date();
    dt.setMonth(dt.getMonth() + 1);
    let filterVals = { 'active': '1', 'FirstLetter': 'a', 'SEARCH': '', 'ContactType': '' };
    localStorage.setItem('ReciveMoney_Filter', JSON.stringify(filterVals));

    this.lastFilter = { "INCOMECLASS": " ", 'ItemDateStart': this.datepipe.transform(new Date(), 'dd/MM/yyyy'), 'ItemDateEnd': this.datepipe.transform(dt, 'dd/MM/yyyy') };
    localStorage.setItem('recive_money_DateFilter', JSON.stringify(this.lastFilter));

    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 130)) + 'px');
    this.receiveMoneyForm = this.fb.group({
      ShowWhat: [''],
      DateRange: [''],
      ReceiptsTotalInc: [''],
      ReceiptsTotalEx: [''],
      ReceiveMoneyType: [''],
    });
    this.getTableFilter();
    this.forListing({ "INCOMECLASS": "Receipt" });

  }
  forListing(data) {
    this.isLoadingResults = true;
    this.GetReceptData.getIncome(data).subscribe(response => {
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
    let filterVal = JSON.parse(localStorage.getItem('recive_money_DateFilter'));
    filterVal.ItemDateStart = begin;
    filterVal.ItemDateEnd = end;
    this.forListing(filterVal);
  }
  GetData(data) {
    this.isLoadingResults = true;
    this.GetReceptData.getRecept(data).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.RECEIPTALLOCATIONS[0]) {
          localStorage.setItem('receiptData', JSON.stringify(response.DATA.RECEIPTALLOCATIONS[0]));
          this.highlightedRows = response.DATA.RECEIPTALLOCATIONS[0].RECEIPTGUID;
          this.currentReciveMoneyData = response.DATA.RECEIPTALLOCATIONS[0];
        }
        this.receiveMoneydata = new MatTableDataSource(response.DATA.RECEIPTALLOCATIONS)
        this.receiveMoneydata.paginator = this.paginator;
        this.receiveMoneydata.sort = this.sort;
      }
      this.isLoadingResults = false;
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });

  }
  selectMatterId(row: any) {
    this.currentReciveMoneyData = row;
    // localStorage.setItem('receiptGuid',row.RECEIPTGUID);
    localStorage.setItem('receiptData', JSON.stringify(row));
  }
  // LoadData(Data) {
  //   this.isLoadingResults = true;
  //   this.Timersservice.getTimeEnrtyData(Data).subscribe(response => {
  //     console.log(response);
  //     if (response.CODE == 200 && response.STATUS == "success") {
  //       if (response.DATA.WORKITEMS[0]) {
  //         this.highlightedRows = response.DATA.WORKITEMS[0].WORKITEMGUID;
  //         localStorage.setItem('edit_WORKITEMGUID', this.highlightedRows);
  //       }
  //       try {
  //         this.receiveMoneydata = new MatTableDataSource(response.DATA.WORKITEMS);
  //         this.receiveMoneydata.paginator = this.paginator;
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //     this.isLoadingResults = false;
  //   }, err => {
  //     this.isLoadingResults = false;
  //     this.toastr.error(err);
  //   });
  //   this.pageSize = localStorage.getItem('lastPageSize');
  // }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  get f() {
    return this.receiveMoneyForm.controls;
  }
  onChange(value) {

    let data = { value }
    let filterVal: any = JSON.parse(localStorage.getItem('recive_money_DateFilter'));
    filterVal.INCOMECLASS = data.value;
    localStorage.setItem('recive_money_DateFilter', JSON.stringify(filterVal))
    this.forListing(filterVal);

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
          // this.LoadData(JSON.parse(localStorage.getItem('time_entries_filter')));
        }
      }
    });
  }
}
