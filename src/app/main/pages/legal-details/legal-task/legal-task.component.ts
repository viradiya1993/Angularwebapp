import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService, TableColumnsService, BehaviorService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { MatterPopupComponent } from '../../matters/matter-popup/matter-popup.component';
import { ContactDialogComponent } from '../../contact/contact-dialog/contact-dialog.component';
import * as $ from 'jquery';
@Component({
  selector: 'app-legal-task',
  templateUrl: './legal-task.component.html',
  styleUrls: ['./legal-task.component.scss'],
  animations: fuseAnimations
})
export class legalDetailTaskComponent implements OnInit {
  displayedColumns: string[];
  ColumnsObj: any = [];
  tempColobj: any;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  isLoadingResults: boolean = false;
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  addData: any = [];
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;
  Task_table: any = [];
  GetUSERS: any = [];
  pageSize: any;
  filterData: any = [];
  isDisplay: boolean = false;
  
  public legalTaskData = {
    "MatterName": '', "ContactName": '', "Search": '', 'Status': ''
  }
  MainTaskFilterData: any;
  constructor(private _mainAPiServiceService: MainAPiServiceService,
    private toastr: ToastrService, private dialog: MatDialog, private TableColumnsService: TableColumnsService,
    public behaviorService: BehaviorService) { }

  ngOnInit() {
    $('content').addClass('inner-scroll');
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + 30)) + 'px');
    this.getTableFilter();

    this.getUserdata();
    this.MainTaskFilterData = JSON.parse(localStorage.getItem("task_filter"));

    this.filterData = {
      'MATTERGUID': this.currentMatter.MATTERGUID, 'STATUS': ' ', "USERGUID": ''
    }
    if (!localStorage.getItem("task_filter_legal")) {
      localStorage.setItem('task_filter_legal', JSON.stringify(this.filterData));
    } else {
      this.filterData = JSON.parse(localStorage.getItem("task_filter_legal"));
    }
    this.LoadData(this.filterData);
    this.legalTaskData.MatterName = this.currentMatter.MATTER;
    this.legalTaskData.ContactName = this.currentMatter.CONTACTNAME;
  }
  getUserdata() {
    this._mainAPiServiceService.getSetData({ 'Active': 'yes' }, 'GetUsers').subscribe(response => {
      if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
        // this.GetUSERS = response.DATA.USERS;
        // if()
        let check = JSON.parse(localStorage.getItem("task_filter_legal"));
        this.behaviorService.UserDropDownData(response.DATA.USERS[0]);
      }
    });
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('legal details', 'tasks').subscribe(response => {
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
  LoadData(data) {
    this.Task_table = [];
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(data, 'GetTask').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.Task_table = new MatTableDataSource(response.DATA.TASKS);
        this.Task_table.paginator = this.paginator;
        this.Task_table.sort = this.sort;
        if (response.DATA.TASKS[0]) {
          this.isDisplay = false;
          this.behaviorService.TaskData(response.DATA.TASKS[0]);
          this.highlightedRows = response.DATA.TASKS[0].TASKGUID;
          //this.highlightedRows = response.DATA.TASKS[0].TASKGUID;
        } else {
          this.isDisplay = true;
        }
      }
      this.isLoadingResults = false;
    }, error => {
      this.toastr.error(error);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'legal details', 'list': 'chronology' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        this.tempColobj = result.tempColobj;
        if (!result.columObj) {
          this.Task_table = new MatTableDataSource([]);
          this.Task_table.paginator = this.paginator;
          this.Task_table.sort = this.sort;
          this.isDisplay = true;
        } else {
          this.filterData = JSON.parse(localStorage.getItem("task_filter_legal"));
          this.LoadData(this.filterData);
          // this.LoadData();
        }
      }
    });
  }
  SelectMatter() {
    let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
    let MaterPopupData = { action: 'edit', 'matterGuid': mattersData.MATTERGUID }
    const dialogRef = this.dialog.open(MatterPopupComponent, {
      disableClose: true, panelClass: 'contact-dialog', data: MaterPopupData
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  SelectContact() {
    let contactPopupData = { action: 'edit' };
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      disableClose: true, panelClass: 'contact-dialog', data: contactPopupData
    });
    dialogRef.afterClosed().subscribe(result => {


    });
  }
  selectStatus(val) {
    this.filterData = JSON.parse(localStorage.getItem("task_filter_legal"));
    this.filterData.STATUS = val;
    localStorage.setItem('task_filter_legal', JSON.stringify(this.filterData));
    this.LoadData(this.filterData);
  }
  FilterSearch(val) {
    this.Task_table.filter = val;
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  RowClick(row) {
    this.behaviorService.TaskData(row);
  }
  refreshLegalTask() {
    this.filterData = JSON.parse(localStorage.getItem("task_filter_legal"));
    this.LoadData(this.filterData);
  }
}
