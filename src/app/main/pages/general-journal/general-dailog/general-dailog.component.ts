import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BankingDialogComponent } from '../../banking/banking-dialog.component';

@Component({
  selector: 'app-general-dailog',
  templateUrl: './general-dailog.component.html',
  styleUrls: ['./general-dailog.component.scss']
})
export class GeneralDailogComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  isLoadingResults: boolean = false;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  Number = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  displayedColumns: string[] = ['Number', 'Account', 'Debit', 'Credit'];
  dataSource: any = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  disabledField: any;
  addbtn: any;
  btnhide: any;
  DEBITSTOTAL = 0;
  CREDITSTOTAL = 0;
  craditDEbitData = { DRCR: new Date(), AMOUNT: '', ACCOUNTGUID: '' };
  isDisable: boolean = true;
  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<GeneralDailogComponent>,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.btnhide = 'NewDelete';
    this.dataSource = new MatTableDataSource([]);
  }
  //SaveGeneral
  SaveGeneral() {
  }
  //SelecteAccount
  SelecteAccount() {
    const dialogRef = this.MatDialog.open(BankingDialogComponent, {
      disableClose: true, width: '100%', data: { AccountType: '' }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
  //NewItem
  NewItem() {
    this.btnhide = 'AddCancel';
    this.isDisable = false;
  }
  //DeleteItem
  DeleteItem() {

  }
  //AddItem
  AddItem() {

  }
  //CancelItem
  CancelItem() {
    this.btnhide = 'NewDelete';
    this.isDisable = true;
  }
  //clickNo
  clickNo() {

  }

}
