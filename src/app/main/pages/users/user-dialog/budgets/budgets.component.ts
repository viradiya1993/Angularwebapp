import { Component, OnInit, Input, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatSort } from '@angular/material';
import { DatePipe } from '@angular/common';
import { MainAPiServiceService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { UserBudgetDialogComponent } from './user-budget-dialog/user-budget-dialog.component';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BudgetsComponent implements OnInit {
  highlightedRows: any;
  isLoadingResults: boolean = false;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  userBudgets: any = [];
  currentBudgets: any;
  pageSize: any;
  public dialogRef: MatDialogRef<BudgetsComponent>;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  displayedColumns: string[] = ['PERIODSTART', 'TOTALBUDGETHOURS', 'TOTALBUDGETDOLLARS'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() userForm: FormGroup;
  @Input() USERGUID: any;

  constructor(public _matDialog: MatDialog, public dialog: MatDialog, private _mainAPiServiceService: MainAPiServiceService, private _toastrService: ToastrService) { }

  ngOnInit() {
    if (this.USERGUID != "") {
      this.loadData();
    } else {
      this.userBudgets = new MatTableDataSource([]);
      this.userBudgets.paginator = this.paginator;
      this.userBudgets.sort = this.sort;
    }
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  loadData() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({ USERGUID: this.USERGUID, 'GETALLFIELDS': true }, 'getUserBudget').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.USERBUDGETS[0]) {
          this.highlightedRows = response.DATA.USERBUDGETS[0].USERBUDGETGUID;
          this.currentBudgets = response.DATA.USERBUDGETS[0];
          localStorage.setItem('current_budgets', JSON.stringify(response.DATA.USERBUDGETS[0]));
        }
        this.userBudgets = new MatTableDataSource(response.DATA.USERBUDGETS);
        this.userBudgets.paginator = this.paginator;
        this.userBudgets.sort = this.sort;
        this.isLoadingResults = false;
      } else if (response.MESSAGE == "Not logged in") {
        this.dialogRef.close(false);
      }
    }, error => {
      console.log(error);
    });
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  // Delete User Budget
  delete_budget(): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, { disableClose: true, width: '100%' });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        let budgetsData: any = JSON.parse(localStorage.getItem('current_budgets'));
        let postData = { FormAction: "delete", DATA: { USERBUDGETGUID: budgetsData.USERBUDGETGUID } };
        this._mainAPiServiceService.getSetData(postData, 'SetUserBudget').subscribe(res => {
          if (res.STATUS == "success" && res.CODE == 200) {
            this._toastrService.success('Delete successfully');
            this.loadData();
          }
        });
      }
      this.confirmDialogRef = null;
    });
  }
  budgetDailog(actionType) {
    const dialogRef = this.dialog.open(UserBudgetDialogComponent, {
      disableClose: true, panelClass: 'UserBudget-dialog', data: { action: actionType, USERGUID: this.USERGUID }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result)
        this.loadData();
    });
  }
  setActiveBudget(val: any) {
    this.currentBudgets = val;
    localStorage.setItem('current_budgets', JSON.stringify(val));
  }
}