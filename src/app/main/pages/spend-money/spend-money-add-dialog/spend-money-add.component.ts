import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ContactSelectDialogComponent } from '../../contact/contact-select-dialog/contact-select-dialog.component';
import { MatterDialogComponent } from '../../time-entries/matter-dialog/matter-dialog.component';
import * as $ from 'jquery';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { SpendmoneyService, TableColumnsService, ContactService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material';


@Component({
  selector: 'app-spend-money-add',
  templateUrl: './spend-money-add.component.html',
  styleUrls: ['./spend-money-add.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SpendMoneyAddComponent implements OnInit {
  action: any;
  dialogTitle: string;
  isLoadingResults: boolean;
  spendmoneyForm: FormGroup;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  displayedColumnsTime: string[] = ['AMOUNT', 'EXPENDITURECLASS', 'GST', 'NOTE'];
  getDataForTable: any;
  paginator: any;
  pageSize: any;
  paidtype = 'paid';
  classtype : any;
  size = 33.33;
  Bankhide: boolean = true;
  hide: boolean = true;
  tdata: boolean;
  getPayourarray:any=[];
  confirmDialogRef: any;
  expac: boolean;
  @ViewChild(MatSort) sort: MatSort;
  dataTableHide: string;
  saveMoneyItemBtn: any;
  copyClassVal: any;
  copyMatterVal: any;
  copyAmountIncGSTVal: any;
  copyGSTTypeVal: any;
  copyGST1Val: any;
  copyAmountExGSTVal: any;
  copyExpenseacVal: any;
  constructor(public dialogRef: MatDialogRef<SpendMoneyAddComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any,
    private _formBuilder: FormBuilder,
    private SpendmoneyService: SpendmoneyService,
    public MatDialog: MatDialog,
    private toastr: ToastrService,
    public _matDialog: MatDialog,public _getContact: ContactService, ) {
    this.action = _data.action;
    console.log(_data);
    this.dialogTitle = this.action === 'edit' ? 'Update Spend Money' : 'Add Spend Money';
    
  }
  forEditshowpopupData(){
   
    let SendMoney_data=JSON.parse(localStorage.getItem('spendMoney_data'));
    this.getDataForTable = new MatTableDataSource(SendMoney_data.EXPENDITUREITEMS);
    console.log(this.getDataForTable);
    this.highlightedRows = SendMoney_data.EXPENDITUREITEMS[0].EXPENDITUREGUID;
    this.getDataForTable.paginator = this.paginator;
    this.getDataForTable.sort = this.sort;

    let DateIncurred = SendMoney_data.DATE.split("/");
    let DATE = new Date(DateIncurred[1] + '/' + DateIncurred[0] + '/' + DateIncurred[2]);
    let DatePaid = SendMoney_data.DATE.split("/");
    let ReceiveDATE = new Date(DatePaid[1] + '/' + DatePaid[0] + '/' + DatePaid[2]);

    this.spendmoneyForm.controls['DateIncurred'].setValue(DATE); 
    console.log(SendMoney_data.STATUS);
    this.paidtype=SendMoney_data.STATUS
    // this.spendmoneyForm.controls['Paid'].setValue(SendMoney_data.STATUS); 
    this.spendmoneyForm.controls['DatePaid'].setValue(ReceiveDATE); 
    this.spendmoneyForm.controls['Notes'].setValue(SendMoney_data.NOTE); 
    // this.spendmoneyForm.controls[''].setValue(''); 
    this.spendmoneyForm.controls['ChequeNo'].setValue(SendMoney_data.CHEQUENO); 
    this.spendmoneyForm.controls['Type'].setValue(SendMoney_data.EXPENDITURETYPE); 
    // this.spendmoneyForm.controls[''].setValue(''); 
    this.spendmoneyForm.controls['Class'].setValue(SendMoney_data.EXPENDITUREITEMS[0].EXPENDITURECLASS); 
    this.spendmoneyForm.controls['GST1'].setValue(SendMoney_data.GST); 
    this.spendmoneyForm.controls['AmountIncGST'].setValue(SendMoney_data.AMOUNT); 
    this.spendmoneyForm.controls['GSTType'].setValue("10% GST");
    // this.spendmoneyForm.controls['Class'].setValue("Expense");
    this.Classtype(SendMoney_data.EXPENDITUREITEMS[0].EXPENDITURECLASS);
  }
  forAddshowpopupData(){
    let SendMoney_data=JSON.parse(localStorage.getItem('spendMoney_data'));
    let DateIncurred = SendMoney_data.DATE.split("/");
    let DATE = new Date(DateIncurred[1] + '/' + DateIncurred[0] + '/' + DateIncurred[2]);
    let DatePaid = SendMoney_data.DATE.split("/");
    let ReceiveDATE = new Date(DatePaid[1] + '/' + DatePaid[0] + '/' + DatePaid[2]);

    this.spendmoneyForm.controls['DateIncurred'].setValue(DATE); 
    this.paidtype=SendMoney_data.STATUS
    this.spendmoneyForm.controls['DatePaid'].setValue(ReceiveDATE); 
    this.spendmoneyForm.controls['ChequeNo'].setValue("0"); 
    this.spendmoneyForm.controls['Type'].setValue("Cash"); 
    // this.spendmoneyForm.controls[''].setValue(''); 
    this.spendmoneyForm.controls['Class'].setValue("Expense"); 
    this.spendmoneyForm.controls['GST1'].setValue("0.00"); 
    this.spendmoneyForm.controls['AmountIncGST'].setValue("0.00"); 
    this.spendmoneyForm.controls['GSTType'].setValue("10% GST");
  
    this.spendmoneyForm.controls['Amount'].setValue(SendMoney_data.GST);
    this.spendmoneyForm.controls['GST'].setValue(SendMoney_data.GST);
    this.Classtype("Expense");
  }
  ngOnInit() {
    //for Data Table hideshow 
    this.saveMoneyItemBtn="show";
    this.dataTableHide="false";

    // this.getDataForTable = new MatTableDataSource([]);
    // this.getDataForTable.paginator = this.paginator;
    // this.getDataForTable.sort = this.sort;

    this.spendmoneyForm = this._formBuilder.group({
      DateIncurred: [''],
      Paid: [''],
      DatePaid: [''],
      Amount: [''],
      GST: [''],
      Bankac: [''],
      Notes: [''],
      Type: [''],
      ChequeNo: [''],
      Payee: [''],
      Invoice: [''],
      MultiLineExpense: [''],
      Class: [''],
      Matter: [''],
      AmountIncGST: [''],
      GSTType: [''],
      GST1: [''],
      AmountExGST: [''],
      Expenseac: [''],
      Note: [''],
      Assetacs: [''],
      Gstac: [''],
      taxac: [''],
      Equityac: [''],
          });

    if (this.action === 'edit') {
      this.size = 20;
      $('#expac').addClass('menu-disabled');
      this.expac = true;
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['GST1'].disable();
      this.forEditshowpopupData();
      this.getPayee({});
    }else{
      this.forAddshowpopupData();
    }
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  getPayee(postData){
    this._getContact.ContactData(postData).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        response.DATA.CONTACTS.forEach(element => {
          this.getPayourarray.push(element.CONTACTNAME);
        });
      }
    }, err => {
      this.toastr.error(err);
    });
  }
  // paid Type Dropdown
  Paidtype(paidvalue) {
    if (paidvalue === 'paid') {
      this.Bankhide = false;
      $('#bank').removeClass('menu-disabled');
      this.spendmoneyForm.controls['DatePaid'].enable();
      this.spendmoneyForm.controls['Bankac'].enable();
      this.spendmoneyForm.controls['Type'].enable();
      this.spendmoneyForm.controls['ChequeNo'].enable();
    } else if (paidvalue === 'unpaid') {
      this.Bankhide = true;
      $('#bank').addClass('menu-disabled');
      this.spendmoneyForm.controls['DatePaid'].disable();
      this.spendmoneyForm.controls['Bankac'].disable();
      this.spendmoneyForm.controls['Type'].disable();
      this.spendmoneyForm.controls['ChequeNo'].disable();
    }
  }
  Classtype(Classvalue) {
    this.classtype = Classvalue;
   
    if (Classvalue === 'Expense') {
    
      if (this.action != 'edit') {
  
        this.hide = true;
        $("#mattersnew").addClass("menu-disabled");
        this.spendmoneyForm.controls['Class'].enable();
        this.spendmoneyForm.controls['Matter'].disable();
        // this.spendmoneyForm.controls['AmountExGST'].disable();
        this.spendmoneyForm.controls['GSTType'].enable();
        this.spendmoneyForm.controls['Note'].enable();
        this.spendmoneyForm.controls['GST1'].enable();
      } else if (this.action === 'edit') {
   
        this.hide = true;
        this.expac = false;
        $("#mattersnew").addClass("menu-disabled");
        // this.spendmoneyForm.controls['Class'].enable();
        this.spendmoneyForm.controls['Matter'].disable();
        this.spendmoneyForm.controls['GST1'].disable();
        this.spendmoneyForm.controls['Note'].enable(); 
        // this.spendmoneyForm.controls['GSTType'].enable();
        // this.spendmoneyForm.controls['GST1'].enable();     
      }
    } else if (Classvalue === 'Matter Expense') {
      this.hide = false;
      this.expac = false;
      $("#mattersnew").removeClass("menu-disabled");
      this.spendmoneyForm.controls['Class'].enable();
      this.spendmoneyForm.controls['Matter'].enable();
      // this.spendmoneyForm.controls['AmountExGST'].disable();
      this.spendmoneyForm.controls['GSTType'].enable();
      this.spendmoneyForm.controls['GST1'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].enable();
      this.spendmoneyForm.controls['Note'].enable();
      this.spendmoneyForm.controls['Expenseac'].enable();
    } else if (Classvalue === 'Capital') {
      this.hide = true;
      this.expac = false;
      $("#mattersnew").addClass("menu-disabled");
      this.spendmoneyForm.controls['Class'].enable();
      this.spendmoneyForm.controls['Matter'].disable();
      // this.spendmoneyForm.controls['AmountExGST'].disable();

      this.spendmoneyForm.controls['GSTType'].disable();
      
      this.spendmoneyForm.controls['GST1'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].enable();
      this.spendmoneyForm.controls['Note'].enable();
    } else if (Classvalue === 'Pay GST') {
      this.hide = true;
      $("#mattersnew").addClass("menu-disabled");
      this.spendmoneyForm.controls['Class'].enable();
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['GSTType'].disable();
      this.spendmoneyForm.controls['GST1'].disable();
      // this.spendmoneyForm.controls['AmountExGST'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].enable();
      this.spendmoneyForm.controls['Note'].enable();
    } else if (Classvalue === 'Pay Tax') {
      this.hide = true;
      this.expac = false;
      $("#mattersnew").addClass("menu-disabled");
      this.spendmoneyForm.controls['Class'].enable();
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['GSTType'].disable();
      this.spendmoneyForm.controls['GST1'].disable();
      // this.spendmoneyForm.controls['AmountExGST'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].enable();
      this.spendmoneyForm.controls['Note'].enable();
    } else if (Classvalue === 'Personal') {
      console.log("fjkd")
      this.hide = true;
      this.expac = false;
      $("#mattersnew").addClass("menu-disabled");
      this.spendmoneyForm.controls['Class'].enable();
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['GSTType'].disable();
      this.spendmoneyForm.controls['GST1'].disable();
      // this.spendmoneyForm.controls['AmountExGST'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].enable();
      this.spendmoneyForm.controls['Note'].enable();
    } else if (Classvalue === 'Description') {
      this.hide = true;
      this.expac = false;
      $("#mattersnew").addClass("menu-disabled");
      this.spendmoneyForm.controls['Class'].enable();
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['GSTType'].disable();
      this.spendmoneyForm.controls['GST1'].disable();
      // this.spendmoneyForm.controls['AmountExGST'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].enable();
      this.spendmoneyForm.controls['Note'].enable();
    } else if (Classvalue === 'Others') {
      this.hide = true;
      this.expac = false;
      $("#mattersnew").addClass("menu-disabled");
      this.spendmoneyForm.controls['Class'].enable();
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['GSTType'].disable();
      this.spendmoneyForm.controls['GST1'].disable();
      // this.spendmoneyForm.controls['AmountExGST'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].enable();
      this.spendmoneyForm.controls['Note'].enable();
    }
    //call api  
    // spendMoney_data
    let SpendData = JSON.parse(localStorage.getItem('spendMoney_data'));
    let passData = {
      EXPENDITUREGUID: SpendData.EXPENDITUREGUID,
      EXPENDITURECLASS: Classvalue
    }
    this.CallClassChangeApi(passData);


  }
  CallClassChangeApi(passData) {
    // let potData = { 'EXPENDITURECLASS':Classvalue };
    this.isLoadingResults = true;
    this.SpendmoneyService.SpendmoneyListData(passData).subscribe(response => {
      console.log(response);
      if (response.CODE == 200 && response.STATUS == "success") {


        if (response.DATA.EXPENDITURES[0]) {

        }

      }
      this.isLoadingResults = false;
    }, error => {
      this.toastr.error(error);
    });
  }
  ContactMatter() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, {
      width: '100%', disableClose: true, data: {
        type: ""
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  public selectMatter() {
    const dialogRef = this.MatDialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.timeEntryForm.controls['MATTERGUID'].setValue(result.MATTERGUID);
        // this.timeEntryForm.controls['matterautoVal'].setValue(result.SHORTNAME + ' : ' + result.MATTER);
        // this.matterChange('MatterGuid', result.MATTERGUID);
      }
    });
  }

  Addspendmoney() {
    this.spendmoneyForm.controls['Class'].enable();
    //this.spendmoneyForm.controls['Matter'].enable();
    this.spendmoneyForm.controls['Expenseac'].enable();
    this.spendmoneyForm.controls['AmountIncGST'].enable();
    this.spendmoneyForm.controls['GSTType'].enable();
    this.spendmoneyForm.controls['GST1'].enable();
    this.spendmoneyForm.controls['Assetacs'].enable();
    this.spendmoneyForm.controls['Note'].enable();
    //this.Classtype(this.classtype);
  }
  Editspendmoney() {
    this.Classtype('capital');
  }
  deletespendmoney() {

    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: true,
      width: '100%',
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      // if (result) {
      //     let getContactGuId = localStorage.getItem('contactGuid');
      //     let postData = { FormAction: "delete", CONTACTGUID: getContactGuId }
      //     this._getContact.AddContactData(postData).subscribe(res => {
      //         if (res.STATUS == "success") {
      //             $('#refreshContactTab').click();
      //             this.toastr.success(res.STATUS);
      //         } else {
      //             this.toastr.error("You Can't Delete Contact Which One Is To Related to Matters");
      //         }
      //     });;
      // }
      // this.confirmDialogRef = null;
    });

  }
  get f() {
    return this.spendmoneyForm.controls;
  }
  multilineCheckbox(){
    this.saveMoneyItemBtn="hide";
    if(this.f.MultiLineExpense.value==true){
      this.dataTableHide="yes";
      this.spendmoneyForm.controls['Class'].disable();
      this.spendmoneyForm.controls['GSTType'].disable();
      this.spendmoneyForm.controls['GST1'].disable();
      this.spendmoneyForm.controls['Note'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].disable();
      this.spendmoneyForm.controls['Expenseac'].disable();
    }else{
      this.saveMoneyItemBtn="show";
      this.dataTableHide="false";
      this.forCommonEnable();
       this.Classtype(this.classtype);
     
    }
  }
  GstTypeforSelect(val){
console.log(val);
  }
  selectSpendMoneyId(row){
  }
  AddMoneyItem(){
    this.saveMoneyItemBtn="show";
    this.forCommonEnable();
    this.Classtype(this.classtype);
   
  }
  SaveItemDialog(){
    this.saveMoneyItemBtn="hide";
    //get all last data and show in table 
    // this.copyClassVal=this.f.Class.value;
    // this.copyMatterVal=this.f.Matter.value;
    // this.copyAmountIncGSTVal=this.f.AmountIncGST.value;
    // this.copyGSTTypeVal=this.f.GSTType.value;
    // this.copyGST1Val=this.f.GST1.value;
    // this.copyAmountExGSTVal=this.f.AmountExGST.value;
    // this.copyExpenseacVal=this.f.Expenseac.value;

let passdata=[{EXPENDITURECLASS:this.f.Class.value,
  AMOUNT:this.f.AmountIncGST.value,
  GST:this.f.GST1.value,
  EXPENDITUREGUID:''}]
   this.getDataForTable.filteredData(passdata)
   this.getDataForTable = new MatTableDataSource(passdata);
  //  console.log(this.getDataForTable.filteredData(passdata));
   this.highlightedRows =passdata[0].EXPENDITUREGUID;
    this.getDataForTable.paginator = this.paginator;
     this.getDataForTable.sort = this.sort;
  }
  CancelItemDialog(){
    this.saveMoneyItemBtn="hide";
  }
  forCommonEnable(){
    this.spendmoneyForm.controls['Class'].enable();
    this.spendmoneyForm.controls['GSTType'].enable();
    this.spendmoneyForm.controls['GST1'].enable();
    this.spendmoneyForm.controls['Note'].enable();
    // this.spendmoneyForm.controls['AmountExGST'].disable();
    this.spendmoneyForm.controls['AmountIncGST'].enable();
    this.spendmoneyForm.controls['Expenseac'].enable();
  }
  FinalSaveData(){
    let Data={
      EXPENDITUREGUID:'',
      EXPENDITURETYPE:'',
      STATUS:this.f.Paid.value,
      CHEQUENO:this.f.ChequeNo.value,
      PAYEE:this.f.Payee.value,
      AMOUNT:this.f.AmountIncGST.value,
      GST:this.f.GST1.value,
      RECEIVEDDATE:this.f.DatePaid.value,
      DATE:this.f.DateIncurred.value,
      BANKACCOUNTGUID:'',
      USERCODE:'',
      SOURCEREFERENCE:'',
      NOTE:this.f.Paid.value,
      EXPENDITUREITEMS:{
        EXPENDITUREITEMGUID:'',
        EXPENDITURECLASS:this.f.Paid.value,
        MATTERGUID:'',
        AMOUNTEXGST:this.f.Paid.value,
        GST:this.f.Paid.value,
        EXPENSEACCOUNTGUID:'',
        NOTE:this.f.Paid.value
      }

     
    }
    this.Setata(Data);
    
  

  }
  Setata(potData) {
    console.log(potData);
    this.isLoadingResults = true;
    this.SpendmoneyService.setSpendmonyData({'FormAction':"inser",DATA:potData}).subscribe(response => {
      console.log(response);
      if (response.CODE == 200 && response.STATUS == "success") {
       
        if (response.DATA.EXPENDITURES[0]) { 
        }

      }
      this.isLoadingResults = false;
    }, error => {
      this.toastr.error(error);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
}

