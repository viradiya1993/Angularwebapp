import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig, MatDatepickerInputEvent } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from '../../sorting-dialog/sorting-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TimersService, TableColumnsService } from '../../../_services';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common'
import * as $ from 'jquery';

@Component({
  selector: 'app-time-entries',
  templateUrl: './time-entries.component.html',
  styleUrls: ['./time-entries.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TimeEntriesComponent implements OnInit {
  TimeEnrtyForm: FormGroup;
  pageSize: any;
  isLoadingResults: boolean = false;
  displayedColumns: string[];
  ColumnsObj = [];
  TimerData;
  TimerDropData: any;
  isShowDrop: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  lastFilter: any;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  tempColobj: any;
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private Timersservice: TimersService,
    public datepipe: DatePipe,
    private TableColumnsService: TableColumnsService,
  ) {
    this.lastFilter = JSON.parse(localStorage.getItem('time_entries_filter'));
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.isShowDrop = currentUser.ProductType == "Barrister" ? false : true;
    this.TimeEnrtyForm = this.fb.group({ date: [''], uninvoicedWork: [''], dlpdrop: [''], });
    if (this.lastFilter) {
      if (this.lastFilter.ItemDateStart && this.lastFilter.ItemDateEnd) {
        let tempDate = this.lastFilter.ItemDateStart.split("/");
        let tempDate2 = this.lastFilter.ItemDateEnd.split("/");
        let Sd = new Date(tempDate[1] + '/' + tempDate[0] + '/' + tempDate[2]);
        let ed = new Date(tempDate2[1] + '/' + tempDate2[0] + '/' + tempDate2[2]);
        this.TimeEnrtyForm.controls['date'].setValue({ begin: Sd, end: ed });
      } else {
        var dt = new Date();
        dt.setMonth(dt.getMonth() + 1);
        this.TimeEnrtyForm.controls['date'].setValue({ begin: new Date(), end: dt });
        this.lastFilter.ItemDateStart = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
        this.lastFilter.ItemDateEnd = this.datepipe.transform(dt, 'dd/MM/yyyy');
      }
      this.TimeEnrtyForm.controls['uninvoicedWork'].setValue(this.lastFilter.Invoiced);
      this.TimeEnrtyForm.controls['dlpdrop'].setValue(this.lastFilter.FeeEarner);
    } else {
      var dt = new Date();
      dt.setMonth(dt.getMonth() + 1);
      this.TimeEnrtyForm.controls['date'].setValue({ begin: new Date(), end: dt });
      this.lastFilter = { 'FeeEarner': '', 'Invoiced': "", 'ItemDateStart': this.datepipe.transform(new Date(), 'dd/MM/yyyy'), 'ItemDateEnd': this.datepipe.transform(dt, 'dd/MM/yyyy') };
      localStorage.setItem('time_entries_filter', JSON.stringify(this.lastFilter));
    }

  }

  ngOnInit() {
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 130)) + 'px');
    this.getTableFilter();
    let d = {};
    this.Timersservice.GetUsers(d).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.TimerDropData = res.DATA.USERS;
      }
    }, err => {
      console.log(err);
    });
    this.LoadData(this.lastFilter);
  }
  refreshTab() {
    this.LoadData(this.lastFilter);
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('time entries', '').subscribe(response => {
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
  get f() {
    return this.TimeEnrtyForm.controls;
  }
  editTimeEntry(Data: any) {
    localStorage.setItem('edit_WORKITEMGUID', Data);
  }
  LoadData(Data) {
    this.isLoadingResults = true;
    this.Timersservice.getTimeEnrtyData(Data).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.WORKITEMS[0]) {
          this.highlightedRows = response.DATA.WORKITEMS[0].WORKITEMGUID;
          localStorage.setItem('edit_WORKITEMGUID', this.highlightedRows);
        }
        try {
          this.TimerData = new MatTableDataSource(response.DATA.WORKITEMS);
          this.TimerData.paginator = this.paginator;
        } catch (error) {
          console.log(error);
        }
      }
      this.isLoadingResults = false;
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  uninvoicedWorkChange(value) {
    let filterVal = { 'FeeEarner': '', 'Invoiced': value, 'ItemDateStart': '', 'ItemDateEnd': '' };
    if (!localStorage.getItem('time_entries_filter')) {
      localStorage.setItem('time_entries_filter', JSON.stringify(filterVal));
    } else {
      filterVal = JSON.parse(localStorage.getItem('time_entries_filter'));
      filterVal.Invoiced = value;
      localStorage.setItem('time_entries_filter', JSON.stringify(filterVal));
    }
    this.LoadData(filterVal);
  }
  dlpChange(value) {
    let filterVal = { 'FeeEarner': value, 'Invoiced': '', 'ItemDateStart': '', 'ItemDateEnd': '' };
    if (!localStorage.getItem('time_entries_filter')) {
      localStorage.setItem('time_entries_filter', JSON.stringify(filterVal));
    } else {
      filterVal = JSON.parse(localStorage.getItem('time_entries_filter'));
      filterVal.FeeEarner = value;
      localStorage.setItem('time_entries_filter', JSON.stringify(filterVal));
    }
    this.LoadData(filterVal);
  }


  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
    let end = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');
    let filterVal = { 'FeeEarner': '', 'Invoiced': '', 'ItemDateStart': begin, 'ItemDateEnd': end };
    if (!localStorage.getItem('time_entries_filter')) {
      localStorage.setItem('time_entries_filter', JSON.stringify(filterVal));
    } else {
      filterVal = JSON.parse(localStorage.getItem('time_entries_filter'));
      filterVal.ItemDateStart = begin;
      filterVal.ItemDateEnd = end;
      localStorage.setItem('time_entries_filter', JSON.stringify(filterVal));
    }
    this.LoadData(filterVal);
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
          this.TimerData = new MatTableDataSource([]);
          this.TimerData.paginator = this.paginator;
        } else {
          this.LoadData(JSON.parse(localStorage.getItem('time_entries_filter')));
        }
      }
    });
  }


}
