import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material';
import { TimersService } from 'app/_services';
import { round } from 'lodash';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  @Input() matterdetailForm: FormGroup;
  @Input() userType: any;
  PRICEVAL: any;
  PRICEVALGST: any;
  constructor(public datepipe: DatePipe, private Timersservice: TimersService) {

  }

  CommencementDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['COMMENCEMENTDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }

  CostsAgreementDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['FeeAgreementDate'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  CompletedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['COMPLETEDDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  ngOnInit() { }
  selectMatter() {
    alert('Access to this part of the application has been restricted');
    return;
    let d = { 'Active': 'yes' };
    this.Timersservice.GetUsers(d).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        console.log(response.DATA);
      }
    }, err => {
      console.log(err);
    });
  }
  get f() {
    return this.matterdetailForm.controls;
  }
  calcPE() {
    this.PRICEVALGST = round(this.f.EstimateFromTotalExGST.value * 1.1);
  }
  calcPI() {
    this.PRICEVAL = round(this.f.EstimateFromTotalIncGST.value / 1.1);
  }
  selectFeeEarner() {
    alert('Access to this part of the application has been restricted');
    return;
    let d = { 'Active': 'yes' };
    this.Timersservice.GetUsers(d).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        console.log(response.DATA);
      }
    }, err => {
      console.log(err);
    });
  }

}
