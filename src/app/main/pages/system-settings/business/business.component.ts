import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SystemSetting } from './../../../../_services';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  officeFormateArray:any=[];
  unitHRArray:any=[];
  getDropDownValue:any=[];
  constructor(private SystemSetting:SystemSetting) { }

  ngOnInit() {
    this.SystemSetting.getSystemSetting({}).subscribe(response=>{
     
      this.getDropDownValue=response.DATA.LISTS;
       
      // this.getMatterClass(response);
     
       })
  }


}
