import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, ViewChild, Injectable, ViewContainerRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MainAPiServiceService, BehaviorService, TableColumnsService } from 'app/_services';
import { Subscription } from 'rxjs';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';

export interface PeriodicElement {
  Chequeno: number;
  Chequetotal: number;
  Description: string;
  Withdrawals: number;
  Deposite: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { Chequeno: 1, Chequetotal: 200, Description: 'abc', Withdrawals: 200, Deposite: 800 },
  { Chequeno: 2, Chequetotal: 400, Description: 'jkd', Withdrawals: 400, Deposite: 600 },
  { Chequeno: 3, Chequetotal: 600, Description: 'abc', Withdrawals: 500, Deposite: 200 },
  { Chequeno: 4, Chequetotal: 300, Description: 'def', Withdrawals: 600, Deposite: 100 },
  { Chequeno: 5, Chequetotal: 500, Description: 'lor', Withdrawals: 700, Deposite: 500 },
];

@Component({
  selector: 'app-recounciliation-item',
  templateUrl: './recounciliation-item.component.html',
  styleUrls: ['./recounciliation-item.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class RecounciliationItemComponent implements OnInit {
  chartAccountDetail: any;
  subscription: Subscription;
  isLoadingResults: boolean = false;
  pageSize: any;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  AccountRecouncile: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ReconciliationData: any = [];
  displayedColumns: string[];
  tempColobj: any;
  ColumnsObj = [];

  constructor(private dialog: MatDialog, private _mainAPiServiceService: MainAPiServiceService, private toastr: ToastrService, private _formBuilder: FormBuilder, public behaviorService: BehaviorService, private TableColumnsService: TableColumnsService, ) { }
  ngOnInit() {
    this.AccountRecouncile = this._formBuilder.group({
      ReconciledDate: [''],
      Statement: [],
      Bankdate: [],
      closeBal: [],
      LastBal: [],
      OutBal: [],
      UnDeposite: [],
      PreBy: [],
      UnbankedCase: [],
      UnWith: [],
      searchFilter: []
    });
    this.behaviorService.ChartAccountData$.subscribe(result => {
      if (result) {
        this.chartAccountDetail = result;
      }
    });
    this.getTableFilter();
    this.LoadData({ AccountGuid: this.chartAccountDetail.ACCOUNTGUID });
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('Reconciliation', 'Reconciliation').subscribe(response => {
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
    localStorage.setItem('RECONCILIATIONGUID', val);
  }
  LoadData(data) {
    this.ReconciliationData = [];
    this.isLoadingResults = true;
    this.subscription = this._mainAPiServiceService.getSetData(data, 'GetReconciliation').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.ReconciliationData = new MatTableDataSource(response.DATA.RECONCILIATIONS);
        this.ReconciliationData.paginator = this.paginator;
        this.ReconciliationData.sort = this.sort;
        if (response.DATA.RECONCILIATIONS[0]) {
          localStorage.setItem('RECONCILIATIONGUID', response.DATA.RECONCILIATIONS[0].RECONCILIATIONGUID);
          this.highlightedRows = response.DATA.RECONCILIATIONS[0].RECONCILIATIONGUID;
        }
        this.isLoadingResults = false;
      } else if (response.CODE == 406 && response.MESSAGE == "Permission denied") {
        this.ReconciliationData = new MatTableDataSource([]);
        this.ReconciliationData.paginator = this.paginator;
        this.ReconciliationData.sort = this.sort;
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
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'Reconciliation', 'list': 'Reconciliation' };
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tempColobj = result.tempColobj;
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        if (!result.columObj) {
          this.ReconciliationData = new MatTableDataSource([]);
          this.ReconciliationData.paginator = this.paginator;
          this.ReconciliationData.sort = this.sort;
        } else {
          this.LoadData({ AccountGuid: this.chartAccountDetail.ACCOUNTGUID });
        }
      }
    });
  }
}
