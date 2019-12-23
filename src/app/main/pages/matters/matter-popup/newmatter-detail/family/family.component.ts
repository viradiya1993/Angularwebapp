import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.scss']
})
export class FamilyComponent implements OnInit {

  constructor(private datepipe: DatePipe) { }


  @Input() matterdetailForm: FormGroup;
  @Input() errorWarningData: any;
  ngOnInit() {
  }

  CohabitationDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['COHABITATIONDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  MarriageDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['MARRIAGEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  SeparationDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['SEPARATIONDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  DivorceDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['DIVORCEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  HearingDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['EXPERTHEARINGDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  ExpiryDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['ExpirationDate'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  DateFiledForDivorceDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['DATEFILEDFORDIVORCE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
}
