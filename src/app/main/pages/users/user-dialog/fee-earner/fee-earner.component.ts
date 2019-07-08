import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fee-earner',
  templateUrl: './fee-earner.component.html',
  styleUrls: ['./fee-earner.component.scss']
})
export class FeeEarnerComponent implements OnInit {

  constructor() { }
  @Input() userForm: FormGroup;
  @Input() errorWarningData: any;
  ngOnInit() {

  }
  RatePerHourVal() {
    this.userForm.controls['RATEPERHOUR'].setValue(parseFloat(this.f.RATEPERHOUR.value).toFixed(2));
  }
  RatePerDayVal() {
    this.userForm.controls['RATEPERDAY'].setValue(parseFloat(this.f.RATEPERDAY.value).toFixed(2));
  }
  get f() {
    return this.userForm.controls;
  }

}
