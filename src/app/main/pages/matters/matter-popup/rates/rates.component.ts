import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { round } from 'lodash';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss']
})
export class RatesComponent implements OnInit {

  constructor() { }
  @Input() matterdetailForm: FormGroup;
  isDisabled: boolean = true;
  FIXEDRATEEXGST: any;
  FIXEDRATEINCGST: any;
  ngOnInit() { }
  radioChange(event) {
    if (this.f.GSTTYPE.value == 'GST Free' || this.f.GSTTYPE.value == 'Export')
      this.isDisabled = false;
    else {
      this.isDisabled = true;
      this.matterdetailForm.controls['ONCHARGEDISBURSEMENTGST'].setValue(0);
    }
  }
  get f() {
    return this.matterdetailForm.controls;
  }
  calcPE() {
    this.FIXEDRATEINCGST = round(this.f.FIXEDRATEEXGST.value * 1.1).toFixed(2);
  }
  calcPI() {
    this.FIXEDRATEEXGST = round(this.f.FIXEDRATEINCGST.value / 1.1).toFixed(2);
  }
}
