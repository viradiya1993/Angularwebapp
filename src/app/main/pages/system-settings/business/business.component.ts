import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {  MainAPiServiceService } from './../../../../_services';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  officeFormateArray:any=[];
  unitHRArray:any=[];
  getDropDownValue:any=[];
  constructor(private _mainAPiServiceService:MainAPiServiceService) { }

  ngOnInit() {
    this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
     
      this.getDropDownValue=response.DATA.LISTS;
       
      // this.getMatterClass(response);
     
       })
  }


}
