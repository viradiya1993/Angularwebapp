import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-immigration',
  templateUrl: './immigration.component.html',
  styleUrls: ['./immigration.component.scss']
})
export class ImmigrationComponent implements OnInit {

  constructor(private datepipe: DatePipe) { }
  @Input() matterdetailForm: FormGroup;
  @Input() errorWarningData: any;
  ngOnInit() {
  }
  AnticipatedEntryClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['ANTICIPATEDDATEOFENTRY'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  LodgementDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['LODGEMENTDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  VisaExpiryDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['VISAEXPIRYDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  DecisionDueDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['DECISIONDUEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
}
