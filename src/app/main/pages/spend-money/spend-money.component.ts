import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TableColumnsService, MainAPiServiceService, BehaviorService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource, MatPaginator, MatDialogConfig, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import * as $ from 'jquery';
import { MatSort } from '@angular/material';
import { DatePipe } from '@angular/common';
import { stringify } from '@angular/core/src/render3/util';

@Component({
  selector: 'app-spend-money',
  templateUrl: './spend-money.component.html',
  styleUrls: ['./spend-money.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SpendMoneyComponent implements OnInit {
  SepndMoneyForm: FormGroup;
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  isLoadingResults: boolean = false;
  ColumnsObj: any = [];
  tempColobj: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  highlightedRows: any;
  displayedColumns: string[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  currentMatterData: any;
  Spendmoneydata: any;
  pageSize: any;
  listingTotal: any = [];
  filterData: any = [];
  filterDataforAllField: any = [];
  forHideShowDateRangePicker: string;
  DateType: any;
  whichtypedate: any;
  whichtypedate2: any;
  whichtypedate3: any;
  whichtypedate4: any;

  constructor(
    private TableColumnsService: TableColumnsService,
    private _mainAPiServiceService: MainAPiServiceService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    public datepipe: DatePipe,
    public behaviorService: BehaviorService
  ) {
    this.getTableFilter();
  }
  ngOnInit() {
    this.SepndMoneyForm = this._formBuilder.group({
      MainClass: [''],
      DateRange: [''],
      DateType: [''],
      DayRange: [''],
      searchFilter: [''],
      TOTALINCGST: [''],
      TOTALEXGST: [''],
    })

    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 130)) + 'px');
    this.forFirstTimeFilter();
  }

  forFirstTimeFilter() {

    let currentDate = new Date();
    let updatecurrentDate = new Date();
    this.DateType = 'Incurred Date';
    this.forHideShowDateRangePicker = "hide";
    updatecurrentDate.setDate(updatecurrentDate.getDate() - 30);
    let end = this.datepipe.transform(currentDate, 'dd/MM/yyyy');
    let begin = this.datepipe.transform(updatecurrentDate, 'dd/MM/yyyy');


    this.filterData = {
      'EXPENDITURECLASS': " ", 'INCURREDSTARTDATE': begin, 'INCURREDENDDATE': end, "PAIDSTARTDATE": '',
      'PAIDENDDATE': '', 'Search': ''
    }
    if (!localStorage.getItem("spendmoney_filter")) {
      localStorage.setItem('spendmoney_filter', JSON.stringify(this.filterData));
    } else {
      this.filterData = JSON.parse(localStorage.getItem("spendmoney_filter"))
    }
    this.SepndMoneyForm.controls['MainClass'].setValue(this.filterData.EXPENDITURECLASS);

    if (this.filterData.PAIDSTARTDATE == '' || this.filterData.PAIDENDDATE == '') {
      this.whichtypedate = this.filterData.INCURREDSTARTDATE;
      this.whichtypedate2 = this.filterData.INCURREDENDDATE;
      this.SepndMoneyForm.controls['DateType'].setValue('Incurred Date');
    } else {
      this.whichtypedate = this.filterData.PAIDSTARTDATE;
      this.whichtypedate2 = this.filterData.PAIDENDDATE;
      this.SepndMoneyForm.controls['DateType'].setValue('Date Paid');
    }
    let INCURREDSTARTDATE = this.whichtypedate.split("/");
    let sendINCURREDSTARTDATE = new Date(INCURREDSTARTDATE[1] + '/' + INCURREDSTARTDATE[0] + '/' + INCURREDSTARTDATE[2]);
    let INCURREDENDDATE = this.whichtypedate2.split("/");
    let SensINCURREDENDDATE = new Date(INCURREDENDDATE[1] + '/' + INCURREDENDDATE[0] + '/' + INCURREDENDDATE[2]);
    this.SepndMoneyForm.controls['DateRange'].setValue({ begin: sendINCURREDSTARTDATE, end: SensINCURREDENDDATE });
    // let potData = { 'ITEMSTARTDATE': new Date() };
    const date1 = sendINCURREDSTARTDATE;
    const date2 = SensINCURREDENDDATE;
    const date3 = new Date();
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const date4 = this.datepipe.transform(date2, 'dd/MM/yyyy');
    const date5 = this.datepipe.transform(date3, 'dd/MM/yyyy');
    if (date4 === date5) {
      if (diffDays == 0) {
        this.SepndMoneyForm.controls['DayRange'].setValue("Today");
      } else if (diffDays == 7) {
        this.SepndMoneyForm.controls['DayRange'].setValue("Last 7 days");
      } else if (diffDays == 30) {
        this.SepndMoneyForm.controls['DayRange'].setValue("Last 30 days");
      } else if (diffDays == 90) {
        this.SepndMoneyForm.controls['DayRange'].setValue("Last 90 days");
      }
    } else {
      this.forHideShowDateRangePicker = "show";
      this.SepndMoneyForm.controls['DayRange'].setValue("Date Range");
    }


    this.loadData(this.filterData);
  }

  getTableFilter() {
    this.TableColumnsService.getTableFilter('spend money', '').subscribe(response => {
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
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }

  loadData(potData) {
    this.Spendmoneydata = [];
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(potData, 'GetExpenditure').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.listingTotal = response.DATA;
        this.Spendmoneydata = new MatTableDataSource(response.DATA.EXPENDITURES);
        this.Spendmoneydata.paginator = this.paginator;
        this.Spendmoneydata.sort = this.sort;
        if (response.DATA.EXPENDITURES[0]) {
          this.behaviorService.SpendMoneyData(response.DATA.EXPENDITURES[0]);
          this.highlightedRows = response.DATA.EXPENDITURES[0].EXPENDITUREGUID;
          this.currentMatterData = response.DATA.EXPENDITURES[0].EXPENDITUREGUID;
        } else {
          // this.toastr.error("No Data Selected");
        }
      }
      this.isLoadingResults = false;
    }, error => {
      this.toastr.error(error);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  refreshSpendMoneyTab() {
    this.filterData = JSON.parse(localStorage.getItem("spendmoney_filter"));
    this.loadData(this.filterData);
  }
  editmatter(Row: any) {
    this.currentMatterData = Row;
    this.behaviorService.SpendMoneyData(Row);
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'spend money', 'list': '' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tempColobj = result.tempColobj;
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        if (!result.columObj) {
          this.Spendmoneydata = new MatTableDataSource([]);
          this.Spendmoneydata.paginator = this.paginator;
          this.Spendmoneydata.sort = this.sort;
        } else {
          this.filterData = JSON.parse(localStorage.getItem("spendmoney_filter"));
          this.loadData(this.filterData);
        }
      }
    });
  }
  onSearch(searchFilter: any) {
    this.filterData = JSON.parse(localStorage.getItem("spendmoney_filter"));
    if (searchFilter['key'] === "Enter" || searchFilter == 'Enter') {
      
      this.filterData.Search = this.f.searchFilter.value;
      localStorage.setItem('spendmoney_filter', JSON.stringify(this.filterData));
      this.loadData(this.filterData);
     
    }
  }
  SpendClassChange(val) {
    this.filterData = JSON.parse(localStorage.getItem("spendmoney_filter"));
    this.filterData.EXPENDITURECLASS = val;
    localStorage.setItem('spendmoney_filter', JSON.stringify(this.filterData));
    this.loadData(this.filterData);
    // if(val=="all"){
    //   this.filterDataforAllField={"EXPENDITURECLASS":val};
    //   this.loadData(this.filterDataforAllField);
    // }else{
    //   this.filterData.EXPENDITURECLASS=val;
    //  
    // }
  }
  SpendDateClassChnage(val) {
    this.DateType = val;
    let begin = this.datepipe.transform(this.f.DateRange.value.begin, 'dd/MM/yyyy');
    let end = this.datepipe.transform(this.f.DateRange.value.end, 'dd/MM/yyyy');
    this.CommonDatefun(end, begin);
    this.filterData = JSON.parse(localStorage.getItem("spendmoney_filter"));
    this.loadData(this.filterData);
  }
  get f() {
    //console.log(this.contactForm);
    return this.SepndMoneyForm.controls;
  }
  DateRange1(type: string, event: MatDatepickerInputEvent<Date>) {

    let begin = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
    let end = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');
    this.CommonDatefun(end, begin);
    this.filterData = JSON.parse(localStorage.getItem("spendmoney_filter"));
    this.loadData(this.filterData);
  }
  DateRange(a, b) {
  }
  selectDayRange(val) {
    this.filterData = JSON.parse(localStorage.getItem("spendmoney_filter"));
    let currentDate = new Date()
    let updatecurrentDate = new Date();
    let begin = this.datepipe.transform(currentDate, 'dd/MM/yyyy');
    if (val == "Last 7 days") {
      updatecurrentDate.setDate(updatecurrentDate.getDate() - 7);
      this.forHideShowDateRangePicker = "hide";
      this.SepndMoneyForm.controls['DateRange'].setValue({ begin: updatecurrentDate, end: currentDate });
    }
    else if (val == "Today") {
      // updatecurrentDate.setDate(updatecurrentDate.getDate() - 30);
      this.forHideShowDateRangePicker = "hide";
      this.SepndMoneyForm.controls['DateRange'].setValue({ begin: currentDate, end: currentDate });
    }
    else if (val == "Last 30 days") {
      updatecurrentDate.setDate(updatecurrentDate.getDate() - 30);
      this.forHideShowDateRangePicker = "hide";
      this.SepndMoneyForm.controls['DateRange'].setValue({ begin: updatecurrentDate, end: currentDate });
    }
    else if (val == "Last 90 days") {
      updatecurrentDate.setDate(updatecurrentDate.getDate() - 90);
      this.forHideShowDateRangePicker = "hide";
      this.SepndMoneyForm.controls['DateRange'].setValue({ begin: updatecurrentDate, end: currentDate });
    } else if (val == "Date Range") {
      this.forHideShowDateRangePicker = "show";
    }
    let end = this.datepipe.transform(updatecurrentDate, 'dd/MM/yyyy');
    this.CommonDatefun(begin, end);
    this.loadData(this.filterData);
  }
  CommonDatefun(begin, end) {
    this.filterData = JSON.parse(localStorage.getItem("spendmoney_filter"));
    if (this.DateType == 'Incurred Date') {
      this.filterData.INCURREDSTARTDATE = end;
      this.filterData.INCURREDENDDATE = begin;
      this.filterData.PAIDSTARTDATE = "";
      this.filterData.PAIDENDDATE = "";
    } else if (this.DateType == "Date Paid") {
      this.filterData.INCURREDSTARTDATE = "";
      this.filterData.INCURREDENDDATE = "";
      this.filterData.PAIDSTARTDATE = end;
      this.filterData.PAIDENDDATE = begin;
    }
    localStorage.setItem('spendmoney_filter', JSON.stringify(this.filterData));
  }
}

