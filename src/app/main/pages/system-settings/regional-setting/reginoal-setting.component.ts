import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reginoal-setting',
  templateUrl: './reginoal-setting.component.html',
  styleUrls: ['./reginoal-setting.component.scss'],
  animations: fuseAnimations
})
export class ReginoalSettingComponent implements OnInit {

  @Input() SettingForm: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
