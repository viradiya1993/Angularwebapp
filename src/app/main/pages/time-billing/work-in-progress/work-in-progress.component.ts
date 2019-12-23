import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { TableColumnsService, MainAPiServiceService, BehaviorService } from '../../../../_services';
import * as $ from 'jquery';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-work-in-progress',
  templateUrl: './work-in-progress.component.html',
  styleUrls: ['./work-in-progress.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class WorkInProgressComponent implements OnInit, OnDestroy {
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  displayedColumns: string[];
  TimeEnrtyForm: FormGroup;
  ColumnsObj: any = [];
  pageSize: any;
  tempColobj: any;
  isShowDrop: boolean;
  isDisplay: boolean = false;
  lastFilter: any
  TimerDropData: any = [];
  WorkInProgressdata: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoadingResults: boolean = false;
  constructor(public datepipe: DatePipe, private dialog: MatDialog, private fb: FormBuilder, private behaviorService: BehaviorService, private _mainAPiServiceService: MainAPiServiceService, private TableColumnsService: TableColumnsService, private toastr: ToastrService) {
    this.lastFilter = JSON.parse(localStorage.getItem('Work_in_progress_filter'));
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.isShowDrop = currentUser.ProductType == "Barrister" ? false : true;
    this.TimeEnrtyForm = this.fb.group({ date: [''], uninvoicedWork: ['No'], dlpdrop: [''], });

    if (this.lastFilter) {
      this.TimeEnrtyForm.controls['uninvoicedWork'].setValue('No');
      this.lastFilter.Invoiced = 'No';
      // this.TimeEnrtyForm.controls['uninvoicedWork'].setValue(this.lastFilter.Invoiced);
      this.TimeEnrtyForm.controls['dlpdrop'].setValue(this.lastFilter.FeeEarner);

      let Date1 = this.lastFilter.ItemDateStart.split("/");
      let SendDate1 = new Date(Date1[1] + '/' + Date1[0] + '/' + Date1[2]);

      let Date2 = this.lastFilter.ItemDateEnd.split("/");
      let SendDate2 = new Date(Date2[1] + '/' + Date2[0] + '/' + Date2[2]);
      this.TimeEnrtyForm.controls['date'].setValue({ begin: SendDate1, end: SendDate2 });
    } else {
      this.TimeEnrtyForm.controls['uninvoicedWork'].setValue('No');
      this.lastFilter = { 'MatterGuid': this.currentMatter.MATTERGUID, 'FeeEarner': '', 'Invoiced': "No", 'ItemDateStart': '', 'ItemDateEnd': '' };
      localStorage.setItem('Work_in_progress_filter', JSON.stringify(this.lastFilter));
    }

  }
  ngOnInit() {
    $('content').addClass('inner-scroll');
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + 140)) + 'px');
    this.behaviorService.workInProgress$.subscribe(result => {
      if (result)
        this.highlightedRows = result.WORKITEMGUID;
    });
    this.getTableFilter();
    this.loadData(this.lastFilter);
  }
  ngOnDestroy() {
    this.behaviorService.setworkInProgressData(null);
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('time and billing', 'work in progress').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS);
        this.displayedColumns = data.showcol;
        this.ColumnsObj = data.colobj;
        this.tempColobj = data.tempColobj;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  loadData(potData) {
    this.WorkInProgressdata = [];
    potData.MatterGuid = this.currentMatter.MATTERGUID
    this.isLoadingResults = true;
    // let potData = { 'MatterGuid': this.currentMatter.MATTERGUID };
    this._mainAPiServiceService.getSetData(potData, 'GetWorkItems').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        if (res.DATA.WORKITEMS[0]) {
          this.isDisplay = false;
          this.editworkInProgress(res.DATA.WORKITEMS[0]);
        } else {
          this.isDisplay = true;
          this.editworkInProgress(null);
        }
        this.WorkInProgressdata = new MatTableDataSource(res.DATA.WORKITEMS);
        this.WorkInProgressdata.paginator = this.paginator;
        // date shorting 
        this.sortingCLM();
      }
      this.isLoadingResults = false;
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });

    this.pageSize = localStorage.getItem('lastPageSize');
  }
  refreshWorkInprogress() {
    let filterVal = JSON.parse(localStorage.getItem('Work_in_progress_filter'));
    this.loadData(filterVal);
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  uninvoicedWorkChange(value) {
    let filterVal = { 'MatterGuid': this.currentMatter.MATTERGUID, 'FeeEarner': '', 'Invoiced': value, 'ItemDateStart': '', 'ItemDateEnd': '' };
    if (!localStorage.getItem('Work_in_progress_filter')) {
      localStorage.setItem('Work_in_progress_filter', JSON.stringify(filterVal));
    } else {
      filterVal = JSON.parse(localStorage.getItem('Work_in_progress_filter'));
      filterVal.Invoiced = value;
      localStorage.setItem('Work_in_progress_filter', JSON.stringify(filterVal));
    }
    this.loadData(filterVal);
  }
  dlpChange(value) {
    let filterVal = { 'MatterGuid': this.currentMatter.MATTERGUID, 'FeeEarner': value, 'Invoiced': '', 'ItemDateStart': '', 'ItemDateEnd': '' };
    if (!localStorage.getItem('Work_in_progress_filter')) {
      localStorage.setItem('Work_in_progress_filter', JSON.stringify(filterVal));
    } else {
      filterVal = JSON.parse(localStorage.getItem('Work_in_progress_filter'));
      filterVal.FeeEarner = value;
      localStorage.setItem('Work_in_progress_filter', JSON.stringify(filterVal));
    }
    this.loadData(filterVal);
  }
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
    let end = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');
    let filterVal = { 'FeeEarner': '', 'Invoiced': '', 'ItemDateStart': '', 'ItemDateEnd': '' };
    filterVal = JSON.parse(localStorage.getItem('Work_in_progress_filter'));
    filterVal.ItemDateStart = begin;
    filterVal.ItemDateEnd = end;
    localStorage.setItem('Work_in_progress_filter', JSON.stringify(filterVal));
    this.loadData(filterVal);
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'time and billing', 'list': 'work in progress' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        this.tempColobj = result.tempColobj;
        if (!result.columObj) {
          this.WorkInProgressdata = new MatTableDataSource([]);
          this.WorkInProgressdata.paginator = this.paginator;
          this.WorkInProgressdata.sort = this.sort;
          this.isDisplay = true;
        } else {
          this.loadData({});
        }
      }
    });
  }
  refresheWorkEtimateTab() {
    this.lastFilter = JSON.parse(localStorage.getItem('Work_in_progress_filter'));
    this.loadData(this.lastFilter);
  }
  editworkInProgress(row: any) {
    this.behaviorService.setworkInProgressData(row);
    this.behaviorService.SpendMoneyData(row);
  }
  sortingCLM() {
    this.WorkInProgressdata.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'ITEMDATE': {
          let tempDate = item.ITEMDATE.split("/");
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
    this.WorkInProgressdata.sort = this.sort;
  }

  sortData(val) {
  }
}



