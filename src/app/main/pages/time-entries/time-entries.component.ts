import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig, MatDatepickerInputEvent, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from '../../sorting-dialog/sorting-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimersService, TableColumnsService, BehaviorService } from '../../../_services';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common'
import * as $ from 'jquery';
import { MatSort } from '@angular/material';
import { MatterDialogComponent } from './matter-dialog/matter-dialog.component';
import * as moment from 'moment';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { round } from 'lodash';


@Component({
  selector: 'app-time-entries',
  templateUrl: './time-entries.component.html',
  styleUrls: ['./time-entries.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TimeEntriesComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  TimeEnrtyForm: FormGroup;
  successMsg: any;
  quickTimeEntriesForm: FormGroup;
  ActiveTab: any;
  pageSize: any;
  errorWarningData: any = {};
  isLoadingResults: boolean = false;
  displayedColumns: string[];
  ColumnsObj = [];
  timeStops: any = [];
  userList: any;
  LookupsList: any;
  TimerData;
  TimerDropData: any;
  isShowDrop: boolean;
  ActivityList: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  lastFilter: any;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  tempColobj: any;
  isspiner: boolean = false;
  isDisplay: boolean = false;
  calculateData: any = { MatterGuid: '', QuantityType: '', Quantity: '', FeeEarner: '', FeeType: '' };
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private Timersservice: TimersService,
    public datepipe: DatePipe,
    private TableColumnsService: TableColumnsService,
    private behaviorService: BehaviorService,
    public MatDialog: MatDialog,
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
        // var dt = new Date();
        // dt.setMonth(dt.getMonth() + 1);
        this.TimeEnrtyForm.controls['date'].setValue({ begin: new Date(), end: new Date() });
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
    this.behaviorService.resizeTableForAllView();
    const behaviorService = this.behaviorService;
    $(window).resize(function () {
      behaviorService.resizeTableForAllView();
    });
    this.behaviorService.ActiveSubMenu$.subscribe(result => { this.ActiveTab = result; });
    if (this.ActiveTab == 'quick-time-entries') {
      this.quickTimeEntriesForm = this.fb.group({
        matterautoVal: [''],
        MATTERGUID: [''],
        ITEMDATETEXT: [''],
        ITEMDATE: [''],
        PRICE: [''],
        PRICEINCGST: [''],
        INVOICEDATE: [this.datepipe.transform(new Date(), 'dd/MM/yyyy')],
        ADDITIONALTEXT: [''],
        QUANTITYTYPE: ['Hours'],
        QUANTITY: [''],
        FEEEARNER: [''],
        ITEMTIME: [''],
      });
      this.calculateData.QuantityType = 'H';
      this.timeStops = this.getTimeStops('00:00', '23:30');
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
        { 'ACTIVITYID': 'hh:mm', 'DESCRIPTION': 'hh:mm' }, { 'ACTIVITYID': 'Hours', 'DESCRIPTION': 'Hours' },
        { 'ACTIVITYID': 'Minutes', 'DESCRIPTION': 'Minutes' }, { 'ACTIVITYID': 'Days', 'DESCRIPTION': 'Days' },
        { 'ACTIVITYID': 'Units', 'DESCRIPTION': 'Units' }, { 'ACTIVITYID': 'Fixed', 'DESCRIPTION': 'Fixed' }
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
    }
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
  public selectMatter() {
    const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.quickTimeEntriesForm.controls['MATTERGUID'].setValue(result.MATTERGUID);
        this.quickTimeEntriesForm.controls['matterautoVal'].setValue(result.SHORTNAME + ' : ' + result.MATTER);
        this.matterChange('MatterGuid', result.MATTERGUID);
      }
    });
  }
  get qf() {
    return this.quickTimeEntriesForm.controls;
  }
  calcPE() {
    this.quickTimeEntriesForm.controls['PRICEINCGST'].setValue(round(this.qf.PRICE.value * 1.1).toFixed(2));
  }
  calcPI() {
    this.quickTimeEntriesForm.controls['PRICE'].setValue(round(this.qf.PRICEINCGST.value / 1.1).toFixed(2));
  }
  matterChange(key: any, event: any) {
    if (key == "MatterGuid") {
      this.quickTimeEntriesForm.controls['MATTERGUID'].setValue(event);
      this.calculateData.MatterGuid = event;
    } else if (key == "FeeEarner") {
      this.calculateData.FeeEarner = event;
    } else if (key == "QuantityType") {
      switch (event) {
        case 'hh:mm': {
          this.calculateData.QuantityType = 'X';
          break;
        }
        case 'Hours': {
          this.calculateData.QuantityType = 'H';
          break;
        }
        case 'Minutes': {
          this.calculateData.QuantityType = 'M';
          break;
        }
        case 'Days': {
          this.calculateData.QuantityType = 'D';
          break;
        }
        case 'Units': {
          this.calculateData.QuantityType = 'U';
          break;
        }
        case 'Fixed': {
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
          this.quickTimeEntriesForm.controls['PRICE'].setValue(CalcWorkItemCharge.PRICE);
          this.quickTimeEntriesForm.controls['PRICEINCGST'].setValue(CalcWorkItemCharge.PRICEINCGST);
          this.isLoadingResults = false;
        }
      }, err => {
        this.isLoadingResults = false;
        this.toastr.error(err);
      });
    }
  }
  QuickDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.quickTimeEntriesForm.controls['ITEMDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  SaveQuickTimeEntry() {
    this.isspiner = true;
    let PostData: any = {
      "MATTERGUID": this.qf.MATTERGUID.value,
      "ITEMDATE": this.qf.ITEMDATE.value,
      "PRICE": this.qf.PRICE.value,
      "PRICEINCGST": this.qf.PRICEINCGST.value,
      "ADDITIONALTEXT": this.qf.ADDITIONALTEXT.value,
      "QUANTITYTYPE": this.qf.QUANTITYTYPE.value,
      "FEEEARNER": this.qf.FEEEARNER.value,
      "ITEMTYPE": 1,
      "ITEMTIME": this.qf.ITEMTIME.value,
      "QUANTITY": this.qf.QUANTITY.value,
    }
    this.successMsg = 'Time entry added successfully';
    let FormAction = 'insert';
    let PostQuickTimeEntryData: any = { FormAction: FormAction, VALIDATEONLY: true, Data: PostData };
    this.Timersservice.SetWorkItems(PostQuickTimeEntryData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.checkValidation(res.DATA.VALIDATIONS, PostQuickTimeEntryData);
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.checkValidation(res.DATA.VALIDATIONS, PostQuickTimeEntryData);
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.checkValidation(res.DATA.VALIDATIONS, PostQuickTimeEntryData);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
  checkValidation(bodyData: any, PostQuickTimeEntryData: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    // errorData
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'NO') {
        errorData.push(value.ERRORDESCRIPTION);
        tempError[value.FIELDNAME] = value;
      } else if (value.VALUEVALID == 'WARNING') {
        tempWarning[value.FIELDNAME] = value;
        warningData.push(value.ERRORDESCRIPTION);
      }
    });
    this.errorWarningData = { "Error": tempError, 'Warning': tempWarning };
    if (Object.keys(errorData).length != 0) {
      this.toastr.error(errorData);
      this.isspiner = false;
    } else if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef = this.MatDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.saveQuick(PostQuickTimeEntryData);
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.saveQuick(PostQuickTimeEntryData);
      this.isspiner = false;
    }
  }
  saveQuick(PostQuickTimeEntryData: any) {
    PostQuickTimeEntryData.VALIDATEONLY = false;
    this.Timersservice.SetWorkItems(PostQuickTimeEntryData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.quickTimeEntriesForm.reset();
        this.LoadData(this.lastFilter);
        this.toastr.success(this.successMsg);
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.toastr.warning(res.MESSAGE);
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.toastr.warning(res.MESSAGE);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }

  refreshTab() {
    this.LoadData(JSON.parse(localStorage.getItem('time_entries_filter')));
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
    this.behaviorService.MainTimeEntryData(Data);
    localStorage.setItem('edit_WORKITEMGUID', Data.WORKITEMGUID);
  }
  LoadData(Data) {
    this.TimerData = [];
    this.isLoadingResults = true;
    this.Timersservice.getTimeEnrtyData(Data).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.WORKITEMS[0]) {
          this.isDisplay = false;
          this.behaviorService.MainTimeEntryData(response.DATA.WORKITEMS[0]);
          this.highlightedRows = response.DATA.WORKITEMS[0].WORKITEMGUID;
          localStorage.setItem('edit_WORKITEMGUID', this.highlightedRows);
        } else {
          this.isDisplay = true;
        }
        try {
          this.TimerData = new MatTableDataSource(response.DATA.WORKITEMS);
          this.TimerData.paginator = this.paginator;
          this.TimerData.sort = this.sort;
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
          this.TimerData.sort = this.sort;
          this.isDisplay = true;
        } else {
          this.LoadData(JSON.parse(localStorage.getItem('time_entries_filter')));
        }
      }
    });
  }


}
