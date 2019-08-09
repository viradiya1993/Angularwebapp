import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService } from 'app/_services';
import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-copy-template',
  templateUrl: './copy-template.component.html',
  styleUrls: ['./copy-template.component.scss'],
  animations: fuseAnimations
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
    //  // console.log(response);
    //   this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
    // })
    
  }
  closepopup(){
    this.dialogRef.close(false);
  }
  


}
