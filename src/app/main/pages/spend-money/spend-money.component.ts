import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SpendmoneyService, TableColumnsService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource, MatPaginator, MatDialogConfig, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import * as $ from 'jquery';
import { MatSort } from '@angular/material';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-spend-money',
  templateUrl: './spend-money.component.html',
  styleUrls: ['./spend-money.component.scss'],
  animations: fuseAnimations
})
export class SpendMoneyComponent implements OnInit {
  SepndMoneyForm:FormGroup;
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
  filterData:any=[];
  filterDataforAllField:any=[];
  forHideShowDateRangePicker: string;
  DateType: any;

  constructor(
    private TableColumnsService: TableColumnsService,
    private SpendmoneyService: SpendmoneyService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    public datepipe: DatePipe,
  ) {
    localStorage.removeItem('spendMoney_data');
    this.getTableFilter();
  }
  ngOnInit() {
this.SepndMoneyForm=this._formBuilder.group({
  MainClass:[''],
  DateRange:[''],
  DateType:[''],
  DayRange:[''],
  searchFilter:['']
})

    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 130)) + 'px');
    this.forFirstTimeFilter();
  }

  forFirstTimeFilter(){
    let currentDate=new Date();
    let updatecurrentDate= new Date();
    this.DateType='Incurred Date';
    this.forHideShowDateRangePicker="hide";
    updatecurrentDate.setDate(updatecurrentDate.getDate() + 30);
    let begin = this.datepipe.transform(currentDate, 'dd/MM/yyyy');
    let end = this.datepipe.transform(updatecurrentDate, 'dd/MM/yyyy');
    this.filterData={'EXPENDITURECLASS':"Expense",'INCURREDSTARTDATE':begin,'INCURREDENDDATE':end,"PAIDSTARTDATE":'',
    'PAIDENDDATE':'','SearchString':''}
    // this.filterData={'EXPENDITURECLASS':"Expense",'INCURREDSTARTDATE':'','INCURREDENDDATE':'',"PAIDSTARTDATE":'',
    // 'PAIDENDDATE':'','SearchString':''}
    this.SepndMoneyForm.controls['MainClass'].setValue("Expense"); 
    this.SepndMoneyForm.controls['DateType'].setValue("Incurred Date");
    this.SepndMoneyForm.controls['DateRange'].setValue({ begin: currentDate, end: updatecurrentDate }); 
    this.SepndMoneyForm.controls['DayRange'].setValue("Last 30 days"); 
      // let potData = { 'ITEMSTARTDATE': new Date() };
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
    console.log(potData);
    this.isLoadingResults = true;
    this.SpendmoneyService.SpendmoneyListData(potData).subscribe(response => {
      console.log(response);
      if (response.CODE == 200 && response.STATUS == "success") {
        console.log("called");
        this.Spendmoneydata = new MatTableDataSource(response.DATA.EXPENDITURES)
        this.Spendmoneydata.paginator = this.paginator;
        if (response.DATA.EXPENDITURES[0]) {
          localStorage.setItem('spendMoney_data', JSON.stringify(response.DATA.EXPENDITURES[0]));
          this.highlightedRows = response.DATA.EXPENDITURES[0].EXPENDITUREGUID;
          this.currentMatterData = response.DATA.EXPENDITURES[0].EXPENDITUREGUID;
        }else{
          // this.toastr.error("No Data Selected");
        }

      }
      this.isLoadingResults = false;
    }, error => {
      this.toastr.error(error);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }



  editmatter(Row: any) {
    this.currentMatterData = Row;
    console.log(Row);
    localStorage.setItem('spendMoney_data', JSON.stringify(Row));
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'time and billing', 'list': '' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      //   this.displayedColumns = result.columObj;
      //   this.ColumnsObj = result.columnameObj;
      //   this.tempColobj = result.tempColobj;
      //   if (!result.columObj) {
      //     this.MatterInvoicesdata = new MatTableDataSource([]);
      //     this.MatterInvoicesdata.paginator = this.paginator;
      //     this.MatterInvoicesdata.sort = this.sort;
      //   } else {
      //     this.loadData();
      //   }
      // }
    });
  }
  onSearch(searchFilter: any) {
    if (searchFilter['key'] === "Enter" || searchFilter == 'Enter') {

      this.filterData.SearchString=this.f.searchFilter.value;
      this.loadData(this.filterData);
      // let filterVal = { 'Active': '', 'SearchString': this.f.searchFilter.value, 'FeeEarner': '', 'UninvoicedWork': '' };
      // if (!localStorage.getItem('matter_filter')) {
      //   // localStorage.setItem('matter_filter', JSON.stringify(filterVal));
      // } else {
      //   filterVal = JSON.parse(localStorage.getItem('matter_filter'));
      //   filterVal.SearchString = this.f.searchFilter.value;
      //   // localStorage.setItem('matter_filter', JSON.stringify(filterVal));
      // }
      // this.child.getMatterList(filterVal);
    }

  }
  SpendClassChange(val) {
    if(val=="all"){
      this.filterDataforAllField={"EXPENDITURECLASS":val};
      this.loadData(this.filterDataforAllField);
    }else{
      this.filterData.EXPENDITURECLASS=val;
      this.loadData(this.filterData);
    }
  
   

  }
  SpendDateClassChnage(val){
    this.DateType=val;
    let begin = this.datepipe.transform(this.f.DateRange.value.begin, 'dd/MM/yyyy');
    let end = this.datepipe.transform(this.f.DateRange.value.end, 'dd/MM/yyyy');
    this.CommonDatefun(begin,end);
    this.loadData(this.filterData);
  }
  get f() {
    //console.log(this.contactForm);
    return this.SepndMoneyForm.controls;
  }
  DateRange1(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
    let end = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');
    this.CommonDatefun(begin,end)
    this.loadData(this.filterData);
   
  }
  DateRange(a,b){

  }
