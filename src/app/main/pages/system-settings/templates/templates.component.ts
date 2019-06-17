import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  animations: fuseAnimations
})
export class TemplatesComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
