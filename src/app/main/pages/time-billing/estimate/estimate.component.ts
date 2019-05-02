import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from '../../../sorting-dialog/sorting-dialog.component';
import { EstimateService, GetallcolumnsFilterService, TableColumnsService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';

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
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoadingResults: boolean = false;
  ColumnsObj: any = [];
  constructor(private TableColumnsService: TableColumnsService,
    private dialog: MatDialog, private Estimate: EstimateService, private GetallcolumnsFilter: GetallcolumnsFilterService, private toastr: ToastrService) { }
  Estimatedata;
  ngOnInit() {
    this.getTableFilter();
    this.loadData();
    $('content').addClass('inner-scroll');
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + 150)) + 'px');
  }
  loadData() {
    let potData = { 'MatterGuid': this.currentMatter.MATTERGUID };
    this.isLoadingResults = true;
    this.Estimate.MatterEstimatesData(potData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.Estimatedata = new MatTableDataSource(res.DATA.ESTIMATES)
        this.Estimatedata.paginator = this.paginator
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
    this.TableColumnsService.getTableFilter('MatterEstimates').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS, 'EstimatesItemsColumns');
        this.displayedColumns = data.showcol;
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
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'MatterEstimates' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        if (!result.columObj) {
          this.Estimatedata = new MatTableDataSource([]);
          this.Estimatedata.paginator = this.paginator;
        } else {
          this.loadData();
        }
      }
    });
  }
}
