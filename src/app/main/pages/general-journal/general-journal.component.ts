import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatDialogRef, MatDialog, MatDialogConfig, MatDatepickerInputEvent } from '@angular/material';
import { MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { MainAPiServiceService, TableColumnsService, BehaviorService } from 'app/_services';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { DatePipe } from '@angular/common';
import * as $ from 'jquery';

@Component({
  selector: 'app-general-journal',
  templateUrl: './general-journal.component.html',
  styleUrls: ['./general-journal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class GeneralJournalComponent implements OnInit {
  highlightedRows: any;
  ColumnsObj = [];
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  contectTitle = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  displayedColumns: string[];
  tempColobj: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoadingResults: boolean = false;
  pageSize: any;
  dateRange: any = {};
  generalJournalData: any = [];
  // updatecurrentDate.setDate( new Date().getDate() - 30);
  filterVals = { ITEMSTARTDATE: '', ITEMENDDATE: '', SEARCH: '', SHOWRECEIPTS: false, SHOWINVOICES: false, SHOWRECEIVEMONEY: false, SHOWSPENDMONEY: false, SHOWGENERALJOURNAL: false };
  constructor(
    private TableColumnsService: TableColumnsService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    public datepipe: DatePipe,
    private _mainAPiServiceService: MainAPiServiceService,
    public behaviorService: BehaviorService,
  ) { }

  ngOnInit() {
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 130)) + 'px');
    let updatecurrentDate = new Date();
    updatecurrentDate.setDate(updatecurrentDate.getDate() - 30);
    this.dateRange = { begin: updatecurrentDate, end: new Date() };
    this.filterVals.ITEMSTARTDATE = this.datepipe.transform(updatecurrentDate, 'dd/MM/yyyy');
    this.filterVals.ITEMENDDATE = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
    this.getTableFilter();
    this.LoadData();
  }
  onSearch(searchFilter: any) {
    if (searchFilter['key'] === "Enter" || searchFilter == 'Enter') {
      this.LoadData();
    }
  }
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.filterVals.ITEMSTARTDATE = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
    this.filterVals.ITEMENDDATE = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');
    this.LoadData();
  }
  changeValueOfCheckbox() {
    this.LoadData();
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('general journal', '').subscribe(response => {
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
  LoadData() {
    this.generalJournalData = [];
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(this.filterVals, 'GetJournal').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let tempJData = [];
        let tempJData2 = [];
        let temJJ = response.DATA.JOURNALS;
        temJJ.forEach((item) => {
          item.JOURNALITEMS.forEach((item2) => {
            item2.JOURNALGUID = item.JOURNALGUID;
            if (!tempJData2[item2.JOURNALGUID]) {
              item2.DATE = item.DATE;
              item2.JOURNALTIME = item.JOURNALTIME;
              item2.DESCRIPTION = item.DESCRIPTION;
              item2.LINKTYPE = item.LINKTYPE;
            } else {
              item2.DATE = '';
              item2.JOURNALTIME = '';
              item2.DESCRIPTION = '';
              item2.LINKTYPE = '';
            }
            item2.LINKGUID = item.LINKGUID;
            item2.EXPORTEDDATE = item.EXPORTEDDATE;
            item2.CLOSED = item.CLOSED;
            tempJData2[item2.JOURNALGUID] = item2;
            tempJData.push(item2);
          });
        });
        this.generalJournalData = new MatTableDataSource(tempJData);
        // this.generalJournalData.paginator = this.paginator;
        // this.generalJournalData.sort = this.sort;
        if (tempJData[0]) {
          this.editjournal(tempJData[0]);
          this.highlightedRows = tempJData[0].JOURNALGUID;
        }
        this.isLoadingResults = false;
      } else if (response.CODE == 406 && response.MESSAGE == "Permission denied") {
        this.generalJournalData = new MatTableDataSource([]);
        // this.generalJournalData.paginator = this.paginator;
        // this.generalJournalData.sort = this.sort;
        this.isLoadingResults = false;
      }
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
    // this.pageSize = localStorage.getItem('lastPageSize');
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'contacts', 'list': '' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tempColobj = result.tempColobj;
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        if (!result.columObj) {
          this.generalJournalData = new MatTableDataSource([]);
          // this.generalJournalData.paginator = this.paginator;
          // this.generalJournalData.sort = this.sort;
        } else {
          this.LoadData();
        }
      }
    });
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  editjournal(row) {
    this.behaviorService.GeneralData(row);
  }
  refreshGeneral(){
    this.LoadData();
  }
}
