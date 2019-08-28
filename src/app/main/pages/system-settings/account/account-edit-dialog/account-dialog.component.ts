import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AccountInnerDialogComponent } from './account-inner-dialoge/account-inner-dialog.component';
import { BehaviorService, MainAPiServiceService } from 'app/_services';
import { BankingDialogComponent } from 'app/main/pages/banking/banking-dialog.component';

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss'],
  animations: fuseAnimations
})
export class AccountDialogComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  accountDialoge:any=[];
  addData:any=[];
  SendArray:any=[];
  public accDialoge={
    "Name":" ", "AccNo":' ','AccType':' '
  }
  constructor(public dialog: MatDialog,public behaviorService:BehaviorService,
    public dialogRef: MatDialogRef<AccountDialogComponent>,private _mainAPiServiceService:MainAPiServiceService,) { }

  ngOnInit() {
    this.behaviorService.SysytemAccountData$.subscribe(result => {
      if (result) {
        console.log(result);
        this.accountDialoge=result;
      }

  });
    this._mainAPiServiceService.getSetData({ACCOUNTGUIDNAME: this.accountDialoge.ACCOUNTGUIDNAME}, 'GetSystem').subscribe(response=>{
    console.log(response);
      // this.getDropDownValue=response.DATA.LISTS;
  
      // this.getMatterClass(response);
     
       })
  this.accDialoge.Name=this.accountDialoge.DESCRIPTION
  this.accDialoge.AccNo=this.accountDialoge.ACCOUNTNO;
  this.accDialoge.AccType=this.accountDialoge.ACCOUNTTYPE
  }
  openAccount(type){
    this.SendArray=[];
    console.log(type);
    const dialogRef = this.dialog.open(BankingDialogComponent, {
      disableClose: true, width: '100%', data: { AccountType: type }
    });
    // this.accDialoge.AccNo=result.name;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.accDialoge.AccNo = result.name;
        this.accDialoge.AccNo = result.MainList.ACCOUNTCLASS + ' - ' + result.MainList.ACCOUNTNUMBER + ' ' + result.MainList.ACCOUNTNAME;
        this.SendArray.push({ACCOUNTNUMBER:result.MainList.ACCOUNTCLASS + ' - ' + result.MainList.ACCOUNTNUMBER,
        ACCOUNTNAME: result.MainList.ACCOUNTNAME})
      }
    });
}
SaveClick(){
  console.log(this.SendArray);
  this.dialogRef.close(this.SendArray);
}


}
