import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MainAPiServiceService, BehaviorService, TableColumnsService } from 'app/_services';
import { MatterPopupComponent } from '../matters/matter-popup/matter-popup.component';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatDatepickerInputEvent } from '@angular/material';
import { MatterDialogComponent } from '../time-entries/matter-dialog/matter-dialog.component';
import { ContactSelectDialogComponent } from '../contact/contact-select-dialog/contact-select-dialog.component';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  animations: fuseAnimations
})
export class TaskComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() errorWarningData: any;
  ColumnsObj = [];
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  tempColobj: any;
  pageSize: any;
  GetUSERS: any = [];
  isLoadingResults: boolean = false;
  MainTask: FormGroup;
  TaskAllData: any = [];
  addData: any = [];
  filterData: { 'MATTERGUID': any, 'STATUS': any; 'Search': string; 'USERGUID': any; 'DUEDATEFROM': any; 'DUEDATETO': any, "Matter": any, "user": any };
  displayedColumns: any;
  highlightedRows: any;
  ImgDisAb: string;
  val: any;
  isDisplay: boolean = false;
  isGetUserEmpty: string;
  constructor(private _mainAPiServiceService: MainAPiServiceService, private dialog: MatDialog,
    private _formBuilder: FormBuilder, public behaviorService: BehaviorService,
    private toastr: ToastrService, private TableColumnsService: TableColumnsService,
    public datepipe: DatePipe, ) {
    this.getUserdata();
  }

  ngOnInit() {
    this.ImgDisAb = "menu-disabled";
    this.getTableFilter();
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 130)) + 'px');

    this.MainTask = this._formBuilder.group({
      matterCheck: [''],
      active: [''],
      status: [''],
      matter: [''],
      DateRange: [''],
      User: [''],
      search: ['']
    });
    // var aestTime = new Date().toLocaleString("en-US", {timeZone: "Australia/Brisbane"});
    // aestTime = new Date(aestTime);
    // console.log('AEST time: '+ aestTime.toLocasleString())

    this.filterData = {
      'MATTERGUID': '', 'Search': '', "USERGUID": '', 'DUEDATEFROM': '', 'DUEDATETO': '', 'STATUS': ' ', "Matter": '', 'user': ""
    }
    //  this.filterData.DUEDATEFROM=new Date();
    //  this.filterData.DUEDATETO=new Date();
    if (!localStorage.getItem("task_filter")) {
      localStorage.setItem('task_filter', JSON.stringify(this.filterData));
    } else {
      this.filterData = JSON.parse(localStorage.getItem("task_filter"));
    }
    this.MainTask.controls['status'].setValue(this.filterData.STATUS);
    this.MainTask.controls['matter'].setValue(this.filterData.Matter);
    this.MainTask.controls['User'].setValue(this.filterData.user);

    let date = this.filterData.DUEDATEFROM.split("/");
    let putDate1 = new Date(date[1] + '/' + date[0] + '/' + date[2]);
    let date2 = this.filterData.DUEDATETO.split("/");
    let putDate2 = new Date(date2[1] + '/' + date2[0] + '/' + date2[2]);
    this.MainTask.controls['DateRange'].setValue({ begin: putDate1, end: putDate2 });
    if (this.filterData.MATTERGUID == '') {
      this.MainTask.controls['matterCheck'].setValue(true);
      this.MainTask.controls['matter'].disable();
      this.CheckboxChecxed();
    } else {
      this.LoadData(this.filterData);
    }
    if (this.isGetUserEmpty == 'no') {
      this.selectUsers(this.filterData.user);
      this.isLoadingResults = false;
    }
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('Tasks', '').subscribe(response => {
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
  getUserdata() {
    this.isGetUserEmpty = 'yes';
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({ 'Active': 'yes' }, 'GetUsers').subscribe(response => {
      if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
        this.GetUSERS = response.DATA.USERS;
        this.isGetUserEmpty = 'no';
        this.behaviorService.UserDropDownData(response.DATA.USERS[0]);
      }
    });
  }
  LoadData(data) {
    this.TaskAllData = [];
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(data, 'GetTask').subscribe(res => {
      this.TaskAllData = new MatTableDataSource(res.DATA.TASKS);
      this.TaskAllData.sort = this.sort;
      this.TaskAllData.paginator = this.paginator;
      if (res.CODE == 200 && res.STATUS == "success") {
        if (res.DATA.TASKS[0]) {
          this.isDisplay = false;
          this.RowClick(res.DATA.TASKS[0])
          // this.behaviorService.TaskData(res.DATA.TASKS[0]);
          this.highlightedRows = res.DATA.TASKS[0].TASKGUID;
        } else {
          this.isDisplay = true;
        }
        this.isLoadingResults = false;
      }
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);

    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  get f() {
    return this.MainTask.controls;
  }
  CheckboxChecxed() {
    if (this.f.matterCheck.value == true) {
      this.ImgDisAb = "menu-disabled";
      this.MainTask.controls['matter'].disable();
      this.filterData = JSON.parse(localStorage.getItem("task_filter"));
      this.filterData.MATTERGUID = "";
      localStorage.setItem('task_filter', JSON.stringify(this.filterData));
      this.LoadData(this.filterData);
    } else {
      this.ImgDisAb = "";
      this.MainTask.controls['matter'].enable();
      const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
      dialogRef.afterClosed().subscribe(result => {
        if (result != false) {
          if (result) {
            localStorage.setItem('set_active_matters', JSON.stringify(result));
            this.MainTask.controls['matter'].setValue(result.MATTER);
            this.filterData = JSON.parse(localStorage.getItem("task_filter"));
            this.filterData.MATTERGUID = result.MATTERGUID;
            this.filterData.Matter = result.MATTER;
            localStorage.setItem('task_filter', JSON.stringify(this.filterData));
            this.LoadData(this.filterData);
          }
          else if (this.f.matter.value == '') {
            this.MainTask.controls['matterCheck'].setValue(true);
          }
        } else {
          this.ImgDisAb = "menu-disabled";
          this.MainTask.controls['matterCheck'].setValue(true);
          this.MainTask.controls['matter'].disable();
        }

      });
    }
  }
  SelectMatter() {
    const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.MainTask.controls['matter'].setValue(result.MATTER);
        this.filterData = JSON.parse(localStorage.getItem("task_filter"));
        this.filterData.MATTERGUID = result.MATTERGUID;
        this.filterData.Matter = result.MATTER;
        localStorage.setItem('task_filter', JSON.stringify(this.filterData));
        this.LoadData(this.filterData);
      }
    });
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'Tasks', 'list': '' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tempColobj = result.tempColobj;
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        if (!result.columObj) {
          this.TaskAllData = new MatTableDataSource([]);
          this.TaskAllData.paginator = this.paginator;
          this.TaskAllData.sort = this.sort;
          this.isDisplay = true;
        } else {
          this.filterData = JSON.parse(localStorage.getItem("task_filter"));
          this.LoadData(this.filterData);
        }
      }
    });
  }
  selectUsers(value) {
    this.filterData = JSON.parse(localStorage.getItem("task_filter"));
    let val = this.GetUSERS.find(c => c['USERNAME'] == value)
    this.filterData.USERGUID = val.USERGUID;
    this.filterData.user = value;
    this.behaviorService.UserDropDownData(val);
    localStorage.setItem('task_filter', JSON.stringify(this.filterData));
    this.LoadData(this.filterData);
  }
  selectStatus(val) {
    this.filterData = JSON.parse(localStorage.getItem("task_filter"));
    this.filterData.STATUS = val;
    localStorage.setItem('task_filter', JSON.stringify(this.filterData));
    this.LoadData(this.filterData);
  }
  DateRange1(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
    let end = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');
    this.filterData = JSON.parse(localStorage.getItem("task_filter"));
    this.filterData.DUEDATEFROM = begin;
    this.filterData.DUEDATETO = end;
    localStorage.setItem('task_filter', JSON.stringify(this.filterData));
    this.LoadData(this.filterData);

  }
  DateRange(a, b) {
  }
  onSearch(searchFilter: any) {
    this.filterData = JSON.parse(localStorage.getItem("task_filter"));
    if (searchFilter['key'] === "Enter" || searchFilter == 'Enter') {
      this.filterData.Search = this.f.search.value;
      localStorage.setItem('task_filter', JSON.stringify(this.filterData));
      this.LoadData(this.filterData);
    }

  }
  refreshTask() {
    this.filterData = JSON.parse(localStorage.getItem("task_filter"));
    this.LoadData(this.filterData);
  }
  RowClick(row) {
    this.behaviorService.TaskData(row);
  }
  ngOnDestroy(): void {
    this.filterData = JSON.parse(localStorage.getItem('task_filter'));
    this.filterData.Search = '';
    localStorage.setItem('task_filter', JSON.stringify(this.filterData));
  }
}
