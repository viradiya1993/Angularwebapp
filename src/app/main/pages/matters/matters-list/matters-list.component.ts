import { Component, OnDestroy, OnInit, Output, ViewEncapsulation, EventEmitter, ViewChild } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogConfig } from '@angular/material';

//import { MattersService } from '../matters.service';
import { SortingDialogComponent } from '../../../sorting-dialog/sorting-dialog.component';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MattersService, TableColumnsService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';


@Component({
  selector: 'app-matters-list',
  templateUrl: './matters-list.component.html',
  styleUrls: ['./matters-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MattersListComponent implements OnInit, OnDestroy {
  [x: string]: any;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  displayedColumns = [];
  ColumnsObj = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  mattersData: any;
  lastFilter = {};
  tempColobj: any;
  isLoadingResults: any = false;
  pageSize: any;

  @Output() matterDetail: EventEmitter<any> = new EventEmitter<any>();


  constructor(
    private dialog: MatDialog,
    private _mattersService: MattersService,
    private toastr: ToastrService,
    private TableColumnsService: TableColumnsService,
  ) {
    if (JSON.parse(localStorage.getItem('matter_filter'))) {
      this.lastFilter = JSON.parse(localStorage.getItem('matter_filter'));
    }
    this.getTableFilter();
  }

  ngOnInit(): void {
    $('content').addClass('inner-scroll');
    this.getMatterList(this.lastFilter);

  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('matters', '').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS, 'matterColumns');
        this.displayedColumns = data.showcol;
        this.ColumnsObj = data.colobj;
        this.tempColobj = data.tempColobj;
      }
    }, error => {
      this.toastr.error(error);
    });
  }

  ngOnDestroy(): void { }

  editmatter(matters) {
    this.matterDetail.emit(matters);
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
        } else {
          this.getMatterList(this.lastFilter);
        }
      }
    });
  }
  getMatterList(data) {
    this.isLoadingResults = true;
    this._mattersService.getMatters(data).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.MATTERS[0]) {
          this.highlightedRows = response.DATA.MATTERS[0].MATTERGUID;
          this.matterDetail.emit(response.DATA.MATTERS[0]);
        }
        this.mattersData = new MatTableDataSource(response.DATA.MATTERS);
        this.mattersData.paginator = this.paginator;

        this.isLoadingResults = false;
      }
    }, error => {
      this.toastr.error(error);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }

}






