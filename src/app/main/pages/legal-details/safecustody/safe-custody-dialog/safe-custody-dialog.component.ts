import { Component, OnInit, Input, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService } from 'app/_services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import {  MainAPiServiceService } from './../../../../_services';

@Component({
  selector: 'app-safe-custody-dialog',
  templateUrl: './safe-custody-dialog.component.html',
  styleUrls: ['./safe-custody-dialog.component.scss'],
  animations: fuseAnimations
})
export class SafeCustodyDialogeComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  highlightedRows: any;
  isLoadingResults: boolean = false;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  @Input() errorWarningData: any;
  addData:any=[];
    action: any;
    dialogTitle: string;
  constructor(private _mainAPiServiceService:MainAPiServiceService,
    public dialogRef: MatDialogRef<SafeCustodyDialogeComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { 
        this.action = data.action;
        if(this.action === 'new client'){
            this.dialogTitle = 'New Safe Custody';
          }else if(this.action === 'edit'){
            this.dialogTitle = 'Update Safe Custody';
          }else if(this.action === 'new matter'){
            this.dialogTitle = 'New Safe Custody';
          }else if(this.action === 'new'){
            this.dialogTitle = 'New Safe Custody';
          }
      
    }

  ngOnInit() {  
    // this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
    //  // console.log(response);
    //   this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
    // })
  }
  closepopup(){
    this.dialogRef.close(false);
  }
  SaveSafeCustody(){

  }

}
