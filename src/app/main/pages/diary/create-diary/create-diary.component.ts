import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MainAPiServiceService, TimersService, TableColumnsService, BehaviorService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatterDialogComponent } from '../../time-entries/matter-dialog/matter-dialog.component';
import * as moment from 'moment';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-create-diary',
  templateUrl: './create-diary.component.html',
  styleUrls: ['./create-diary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CreateDiaryComponent implements OnInit {
  CreateTimeEnrtyForm: FormGroup;
  isLoadingResults: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  tempColobj: any;
  ColumnsObj = [];
  timeStops: any = [];
  userList: any;
  SendCreateTimeEntries: any = [];
  ActivityList: any;
  confirmDialogRef: any;
  LookupsList: any;
  createDiaryForm: any = {}
  CreateTimeEntriesArray: any = [];
  currenbtMatter = JSON.parse(localStorage.getItem('set_active_matters'));
  calculateData: any = { MatterGuid: '', QuantityType: '', Quantity: '', FeeEarner: '', FeeType: '' };
  // createDiaryForm={
  //   'Date Range':'','Date':'','Item':''
  // }
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  // displayedColumns: string[];
  selection = new SelectionModel<any>(true, []);
  TimerDataFordiary: any = [];
  highlightedRows: any;
  displayedColumns: string[] = ['select', 'APPOINTMENTDATE', 'APPOINTMENTTIME', 'DURATION', 'MATTERSHORTNAME',
    'APPOINTMENTTYPE', 'NOTE', 'PRICE', 'PRICEINCGST', 'GST'];
  pageSize: string;
  isDisplay: boolean = false;
  CreateDiaryArray: any = [];
  INDEX: any;
  filterData: any = [];
  errorWarningData: any = { "Error": [], 'Warning': [] };
  forHideShowDateRangePicker: string;
  callApi: string;
  SendINDEX: any;
  constructor(private _mainAPiServiceService: MainAPiServiceService,
    private Timersservice: TimersService,
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private behaviorService: BehaviorService,
    private TableColumnsService: TableColumnsService,
    public _matDialog: MatDialog,
    private toastr: ToastrService, ) {
    // this.getTableFilter();
  }

  ngOnInit() {
    this.CreateTimeEnrtyForm = this.fb.group({
      matterautoVal: [''],
      MATTERGUID: [''],
      ADDITIONALTEXT: [''],


      PRICEINCGST: [''],
      PRICE: [''],
      QUANTITYTYPE: [''],
      QUANTITY: [''],
      FEEEARNER: [''],
      ITEMTIME: [''],
      ITEMDATETEXT: [''],
      ITEMDATE: [''],

      DateRange: [''],
      Date: [''],
      Item: [''],
      dlpdrop: [''],
    });
    let currentDate = new Date();
    let updatecurrentDate = new Date();
    updatecurrentDate.setDate(updatecurrentDate.getDate() - 30);
    this.forHideShowDateRangePicker = "hide";
    let end = this.datepipe.transform(currentDate, 'dd/MM/yyyy');
    let begin = this.datepipe.transform(updatecurrentDate, 'dd/MM/yyyy');

    this.filterData = {
      'TYPEFILTER': "All", 'DATESTART': begin, 'DATEEND': end, "SHOWWHAT": 'CREATE WIP',
      'Search': ''
    }
    if (!localStorage.getItem("Create_DiaryEntries_filter")) {
      localStorage.setItem('Create_DiaryEntries_filter', JSON.stringify(this.filterData));
    } else {
      this.filterData = JSON.parse(localStorage.getItem("Create_DiaryEntries_filter"))
    }

    let DATESTART = this.filterData.DATESTART.split("/");
    let sendDATESTART = new Date(DATESTART[1] + '/' + DATESTART[0] + '/' + DATESTART[2]);
    let DATEEND = this.filterData.DATEEND.split("/");
    let SensDATEEND = new Date(DATEEND[1] + '/' + DATEEND[0] + '/' + DATEEND[2]);
    this.CreateTimeEnrtyForm.controls['Date'].setValue({ begin: sendDATESTART, end: SensDATEEND });
    this.CreateTimeEnrtyForm.controls['Item'].setValue(this.filterData.TYPEFILTER);
    // let potData = { 'ITEMSTARTDATE': new Date() };
    const date1 = sendDATESTART;
    const date2 = SensDATEEND;
    const date3 = new Date();
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const date4 = this.datepipe.transform(date2, 'dd/MM/yyyy');
    const date5 = this.datepipe.transform(date3, 'dd/MM/yyyy');
    if (date4 === date5) {
      if (diffDays == 0) {
        this.CreateTimeEnrtyForm.controls['DateRange'].setValue("Today");
      } else if (diffDays == 7) {
        this.CreateTimeEnrtyForm.controls['DateRange'].setValue("Last 7 days");
      } else if (diffDays == 30) {
        this.CreateTimeEnrtyForm.controls['DateRange'].setValue("Last 30 days");
      } else if (diffDays == 90) {
        this.CreateTimeEnrtyForm.controls['DateRange'].setValue("Last 90 days");
      }
    } else {
      this.forHideShowDateRangePicker = "show";
      this.CreateTimeEnrtyForm.controls['DateRange'].setValue("Date Range");
    }

    // this.CreateTimeEnrtyForm.controls['DateRange'].setValue("Date Range");
    // this.CreateTimeEnrtyForm.controls['DateRange'].setValue("Date Range");
    // this.CreateTimeEnrtyForm.controls['DateRange'].setValue("Date Range");

    // this.CreateTimeEnrtyForm.controls['DateRange'].setValue("Date Range");
    // this.CreateTimeEnrtyForm.controls['DateRange'].setValue("Date Range");
    this.LoadData(this.filterData);
    this.Timersservice.GetUsers({}).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.userList = res.DATA.USERS;
      } else {
        this.userList = [];
      }
    }, err => {
      this.toastr.error(err);
    });
    this.ActivityList = [
      { 'ACTIVITYID': 'X', 'DESCRIPTION': 'hh:mm' }, { 'ACTIVITYID': 'H', 'DESCRIPTION': 'Hours' },
      { 'ACTIVITYID': 'M', 'DESCRIPTION': 'Minutes' }, { 'ACTIVITYID': 'D', 'DESCRIPTION': 'Days' },
      { 'ACTIVITYID': 'U', 'DESCRIPTION': 'Units' }, { 'ACTIVITYID': 'F', 'DESCRIPTION': 'Fixed' }
      // { 'ACTIVITYID': 'hh:mm', 'DESCRIPTION': 'hh:mm' }, { 'ACTIVITYID': 'Hours', 'DESCRIPTION': 'Hours' },
      // { 'ACTIVITYID': 'Minutes', 'DESCRIPTION': 'Minutes' }, { 'ACTIVITYID': 'Days', 'DESCRIPTION': 'Days' },
      // { 'ACTIVITYID': 'Units', 'DESCRIPTION': 'Units' }, { 'ACTIVITYID': 'Fixed', 'DESCRIPTION': 'Fixed' }
    ];
    this.Timersservice.GetLookupsData({}).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.LookupsList = res.DATA.LOOKUPS;
      } else {
        this.LookupsList = [];
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
    });
    this.calculateData.MatterGuid = this.currenbtMatter.MATTERGUID;
    this.calculateData.QuantityType = 'H';
    this.timeStops = this.getTimeStops('00:00', '23:30');

    // this.createDiaryForm.Date = ({ begin: new Date(), end: new Date() });
    // this.createDiaryForm.Search = "";
    // this.createDiaryForm.Item = 'All Items';
  }
  helloFunction() {
    // this.SendCreateTimeEntries = [];
    // console.log(this.selection.selected);
    // this.selection.selected.forEach(element => {
    //   console.log(element);
    //   this.SendCreateTimeEntries.push({
    //     ADDITIONALTEXT: "fhkdjsfhkds",
    //     PRICE: element.PRICE,
    //     PRICEINCGST: element.PRICEINCGST,
    //     ITEMDATE: element.APPOINTMENTDATE,
    //     ITEMTIME: element.APPOINTMENTTIME,
    //     MATTERGUID: element.MATTERGUID,
    //     FEEEARNER: element.FEEEARNERID,
    //     APPOINTMENTGUID: element.APPOINTMENTGUID,
    //     QUANTITY: element.QUANTITY,
    //     index: element.index
    //   });
    // });
    this.SendCreateTimeEntries = [];
  }
  isAllSelected() {
    if (this.TimerDataFordiary.length != 0) {
      const numSelected = this.selection.selected.length;
      const numRows = this.TimerDataFordiary.data.length;
      return numSelected === numRows;
    }

  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.TimerDataFordiary.data.forEach(row => this.selection.select(row));
    this.CreateDiaryArray.push(this.selection.selected);
  }
  checkboxLabel(row?: any): string {
    if (this.TimerDataFordiary.length != 0) {
      if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

  }
  LoadData(data) {
    this.TimerDataFordiary = [];
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(data, 'GetAppointment').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        response.DATA.APPOINTMENTS.forEach((element, index) => {
          element.index = index
        });
        this.TimerDataFordiary = new MatTableDataSource(response.DATA.APPOINTMENTS);
        this.TimerDataFordiary.paginator = this.paginator;
        this.TimerDataFordiary.sort = this.sort;


        if (response.DATA.APPOINTMENTS[0]) {
          // this.behaviorService.MainTimeEntryData(response.DATA.WORKITEMS[0]);
          this.isDisplay = false;
          // this.highlightedRows = response.DATA.APPOINTMENTS[0].APPOINTMENTGUID;
          // localStorage.setItem('edit_WORKITEMGUID', this.highlightedRows);
        } else {
          this.isDisplay = true;
        }
        try {
          this.TimerDataFordiary = new MatTableDataSource(response.DATA.APPOINTMENTS);
          this.TimerDataFordiary.paginator = this.paginator;
          this.TimerDataFordiary.sort = this.sort;
        } catch (error) {
        }
      }
      this.isLoadingResults = false;
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  public selectMatter() {
    const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.CreateTimeEnrtyForm.controls['MATTERGUID'].setValue(result.MATTERGUID);
        this.CreateTimeEnrtyForm.controls['matterautoVal'].setValue(result.SHORTNAME + ' : ' + result.MATTER);
        this.matterChange('MatterGuid', result.MATTERGUID);
        // this.commonSendArry();
        // this.SendCreateTimeEntries[this.INDEX].MATTERGUID = this.qf.MATTERGUID.value;
      }
    });
  }
  QuickDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.CreateTimeEnrtyForm.controls['ITEMDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
    this.CommonChagesArray();
    // this.commonSendArry();

  }
  getTimeStops(start, end) {
    var startTime = moment(start, 'hh:mm');
    var endTime = moment(end, 'hh:mm');
    if (endTime.isBefore(startTime)) {
      endTime.add(1, 'day');
    }
    var timeStops = [];
    while (startTime <= endTime) {
      timeStops.push(moment(startTime).format('hh:mm A'));
      startTime.add(30, 'minutes');
    }
    return timeStops;
  }
  calcPE() {
    this.CreateTimeEnrtyForm.controls['PRICEINCGST'].setValue((this.qf.PRICE.value * 1.1).toFixed(2));
    this.CommonChagesArray();
    // this.commonSendArry();
  }
  calcPI() {
    this.CreateTimeEnrtyForm.controls['PRICE'].setValue((this.qf.PRICEINCGST.value / 1.1).toFixed(2));
    this.CommonChagesArray();
    // this.commonSendArry();
  }
  matterChange(key: any, event: any) {
    if (key == "MatterGuid") {
      this.CreateTimeEnrtyForm.controls['MATTERGUID'].setValue(event);
      this.calculateData.MatterGuid = event;
    } else if (key == "FeeEarner") {
      this.calculateData.FeeEarner = event;
    } else if (key == "QuantityType") {
      switch (event) {
        case 'X': {
          this.calculateData.QuantityType = 'X';
          break;
        }
        case 'H': {
          this.calculateData.QuantityType = 'H';
          break;
        }
        case 'M': {
          this.calculateData.QuantityType = 'M';
          break;
        }
        case 'D': {
          this.calculateData.QuantityType = 'D';
          break;
        }
        case 'U': {
          this.calculateData.QuantityType = 'U';
          break;
        }
        case 'F': {
          this.calculateData.QuantityType = 'F';
          break;
        }
        default: {
          this.calculateData.FeeType = event;
          this.calculateData.QuantityType = 'F';
          break;
        }

      }
    }
    this.calculateData.Quantity = this.qf.QUANTITY.value;
    if (this.calculateData.MatterGuid != '' && this.calculateData.Quantity != '' && (this.calculateData.QuantityType != '' || this.calculateData.FeeType != '')) {
      this.isLoadingResults = true;
      this.Timersservice.calculateWorkItems(this.calculateData).subscribe(response => {
        if (response.CODE == 200 && response.STATUS == "success") {
          let CalcWorkItemCharge = response.DATA;
          this.CreateTimeEnrtyForm.controls['PRICE'].setValue(CalcWorkItemCharge.PRICE);
          this.CreateTimeEnrtyForm.controls['PRICEINCGST'].setValue(CalcWorkItemCharge.PRICEINCGST);
          this.isLoadingResults = false;
          this.CommonChagesArray();
          // this.commonSendArry();

        }
      }, err => {
        this.isLoadingResults = false;
        this.toastr.error(err);
      });
    }

  } get qf() {
    return this.CreateTimeEnrtyForm.controls;
  }
  timeChange() {
    this.CommonChagesArray();
    // this.commonSendArry();
  }
  DateRange1(type: string, event: MatDatepickerInputEvent<Date>) {

    let begin = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
    let end = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');
    this.CommonDatefun(end, begin);
    this.filterData = JSON.parse(localStorage.getItem("Create_DiaryEntries_filter"));
    this.LoadData(this.filterData);
    // this.CommonDatefun(end, begin);
    // this.filterData = JSON.parse(localStorage.getItem("spendmoney_filter"));
    // this.loadData(this.filterData);
  }
  DateRange(a, b) {
  }
  Rowclick(val, index) {
    this.INDEX = index;
    this.CreateTimeEnrtyForm.controls['PRICE'].setValue(val.PRICE);
    this.CreateTimeEnrtyForm.controls['PRICEINCGST'].setValue(val.PRICEINCGST);
    this.CreateTimeEnrtyForm.controls['matterautoVal'].setValue(val.MATTERSHORTNAME);
    this.CreateTimeEnrtyForm.controls['MATTERGUID'].setValue(val.MATTERGUID);
    let Date1 = val.APPOINTMENTDATE.split("/");
    let ShowDate = new Date(Date1[1] + '/' + Date1[0] + '/' + Date1[2]);
    this.CreateTimeEnrtyForm.controls['ITEMDATETEXT'].setValue(ShowDate);
    this.CreateTimeEnrtyForm.controls['ITEMDATE'].setValue(val.APPOINTMENTDATE);
    let ttyData = moment(val.APPOINTMENTTIME, 'hh:mm');
    this.CreateTimeEnrtyForm.controls['ITEMTIME'].setValue(moment(ttyData).format('hh:mm A'));
    // this.CreateTimeEnrtyForm.controls['ITEMTIME'].setValue(val.APPOINTMENTTIME);
    this.CreateTimeEnrtyForm.controls['FEEEARNER'].setValue(val.FEEEARNERID);
    this.CreateTimeEnrtyForm.controls['QUANTITY'].setValue(val.DURATION);
    this.CreateTimeEnrtyForm.controls['QUANTITYTYPE'].setValue(val.QUANTITYTYPE);
    this.CreateTimeEnrtyForm.controls['ADDITIONALTEXT'].setValue('');

    //chgange in array 




  }
  // commonSendArry() {
  //   console.log(this.SendINDEX);
  //   this.SendCreateTimeEntries[this.SendINDEX].PRICE = this.qf.PRICE.value;
  //   this.SendCreateTimeEntries[this.SendINDEX].PRICEINCGST = this.qf.PRICEINCGST.value;
  //   this.SendCreateTimeEntries[this.SendINDEX].MATTERGUID = this.qf.MATTERGUID.value;
  //   this.SendCreateTimeEntries[this.SendINDEX].ITEMDATE = this.qf.ITEMDATE.value;
  //   this.SendCreateTimeEntries[this.SendINDEX].ITEMTIME = this.qf.ITEMTIME.value;
  //   this.SendCreateTimeEntries[this.SendINDEX].FEEEARNER = this.qf.FEEEARNER.value;
  //   this.SendCreateTimeEntries[this.SendINDEX].QUANTITY = this.qf.QUANTITY.value;
  //   this.SendCreateTimeEntries[this.SendINDEX].index = this.INDEX;
  // }

  CommonChagesArray() {
    this.TimerDataFordiary.data[this.INDEX].PRICE = this.qf.PRICE.value;
    this.TimerDataFordiary.data[this.INDEX].PRICEINCGST = this.qf.PRICEINCGST.value;
    this.TimerDataFordiary.data[this.INDEX].APPOINTMENTDATE = this.qf.ITEMDATE.value;
    this.TimerDataFordiary.data[this.INDEX].MATTERGUID = this.qf.MATTERGUID.value;
    this.TimerDataFordiary.data[this.INDEX].MATTERSHORTNAME = this.qf.matterautoVal.value;
    // this.TimerDataFordiary[this.INDEX].ITEMDATE=this.qf.ITEMDATE.value;
    this.TimerDataFordiary.data[this.INDEX].APPOINTMENTTIME = this.qf.ITEMTIME.value;
    this.TimerDataFordiary.data[this.INDEX].FEEEARNERID = this.qf.FEEEARNER.value;
    this.TimerDataFordiary.data[this.INDEX].DURATION = this.qf.QUANTITY.value;

    this.TimerDataFordiary.data[this.INDEX].QUANTITYTYPE = this.qf.QUANTITYTYPE.value;
    // this.TimerDataFordiary[this.INDEX].index = this.INDEX;
  }

  CheckboxClick() {

  }
  checkMatterIsvalid() {
    let isValid = true;
    this.selection.selected.forEach((element, index) => {
      if (element.MATTERGUID == '') {
        // this.SendINDEX = index;
        this.highlightedRows = element.index;
        this.INDEX = element.index;
        this.Rowclick(this.TimerDataFordiary.data[element.index], element.index)
        let tempError: any = this.errorWarningData.Error;
        tempError['MATTERGUID'] = {};
        this.errorWarningData.Error = tempError;
        isValid = false;
      }
    });
    return isValid;
  }
  saveCreateDiary() {
    if (!this.checkMatterIsvalid()) {
      this.toastr.error('Please Select Matter For Highlited Row');
    } else {
      this.SendCreateTimeEntries = [];
      this.selection.selected.forEach(element => {
        this.SendCreateTimeEntries.push({
          ADDITIONALTEXT: "fhkdjsfhkds",
          PRICE: element.PRICE,
          PRICEINCGST: element.PRICEINCGST,
          ITEMDATE: element.APPOINTMENTDATE,
          ITEMTIME: element.APPOINTMENTTIME,
          MATTERGUID: element.MATTERGUID,
          FEEEARNER: element.FEEEARNERID,
          APPOINTMENTGUID: element.APPOINTMENTGUID,
          QUANTITY: element.QUANTITY,

        });
      });
      let details = { MultiRecord: 1, FormAction: "insert", VALIDATEONLY: true, DATA: this.SendCreateTimeEntries };
      this._mainAPiServiceService.getSetData(details, 'SetWorkItems').subscribe(response => {
        //array empty of save item
        if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
          this.checkValidation(response.DATA.VALIDATIONS, details);
        } else if (response.CODE == 451 && response.STATUS == 'warning') {
          this.checkValidation(response.DATA.VALIDATIONS, details);
        } else if (response.CODE == 450 && response.STATUS == 'error') {
          this.checkValidation(response.DATA.VALIDATIONS, details);
        } else if (response.MESSAGE == 'Not logged in') {

        } else {

        }

      }, error => {
        this.toastr.error(error);
      });
    }

  }
  checkValidation(bodyData: any, details: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'NO') {
        errorData.push(value.ERRORDESCRIPTION);
        tempError[value.FIELDNAME] = value;
      } else if (value.VALUEVALID == 'WARNING') {
        warningData.push(value.ERRORDESCRIPTION);
        tempWarning[value.FIELDNAME] = value;
      }
    });
    this.errorWarningData = { "Error": tempError, 'warning': tempWarning };
    if (Object.keys(errorData).length != 0) {
      this.toastr.error(errorData);

    } else if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {

          this.SaveCreateDiaryData(details);
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.SaveCreateDiaryData(details);

    }
  }
  SaveCreateDiaryData(data: any) {
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetWorkItems').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {

        this.toastr.success('save successfully');
        this.refreshCreateDiaryEntriesab();

      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.toastr.warning(response.MESSAGE);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.toastr.error(response.MESSAGE);
      } else if (response.MESSAGE == 'Not logged in') {

      }

    }, error => {
      this.toastr.error(error);
    });
  }

  onPaginateChange(page: any) {

  }
  selectDayRange(val) {
    this.filterData = JSON.parse(localStorage.getItem("spendmoney_filter"));
    let currentDate = new Date()
    let updatecurrentDate = new Date();
    let begin = this.datepipe.transform(currentDate, 'dd/MM/yyyy');
    if (val == "Last 7 days") {
      updatecurrentDate.setDate(updatecurrentDate.getDate() - 7);
      this.forHideShowDateRangePicker = "hide";
      this.CreateTimeEnrtyForm.controls['Date'].setValue({ begin: updatecurrentDate, end: currentDate });
    }
    else if (val == "Today") {
      // updatecurrentDate.setDate(updatecurrentDate.getDate() - 30);
      this.forHideShowDateRangePicker = "hide";
      this.CreateTimeEnrtyForm.controls['Date'].setValue({ begin: currentDate, end: currentDate });
    }
    else if (val == "Last 30 days") {
      updatecurrentDate.setDate(updatecurrentDate.getDate() - 30);
      this.forHideShowDateRangePicker = "hide";
      this.CreateTimeEnrtyForm.controls['Date'].setValue({ begin: updatecurrentDate, end: currentDate });
    }
    else if (val == "Last 90 days") {
      updatecurrentDate.setDate(updatecurrentDate.getDate() - 90);
      this.forHideShowDateRangePicker = "hide";
      this.CreateTimeEnrtyForm.controls['Date'].setValue({ begin: updatecurrentDate, end: currentDate });
    } else if (val == "Date Range") {
      this.forHideShowDateRangePicker = "show";
    }
    let end = this.datepipe.transform(updatecurrentDate, 'dd/MM/yyyy');
    this.CommonDatefun(begin, end);
    this.LoadData(this.filterData);

  }
  CommonDatefun(begin, end) {
    this.filterData = JSON.parse(localStorage.getItem("Create_DiaryEntries_filter"));

    this.filterData.DATESTART = end;
    this.filterData.DATEEND = begin;

    localStorage.setItem('Create_DiaryEntries_filter', JSON.stringify(this.filterData));
  }
  ItemChange(val) {
    this.filterData = JSON.parse(localStorage.getItem("Create_DiaryEntries_filter"));
    this.filterData.TYPEFILTER = val;
    localStorage.setItem('v', JSON.stringify(this.filterData));
    this.LoadData(this.filterData);


  }
  refreshCreateDiaryEntriesab() {
    this.filterData = JSON.parse(localStorage.getItem("Create_DiaryEntries_filter"));
    this.LoadData(this.filterData);
  }
  FilterSearch(filterValue) {
    this.TimerDataFordiary.filter = filterValue;

  }


}
