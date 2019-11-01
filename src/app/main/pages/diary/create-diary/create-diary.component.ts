import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MainAPiServiceService, TimersService, TableColumnsService, BehaviorService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator, MatSort, MatDatepickerInputEvent, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { MatterDialogComponent } from '../../time-entries/matter-dialog/matter-dialog.component';
import * as moment from 'moment';

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
  SendCreateTimeEntries:any=[];
  ActivityList: any;
  LookupsList: any;
  createDiaryForm: any = {}
  currenbtMatter=JSON.parse(localStorage.getItem('set_active_matters'));
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
  CreateDiaryArray: any=[];
  INDEX: any;
  constructor(private _mainAPiServiceService: MainAPiServiceService,
    private Timersservice: TimersService,
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private behaviorService: BehaviorService,
    private TableColumnsService: TableColumnsService,
    private toastr: ToastrService, ) {
    // this.getTableFilter();
    this.LoadData();
  }

  ngOnInit() {
    this.CreateTimeEnrtyForm = this.fb.group({ 
      matterautoVal: [''], 
      MATTERGUID:[''],
      ADDITIONALTEXT:[''],


      PRICEINCGST:[''],
      PRICE:[''],
      QUANTITYTYPE:[''],
      QUANTITY:[''],
      FEEEARNER:[''],
      ITEMTIME:[''],
      ITEMDATETEXT:[''],
      ITEMDATE:[''],
     
      uninvoicedWork: [''],
       dlpdrop: [''], 
    });
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
    this.calculateData.MatterGuid=this.currenbtMatter.MATTERGUID;
    this.calculateData.QuantityType = 'H';
    this.timeStops = this.getTimeStops('00:00', '23:30');

    this.createDiaryForm.Date = ({ begin: new Date(), end: new Date() });
    this.createDiaryForm.Search = "";
    this.createDiaryForm.Item = 'All Items';
  }
  helloFunction() {
    console.log(this.selection.selected);

    this.selection.selected.forEach(element => {
      this.SendCreateTimeEntries.push({
        PRICE:element.PRICE,
        PRICEINCGST:element.PRICEINCGST,
        ITEMDATE:element.APPOINTMENTDATE,
        ITEMTIME:element.APPOINTMENTTIME,
        MATTERGUID:element.MATTERGUID,
        FEEEARNER:element.FEEEARNERID,
        APPOINTMENTGUID:element.APPOINTMENTGUID,
        QUANTITY:element.QUANTITY,
      });
    });

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
//   APPOINTMENTENDDATE
// APPOINTMENTTIME
// DURATION
// MATTERSHORTNAME
// APPOINTMENTTYPE
// Description
// PRICE
// PRICEINCGST
// GST
  // getTableFilter() {
  //   this.TableColumnsService.getTableFilter('time entries', '').subscribe(response => {
  //     if (response.CODE == 200 && response.STATUS == "success") {
  //       let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS);
  //       this.tempColobj = data.tempColobj;
  //       this.displayedColumns = data.showcol;
  //       this.displayedColumns.splice(0, 0, "select");
  //       this.ColumnsObj = data.colobj;
  //     }
  //   }, error => {
  //     this.toastr.error(error);
  //   });
  // }
  LoadData() {
    this.TimerDataFordiary = [];
    this.isLoadingResults = true;
    // this.Timersservice.getTimeEnrtyData({})
    // this._mainAPiServiceService.getSetData({ShowWhat: "CREATE WIP" }, 'GetAppointment')
    this._mainAPiServiceService.getSetData({ShowWhat: "CREATE WIP",TYPEFILTER:'All' }, 'GetAppointment').subscribe(response => {
      console.log(response);
      if (response.CODE == 200 && response.STATUS == "success") {
        this.TimerDataFordiary = new MatTableDataSource(response.DATA.APPOINTMENTS);
          this.TimerDataFordiary.paginator = this.paginator;
          this.TimerDataFordiary.sort = this.sort;
          // response.DATA.APPOINTMENTS.forEach(element => {
          //   this.SendCreateTimeEntries.push({
          //     PRICE:element.PRICE,
          //     PRICEINCGST:element.PRICEINCGST,
          //     ITEMDATE:element.APPOINTMENTDATE,
          //     ITEMTIME:element.APPOINTMENTTIME,
          //     MATTERGUID:element.MATTERGUID,
          //     FEEEARNER:element.FEEEARNERID,
          //     APPOINTMENTGUID:element.APPOINTMENTGUID,
          //     QUANTITY:element.QUANTITY,
          //   });
          // });
        
        if (response.DATA.APPOINTMENTS[0]) {
          // this.behaviorService.MainTimeEntryData(response.DATA.WORKITEMS[0]);
           this.isDisplay = false;
          this.highlightedRows = response.DATA.APPOINTMENTS[0].APPOINTMENTGUID;
          // localStorage.setItem('edit_WORKITEMGUID', this.highlightedRows);
        }else {
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
      }
    });
  }
  QuickDate(type: string, event: MatDatepickerInputEvent<Date>) {
  this.CreateTimeEnrtyForm.controls['ITEMDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  this.CommonChagesArray();

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
  }
  calcPI() {
    this.CreateTimeEnrtyForm.controls['PRICE'].setValue((this.qf.PRICEINCGST.value / 1.1).toFixed(2));
  }  
  matterChange(key: any, event: any) {
    console.log(key);
    console.log(event);
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
        }
      }, err => {
        this.isLoadingResults = false;
        this.toastr.error(err);
      });
    }
  }  get qf() {
    return this.CreateTimeEnrtyForm.controls;
  }
  DateRange1(type: string, event: MatDatepickerInputEvent<Date>) {

    let begin = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
    let end = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');
    // this.CommonDatefun(end, begin);
    // this.filterData = JSON.parse(localStorage.getItem("spendmoney_filter"));
    // this.loadData(this.filterData);
  }
  DateRange(a, b) {
  }
  Rowclick(val,index) {
    this.INDEX=index;
    // this.behaviorService.MainTimeEntryData(val);
    // localStorage.setItem('edit_WORKITEMGUID', val.WORKITEMGUID);
    this.CreateTimeEnrtyForm.controls['PRICE'].setValue(val.PRICE);
    this.CreateTimeEnrtyForm.controls['PRICEINCGST'].setValue(val.PRICEINCGST);
    this.CreateTimeEnrtyForm.controls['matterautoVal'].setValue(this.currenbtMatter.SHORTNAME);
    this.CreateTimeEnrtyForm.controls['MATTERGUID'].setValue(this.currenbtMatter.MATTERGUID);
    let Date1 = val.APPOINTMENTDATE.split("/");
    let ShowDate = new Date(Date1[1] + '/' + Date1[0] + '/' + Date1[2]);
    this.CreateTimeEnrtyForm.controls['ITEMDATETEXT'].setValue(ShowDate);
    this.CreateTimeEnrtyForm.controls['ITEMDATE'].setValue(val.APPOINTMENTDATE);
    let ttyData = moment(val.APPOINTMENTTIME, 'hh:mm');
    this.CreateTimeEnrtyForm.controls['ITEMTIME'].setValue(moment(ttyData).format('hh:mm A'));
    // this.CreateTimeEnrtyForm.controls['ITEMTIME'].setValue(val.APPOINTMENTTIME);
    this.CreateTimeEnrtyForm.controls['FEEEARNER'].setValue(val.FEEEARNERID);
    this.CreateTimeEnrtyForm.controls['QUANTITY'].setValue(val.QUANTITY);
    this.CreateTimeEnrtyForm.controls['QUANTITYTYPE'].setValue(val.QUANTITYTYPE);
    this.CreateTimeEnrtyForm.controls['ADDITIONALTEXT'].setValue('');
    
      //chgange in array 

     


  }

  CommonChagesArray(){
    this.SendCreateTimeEntries[this.INDEX].PRICE=this.qf.PRICE.value;
    this.SendCreateTimeEntries[this.INDEX].PRICEINCGST=this.qf.PRICEINCGST.value;
    this.SendCreateTimeEntries[this.INDEX].MATTERGUID=this.qf.MATTERGUID.value;
    this.SendCreateTimeEntries[this.INDEX].ITEMDATE=this.qf.ITEMDATE.value;
    this.SendCreateTimeEntries[this.INDEX].ITEMTIME=this.qf.ITEMTIME.value;
    this.SendCreateTimeEntries[this.INDEX].FEEEARNER=this.qf.FEEEARNER.value;
    this.SendCreateTimeEntries[this.INDEX].QUANTITY=this.qf.QUANTITY.value;
  }

  CheckboxClick() {

  }

  saveCreateDiary() {

    console.log(this.selection.selected);
    console.log(this.SendCreateTimeEntries);
   
    let finalData = { DATA: this.SendCreateTimeEntries, FormAction: 'insert', VALIDATEONLY: false }
    this._mainAPiServiceService.getSetData(finalData, 'SetAppointment').subscribe(response => {
      console.log(response);

    }, err => {
      this.toastr.error(err);
    });

  }

  onPaginateChange(page: any) {

  }
  selectDayRange(val) {
    console.log(val);
  }

}
