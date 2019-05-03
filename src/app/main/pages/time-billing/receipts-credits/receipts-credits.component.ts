import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { ReceiptsCreditsService, TableColumnsService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';

@Component({
  selector: 'app-receipts-credits',
  templateUrl: './receipts-credits.component.html',
  styleUrls: ['./receipts-credits.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ReceiptsCreditsComponent implements OnInit {
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  displayedColumns: string[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ColumnsObj: any = [];
  pageSize: any;
  isLoadingResults: boolean = false;
  constructor(private dialog: MatDialog,
    private ReceiptsCredits: ReceiptsCreditsService,
    private TableColumnsService: TableColumnsService,
    private toastr: ToastrService) { }

  ReceiptsCreditsdata;
  ngOnInit() {
    $('content').addClass('inner-scroll');
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + 140)) + 'px');
    this.getTableFilter();
    this.LoadData();
  }
  LoadData() {
    //API Data fetch
    this.isLoadingResults = true;
    let potData = { 'MatterGUID': this.currentMatter.MATTERGUID };
    this.ReceiptsCredits.ReceiptsCreditsData(potData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.ReceiptsCreditsdata = new MatTableDataSource(res.DATA.RECEIPTS)
        this.ReceiptsCreditsdata.paginator = this.paginator
      }
      this.isLoadingResults = false;
    },
      err => {
        this.toastr.error(err);
      });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }

  getTableFilter() {
    this.TableColumnsService.getTableFilter('MatterReceipts').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS, 'MatterReceiptsColumns');
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
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'MatterReceipts' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        if (!result.columObj) {
          this.ReceiptsCreditsdata = new MatTableDataSource([]);
          this.ReceiptsCreditsdata.paginator = this.paginator;
        } else {
          this.LoadData();
        }
      }
    });
  }
}