selectDayRange(val){
let currentDate = new Date()
let updatecurrentDate = new Date();
let begin = this.datepipe.transform(currentDate, 'dd/MM/yyyy');

if(val=="Last 7 days"){
  updatecurrentDate.setDate(updatecurrentDate.getDate() + 7);
  this.forHideShowDateRangePicker="hide";
  this.SepndMoneyForm.controls['DateRange'].setValue({ begin: currentDate, end: updatecurrentDate });
}
else if(val=="Today"){
  updatecurrentDate.setDate(updatecurrentDate.getDate() + 30);
  this.forHideShowDateRangePicker="hide";
  this.SepndMoneyForm.controls['DateRange'].setValue({ begin: currentDate, end: currentDate });
}
else if(val=="Last 30 days"){
  updatecurrentDate.setDate(updatecurrentDate.getDate() + 30);
  this.forHideShowDateRangePicker="hide";
  this.SepndMoneyForm.controls['DateRange'].setValue({ begin: currentDate, end: updatecurrentDate });
}
else if(val=="Last 90 days"){
  updatecurrentDate.setDate(updatecurrentDate.getDate() + 90);
  this.forHideShowDateRangePicker="hide";
  this.SepndMoneyForm.controls['DateRange'].setValue({ begin: currentDate, end: updatecurrentDate });
}else if(val=="Date Range"){
this.forHideShowDateRangePicker="show";

}  
let end = this.datepipe.transform(updatecurrentDate, 'dd/MM/yyyy');
this.CommonDatefun(begin,end);
 this.loadData(this.filterData); 
 
}
  CommonDatefun(begin,end){
    if( this.DateType=='Incurred Date'){
      this.filterData.INCURREDSTARTDATE=begin;
      this.filterData.INCURREDENDDATE=end;
      this.filterData.PAIDSTARTDATE="";
      this.filterData.PAIDENDDATE="";
    }else if(this.DateType=="Date Paid"){
      this.filterData.INCURREDSTARTDATE="";
      this.filterData.INCURREDENDDATE="";
      this.filterData.PAIDSTARTDATE=begin;
      this.filterData.PAIDENDDATE=end;
    }
  }
}

