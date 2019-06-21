import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ContactSelectDialogComponent } from '../../contact/contact-select-dialog/contact-select-dialog.component';
import { MatterDialogComponent } from '../../time-entries/matter-dialog/matter-dialog.component';
import * as $ from 'jquery';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { SpendmoneyService, TableColumnsService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
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
  isLoadingResults:boolean;
  spendmoneyForm: FormGroup;
  displayedColumnsTime: string[] = ['class', 'amount', 'Gst', 'note'];
  getDataForTable: any;
  paginator: any;
  pageSize: any;
  paidtype = 'paid';
  classtype = 'Expence';
  size = 33.33;
  Bankhide: boolean = true;
  hide: boolean = true;
  tdata : boolean;
  confirmDialogRef: any;
  expac : boolean;
  constructor(public dialogRef: MatDialogRef<SpendMoneyAddComponent>,
     @Inject(MAT_DIALOG_DATA) public _data: any, 
     private _formBuilder: FormBuilder, 
     private SpendmoneyService: SpendmoneyService,
     public MatDialog: MatDialog,
     private toastr: ToastrService,
     public _matDialog: MatDialog,) { 
    this.action = _data.action;
    this.dialogTitle = this.action === 'edit' ? 'Update Spend Money' : 'Add Spend Money';
  }
  
  ngOnInit() {

    this.getDataForTable = new MatTableDataSource([]);
    this.getDataForTable.paginator = this.paginator;

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
      Equityac: ['']
    });

  if (this.action === 'edit') {
      this.size = 20;      
      $('#expac').addClass('menu-disabled');
      this.expac = true;
      this.spendmoneyForm.controls['Class'].disable();
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].disable();      
      this.spendmoneyForm.controls['GSTType'].disable();
      this.spendmoneyForm.controls['GST1'].disable();      
      this.spendmoneyForm.controls['AmountExGST'].disable();
      this.spendmoneyForm.controls['Expenseac'].disable();
      this.spendmoneyForm.controls['Note'].disable();
    }
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  // paid Type Dropdown
  Paidtype (paidvalue){
    if (paidvalue === 'paid'){
      this.Bankhide = false;
      $('#bank').removeClass('menu-disabled');
      this.spendmoneyForm.controls['DatePaid'].enable();
      this.spendmoneyForm.controls['Bankac'].enable();
      this.spendmoneyForm.controls['Type'].enable();
      this.spendmoneyForm.controls['ChequeNo'].enable();
    } else if (paidvalue === 'unpaid'){
      this.Bankhide = true;
      $('#bank').addClass('menu-disabled');
      this.spendmoneyForm.controls['DatePaid'].disable();
      this.spendmoneyForm.controls['Bankac'].disable();
      this.spendmoneyForm.controls['Type'].disable();
      this.spendmoneyForm.controls['ChequeNo'].disable();      
    }
  }
  Classtype(Classvalue){
    this.classtype = Classvalue;    
    if (Classvalue === 'Expence'){      
      if (this.action !== 'edit'){
        this.hide = true;
        $("#mattersnew").addClass("menu-disabled");
        this.spendmoneyForm.controls['Class'].enable();
        this.spendmoneyForm.controls['Matter'].disable();
        this.spendmoneyForm.controls['AmountExGST'].disable();
        this.spendmoneyForm.controls['GSTType'].enable();
        this.spendmoneyForm.controls['GST1'].enable();
      }else if (this.action === 'edit'){
        this.hide = true;
        this.expac = false;
        $("#mattersnew").addClass("menu-disabled");
        // this.spendmoneyForm.controls['Class'].enable();
        this.spendmoneyForm.controls['Matter'].disable();
        // this.spendmoneyForm.controls['GSTType'].enable();
        // this.spendmoneyForm.controls['GST1'].enable();     
      }
    }else if (Classvalue === 'matter Expence') {
      this.hide = false;
      this.expac = false;
      $("#mattersnew").removeClass("menu-disabled");  
      this.spendmoneyForm.controls['Class'].enable();    
      this.spendmoneyForm.controls['Matter'].enable();
      this.spendmoneyForm.controls['AmountExGST'].disable();
      this.spendmoneyForm.controls['GSTType'].enable();
      this.spendmoneyForm.controls['GST1'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].enable();
      this.spendmoneyForm.controls['Note'].enable();
      this.spendmoneyForm.controls['Expenseac'].enable();
    }else if (Classvalue === 'capital'){
      this.hide = true;
      this.expac = false;
      $("#mattersnew").addClass("menu-disabled");
      this.spendmoneyForm.controls['Class'].enable();
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['AmountExGST'].disable();
      this.spendmoneyForm.controls['GSTType'].enable();
      this.spendmoneyForm.controls['GST1'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].enable();
      this.spendmoneyForm.controls['Note'].enable();
    }else if (Classvalue === 'pay gst'){
      this.hide = true;
      $("#mattersnew").addClass("menu-disabled");
      this.spendmoneyForm.controls['Class'].enable();
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['GSTType'].disable();
      this.spendmoneyForm.controls['GST1'].disable();
      this.spendmoneyForm.controls['AmountExGST'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].enable();
      this.spendmoneyForm.controls['Note'].enable();
    }else if (Classvalue === 'pay txt'){
      this.hide = true;
      this.expac = false;
      $("#mattersnew").addClass("menu-disabled");
      this.spendmoneyForm.controls['Class'].enable();
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['GSTType'].disable();
      this.spendmoneyForm.controls['GST1'].disable();
      this.spendmoneyForm.controls['AmountExGST'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].enable();
      this.spendmoneyForm.controls['Note'].enable();
    }else if (Classvalue === 'personal') {
      this.hide = true;
      this.expac = false;
      $("#mattersnew").addClass("menu-disabled");
      this.spendmoneyForm.controls['Class'].enable();
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['GSTType'].disable();
      this.spendmoneyForm.controls['GST1'].disable();
      this.spendmoneyForm.controls['AmountExGST'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].enable();
      this.spendmoneyForm.controls['Note'].enable();
    }else if (Classvalue === 'depreciation'){
      this.hide = true;
      this.expac = false;
      $("#mattersnew").addClass("menu-disabled");
      this.spendmoneyForm.controls['Class'].enable();
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['GSTType'].disable();
      this.spendmoneyForm.controls['GST1'].disable();
      this.spendmoneyForm.controls['AmountExGST'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].enable();
      this.spendmoneyForm.controls['Note'].enable();
    }else if (Classvalue === 'other'){
      this.hide = true;
      this.expac = false;
      $("#mattersnew").addClass("menu-disabled");
      this.spendmoneyForm.controls['Class'].enable();
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['GSTType'].disable();
      this.spendmoneyForm.controls['GST1'].disable();
      this.spendmoneyForm.controls['AmountExGST'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].enable();
      this.spendmoneyForm.controls['Note'].enable();
    }
    //call api  
    // spendMoney_data
    let SpendData =JSON.parse(localStorage.getItem('spendMoney_data')); 
    let passData={
      EXPENDITUREGUID:SpendData.EXPENDITUREGUID,
      EXPENDITURECLASS:Classvalue
    }
    this.CallClassChangeApi(passData);


  }
  CallClassChangeApi(passData){
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
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, { width: '100%', disableClose: true });
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
  
  Addspendmoney(){
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
  Editspendmoney(){   
    this.Classtype('capital');
  }
  deletespendmoney(){
   
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
}
 
