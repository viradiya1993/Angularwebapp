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
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-recounciliation-item',
  templateUrl: './recounciliation-item.component.html',
  styleUrls: ['./recounciliation-item.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class RecounciliationItemComponent implements OnInit {
  chartAccountDetail: any;
errorWarningData: any = { "Error": [], 'Warning': [] };
  subscription: Subscription;
  isLoadingResults: boolean = false;
  pageSize: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
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
  recouncileItemdata: any;

  constructor(private dialog: MatDialog, public datepipe: DatePipe,
     private _mainAPiServiceService: MainAPiServiceService, private toastr: ToastrService, private _formBuilder: FormBuilder,
      public behaviorService: BehaviorService, private TableColumnsService: TableColumnsService, public _matDialog: MatDialog,) { }
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
    // let getdate = new Date(sendDate[1] + '/' + sendDate[0] + '/' + sendDate[2]), y = getdate.getFullYear(), m = getdate.getMonth();;;
      //  let lateday = new Date(y, m + 1, 0);
    this.lastDay=this.datepipe.transform(new Date(), 'dd/MM/yyyy');
    this.AccountRecouncile.controls['Bankdate'].setValue(new Date());
    this.getTableFilter();
    this.LoadData({ AccountGuid: this.chartAccountDetail.ACCOUNTGUID, 'BankStatementDate': this.lastDay });
  
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
    this.behaviorService.RecouncileItemSendSetData({ 
      ACCOUNTGUID:this.chartAccountDetail.ACCOUNTGUID, 
      PERIODENDDATE:this.lastDay,
      STARTINGBALANCE:'',
      DEPOSITS:this.f.UnDeposite.value,
      WITHDRAWALS:this.f.UnWith.value,
      UNPRESENTEDDEPOSITS:this.f.UnDeposite.value,
      UNPRESENTEDWITHDRAWALS:this.f.UnWith.value,
      ENDINGBALANCE:this.f.calculatedClosingBalance.value,
      PREPAREDBY:this.f.PreBy.value,
      RECONCILIATIONITEMS: this.selection.selected })
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
    // this.SendRecouncileArray.push(this.selection.selected);
      this.behaviorService.RecouncileItemSendSetData({ 
      ACCOUNTGUID:this.chartAccountDetail.ACCOUNTGUID, 
      PERIODENDDATE:this.lastDay,
      STARTINGBALANCE:'',
      DEPOSITS:this.f.UnDeposite.value,
      WITHDRAWALS:this.f.UnWith.value,
      UNPRESENTEDDEPOSITS:this.f.UnDeposite.value,
      UNPRESENTEDWITHDRAWALS:this.f.UnWith.value,
      ENDINGBALANCE:this.f.calculatedClosingBalance.value,
      PREPAREDBY:this.f.PreBy.value,
      RECONCILIATIONITEMS: this.selection.selected })
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
    this.AccountRecouncile.controls['calculatedClosingBalance'].setValue(0);
    this.AccountRecouncile.controls['statementClosingBalance'].setValue(0);
    this.AccountRecouncile.controls['OutBal'].setValue(0);
    this.AccountRecouncile.controls['UnDeposite'].setValue(0);
    this.AccountRecouncile.controls['UnWith'].setValue(0);
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
        if(response.DATA.RECONCILIATIONITEMS[0]){
        }else{
          this.AccountRecouncile.controls['UnDeposite'].setValue(0);
          this.AccountRecouncile.controls['UnWith'].setValue(0);
        }
     


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
  SetRecouncilItem(){
    this.behaviorService.RecouncileItemSendSetData$.subscribe(result => {
      this.recouncileItemdata = result
  });
  // let postData = this.recouncileItemdata;
  // let sendData = {
  //     DATA: postData, FormAction: 'insert'
  // }

  let finalData = { DATA: this.recouncileItemdata, FormAction: 'insert', VALIDATEONLY: true }
  this._mainAPiServiceService.getSetData(finalData, 'SetReconciliation').subscribe(response => {
    if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
      this.checkValidation(response.DATA.VALIDATIONS, finalData);
    } else if (response.CODE == 451 && response.STATUS == 'warning') {
      this.checkValidation(response.DATA.VALIDATIONS, finalData);
    } else if (response.CODE == 450 && response.STATUS == 'error') {
      this.checkValidation(response.DATA.VALIDATIONS, finalData);
    } else if (response.MESSAGE == 'Not logged in') {
    } else {

    }

  }, err => {
    this.toastr.error(err);
  });

  }
  checkValidation(bodyData: any, details: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'No') {
        errorData.push(value.ERRORDESCRIPTION);
        tempError[value.FIELDNAME] = value;
      }
      else if (value.VALUEVALID == 'Warning') {
        tempWarning[value.FIELDNAME] = value;
        warningData.push(value.ERRORDESCRIPTION);
      }

    });
    this.errorWarningData = { "Error": tempError, 'Warning': tempWarning };
    if (Object.keys(errorData).length != 0) {
      this.toastr.error(errorData);
    } else if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.RecouncileSaveData(details);
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.RecouncileSaveData(details);
    }
  }
  RecouncileSaveData(data: any) {
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetTask').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.toastr.success(' save successfully');
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.toastr.warning(response.MESSAGE);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.toastr.error(response.MESSAGE);
      } else if (response.MESSAGE == 'Not logged in') {
      }

    }, error => {
      this.toastr.error(error);
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
