import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatePipe } from '@angular/common';
import { MainAPiServiceService } from 'app/_services';

const ELEMENT_DATA: any[] = [
  { PeriodStart: 1, TotalHours: 'Hydrogen', TotalDollars: 1.0079 },
  { PeriodStart: 2, TotalHours: 'Helium', TotalDollars: 4.0026 },
  { PeriodStart: 3, TotalHours: 'Lithium', TotalDollars: 6.941 },
  { PeriodStart: 4, TotalHours: 'Beryllium', TotalDollars: 9.0122 },

];
@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss']
})
export class BudgetsComponent implements OnInit {
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  PeriodStart = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';

  isLoadingResults: boolean = false;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;

  public dialogRef: MatDialogRef<BudgetsComponent>;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  displayedColumns: string[] = ['periodstart', 'totalhours', 'totaldollars'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);


  @Input() userForm: FormGroup;
  @Input() USERGUID: any;

  constructor(public _matDialog: MatDialog, public dialog: MatDialog, private _mainAPiServiceService: MainAPiServiceService) { }

  ngOnInit() {
    if (this.USERGUID != "") {
      this._mainAPiServiceService.getSetData({ USERGUID: this.USERGUID, 'GETALLFIELDS': true }, 'getUserBudget').subscribe(response => {
        console.log(response);
        if (response.CODE === 200 && response.STATUS === 'success') {
        } else if (response.MESSAGE == "Not logged in") {
          this.dialogRef.close(false);
        }
        this.isLoadingResults = false;
      }, error => {
        console.log(error);
      });
    } else {

    }
  }
  // All User Budget DilogBox

  // New User Budget
  new_budget() {
    const dialogRef = this.dialog.open(UserBudget, {
      disableClose: true,
      panelClass: 'UserBudget-dialog',
      data: { action: 'new', }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
  //Edit User Budget
  edit_budget() {
    const dialogRef = this.dialog.open(UserBudget, {
      disableClose: true,
      panelClass: 'UserBudget-dialog',
      data: {
        action: 'edit',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // Delete User Budget
  delete_budget(): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: true,
      width: '100%',
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  //click Budget
  clickbudget(val) {

  }


}

@Component({
  selector: 'user-budget-dialog',
  templateUrl: 'user-budget-dialog.html',
  styleUrls: ['user-budget-dialog.scss']
})

export class UserBudget {
  isLoadingResults: boolean = false;
  action_2: string;
  dialogTitle: string;
  isspiner: boolean = false;
  YearlyHours: any;
  YearlyRate: any;
  june1: any;
  Months: any = [];
  @Input() user_budget: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<UserBudget>,
    @Inject(MAT_DIALOG_DATA) public data_2: any,
    private _formBuilder: FormBuilder,
    public datepipe: DatePipe
  ) {
    this.action_2 = data_2.action;
    if (this.action_2 === 'new') {
      this.dialogTitle = 'New Budget';
    } else {
      this.dialogTitle = 'Edit Budget';
    }
    this.Months = [];
    for (let i = 0; i < 12; i++) {
      let nowdate = (new Date());
      nowdate = new Date(nowdate.getFullYear(), nowdate.getMonth(), 1);
      nowdate.setMonth(nowdate.getMonth() + i);
      this.Months.push(nowdate);
    }
    console.log(this.Months);
  }

  ngOnInit() {
    this.user_budget = this._formBuilder.group({
      Budgetdate: [new Date()],
      ratehr: [],
      Year: [],
      ExGst: [],
      june1: [],
      hoursyear: [],
      rateyear: [],
    });
  }

  // Year Hour
  YearHour(val) {
    console.log(val);
    this.YearlyHours = val / 12
    console.log("Year Hour work!!!");
  }
  //Year EX Gst
  YearExGst(val) {
    console.log(val);
    console.log("Year Gst work!!!");
    this.YearlyRate = val / 12
  }


  NowDate(value) {
    this.Months = [];
    for (let i = 0; i < 12; i++) {
      let nowdate = (new Date(value));
      nowdate = new Date(nowdate.getFullYear(), nowdate.getMonth(), 1);
      nowdate.setMonth(nowdate.getMonth() + i);
      this.Months.push(nowdate);
    }
    console.log(this.Months);
  }

  //Save Budget
  ok_budget() {
    alert('Save budget!!!');
  }
  // Close User Budget
  CloseUserBudget(): void {
    this.dialogRef.close(false);
  }
}