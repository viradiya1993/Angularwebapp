import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
  selector: 'app-mortgage-finance',
  templateUrl: './mortgage-finance.component.html',
  styleUrls: ['./mortgage-finance.component.scss']
})
export class MortgageFinanceComponent implements OnInit {

  constructor(private datepipe: DatePipe) { }

  @Input() matterdetailForm: FormGroup;
  ngOnInit() {
  }
  CommencementDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['COMMENCEMENTDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  DisachargeDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['DISCHARGEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  ExpirtyDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['ExpirtyDate'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }

}
