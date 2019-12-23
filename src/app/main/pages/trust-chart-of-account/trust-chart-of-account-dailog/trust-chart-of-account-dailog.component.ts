import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { BehaviorService, MainAPiServiceService } from 'app/_services';
import * as $ from 'jquery';

@Component({
  selector: 'app-trust-chart-of-account-dailog',
  templateUrl: './trust-chart-of-account-dailog.component.html',
  styleUrls: ['./trust-chart-of-account-dailog.component.scss']
})
export class TrustChartOfAccountDailogComponent implements OnInit {
  TrustChartAccount: FormGroup;
  isLoadingResults: boolean = false;
  action: any;
  dialogTitle:any;
  isspiner: boolean = false;
  constructor( 
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<TrustChartOfAccountDailogComponent>,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private behaviorService: BehaviorService,
    public _matDialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      console.log(data);
      this.action = data.action;
      if (this.action === 'new'){
        this.dialogTitle = 'New Account'
      }else if(this.action === 'edit'){
        this.dialogTitle = 'Update Account'
      }else{
        this.dialogTitle = 'Duplicate Account'
      }
    }
    get f() {
      return this.TrustChartAccount.controls;
    }
  ngOnInit() {
    this.TrustChartAccount = this._formBuilder.group({
      TRUSTACCOUNTCLASS:[''],
      TRUSTACCOUNTNAME:[''],
      TRUSTACCOUNTNUMBER:[''],
      TRUSTACTIVE:[''],
      TRUSTBANKBSB:[''],
      TRUSTBANKNAME:[''],
      TRUSTBANKACCOUNTNUMBER:[''],
      TRUSTBANKADDRESS:[''],
      TRUSTBANKTERM:[''],
      TRUSTBANKINTERESTRATE:[''],
    });
    this.TrustChartAccount.controls['TRUSTACTIVE'].setValue(true);
  }
  //Savetrustaccount
  Savetrustaccount(){
    alert('Savetrustaccount work!!');
  }

}
