import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { TableColumnsService, MainAPiServiceService, BehaviorService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { MatSort } from '@angular/material/sort';



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
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;
  ColumnsObj: any = [];
  pageSize: any;
  tempColobj: any;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  isLoadingResults: boolean = false;
  currentData: any;
  isDisplay: boolean = false;
  constructor(private dialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    private TableColumnsService: TableColumnsService,
    private toastr: ToastrService, public behaviorService: BehaviorService, ) { }

  ReceiptsCreditsdata:any=[];
  ngOnInit() {
    $('content').addClass('inner-scroll');
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + 220)) + 'px');
    // this.behaviorService.resizeTableForAllViewForSub();
    // const behaviorService = this.behaviorService;
    // $(window).resize(function () {
    //   behaviorService.resizeTableForAllViewForSub();
    // });
    this.getTableFilter();
    this.LoadData();
  }
  LoadData() {
    //API Data fetch
    this.ReceiptsCreditsdata  = [];
    this.isLoadingResults = true;
    let potData = { 'MatterGUID': this.currentMatter.MATTERGUID };
    this._mainAPiServiceService.getSetData(potData, 'GetMatterReceipts').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.behaviorService.ReceiptData(null);
        if (res.DATA.RECEIPTS[0]) {
          this.isDisplay = false;
          this.selectId(res.DATA.RECEIPTS[0]);
        } else {
          this.isDisplay = true;
        }
        if (res.DATA.RECEIPTS.length != 0) {
          this.behaviorService.ReceiptData(res.DATA.RECEIPTS[0]);
          localStorage.setItem('receiptData', JSON.stringify(res.DATA.RECEIPTS[0]));
          localStorage.setItem('TBreceiptData', JSON.stringify(res.DATA.RECEIPTS[0]));
          this.highlightedRows = res.DATA.RECEIPTS[0].INCOMEGUID;
          this.ReceiptsCreditsdata = new MatTableDataSource(res.DATA.RECEIPTS)
          this.ReceiptsCreditsdata.paginator = this.paginator;
          this.sortingCLM();
        }

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
    this.TableColumnsService.getTableFilter('time and billing', 'receipts and credits').subscribe(response => {
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
  selectId(row: any) {
    this.currentData = row;
    this.behaviorService.ReceiptData(row);
    localStorage.setItem('receiptData', JSON.stringify(row));
    localStorage.setItem('TBreceiptData', JSON.stringify(row));
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'time and billing', 'list': 'receipts and credits' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        this.tempColobj = result.tempColobj;
        if (!result.columObj) {
          this.ReceiptsCreditsdata = new MatTableDataSource([]);
          this.ReceiptsCreditsdata.paginator = this.paginator;
          this.ReceiptsCreditsdata.sort = this.sort;
          this.isDisplay = true;
        } else {
          this.LoadData();
        }
      }
    });
  }
  sortingCLM() {
    this.ReceiptsCreditsdata.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'INCOMEDATE': {
          let tempDate = item.INCOMEDATE.split("/");
          let Sd = new Date(tempDate[1] + '/' + tempDate[0] + '/' + tempDate[2]);
          let newDate = new Date(Sd);
          return newDate;
        }
        default: {
          return item[property];
        }
      }
    }
    // proper shorting for date 
    this.ReceiptsCreditsdata.sort = this.sort;
  }
  sortData(val){
  }
}


