import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MainAPiServiceService, TableColumnsService, BehaviorService } from 'app/_services';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-trust-money',
  templateUrl: './trust-money.component.html',
  styleUrls: ['./trust-money.component.scss'],
  animations: fuseAnimations
})
export class TrustMoneyComponent implements OnInit {
  @Input() errorWarningData: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoadingResults: boolean = false;
  isDisplay: boolean = false;
  pageSize: any;
  displayedColumns: any;
  tempColobj: any;
  ColumnsObj = [];
  filterData: any = [];
  TrustMoneyData: any = [];
  TrustMoneyForm: FormGroup;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  highlightedRows: any;
  forHideShowDateRangePicker: string;
  constructor(private _mainAPiServiceService: MainAPiServiceService,
    private toastr: ToastrService, private TableColumnsService: TableColumnsService,
    public datepipe: DatePipe,
    private _formBuilder: FormBuilder,
    private behaviorService: BehaviorService,
    private dialog: MatDialog, ) {


  }

  ngOnInit() {
    this.behaviorService.resizeTableForAllView();
    const behaviorService = this.behaviorService;
    $(window).resize(function () {
      behaviorService.resizeTableForAllView();
    });
    this.getTableFilter();
    this.TrustMoneyForm = this._formBuilder.group({
      DateRangeSelect: [''],
      DateRange: [''],
      LASTRECONCILIATIONBALANCE:[''],
      LASTRECONCILIATIONDATE:[''],
      TRUSTBALANCE:['']

    });
    let currentDate = new Date();
    let updatecurrentDate = new Date();
    // this.DateType = 'Incurred Date';
    this.forHideShowDateRangePicker = "hide";
    updatecurrentDate.setDate(updatecurrentDate.getDate() - 30);
    let end = this.datepipe.transform(currentDate, 'dd/MM/yyyy');
    let begin = this.datepipe.transform(updatecurrentDate, 'dd/MM/yyyy');

    this.filterData = {
      'TRANSACTIONSTARTDATE': begin, 'TRANSACTIONENDDATE': end, 'Search': ''
    }
    if (!localStorage.getItem("trustMoney_filter")) {
      localStorage.setItem('trustMoney_filter', JSON.stringify(this.filterData));
    } else {
      this.filterData = JSON.parse(localStorage.getItem("trustMoney_filter"))
    }
    let STARTDATE = this.filterData.TRANSACTIONSTARTDATE.split("/");
    let sendSTARTDATE = new Date(STARTDATE[1] + '/' + STARTDATE[0] + '/' + STARTDATE[2]);
    let ENDDATE = this.filterData.TRANSACTIONENDDATE.split("/");
    let SensENDDATE = new Date(ENDDATE[1] + '/' + ENDDATE[0] + '/' + ENDDATE[2]);
    this.TrustMoneyForm.controls['DateRange'].setValue({ begin: sendSTARTDATE, end: SensENDDATE });

    const date1 = sendSTARTDATE;
    const date2 = SensENDDATE;
    const date3 = new Date();
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const date4 = this.datepipe.transform(date2, 'dd/MM/yyyy');
    const date5 = this.datepipe.transform(date3, 'dd/MM/yyyy');
    if (diffDays == 0) {
      this.TrustMoneyForm.controls['DateRangeSelect'].setValue("Today");
    } else if (diffDays == 7) {
      this.TrustMoneyForm.controls['DateRangeSelect'].setValue("Last 7 days");
    } else if (diffDays == 30) {
      this.TrustMoneyForm.controls['DateRangeSelect'].setValue("Last 30 days");
    } else if (diffDays == 90) {
      this.TrustMoneyForm.controls['DateRangeSelect'].setValue("Last 90 days");
    }
    else {
      this.forHideShowDateRangePicker = "show";
      this.TrustMoneyForm.controls['DateRangeSelect'].setValue("Date Range");
    }
    this.LoadData(this.filterData);

  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }

