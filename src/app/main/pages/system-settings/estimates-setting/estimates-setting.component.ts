import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-estimates-setting',
  templateUrl: './estimates-setting.component.html',
  styleUrls: ['./estimates-setting.component.scss'],
  animations: fuseAnimations
})
export class EstimatesSettingComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
