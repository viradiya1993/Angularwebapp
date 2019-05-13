import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-criminal',
  templateUrl: './criminal.component.html',
  styleUrls: ['./criminal.component.scss']
})
export class CriminalComponent implements OnInit {

  constructor() { }

  @Input() matterdetailForm: FormGroup;
  ngOnInit() {
  }

}
