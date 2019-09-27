import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService } from 'app/_services';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-copy-template',
  templateUrl: './copy-template.component.html',
  styleUrls: ['./copy-template.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class CopyTemplateComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  addData:any=[];
  TemplateName:any;
  constructor(private _mainAPiServiceService:MainAPiServiceService,
   public dialogRef: MatDialogRef<CopyTemplateComponent>,) { }

  ngOnInit() {
    // this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
    //// console.log(response);
    //this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
    // }) 
  }
  closepopup(){
    this.dialogRef.close(false);
  }
  
  save(){
  // let val= Date.parse('01/01/2011 10:00:00 AM') - Date.parse('01/01/2011 5:00:00 P');
  // console.log(val);
  }


}
