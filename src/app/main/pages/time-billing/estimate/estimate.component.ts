import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from '../../../sorting-dialog/sorting-dialog.component';
import { GetallcolumnsFilterService, TableColumnsService, MainAPiServiceService, BehaviorService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EstimateComponent implements OnInit {
  displayedColumns: string[];
  pageSize: any;
  tempColobj: any;
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoadingResults: boolean = false;
  ColumnsObj: any = [];
  highlightedRows: any;
  isDisplay: boolean = false;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  constructor(private TableColumnsService: TableColumnsService,
    private dialog: MatDialog, private GetallcolumnsFilter: GetallcolumnsFilterService,
    private _mainAPiServiceService: MainAPiServiceService, private toastr: ToastrService,public behaviorService: BehaviorService) { }
  Estimatedata;
  ngOnInit() {
    this.getTableFilter();
    this.loadData();
    $('content').addClass('inner-scroll');
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + 150)) + 'px');
    this.loadData();
  }
  refreshEstimateTab() {
    this.loadData();
  }
  loadData() {
    let potData = { 'MatterGuid': this.currentMatter.MATTERGUID };
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(potData, 'GetMatterEstimateItem').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        if (res.DATA.ESTIMATEITEMS[0]) {
          this.isDisplay = false;
          this.RowClick(res.DATA.ESTIMATEITEMS[0]);
        } else {
          this.isDisplay = true;
        }
        this.Estimatedata = new MatTableDataSource(res.DATA.ESTIMATEITEMS)
        this.Estimatedata.paginator = this.paginator
        this.Estimatedata.sort = this.sort;
        this.isLoadingResults = false;
      }
    }, err => {
      this.toastr.error(err);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }

  getTableFilter() {
    this.TableColumnsService.getTableFilter('time and billing', 'estimate').subscribe(response => {
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
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'time and billing', 'list': 'estimate' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        this.tempColobj = result.tempColobj;
        if (!result.columObj) {
          this.Estimatedata = new MatTableDataSource([]);
          this.Estimatedata.paginator = this.paginator;
          this.Estimatedata.sort = this.sort;
          this.isDisplay = true;
        } else {
          this.loadData();
        }
      }
    });
  }
  RowClick(row){
    this.behaviorService.estimatelegalData(row);
  }
}