  selectDayRange(val) {
    this.filterData = JSON.parse(localStorage.getItem("trustMoney_filter"));
    let currentDate = new Date()
    let updatecurrentDate = new Date();
    let begin = this.datepipe.transform(currentDate, 'dd/MM/yyyy');
    if (val == "Last 7 days") {
      updatecurrentDate.setDate(updatecurrentDate.getDate() - 7);
      this.forHideShowDateRangePicker = "hide";
      this.TrustMoneyForm.controls['DateRange'].setValue({ begin: updatecurrentDate, end: currentDate });
    }
    else if (val == "Today") {
      // updatecurrentDate.setDate(updatecurrentDate.getDate() - 30);
      this.forHideShowDateRangePicker = "hide";
      this.TrustMoneyForm.controls['DateRange'].setValue({ begin: currentDate, end: currentDate });
    }
    else if (val == "Last 30 days") {
      updatecurrentDate.setDate(updatecurrentDate.getDate() - 30);
      this.forHideShowDateRangePicker = "hide";
      this.TrustMoneyForm.controls['DateRange'].setValue({ begin: updatecurrentDate, end: currentDate });
    }
    else if (val == "Last 90 days") {
      updatecurrentDate.setDate(updatecurrentDate.getDate() - 90);
      this.forHideShowDateRangePicker = "hide";
      this.TrustMoneyForm.controls['DateRange'].setValue({ begin: updatecurrentDate, end: currentDate });
    } else if (val == "Date Range") {
      this.forHideShowDateRangePicker = "show";
    }
    let end = this.datepipe.transform(updatecurrentDate, 'dd/MM/yyyy');
    this.CommonDatefun(begin, end);
    this.LoadData(this.filterData);
  }
  CommonDatefun(begin, end) {
    this.filterData = JSON.parse(localStorage.getItem("trustMoney_filter"));

    this.filterData.TRANSACTIONSTARTDATE = end;
    this.filterData.TRANSACTIONENDDATE = begin;

    localStorage.setItem('trustMoney_filter', JSON.stringify(this.filterData));
  }
  DateRange1(type: string, event: MatDatepickerInputEvent<Date>) {

    let begin = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
    let end = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');
    this.CommonDatefun(end, begin);
    this.filterData = JSON.parse(localStorage.getItem("trustMoney_filter"));
    this.LoadData(this.filterData);
  }
  DateRange(a, b) {
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('trust money', '').subscribe(response => {
      console.log(response);
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
  openDialog() {
    console.log("click open dialoge ");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'trust money', 'list': '' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        this.tempColobj = result.tempColobj;
        if (!result.columObj) {
          this.TrustMoneyData = new MatTableDataSource([]);
          this.TrustMoneyData.paginator = this.paginator;
          this.TrustMoneyData.sort = this.sort;
          this.isDisplay = true;
        } else {
          this.filterData = JSON.parse(localStorage.getItem("trustMoney_filter"));
          this.LoadData(this.filterData);
        }
      }
    });
  }
  LoadData(data) {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(data, 'GetTrustTransaction').subscribe(res => {
      console.log(res);
      if (res.CODE == 200 && res.STATUS == "success") {
        this.TrustMoneyForm.controls['LASTRECONCILIATIONBALANCE'].setValue(res.DATA.LASTRECONCILIATIONBALANCE);
        this.TrustMoneyForm.controls['LASTRECONCILIATIONDATE'].setValue(res.DATA.LASTRECONCILIATIONDATE);
        this.TrustMoneyForm.controls['TRUSTBALANCE'].setValue(res.DATA.TRUSTBALANCE);
        if (res.DATA.TRUSTTRANSACTIONS[0]) {
          this.isDisplay = false;
          this.RowClick(res.DATA.TRUSTTRANSACTIONS[0]);
          this.highlightedRows = res.DATA.TRUSTTRANSACTIONS[0].TRUSTTRANSACTIONGUID;
          // this.behaviorService.TaskData(res.DATA.TASKS[0]);
        } else {
          this.isDisplay = true;
        }
        this.TrustMoneyData = new MatTableDataSource(res.DATA.TRUSTTRANSACTIONS);
        this.TrustMoneyData.sort = this.sort;
        this.TrustMoneyData.paginator = this.paginator;
        this.isLoadingResults = false;
      } else if (res.CODE == 406 && res.MESSAGE == "Permission denied") {
        this.TrustMoneyData = new MatTableDataSource([]);
        this.TrustMoneyData.paginator = this.paginator;
        this.TrustMoneyData.sort = this.sort;
        this.isLoadingResults = false;
        this.isDisplay = true;
      }
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  RowClick(row) {
    console.log(row);
  }
  trustMoneyRefersh() {
    this.filterData = JSON.parse(localStorage.getItem("trustMoney_filter"))
    this.LoadData(this.filterData);
  }
}
