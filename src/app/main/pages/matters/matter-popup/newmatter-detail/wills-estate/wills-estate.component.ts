import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-wills-estate',
  templateUrl: './wills-estate.component.html',
  styleUrls: ['./wills-estate.component.scss']
})
export class WillsEstateComponent implements OnInit {

  constructor() { }

  @Input() matterdetailForm: FormGroup;
  ngOnInit() {
  }

}
