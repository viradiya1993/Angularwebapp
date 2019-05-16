import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-wills-estate',
  templateUrl: './wills-estate.component.html',
  styleUrls: ['./wills-estate.component.scss']
})
export class WillsEstateComponent implements OnInit {

  constructor(private datepipe: DatePipe) { }

  @Input() matterdetailForm: FormGroup;
  ngOnInit() {
  }
  DateofWill(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['DATEOFWILL'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  DateGrantRepresentation(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['DateGrantRepresentation'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }

}
