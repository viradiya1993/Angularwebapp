import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss'],
  animations: fuseAnimations
})
export class NameComponent implements OnInit {

  @Input() SettingForm: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
