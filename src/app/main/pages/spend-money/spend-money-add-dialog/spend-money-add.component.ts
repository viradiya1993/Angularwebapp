import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource, MatDatepickerInputEvent } from '@angular/material';
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
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-spend-money-add',
  templateUrl: './spend-money-add.component.html',
  styleUrls: ['./spend-money-add.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class SpendMoneyAddComponent implements OnInit {
  dataSource: MatTableDataSource<UserData>;
  action: any;
  dialogTitle: string;
  isLoadingResults: boolean;
  spendmoneyForm: FormGroup;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  displayedColumnsTime: string[] = ['AMOUNT', 'EXPENDITURECLASS', 'GST', 'NOTE'];
  getDataForTable: any;
  FinalDataTableArray:any=[];
  paginator: any;
  pageSize: any;
  isspiner: boolean = false;
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
  copyClassVal: any;
  copyMatterVal: any;
  copyAmountIncGSTVal: any;
  copyGSTTypeVal: any;
  sendItem:any=[];

  copyGST1Val: any;
  copyAmountExGSTVal: any;
  copyExpenseacVal: any;
  Main3btn: string;
  SubMain2btn: string;
  FormAction: string;
  FAmount:any=[];
  GSTValAfterCal: number;
  GstTypeDiff: any;
  GSTValForExGst: number;
  FinalTotal: any;
  FGst: any=[];
  FinalTotalGST: any;
  constructor(public dialogRef: MatDialogRef<SpendMoneyAddComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any,
    private _formBuilder: FormBuilder,
    private SpendmoneyService: SpendmoneyService,
    public MatDialog: MatDialog,
    private toastr: ToastrService,
    public _matDialog: MatDialog,public _getContact: ContactService, public datepipe: DatePipe, ) {
    this.action = _data.action;
    
    this.dialogTitle = this.action === 'edit' ? 'Update Spend Money' : 'Add Spend Money';
    this.getPayee({});
  }
  forEditshowpopupData(){
   
    let SendMoney_data=JSON.parse(localStorage.getItem('spendMoney_data'));

    // this.getDataForTable = new MatTableDataSource(SendMoney_data.EXPENDITUREITEMS);
    this.getDataForTable =SendMoney_data.EXPENDITUREITEMS;
    // this.getDataForTable.push({id:1})
  // this.getDataForTable =SendMoney_data.EXPENDITUREITEMS;

    this.highlightedRows = SendMoney_data.EXPENDITUREITEMS[0].EXPENDITUREGUID;
    this.getDataForTable.paginator = this.paginator;
    this.getDataForTable.sort = this.sort;

    let DateIncurred = SendMoney_data.DATE.split("/");
    let DATE = new Date(DateIncurred[1] + '/' + DateIncurred[0] + '/' + DateIncurred[2]);
    let DatePaid = SendMoney_data.DATE.split("/");
    let ReceiveDATE = new Date(DatePaid[1] + '/' + DatePaid[0] + '/' + DatePaid[2]);

    this.spendmoneyForm.controls['DateIncurred'].setValue(DATE); 
    
    this.paidtype=SendMoney_data.STATUS
    // this.spendmoneyForm.controls['Paid'].setValue(SendMoney_data.STATUS); 
    this.spendmoneyForm.controls['DatePaid'].setValue(ReceiveDATE);
    //for sending date 
    this.spendmoneyForm.controls['DateIncurredForSend'].setValue(SendMoney_data.DATE);
    this.spendmoneyForm.controls['DatePaidForSend'].setValue(SendMoney_data.DATE); 
    
    this.spendmoneyForm.controls['Notes'].setValue(SendMoney_data.NOTE); 
    // this.spendmoneyForm.controls[''].setValue(''); 
    this.spendmoneyForm.controls['ChequeNo'].setValue(SendMoney_data.CHEQUENO); 
    this.spendmoneyForm.controls['Type'].setValue(SendMoney_data.EXPENDITURETYPE); 
    // this.spendmoneyForm.controls[''].setValue(''); 
    this.spendmoneyForm.controls['Class'].setValue(SendMoney_data.EXPENDITUREITEMS[0].EXPENDITURECLASS); 
    this.spendmoneyForm.controls['GST1'].setValue(SendMoney_data.EXPENDITUREITEMS[0].GST.toString()); 
    this.spendmoneyForm.controls['GST1'].disable();
    this.spendmoneyForm.controls['AmountIncGST'].setValue(SendMoney_data.AMOUNT); 
    this.spendmoneyForm.controls['GSTType'].setValue("1.1");
  
    this.spendmoneyForm.controls['Amount'].setValue(SendMoney_data.AMOUNT);
    this.spendmoneyForm.controls['GST'].setValue(SendMoney_data.GST);
    this.spendmoneyForm.controls['Payee'].setValue(SendMoney_data.PAYEE);
    // this.spendmoneyForm.controls['Class'].setValue("Expense");
    this.Classtype(SendMoney_data.EXPENDITUREITEMS[0].EXPENDITURECLASS);
  }
  forAddshowpopupData(){
    this.getDataForTable = [];
    let SendMoney_data=JSON.parse(localStorage.getItem('spendMoney_data'));
    let DateIncurred = SendMoney_data.DATE.split("/");
    let DATE = new Date(DateIncurred[1] + '/' + DateIncurred[0] + '/' + DateIncurred[2]);
    let DatePaid = SendMoney_data.DATE.split("/");
    let ReceiveDATE = new Date(DatePaid[1] + '/' + DatePaid[0] + '/' + DatePaid[2]);

    this.spendmoneyForm.controls['DateIncurred'].setValue(DATE); 
    this.paidtype=SendMoney_data.STATUS
    this.spendmoneyForm.controls['DatePaid'].setValue(ReceiveDATE); 
     //for sending date 
     this.spendmoneyForm.controls['DateIncurredForSend'].setValue(SendMoney_data.DATE);
     this.spendmoneyForm.controls['DatePaidForSend'].setValue(SendMoney_data.DATE); 
    this.spendmoneyForm.controls['ChequeNo'].setValue("0"); 
    this.spendmoneyForm.controls['Type'].setValue("Cash"); 
    // this.spendmoneyForm.controls[''].setValue(''); 
    this.spendmoneyForm.controls['Class'].setValue("Expense"); 
    this.spendmoneyForm.controls['GST1'].setValue(0.00); 
    this.spendmoneyForm.controls['AmountIncGST'].setValue(0.00); 
    
    this.spendmoneyForm.controls['GSTType'].setValue("1.1");
    this.GstTypeDiff="1.1"; 
    this.spendmoneyForm.controls['GST1'].disable();
  
    // this.spendmoneyForm.controls['Amount'].setValue(SendMoney_data.AMOUNT);
    this.spendmoneyForm.controls['GST'].setValue(SendMoney_data.GST);
    this.Classtype("Expense");
  }
  ngOnInit() {
    //for Data Table hideshow 
    this.Main3btn='disabled';
    this.dataTableHide="false";
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
      DatePaidForSend:[''],
      DateIncurredForSend:['']

          });

    if (this.action == 'edit') {
      this.size = 20;
      $('#expac').addClass('menu-disabled');
      this.expac = true;
      this.spendmoneyForm.controls['Matter'].disable();
      // this.spendmoneyForm.controls['GST1'].disable();
      this.forEditshowpopupData();
     
    }else{
      this.forAddshowpopupData();
    }
    //Autocomplete for payee
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
        // this.spendmoneyForm.controls['GST1'].enable();
      } else if (this.action === 'edit') {
   
        this.hide = true;
        this.expac = false;
        $("#mattersnew").addClass("menu-disabled");
        // this.spendmoneyForm.controls['Class'].enable();
        this.spendmoneyForm.controls['Matter'].disable();
        // this.spendmoneyForm.controls['GST1'].disable();
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
      // this.spendmoneyForm.controls['GST1'].disable();
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
      
      // this.spendmoneyForm.controls['GST1'].disable();
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
      // this.spendmoneyForm.controls['GST1'].disable();
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
      // this.spendmoneyForm.controls['GST1'].disable();
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
      // this.spendmoneyForm.controls['GST1'].disable();
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
      // this.spendmoneyForm.controls['GST1'].disable();
      // this.spendmoneyForm.controls['AmountExGST'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].enable();
      this.spendmoneyForm.controls['Note'].enable();
    }
    //call api  
    // spendMoney_data
    // let SpendData = JSON.parse(localStorage.getItem('spendMoney_data'));
    // let passData = {
    //   EXPENDITUREGUID: SpendData.EXPENDITUREGUID,
    //   EXPENDITURECLASS: Classvalue
    // }
    // this.CallClassChangeApi(passData);


  }
  // CallClassChangeApi(passData) {
  //   // let potData = { 'EXPENDITURECLASS':Classvalue };
  //   this.isLoadingResults = true;
  //   this.SpendmoneyService.SpendmoneyListData(passData).subscribe(response => {
  //     console.log(response);
  //     if (response.CODE == 200 && response.STATUS == "success") {


  //       if (response.DATA.EXPENDITURES[0]) {

  //       }

  //     }
  //     this.isLoadingResults = false;
  //   }, error => {
  //     this.toastr.error(error);
  //   });
  // }
  ContactMatter() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, {
      width: '100%', disableClose: true, data: {
        type: ""
      }
    });
    dialogRef.afterClosed().subscribe(result => {
console.log(result);
this.spendmoneyForm.controls['Payee'].setValue(result.CONTACTNAME);
    });
  }
  public selectMatter() {
    const dialogRef = this.MatDialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
          this.spendmoneyForm.controls['Matter'].setValue(result.MATTER);
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
    // this.spendmoneyForm.controls['GST1'].enable();
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
    if(this.f.MultiLineExpense.value==true){
      this.dataTableHide="yes";
      this.Main3btn='enable';
      this.SubMain2btn='disabled';
      this.spendmoneyForm.controls['Class'].disable();
      this.spendmoneyForm.controls['GSTType'].disable();
      // this.spendmoneyForm.controls['GST1'].disable();
      this.spendmoneyForm.controls['Note'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].disable();
      this.spendmoneyForm.controls['Expenseac'].disable();
    }else{
      this.Main3btn='disabled';
      this.SubMain2btn='enable';
      this.dataTableHide="false";
      this.forCommonEnable();
       this.Classtype(this.classtype);
     
    }
  }
  GstTypeforSelect(val){
    this.GstTypeDiff=val;
    this.amountCal();
    if(val=="LessThen 10% GST"){
      this.spendmoneyForm.controls['GST1'].enable();
    }else if(val=="No GST"){
      this.spendmoneyForm.controls['GST1'].disable();
      this.spendmoneyForm.controls['GST1'].setValue(0.00);
    }else if(val=="10"){
      this.spendmoneyForm.controls['GST1'].disable();
      this.spendmoneyForm.controls['GST1'].setValue(10);
    }
   
    
console.log(val);
  }
  selectSpendMoneyId(row){
  }
  AddMoneyItem(){ 
    this.spendmoneyForm.controls['GSTType'].setValue("1.1");
    this.spendmoneyForm.controls['AmountIncGST'].setValue("0.00");
    this.spendmoneyForm.controls['GST1'].setValue("");
    this.spendmoneyForm.controls['AmountExGST'].setValue("");
    this.GstTypeDiff="1.1"; 
    this.SubMain2btn='enable';
    this.Main3btn='disabled';
    this.forCommonEnable();
    this.Classtype(this.classtype);
  }
  SaveItemDialog(){
    this.FAmount=[];
    this.FGst=[];
    this.Main3btn='enable';
    this.getDataForTable.push(this.JustForCall());
    // this.getDataForTable.filter = "";
    this.getDataForTable.forEach(element => {
      this.FAmount.push(element.AMOUNT); 
      this.FGst.push(element.GST); 
    });
    this.FinalTotal= Number(this.FAmount.reduce(function (a = 0, b = 0) { return a + b; }, 0));
    this.FinalTotalGST= Number(this.FGst.reduce(function (a = 0, b = 0) { return a + b; }, 0));
    this.spendmoneyForm.controls['Amount'].setValue(this.FinalTotal);
    this.spendmoneyForm.controls['GST'].setValue(this.FinalTotalGST);
  }
  JustForCall(){  
    return {
      EXPENDITURECLASS:this.f.Class.value,
      AMOUNT:this.f.AmountIncGST.value,
      GST:this.f.GST1.value,
      EXPENDITUREGUID:''}; 
  }
  CancelItemDialog(){
  }
  amountCal(){

// if(this.GstTypeDiff=="1.1"){
//  let amount =this.f.AmountIncGST.value;
// }else if(this.GstTypeDiff=="No GST"){

// }else if(this.GstTypeDiff=="LessThen 10% GST"){

// }
    ///
    let amount =this.f.AmountIncGST.value;
    let gst:any =1.1
    let cal =(amount) / (gst).toFixed(2);
    let final = amount - cal ;
    this.GSTValAfterCal= final;
    if(this.GstTypeDiff=="No GST"){
      this.GSTValForExGst=amount;        
    }else if(this.GstTypeDiff=="1.1"){
      this.GSTValForExGst= cal;
    }else if(this.GstTypeDiff=="LessThen 10% GST"){
      this.GSTValAfterCal=0;
    this.GSTValForExGst=amount;
    }
  }
  GSTCalFun(){
    // let amount =this.f.AmountIncGST.value;
    let cal =parseFloat(this.f.AmountIncGST.value)-(this.f.GST1.value).toFixed(2);
    this.GSTValForExGst=cal;
  }
  choosedDateForIncurred(type: string, event: MatDatepickerInputEvent<Date>){
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.spendmoneyForm.controls['DateIncurredForSend'].setValue(begin);
     
   
  }
  choosedDateForPaid( type: string, event: MatDatepickerInputEvent<Date>){
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.spendmoneyForm.controls['DatePaidForSend'].setValue(begin); 
  }

  forCommonEnable(){
    this.spendmoneyForm.controls['Class'].enable();
    this.spendmoneyForm.controls['GSTType'].enable();
    // this.spendmoneyForm.controls['GST1'].enable();
    this.spendmoneyForm.controls['Note'].enable();
    // this.spendmoneyForm.controls['AmountExGST'].disable();
    this.spendmoneyForm.controls['AmountIncGST'].enable();
    this.spendmoneyForm.controls['Expenseac'].enable();
  }
  FinalSaveData(){  
   console.log(this.getDataForTable);
   this.getDataForTable.forEach(element => {
     this.sendItem.push({
      AMOUNT: element.AMOUNT,
      EXPENDITURECLASS:element.EXPENDITURECLASS,
      EXPENDITUREGUID: '',
      EXPENDITUREITEMGUID: "",
      EXPENSEACCOUNTGUID: "",
      GST: element.GST,
      MATTERGUID: "",
      NOTE: element.NOTE,
      SHORTNAME: "",
      WORKITEMGUID: ""
     })
   });
   let SendMoney_data=JSON.parse(localStorage.getItem('spendMoney_data'));
    let Data={
      EXPENDITUREGUID:SendMoney_data.EXPENDITUREGUID,
      EXPENDITURETYPE:'',
      STATUS:this.f.Paid.value,
      CHEQUENO:this.f.ChequeNo.value,
      PAYEE:this.f.Payee.value,
      AMOUNT:this.f.AmountIncGST.value,
      GST:this.f.GST1.value,
      RECEIVEDDATE:this.f.DatePaidForSend.value,
      DATE:this.f.DateIncurredForSend.value,
      BANKACCOUNTGUID:'ACCAAAAAAAAAAAA4',
      USERCODE:'',
      SOURCEREFERENCE:this.f.Invoice.value,
      NOTE:this.f.Notes.value,
      EXPENDITUREITEMS: this.sendItem
       
        // EXPENDITUREITEMGUID:'',
        // EXPENDITURECLASS:this.f.Class.value,
        // MATTERGUID:'',
        // AMOUNT:this.f.AmountExGST.value,
        // GST:'',
        // EXPENSEACCOUNTGUID:'',
        // NOTE:this.f.Note.value
      
    }
    if(this.action=="edit"){
      this.FormAction="update";
    }else{
      this.FormAction="insert";
    }
    this.Setata(Data);

  }
  Setata(potData) {
    this.isspiner = true;
    let details = { FormAction: this.FormAction, VALIDATEONLY: true, Data: potData };
    console.log(potData);
    this.SpendmoneyService.setSpendmonyData(details).subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, details);
      } else if (response.CODE == 451 && response.STATUS == "warning") {
        this.checkValidation(response.DATA.VALIDATIONS, details);
      } else if (response.CODE == 450 && response.STATUS == "error") {
        this.checkValidation(response.DATA.VALIDATIONS, details);
      } else if (response.MESSAGE == "Not logged in") {
        this.dialogRef.close(false);
      } else {
        this.isspiner = false;
      }
    }, error => {
      this.toastr.error(error);
    });
    // console.log(potData);
    // this.isLoadingResults = true;
    // this.SpendmoneyService.setSpendmonyData({'FormAction':"insert",DATA:potData}).subscribe(response => {
    //   console.log(response);
    //   if (response.CODE == 200 && response.STATUS == "success") {
       
    //     // if (response.DATA.EXPENDITURES[0]) { 
    //     // }

    //   }
    //   this.isLoadingResults = false;
    // }, error => {
    //   this.toastr.error(error);
    // });
    // this.pageSize = localStorage.getItem('lastPageSize');
  }

  checkValidation(bodyData: any, details: any) {
    let errorData: any = [];
    let warningData: any = [];
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'NO')
        errorData.push(value.ERRORDESCRIPTION);
      else if (value.VALUEVALID == 'WARNING')
        warningData.push(value.ERRORDESCRIPTION);
    });
    if (Object.keys(errorData).length != 0)
      this.toastr.error(errorData);
    if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.saveSpendMoneyData(details);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.saveSpendMoneyData(details);
    this.isspiner = false;
  }

  saveSpendMoneyData(data: any) {
    data.VALIDATEONLY = false;
    this.SpendmoneyService.setSpendmonyData(data).subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        if (this.action !== 'edit') {
          this.toastr.success(' save successfully');
        } else {
          this.toastr.success(' update successfully');
        }
        this.isspiner = false;
        this.dialogRef.close(true);
      } else if (response.MESSAGE == "Not logged in") {
        this.dialogRef.close(false);
      } else {
        this.isspiner = false;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  clicktitle(){

  }
}

export interface UserData {
  AMOUNT: string;
  EXPENDITURECLASS: string;
  GST: string;
  NOTE: string;
}