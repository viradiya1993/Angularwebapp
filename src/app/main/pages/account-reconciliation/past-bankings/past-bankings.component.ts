import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { BehaviorService, TableColumnsService, MainAPiServiceService } from 'app/_services';
import { Subscription } from 'rxjs';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';

@Component({
  selector: 'app-past-bankings',
  templateUrl: './past-bankings.component.html',
  styleUrls: ['./past-bankings.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class PastBankingsComponent implements OnInit {
  subscription: Subscription;
  chartAccountDetail: any;
  PastBanking: FormGroup;
  pageSize: any;
  isLoadingResults: boolean = false;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  bankingPastData: any = [];
  displayedColumns: string[];
  tempColobj: any;
  ColumnsObj = [];
  isDisplay: boolean = false;

  @ViewChild(MatSort,{static: false}) sort: MatSort;
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  constructor(private dialog: MatDialog, private _mainAPiServiceService: MainAPiServiceService, private toastr: ToastrService, private _formBuilder: FormBuilder, public behaviorService: BehaviorService, private TableColumnsService: TableColumnsService, ) { }

  ngOnInit() {
    this.behaviorService.ChartAccountData$.subscribe(result => {
      if (result) {
        this.chartAccountDetail = result;
      }
    });
    this.getTableFilter();
    this.LoadData({ AccountGuid: this.chartAccountDetail.ACCOUNTGUID });
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('Reconciliation', 'PastBanking').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS);
        this.tempColobj = data.tempColobj;
        this.displayedColumns = data.showcol;
        this.ColumnsObj = data.colobj;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  editBanking(val, row) {
    localStorage.setItem('BANKINGGUID', val);
  }
  LoadData(data) {
    this.bankingPastData = [];
    this.isLoadingResults = true;
    this.subscription = this._mainAPiServiceService.getSetData(data, 'GetBanking').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.bankingPastData = new MatTableDataSource(response.DATA.BANKINGS);
        this.bankingPastData.paginator = this.paginator;
        this.bankingPastData.sort = this.sort;
        if (response.DATA.BANKINGS[0]) {
          this.isDisplay = false;
          localStorage.setItem('BANKINGGUID', response.DATA.BANKINGS[0].BANKINGGUID);
          this.highlightedRows = response.DATA.BANKINGS[0].BANKINGGUID;
        }else {
          this.isDisplay = true;
        }
        this.isLoadingResults = false;
      } else if (response.CODE == 406 && response.MESSAGE == "Permission denied") {
        this.bankingPastData = new MatTableDataSource([]);
        this.bankingPastData.paginator = this.paginator;
        this.bankingPastData.sort = this.sort;
        this.isLoadingResults = false;
      }
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'Reconciliation', 'list': 'PastBanking' };
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tempColobj = result.tempColobj;
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        if (!result.columObj) {
          this.bankingPastData = new MatTableDataSource([]);
          this.bankingPastData.paginator = this.paginator;
          this.bankingPastData.sort = this.sort;
          this.isDisplay = true;
        } else {
          this.LoadData({ AccountGuid: this.chartAccountDetail.ACCOUNTGUID });
        }
      }
    });
  }


}
