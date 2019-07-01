import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-trademark-ip',
  templateUrl: './trademark-ip.component.html',
  styleUrls: ['./trademark-ip.component.scss']
})
export class TrademarkIPComponent implements OnInit {

  constructor() { }

  @Input() matterdetailForm: FormGroup;
  @Input() errorWarningData: any;
  ngOnInit() {
  }

}
