import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-compensation',
  templateUrl: './compensation.component.html',
  styleUrls: ['./compensation.component.scss']
})
export class CompensationComponent implements OnInit {

  constructor(public datepipe: DatePipe) { }

  @Input() matterdetailForm: FormGroup;

  ngOnInit() {
  }
  AccidentDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['ACCIDENTDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  ExpiryDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['ACCIDENTDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  Investigation(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['INVESTIGATIONDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  SettlementDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['SETTLEMENTDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  // SettlementDate(type: string, event: MatDatepickerInputEvent<Date>) {
  //   this.matterdetailForm.controls['SETTLEMENTDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  // }

}
