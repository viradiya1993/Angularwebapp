import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { SystemSetting } from './../../../../_services';


@Component({
  selector: 'app-trust',
  templateUrl: './trust.component.html',
  styleUrls: ['./trust.component.scss'],
  animations: fuseAnimations
})
export class TrustComponent implements OnInit {
  isLoadingResults: boolean;
  @Input() errorWarningData: any;
  @Input() SettingForm: FormGroup;

  getDropDownValue: any=[];
  constructor(private SystemSetting:SystemSetting) { }

  ngOnInit() {
   
    this.SystemSetting.getSystemSetting({}).subscribe(response=>{
      console.log(response);
      this.getDropDownValue=response.DATA.LISTS;
    
      })
       
  }

}
