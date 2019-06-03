import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss']
})
export class RatesComponent implements OnInit {

  constructor() { }
  @Input() matterdetailForm: FormGroup;
  isDisabled: boolean = true;
  ngOnInit() { }
  radioChange(event) {
    if (this.f.GSTTYPE.value == 'GST Free' || this.f.GSTTYPE.value == 'Export')
      this.isDisabled = false;
    else
      this.isDisabled = true;
  }
  get f() {
    //console.log(this.contactForm);
    return this.matterdetailForm.controls;
  }
}
