import { Component, OnInit, Inject,ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA,MatPaginator} from '@angular/material';
import { Router } from '@angular/router';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectAccountComponent} from './../../select-account/select-account.component';


export interface PeriodicElement {
  Number:number;
  Account:string;
  Debit:any;
  Credit:string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {Number: 1, Account: 'Hydrogen', Debit: 1.0079, Credit: 'H'},
  {Number: 2, Account: 'Helium', Debit: 4.0026, Credit: 'He'},
  {Number: 3, Account: 'Lithium', Debit: 6.941, Credit: 'Li'},
  {Number: 4, Account: 'Beryllium', Debit: 9.0122, Credit: 'Be'},
  {Number: 5, Account: 'Boron', Debit: 10.811, Credit: 'B'},
  
];
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
  GenrealForm:FormGroup;
  highlightedRows:any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  Number = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  displayedColumns: string[] = ['Number', 'Account', 'Debit', 'Credit'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  disabledField:any;
  addbtn:any;
  btnhide:any;
  constructor
  (
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<GeneralDailogComponent>,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog, 
    public dialog: MatDialog
  ) 
  {

  }

  ngOnInit() {
    this.btnhide='NewDelete';
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
 

    this.GenrealForm = this._formBuilder.group({
      GenralDate: [new Date()],
      description:['',Validators.required],
      total:[''],
      total1:[''],
      amount:[''],
      account:[''],
      DRCR:['']
    });
    this.GenrealForm.controls['amount'].disable();
    this.GenrealForm.controls['account'].disable();
    this.GenrealForm.controls['DRCR'].disable();
  }
  //SaveGeneral
  SaveGeneral(){
  }
  //SelecteAccount
  SelecteAccount(){
    const dialogRef = this.dialog.open(SelectAccountComponent, {

    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  //NewItem
  NewItem(){
    this.btnhide='AddCancel';
    this.GenrealForm.controls['amount'].enable();
    this.GenrealForm.controls['account'].enable();
    this.GenrealForm.controls['DRCR'].enable();
  }
  //DeleteItem
  DeleteItem(){

  }
  //AddItem
  AddItem(){

  }
  //CancelItem
  CancelItem(){
  this.btnhide='NewDelete';
  }
  //clickNo
  clickNo(){

  }

}
