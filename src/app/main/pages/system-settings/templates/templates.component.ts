import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { SystemSetting } from './../../../../_services';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  animations: fuseAnimations
})
export class TemplatesComponent implements OnInit {
  @Input() SettingForm: FormGroup;
 
  getTemplateArray:any=[];

  getDropDownValue:any=[];
  constructor(private SystemSetting:SystemSetting) { }

  ngOnInit() {
    this.SystemSetting.getSystemSetting({}).subscribe(response=>{
      console.log(response);
      this.getDropDownValue=response.DATA.LISTS;
     
       })
  }

}
