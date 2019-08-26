import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { BehaviorService, MainAPiServiceService } from 'app/_services';

@Component({
  selector: 'app-chart-ac-dailog',
  templateUrl: './chart-ac-dailog.component.html',
  styleUrls: ['./chart-ac-dailog.component.scss']
})
export class ChartAcDailogComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  isLoadingResults: boolean = false;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;
  AccountForm: FormGroup;
  AccountData:any=[];
  theCheckbox = true;

  constructor
  (
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<ChartAcDailogComponent>,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private behaviorService: BehaviorService,
    public _matDialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) 
  { 
    this.action = data.action;
    if (this.action === 'new') {
      this.dialogTitle = 'New Account';
    } else if (this.action === 'edit') {
      this.dialogTitle = 'Update Account';
    } else if(this.action === 'duplicate') {
      this.dialogTitle = 'Duplicate Account';
    }

    this.behaviorService.ChartAccountData$.subscribe(result => {
      if(result){
        // console.log(result);
       this.AccountData=result;
      }          
    });
   
  
   
  }

  ngOnInit() {
    this.AccountForm = this._formBuilder.group({
      AccountClass:[''],
      accountname:['',Validators.required],
      //General
      accountNo:[''],
      accounttype:[''],
      ACTIVE:['']

    });
    // if(this.AccountData.parent==null){
    //   this.AccountForm.controls['AccountClass'].setValue(this.AccountData.class);
    // }else{
    //   this.AccountForm.controls['AccountClass'].setValue(this.AccountData.parent);
    // }
    if(this.action=="edit"){
      this.isLoadingResults=true;
      this._mainAPiServiceService.getSetData({ACCOUNTGUID:this.AccountData.ACCOUNTGUID}, 'GetAccount').subscribe(res => {
        if (res.CODE == 200 && res.STATUS == "success") {
          this.AccountForm.controls['accountNo'].setValue(res.DATA.ACCOUNTS[0].ACCOUNTCLASS + ' - ' + res.DATA.ACCOUNTS[0].ACCOUNTNUMBER);
         this.AccountForm.controls['accountname'].setValue(res.DATA.ACCOUNTS[0].ACCOUNTNAME);
         this.AccountForm.controls['accounttype'].setValue(res.DATA.ACCOUNTS[0].ACCOUNTTYPE.toString());
         this.AccountForm.controls['AccountClass'].setValue(res.DATA.ACCOUNTS[0].ACCOUNTCLASS);
        } else if (res.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
        this.isLoadingResults = false;
      }, err => {
        this.toastr.error(err);
        this.isLoadingResults = false;
      });
    }

  }
  //Account Class Dropdown
  AccountChange(value){

  }
  //SaveAccount
  SaveAccount(){
  

  }
  FilterSearch(val){

  }

}
