import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-strata',
  templateUrl: './strata.component.html',
  styleUrls: ['./strata.component.scss']
})
export class StrataComponent implements OnInit {

  constructor() { }

  @Input() matterdetailForm: FormGroup;
  ngOnInit() {
  }

}
