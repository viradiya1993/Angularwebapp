import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-defaults',
  templateUrl: './defaults.component.html',
  styleUrls: ['./defaults.component.scss'],
  animations: fuseAnimations
})
export class DefultsComponent implements OnInit {
  @Input() SettingForm: FormGroup;

  constructor() { }

  ngOnInit() {
   
  }

}
