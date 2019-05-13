import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material';
import { TimersService } from 'app/_services';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  @Input() matterdetailForm: FormGroup;
  constructor(public datepipe: DatePipe, private Timersservice: TimersService) {

  }

  CommencementDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    localStorage.setItem('CommencementDate', begin);
  }

  CostsAgreementDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    localStorage.setItem('CostsAgreementDate', begin);
  }
  CompletedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    localStorage.setItem('CompletedDate', begin);
  }
  ngOnInit() {

  }
  selectMatter() {
    let d = { 'Active': 'yes' };
    this.Timersservice.GetUsers(d).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        console.log(response.DATA);
      }
    }, err => {
      console.log(err);
    });
  }

  selectFeeEarner() {
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
