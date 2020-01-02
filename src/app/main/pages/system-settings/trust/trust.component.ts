import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService, BehaviorService } from './../../../../_services';


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
  constructor(private _mainAPiServiceService:MainAPiServiceService,
    private behaviorService:BehaviorService) { }

  ngOnInit() {
   
    this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{

      this.getDropDownValue=response.DATA.LISTS;
      this.behaviorService.loadingSystemSetting('templete');
    
      })
       
  }

}
