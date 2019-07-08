
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material';
import * as $ from 'jquery';
import { TableColumnsService, MainAPiServiceService } from 'app/_services';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UsersComponent implements OnInit {
  userfilter: FormGroup;
  isLoadingResults: boolean = false;
  displayedColumns: string[];
  ColumnsObj: any = [];
  tempColobj: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  Userid = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  highlightedRows: any;
  currentUserData: any;
  pageSize: any;
  Useralldata: any = [];
  lastFilter: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private TableColumnsService: TableColumnsService,
    private _mainAPiServiceService: MainAPiServiceService,
    private toastr: ToastrService,
  ) {
    let filterData = JSON.parse(localStorage.getItem('users_filter'));
    if (filterData) {
      this.lastFilter = JSON.parse(localStorage.getItem('users_filter'));
    } else {
      this.lastFilter = { ACTIVE: '' };
      localStorage.setItem('users_filter', JSON.stringify(this.lastFilter));
    }
    this.userfilter = this._formBuilder.group({ ACTIVE: [this.lastFilter.ACTIVE] });
  }
  ngOnInit() {
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 130)) + 'px');
    this.getTableFilter();
    this.loadData(this.lastFilter);
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('Users', '').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS);
        this.displayedColumns = data.showcol;
        this.tempColobj = data.tempColobj;
        this.ColumnsObj = data.colobj;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  UserTypeChange(event) {
    this.lastFilter.ACTIVE = event.value;
    localStorage.setItem('users_filter', JSON.stringify(this.lastFilter));
    this.loadData(this.lastFilter);
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  setActiveUserData(rowData: any) {
    localStorage.setItem('current_user_Data', JSON.stringify(rowData));
  }
  loadData(filterData) {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(filterData, 'GetUsers').subscribe(response => {
      if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
        if (response.DATA.USERS[0]) {
          this.highlightedRows = response.DATA.USERS[0].USERGUID;
          this.currentUserData = response.DATA.USERS[0];
          localStorage.setItem('current_user_Data', JSON.stringify(response.DATA.USERS[0]));
        }
        this.Useralldata = new MatTableDataSource(response.DATA.USERS);
        this.Useralldata.paginator = this.paginator;
        this.Useralldata.sort = this.sort;
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
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'Users', 'list': '' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        this.tempColobj = result.tempColobj;
        if (!result.columObj) {
          this.Useralldata = new MatTableDataSource([]);
          this.Useralldata.paginator = this.paginator;
          this.Useralldata.sort = this.sort;
        } else {
          this.loadData(this.lastFilter);
        }
      }
    });
  }
}
