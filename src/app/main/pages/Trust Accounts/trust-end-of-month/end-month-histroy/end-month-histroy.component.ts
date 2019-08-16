import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService } from 'app/_services';


@Component({
  selector: 'app-end-month-histroy',
  templateUrl: './end-month-histroy.component.html',
  styleUrls: ['./end-month-histroy.component.scss'],
  animations: fuseAnimations
})
export class EndOfMonthHistroyComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  addData:any=[];
  constructor(private _mainAPiServiceService:MainAPiServiceService) { }

  ngOnInit() {
    // this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
    //  // console.log(response);
    //   this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
    // })
    
  }
  
 

}
