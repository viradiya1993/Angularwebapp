import { Component, OnDestroy, OnInit, Output, ViewEncapsulation, EventEmitter, ViewChild, HostListener, ElementRef, AfterViewInit } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogConfig, MatTable } from '@angular/material';
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
export class MattersListComponent implements OnInit, OnDestroy, AfterViewInit {
  subscription: Subscription;
  [x: string]: any;
  highlightedRows: any;
  abced: any = [];
  isDisplay: boolean = false;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  displayedColumns = [];
  ColumnsObj = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //start resize
  @ViewChild(MatTable, { read: ElementRef }) private matTableRef: ElementRef;
  pressed = false;
  currentResizeIndex: number;
  startX: number;
  startWidth: number;
  isResizingRight: boolean;
  resizableMousemove: () => void;
  resizableMouseup: () => void;
  //end resize

  mattersData: any = [];
  lastFilter = {};
  tempColobj: any;
  isLoadingResults: any = false;
  pageSize: any;
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
  //table resize change end
  ngAfterViewInit() {
    this.setTableResize(this.matTableRef.nativeElement.clientWidth);
  }
  setTableResize(tableWidth: number) {
    console.log(tableWidth);
    let totWidth = 0;
    this.displayedColumns.forEach((column) => {
      totWidth += 100;
    });
    const scale = (tableWidth - 5) / totWidth;
    this.displayedColumns.forEach((column) => {
      let wi = 100;
      wi *= scale;
      this.setColumnWidth(column);
    });
  }
  onResizeColumn(event: any, index: number) {
    this.checkResizing(event, index);
    this.currentResizeIndex = index;
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = event.target.clientWidth;
    event.preventDefault();
    this.mouseMove(index);
  }
  private checkResizing(event, index) {
    const cellData = this.getCellData(index);
    if ((index === 0) || (Math.abs(event.pageX - cellData.right) < cellData.width / 2 && index !== this.displayedColumns.length - 1)) {
      this.isResizingRight = true;
    } else {
      this.isResizingRight = false;
    }
  }

  private getCellData(index: number) {
    const headerRow = this.matTableRef.nativeElement.children[0];
    const cell = headerRow.children[index];
    return cell.getBoundingClientRect();
  }
  mouseMove(index: number) {
    this.resizableMousemove = this.renderer.listen('document', 'mousemove', (event) => {
      if (this.pressed && event.buttons) {
        const dx = (this.isResizingRight) ? (event.pageX - this.startX) : (-event.pageX + this.startX);
        const width = this.startWidth + dx;
        if (this.currentResizeIndex === index && width > 50) {
          this.setColumnWidthChanges(index, width);
        }
      }
    });
    this.resizableMouseup = this.renderer.listen('document', 'mouseup', (event) => {
      if (this.pressed) {
        this.pressed = false;
        this.currentResizeIndex = -1;
        this.resizableMousemove();
        this.resizableMouseup();
      }
    });
  }
  setColumnWidthChanges(index: number, width: number) {
    const orgWidth = this.displayedColumns[index].width;
    const dx = width - orgWidth;
    if (dx !== 0) {
      const j = (this.isResizingRight) ? index + 1 : index - 1;
      const newWidth = this.displayedColumns[j].width - dx;
      if (newWidth > 50) {
        this.displayedColumns[index].width = width;
        this.setColumnWidth(this.displayedColumns[index]);
        this.displayedColumns[j].width = newWidth;
        this.setColumnWidth(this.displayedColumns[j]);
      }
    }
  }
  setColumnWidth(column: any) {
    const columnEls = Array.from(document.getElementsByClassName('mat-column-' + column));
    columnEls.forEach((el: HTMLDivElement) => {
      el.style.width = 100 + 'px';
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setTableResize(this.matTableRef.nativeElement.clientWidth);
  }
  //table resize change end

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
        } else {
          this.isDisplay = true;
        }
        this.mattersData = new MatTableDataSource(response.DATA.MATTERS);
        this.mattersData.paginator = this.paginator;
        this.mattersData.sort = this.sort;
        this.isLoadingResults = false;
      } else if (response.CODE == 406 && response.MESSAGE == "Permission denied") {
        this.mattersData = new MatTableDataSource([]);
        this.mattersData.paginator = this.paginator;
        this.mattersData.sort = this.sort;
        this.isLoadingResults = false;
        this.isDisplay = true;
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






