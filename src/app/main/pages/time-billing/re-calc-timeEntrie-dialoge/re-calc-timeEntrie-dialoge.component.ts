import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-re-calc-timeEntrie-dialoge',
  templateUrl: './re-calc-timeEntrie-dialoge.component.html',
  styleUrls: ['./re-calc-timeEntrie-dialoge.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ReCalcTimeEntriesDialogeComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  addData:any=[];
  TemplateName:any;
  getSelectedWIP: any;
  constructor(private _mainAPiServiceService:MainAPiServiceService,
   public dialogRef: MatDialogRef<ReCalcTimeEntriesDialogeComponent>, private behaviourService:BehaviorService) { 

  this.behaviourService.workInProgress$.subscribe(result=>{
      console.log(result);
      if(result){
        this.getSelectedWIP=result;
      }
  });
   }

  ngOnInit() {
      let sendData = {MATTERGUID:this.getSelectedWIP.MATTERGUID,
        FEEEARNER:this.getSelectedWIP.FEEEARNER,
        FEETYPE:this.getSelectedWIP.FEETYPE,
        QUANTITY:this.getSelectedWIP.QUANTITY,
        QUANTITYTYPE:this.getSelectedWIP.QUANTITYTYPE}
    this._mainAPiServiceService.getSetData(sendData, 'CalcWorkItemCharge').subscribe(response=>{
        console.log(response);
    // this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
    }) 
  }

  
  save(){
  // let val= Date.parse('01/01/2011 10:00:00 AM') - Date.parse('01/01/2011 5:00:00 P');
  // console.log(val);
  }


}
