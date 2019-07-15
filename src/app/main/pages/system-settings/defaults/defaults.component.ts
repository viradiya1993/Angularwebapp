import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService } from './../../../../_services';

@Component({
  selector: 'app-defaults',
  templateUrl: './defaults.component.html',
  styleUrls: ['./defaults.component.scss'],
  animations: fuseAnimations
})
export class DefultsComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  texVal:any=[];
  incomeTypeArray:any=[];
  matterclassArray:any=[];
  shortNameArray:any=[];
  sundryFreeEarnerArray:any=[];
  getDropDownValue:any=[];
  constructor(private _mainAPiServiceService:MainAPiServiceService) { }

  ngOnInit() {
    this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
     console.log(response);
     this.getDropDownValue=response.DATA.LISTS;
    
      })
  }
  
}
