import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { BehaviorService } from 'app/_services';

@Component({
  selector: 'app-estimates-setting',
  templateUrl: './estimates-setting.component.html',
  styleUrls: ['./estimates-setting.component.scss'],
  animations: fuseAnimations
})
export class EstimatesSettingComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  constructor(private behaviorService:BehaviorService
  ) { }
  ngOnInit() {
    this.behaviorService.loadingSystemSetting('estimate');
  }

}
