import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService } from './../../../../_services';

@Component({
  selector: 'app-reginoal-setting',
  templateUrl: './reginoal-setting.component.html',
  styleUrls: ['./reginoal-setting.component.scss'],
  animations: fuseAnimations
})
export class ReginoalSettingComponent implements OnInit {
  @Input() errorWarningData: any;
  @Input() SettingForm: FormGroup;
  getDropDownValue:any=[];
  constructor(private _mainAPiServiceService:MainAPiServiceService) { }
  ngOnInit() {
    this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
      console.log(response);
      this.getDropDownValue=response.DATA.LISTS;
     
      })
  }

}
