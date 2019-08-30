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
  AccountRecouncile: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ReconciliationData: any = [];
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[];
  tempColobj: any;
  ColumnsObj = [];

  constructor(private dialog: MatDialog, private _mainAPiServiceService: MainAPiServiceService, private toastr: ToastrService, private _formBuilder: FormBuilder, public behaviorService: BehaviorService, private TableColumnsService: TableColumnsService, ) { }
  ngOnInit() {
    let userdata = JSON.parse(localStorage.getItem('currentUser'));
    this.AccountRecouncile = this._formBuilder.group({
      LASTRECONCILEDDATE: [''],
      LASTRECONCILEDBALANCE: [],
      statementClosingBalance: [],
      Bankdate: [],
      calculatedClosingBalance: [],
      OutBal: [],
      UnDeposite: [],
      PreBy: [userdata.UserName],
      UnWith: [],
    });
    this.behaviorService.ChartAccountData$.subscribe(result => {
      if (result) {
        this.chartAccountDetail = result;
      }
    });
    this.getTableFilter();
    this.LoadData({ AccountGuid: "ACCAAAAAAAAAAAA4", 'BankStatementDate': "30/11/2015" });
    // this.LoadData({ AccountGuid: this.chartAccountDetail.ACCOUNTGUID });
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.ReconciliationData.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.ReconciliationData.data.forEach(row => this.selection.select(row));
  }
  helloFunction() {
    console.log(this.selection.selected);
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('Reconciliation', 'Reconciliation').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS);
        this.tempColobj = data.tempColobj;
        this.displayedColumns = data.showcol;
        this.displayedColumns.splice(0, 0, "select");
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

  LoadData(data) {
    this.ReconciliationData = [];
    this.isLoadingResults = true;
    this.subscription = this._mainAPiServiceService.getSetData(data, 'GetReconciliationItems').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.ReconciliationData = new MatTableDataSource(response.DATA.RECONCILIATIONITEMS);
        this.AccountRecouncile.controls['LASTRECONCILEDDATE'].setValue(response.DATA.LASTRECONCILEDDATE);
        this.AccountRecouncile.controls['LASTRECONCILEDBALANCE'].setValue(response.DATA.LASTRECONCILEDBALANCE);
        this.AccountRecouncile.controls['calculatedClosingBalance'].setValue(response.DATA.LASTRECONCILEDBALANCE);
        this.ReconciliationData.paginator = this.paginator;
        this.ReconciliationData.sort = this.sort;
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
        this.displayedColumns.splice(0, 0, "select");
        this.ColumnsObj = result.columnameObj;
        if (!result.columObj) {
          this.ReconciliationData = new MatTableDataSource([]);
          this.ReconciliationData.paginator = this.paginator;
          this.ReconciliationData.sort = this.sort;
        } else {
          this.LoadData({ AccountGuid: "ACCAAAAAAAAAAAA4", 'BankStatementDate': "30/11/2015" });
          // this.LoadData({ AccountGuid: this.chartAccountDetail.ACCOUNTGUID });
        }
      }
    });
  }
}
