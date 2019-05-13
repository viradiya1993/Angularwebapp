import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-maritime',
  templateUrl: './maritime.component.html',
  styleUrls: ['./maritime.component.scss']
})
export class MaritimeComponent implements OnInit {

  constructor() { }
  @Input() matterdetailForm: FormGroup;
  ngOnInit() {
  }

}
