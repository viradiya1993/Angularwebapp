import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-litigation',
  templateUrl: './litigation.component.html',
  styleUrls: ['./litigation.component.scss']
})
export class LitigationComponent implements OnInit {

  constructor() { }

  @Input() matterdetailForm: FormGroup;
  ngOnInit() {
  }

}
