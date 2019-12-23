import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-strata',
  templateUrl: './strata.component.html',
  styleUrls: ['./strata.component.scss']
})
export class StrataComponent implements OnInit {

  constructor(private datepipe: DatePipe) { }

  @Input() matterdetailForm: FormGroup;
  @Input() errorWarningData: any;
  ngOnInit() {
  }

  ExpirationDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['EXPIRATIONDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  ResolutionDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['SPECIALRESOLUTIONDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
}
