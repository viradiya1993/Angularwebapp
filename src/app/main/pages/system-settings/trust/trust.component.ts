import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-trust',
  templateUrl: './trust.component.html',
  styleUrls: ['./trust.component.scss'],
  animations: fuseAnimations
})
export class TrustComponent implements OnInit {

  @Input() SettingForm: FormGroup;
 
  constructor() { }

  ngOnInit() {
  }

}
