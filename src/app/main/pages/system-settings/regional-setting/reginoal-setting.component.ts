import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService, BehaviorService } from './../../../../_services';

@Component({
  selector: 'app-reginoal-setting',
  templateUrl: './reginoal-setting.component.html',
  styleUrls: ['./reginoal-setting.component.scss'],
  animations: fuseAnimations
})
export class ReginoalSettingComponent implements OnInit {
  @Input() errorWarningData: any;
  @Input() SettingForm: FormGroup;
  getDropDownValue: any = [];
  countryList: any = [];
  constructor(private _mainAPiServiceService: MainAPiServiceService,
    private behaviorService:BehaviorService) { }
  ngOnInit() {
    this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response => {
      this.getDropDownValue = response.DATA.LISTS;
    });
    this._mainAPiServiceService.getSetData({ 'LookupType': 'Country List' }, 'GetLookups').subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.countryList = responses.DATA.LOOKUPS;
        this.behaviorService.loadingSystemSetting('reginoal-setting');
      }
    });
  }

}
