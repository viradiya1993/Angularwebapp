import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-maritime',
  templateUrl: './maritime.component.html',
  styleUrls: ['./maritime.component.scss']
})
export class MaritimeComponent implements OnInit {

  constructor(private datepipe: DatePipe) { }
  @Input() matterdetailForm: FormGroup;
  ngOnInit() {
  }
  SettlementDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['SETTLEMENTDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  ExchangeDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['EXCHANGEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  IncidentDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['INCIDENTDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }

}
