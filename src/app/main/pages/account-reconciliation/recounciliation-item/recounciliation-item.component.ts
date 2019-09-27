import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, ViewChild, Injectable, ViewContainerRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialogRef, MatDialog, MatDialogConfig, MatDatepickerInputEvent } from '@angular/material';
import { MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MainAPiServiceService, BehaviorService, TableColumnsService } from 'app/_services';
import { Subscription } from 'rxjs';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { DatePipe } from '@angular/common';

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
  DebitAmount: any = [];
  CraditAmount: any = [];
  SendRecouncileArray: any = [];
  FirstTimeWithDrawTotal: any = [];
  FirstTimeWithDrawTotalArray: any = [];
  FirstTimeDipositeTotalArray: any = [];
  AccountRecouncile: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ReconciliationData: any = [];
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[];
  tempColobj: any;
  ColumnsObj = [];
  CalculatedClosingBalnce: number;
  DepositBalnce: number;
  FirstTimeDipositeTotal: number;
  lastDay: any;

  constructor(private dialog: MatDialog, public datepipe: DatePipe, private _mainAPiServiceService: MainAPiServiceService, private toastr: ToastrService, private _formBuilder: FormBuilder, public behaviorService: BehaviorService, private TableColumnsService: TableColumnsService, ) { }
  ngOnInit() {
    this.ReconciliationData = [];
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
    let sendDate = this.chartAccountDetail.MainList.RECONCILEDGROUP.LASTRECONCILEDDATE.split("/");
    let getdate = new Date(sendDate[1] + '/' + sendDate[0] + '/' + sendDate[2]), y = getdate.getFullYear(), m = getdate.getMonth();;;
       let lateday = new Date(y, m + 1, 0);
       this.lastDay=this.datepipe.transform(this.lastDay, 'dd/MM/yyyy')
    this.AccountRecouncile.controls['Bankdate'].setValue(this.lastDay);
    this.getTableFilter();
    this.LoadData({ AccountGuid: this.chartAccountDetail.ACCOUNTGUID, 'BankStatementDate': this.datepipe.transform(this.lastDay, 'dd/MM/yyyy') });
  
    // this.LoadData({ AccountGuid: "ACCAAAAAAAAAAAA4", 'BankStatementDate': '30/11/2015' });
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
    this.GloballyCal();
    this.SendRecouncileArray.push(this.selection.selected);
    this.behaviorService.RecouncileItemSendSetData({ "BankStatementDate": "30/11/2015", "ClosingBalance": this.f.statementClosingBalance.value, "item": this.selection.selected })


  }
  get f() {
    return this.AccountRecouncile.controls;
  }
  GloballyCal() {
    this.DebitAmount = [];
    this.CraditAmount = [];
    this.selection.selected.forEach(element => {
      this.DebitAmount.push(element.DEBITAMOUNT);
      this.CraditAmount.push(element.CREDITAMOUNT);
      this.CalculatedClosingBalnce = Number(this.DebitAmount.reduce(function (a = 0, b = 0) { return a + b; }, 0));
      this.DepositBalnce = Number(this.CraditAmount.reduce(function (a = 0, b = 0) { return a + b; }, 0));
      // this.WithdrawalBalnce = Number(this.CraditAmount.reduce(function (a = 0, b = 0) { return a + b; }, 0));
    });
    if (this.selection.selected.length == 0) {
      this.CalculatedClosingBalnce = 0;
      this.DepositBalnce = 0;
    }
    let finalTotal = Number(this.f.LASTRECONCILEDBALANCE.value) + this.CalculatedClosingBalnce - this.DepositBalnce;
    let deposit = Number(this.DepositBalnce).toFixed(2);
    let withdrawal = Number(this.CalculatedClosingBalnce).toFixed(2);
    this.AccountRecouncile.controls['UnDeposite'].setValue(deposit);
    this.AccountRecouncile.controls['UnWith'].setValue(withdrawal);
    this.AccountRecouncile.controls['calculatedClosingBalance'].setValue(finalTotal);
  }
  helloFunction() {
    this.GloballyCal();
    this.FirstTimeCal('');
    console.log(this.selection.selected);
    // this.SendRecouncileArray.push(this.selection.selected);
    this.behaviorService.RecouncileItemSendSetData({ "BankStatementDate": "30/11/2015", "ClosingBalance": this.f.statementClosingBalance.value, "item": this.selection.selected })
    // this.SelectedItemArray.push(this.selection.selected)
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  statmentClosingBal() {
    let val = Number(this.f.statementClosingBalance.value) - Number(this.f.calculatedClosingBalance.value);
    this.AccountRecouncile.controls['OutBal'].setValue(val);
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
    // this.subscription.unsubscribe();
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  FirstTimeCal(data) {
    if (data != '') {
      data.forEach(element => {

        this.FirstTimeWithDrawTotalArray.push(element.DEBITAMOUNT);
        this.FirstTimeWithDrawTotal = Number(this.FirstTimeWithDrawTotalArray.reduce(function (a = 0, b = 0) { return a + b; }, 0));

        this.FirstTimeDipositeTotalArray.push(element.CREDITAMOUNT);
        this.FirstTimeDipositeTotal = Number(this.FirstTimeDipositeTotalArray.reduce(function (a = 0, b = 0) { return a + b; }, 0));

        // this.DepositBalnce = Number(this.CraditAmount.reduce(function (a = 0, b = 0) { return a + b; }, 0));
      });
    }
    let FinalValWithdrawl = (this.FirstTimeWithDrawTotal - this.f.UnWith.value).toFixed(2);
    let FinalValdeposit = (this.FirstTimeDipositeTotal - this.f.UnDeposite.value).toFixed(2);

    this.AccountRecouncile.controls['UnWith'].setValue(FinalValWithdrawl);
    this.AccountRecouncile.controls['UnDeposite'].setValue(FinalValdeposit);
  }
  LoadData(data) {
    this.ReconciliationData = [];
    this.isLoadingResults = true;
    this.subscription = this._mainAPiServiceService.getSetData(data, 'GetReconciliationItems').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.FirstTimeCal(response.DATA.RECONCILIATIONITEMS);
        this.ReconciliationData = new MatTableDataSource(response.DATA.RECONCILIATIONITEMS);
        this.ReconciliationData.paginator = this.paginator;
        this.ReconciliationData.sort = this.sort;
        this.AccountRecouncile.controls['LASTRECONCILEDDATE'].setValue(response.DATA.LASTRECONCILEDDATE);
        this.AccountRecouncile.controls['LASTRECONCILEDBALANCE'].setValue(response.DATA.LASTRECONCILEDBALANCE);
        this.AccountRecouncile.controls['calculatedClosingBalance'].setValue(response.DATA.LASTRECONCILEDBALANCE);

        this.AccountRecouncile.controls['statementClosingBalance'].setValue(0.00);
        this.statmentClosingBal();
        this.AccountRecouncile.controls['OutBal'].setValue(response.DATA.LASTRECONCILEDBALANCE);
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
          this.LoadData({ AccountGuid: this.chartAccountDetail.ACCOUNTGUID, 'BankStatementDate': this.lastDay });
          // this.LoadData({ AccountGuid: "ACCAAAAAAAAAAAA4", 'BankStatementDate': "3/09/2019" });
          // this.LoadData({ AccountGuid: this.chartAccountDetail.ACCOUNTGUID });
        }
      }
    });
  }
  refreshRecouncilItem() {
    this.LoadData({ AccountGuid: this.chartAccountDetail.ACCOUNTGUID, 'BankStatementDate': this.lastDay });
    // this.LoadData({ AccountGuid: "ACCAAAAAAAAAAAA4", 'BankStatementDate': "3/09/2019" });
  }
  BankchoosedDate(type: string, event: MatDatepickerInputEvent<Date>){
    this.lastDay= this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.LoadData({ AccountGuid: this.chartAccountDetail.ACCOUNTGUID, 'BankStatementDate':  this.lastDay });
  }
}
