import { Component, OnInit, Inject, ViewChild,ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl,FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BankingDialogComponent } from '../../banking/banking-dialog.component';
import { TimersService, BehaviorService,MainAPiServiceService } from 'app/_services';
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-general-dailog',
  templateUrl: './general-dailog.component.html',
  styleUrls: ['./general-dailog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
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
  craditDEbitData = { DRCR: '', AMOUNT: '', ACCOUNTGUID: '' };
  isDisable: boolean = true;
  GeneralForm: FormGroup;
  GeneralDate: Date;
  DATEVLAUE: any;
  errorWarningData: any = {};
  
  //buttonDisabled: boolean = true;
  successMsg: any;
  Slice: any;
  Slice2: any;
  hide: boolean;
  JournalData:any=[];
  FormAction: string;
  JournalGuid: string;
  DEBITSTOTAL:any = 0;
  CREDITSTOTAL:any = 0;
  CREDITDEBITDATA: any=[];
  CREDITDATAARRY:any=[];
  DEBITDATAARRAY:any=[];
  Accountguid:any;
  Accountname:any;
  FinalDebitTotal: any;
  FinalCreditTotal: any;
  CREDITTOTALFINAL:any=[];
  DEBITSTOTALFINAL:any=[];
  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<GeneralDailogComponent>,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private Timersservice: TimersService,
    public datepipe: DatePipe,
    private behaviorService: BehaviorService,
    public _mainAPiServiceService: MainAPiServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) 
  { 
    this.action = data.action;
    if(this.action === 'new'){
      this.dialogTitle = 'New General Journal Entry';
    }else if(this.action === 'edit'){
      this.dialogTitle = 'Update General Journal Entry';
    }else{
      this.dialogTitle = 'Duplicate General Journal Entry';
    }
    this.behaviorService.GeneralData$.subscribe(result => {
      if (result) {
          this.JournalData = result; 
      }
  });    
  }

  ngOnInit() {
    this.btnhide = 'NewDelete';
    this.dataSource = new MatTableDataSource([]);
    this.GeneralForm = this._formBuilder.group({
      DATEGENERAL: ['', Validators.required],
      DESCRIPTION:[''],
      TOTALDEBIT:[''],
      TOTALCREDITS:[''],
      GAMOUNT:[''],
      ACCOUNT:[''],
      AccountGuid:[''],
      CRDR:[''],
      NEWDATE: [this.datepipe.transform(new Date(), 'dd/MM/yyyy')],
    });
    if (this.action == 'edit' || this.action == 'duplicate'){
      this.EditGeneral();
    }
    this.GeneralDate = new Date();
    this.hide = true;
    $("#accountnew").addClass("menu-disabled");   
    this.GeneralForm.controls['GAMOUNT'].disable();
    this.GeneralForm.controls['ACCOUNT'].disable();
    this.GeneralForm.controls['CRDR'].disable();
  }

  get f() {
    return this.GeneralForm.controls;
  }
  
  //choosedDate
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.DATEVLAUE = this.datepipe.transform(event.value, 'dd/MM/yyyy');
  }
  //SelecteAccount
  SelecteAccount() {
    const dialogRef = this.MatDialog.open(BankingDialogComponent, {
      disableClose: true, width: '100%', data: { AccountType: '' }
    });
    dialogRef.afterClosed().subscribe(result => { 
      let AccountName = result.name;
      this.Slice = AccountName.slice(0,8); 
      this.Slice2 = AccountName.slice(9); 
      this.GeneralForm.controls['ACCOUNT'].setValue(result.name);
      this.Accountguid = result.ACCOUNTGUID;
      //this.GeneralForm.controls['AccountGuid'].setValue(result.ACCOUNTGUID);
    });
  }
  //NewItem
  NewItem() {
    this.btnhide = 'AddCancel';
    this.isDisable = false;
    this.hide = false;
    $("#accountnew").removeClass("menu-disabled");   
    this.GeneralForm.controls['GAMOUNT'].enable();
    this.GeneralForm.controls['ACCOUNT'].enable();
    this.GeneralForm.controls['CRDR'].enable();
  }
  //DeleteItem
  DeleteItem() {

  }
  //AddItem
  AddItem() {
  this.btnhide = 'NewDelete';
  this.isDisable = true;
  if(this.craditDEbitData.AMOUNT == '' || this.craditDEbitData.AMOUNT == null ){
      this.toastr.error('Please enter amount.');
      return false;
  }else if(this.craditDEbitData.ACCOUNTGUID=='' ||this.craditDEbitData.ACCOUNTGUID == null){
      this.toastr.error('Please select account.');
      return false;
  }
  if(this.craditDEbitData.DRCR === 'CR'){
    this.CREDITDEBITDATA.push({
        ACCOUNTNUMBER:this.Slice,
        ACCOUNTNAME:this.Slice2,
        CREDITAMOUNT:this.craditDEbitData.AMOUNT,
        DEBITAMOUNT:0,
    });
    this.CREDITSTOTAL += this.craditDEbitData.AMOUNT;
    this.CREDITDATAARRY.push({
      ACCOUNTGUID:this.Accountguid,
      AMOUNT:this.craditDEbitData.AMOUNT
    });
    this.GeneralForm.controls['ACCOUNT'].setValue('');
    this.craditDEbitData.AMOUNT='';    
  }else{
    this.CREDITDEBITDATA.push({
      ACCOUNTNUMBER:this.Slice,
      ACCOUNTNAME:this.Slice2,
      CREDITAMOUNT:0,
      DEBITAMOUNT:this.craditDEbitData.AMOUNT,
    });
    this.DEBITSTOTAL += this.craditDEbitData.AMOUNT;
    this.DEBITDATAARRAY.push({
      ACCOUNTGUID:this.Accountguid,
      AMOUNT:this.craditDEbitData.AMOUNT
    });
    this.GeneralForm.controls['ACCOUNT'].setValue('');
    this.craditDEbitData.AMOUNT='';
  }
 
 }
  //CancelItem
  CancelItem() {
    this.btnhide = 'NewDelete';
    this.isDisable = true;
    this.hide = true;
    $("#accountnew").addClass("menu-disabled");   
    this.GeneralForm.controls['GAMOUNT'].disable();
    this.GeneralForm.controls['ACCOUNT'].disable();
    this.GeneralForm.controls['CRDR'].disable();
  }
  //clickNo
  clickNo() {

  }
  ClickData(){

  }
  //SaveGeneral
  SaveGeneral() {
    if (this.DATEVLAUE == "" || this.DATEVLAUE == null || this.DATEVLAUE == undefined) {
        this.DATEVLAUE = this.f.NEWDATE.value;
    }
    if(this.action === 'new' || this.action === 'duplicate'){
      this.FormAction = 'insert';
      this.JournalGuid = "";   
    } else {
        this.FormAction = 'update';
        this.JournalGuid =this.JournalData.JOURNALGUID;
    }   
    let PostData: any = {
      JOURNALGUID:this.JournalGuid,
      DATE: this.DATEVLAUE,
      JOURNALTIME:"",
      DESCRIPTION:this.f.DESCRIPTION.value,
      DEBITS:this.DEBITDATAARRAY,     
      CREDITS:this.CREDITDATAARRY
    }
   // return;
    this.isspiner = true;
    if(this.CREDITSTOTAL === this.DEBITSTOTAL){
      this.successMsg = 'Save successfully';
      let details = { FormAction: this.FormAction, VALIDATEONLY: true, Data: PostData };
      this._mainAPiServiceService.getSetData(details, 'SetJournal').subscribe(response => {     
        if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
          this.checkValidation(response.DATA.VALIDATIONS, details);
        } else if (response.CODE == 451 && response.STATUS == 'warning') {
          this.checkValidation(response.DATA.VALIDATIONS, details);
        } else if (response.CODE == 450 && response.STATUS == 'error') {
          this.checkValidation(response.DATA.VALIDATIONS, details);
        } else if (response.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        } else {
          this.isspiner = false;
        }
      }, error => {
        this.toastr.error(error);
      });
    }else{
      this.toastr.error('Credit Amount total and Debit Amount total not equal.');
    }
  }
  
  checkValidation(bodyData: any, PostActivityData: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'No') {
        errorData.push(value.ERRORDESCRIPTION);
        tempError[value.FIELDNAME] = value;
      } else if (value.VALUEVALID == 'Warning') {
        tempWarning[value.FIELDNAME] = value;
        warningData.push(value.ERRORDESCRIPTION);
      }
    });
    this.errorWarningData = { "Error": tempError, 'warning': tempWarning };
    if (Object.keys(errorData).length != 0)
      this.toastr.error(errorData);
    if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef = this.MatDialog.open(FuseConfirmDialogComponent, {
        disableClose: true, width: '100%', data: warningData
      });
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.saveActivityData(PostActivityData);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.saveActivityData(PostActivityData);
    this.isspiner = false;
  }
  saveActivityData(PostActivityData: any) {
    PostActivityData.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(PostActivityData, 'SetJournal').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.toastr.success(this.successMsg);
        this.dialogRef.close(true);
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.toastr.warning(this.successMsg);
        this.isspiner = false;
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.toastr.error(res.STATUS);
        this.isspiner = false;
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
  //EditGeneral
  EditGeneral(){
    //GetJournal
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({JOURNALGUID:this.JournalData.JOURNALGUID}, 'GetJournal').subscribe(result => {
      console.log(result);
      if (result.CODE == 200 && result.STATUS == "success") {
        this.GeneralForm.controls['DESCRIPTION'].setValue(result.DATA.JOURNALS[0].DESCRIPTION);
        this.CREDITDEBITDATA = result.DATA.JOURNALS[0].JOURNALITEMS;
        this.CreditDebitTotal();
        this.isLoadingResults = false;
      }
    }, err => {
       this.toastr.error(err);
       this.isLoadingResults = false;
    });
  }
  CreditDebitTotal() {
    this.CREDITTOTALFINAL = [];
    this.DEBITSTOTALFINAL = [];
    this.CREDITDEBITDATA.forEach(element => {
      this.CREDITTOTALFINAL.push(element.CREDITAMOUNT);
      this.DEBITSTOTALFINAL.push(Number(element.DEBITAMOUNT));
    });
    this.FinalDebitTotal = Number(this.DEBITSTOTALFINAL.reduce(function (a = 0, b = 0) { return a + b; }, 0));
    this.FinalCreditTotal = Number(this.CREDITTOTALFINAL.reduce(function (a = 0, b = 0) { return a + b; }, 0));    
    this.GeneralForm.controls['TOTALDEBIT'].setValue(parseFloat(this.FinalDebitTotal).toFixed(2));
    this.GeneralForm.controls['TOTALCREDITS'].setValue(parseFloat(this.FinalCreditTotal).toFixed(2));
  }


}
