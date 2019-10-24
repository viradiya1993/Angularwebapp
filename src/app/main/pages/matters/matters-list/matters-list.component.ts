import { Component, OnDestroy, OnInit, Output, ViewEncapsulation, EventEmitter, ViewChild } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SortingDialogComponent } from '../../../sorting-dialog/sorting-dialog.component';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { TableColumnsService, MainAPiServiceService, BehaviorService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { MatSort } from '@angular/material';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-matters-list',
  templateUrl: './matters-list.component.html',
  styleUrls: ['./matters-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MattersListComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  [x: string]: any;
  highlightedRows: any;
  abced: any = [];
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  displayedColumns = [];
  ColumnsObj = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  mattersData: any = [];
  lastFilter = {};
  tempColobj: any;
  isLoadingResults: any = false;
  pageSize: any;
  isDisplay: boolean = false;
  @Output() matterDetail: EventEmitter<any> = new EventEmitter<any>();


  constructor(
    private dialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    private toastr: ToastrService,
    private TableColumnsService: TableColumnsService,
    private behaviorService: BehaviorService,
  ) {
    this.mattersData = [];
    if (JSON.parse(localStorage.getItem('matter_filter'))) {
      this.lastFilter = JSON.parse(localStorage.getItem('matter_filter'));
    }
    this.getTableFilter();
  }

  ngOnInit(): void {
    this.abced = [];
    $('content').addClass('inner-scroll');
    this.getMatterList(this.lastFilter);
  }
  refreshMatterTab() {
    this.getMatterList(JSON.parse(localStorage.getItem('matter_filter')));
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('matters', '').subscribe(response => {
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

  editmatter(matters) {
    this.matterDetail.emit(matters);
    this.behaviorService.MatterData(matters);
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'matters', 'list': '' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        this.tempColobj = result.tempColobj;
        if (!result.columObj) {
          this.mattersData = new MatTableDataSource([]);
          this.mattersData.paginator = this.paginator;
          this.mattersData.sort = this.sort;
          this.isDisplay = true;
        } else {
          this.getMatterList(this.lastFilter);
        }
      }
    });
  }
  getMatterList(data) {
    this.isLoadingResults = true;
    this.subscription = this._mainAPiServiceService.getSetData(data, 'GetMatter').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.MATTERS[0]) {
          this.behaviorService.MatterData(response.DATA.MATTERS[0]);
          this.highlightedRows = response.DATA.MATTERS[0].MATTERGUID;
          this.editmatter(response.DATA.MATTERS[0]);
        }else {
          this.isDisplay = true;
        }
        this.mattersData = new MatTableDataSource(response.DATA.MATTERS);
        this.mattersData.paginator = this.paginator;

        //   this.mattersData._paginator._pageIndex=0;
        //   setInterval(() => {
        //     this.abced.push({});
        //     this.mattersData._paginator._pageIndex=this.abced.length;
        //     this.onPaginateChange({onPaginateChange:this.mattersData._paginator._pageSize});
        //     console.log(this.mattersData);
        //   }, 4000);
        // for(let i=0;i<=this.mattersData.filteredData.length;i++){

        // }
        // console.log(this.mattersData.filteredData.length);
        this.mattersData.sort = this.sort;
        this.isLoadingResults = false;
      } else if (response.CODE == 406 && response.MESSAGE == "Permission denied") {
        this.mattersData = new MatTableDataSource([]);
        this.mattersData.paginator = this.paginator;
        this.mattersData.sort = this.sort;
        this.isLoadingResults = false;
      }
    }, error => {
      this.toastr.error(error);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}






