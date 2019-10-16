import { Component, OnInit, Input } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
@Component({
  selector: 'app-recurrance-pattern',
  templateUrl: './recurrance-pattern.component.html',
  styleUrls: ['./recurrance-pattern.component.scss']
})
export class RecurrancePatternComponent implements OnInit {
  @Input() DairyForm: FormGroup;
  RedioBtnValue: any;
  WeekDay: any = [
    { value: 1, day: 'Monday' },
    { value: 2, day: 'Tuesday' },
    { value: 3, day: 'Wednesday' },
    { value: 4, day: 'Thursday' },
    { value: 5, day: 'Friday' },
    { value: 6, day: 'Saturday' },
    { value: 7, day: 'Sunday' }
  ]
  constructor(public datepipe: DatePipe, private fb: FormBuilder) { }

  ngOnInit() {
    this.DairyForm.controls['RedioDate'].setValue('End');
    this.radiobtndate();
  }

  get f() {
    return this.DairyForm.controls;
  }
  radiobtnclick() {
    if (this.f.RedioChnage.value == "Once") {
      this.RedioBtnValue = "Once"
    } else if (this.f.RedioChnage.value == "Daily") {
      this.RedioBtnValue = "Daily"
    } else if (this.f.RedioChnage.value == "Weekly") {
      this.RedioBtnValue = "Weekly"
    } else if (this.f.RedioChnage.value == "Monthly") {
      this.RedioBtnValue = "Monthly"
    } else if (this.f.RedioChnage.value == "Yearly") {
      this.RedioBtnValue = "Yearly"
    }

  }

  //radiobtnday
  radiobtnday() {
    if (this.f.RedioChnageDay.value == 'Day') {
      this.DairyForm.controls['EveryDay'].enable();
      this.DairyForm.controls['countvalue'].disable();
      this.DairyForm.controls['DaySelect'].disable();
    } else if (this.f.RedioChnageDay.value == 'The') {
      this.DairyForm.controls['countvalue'].enable();
      this.DairyForm.controls['DaySelect'].enable();
      this.DairyForm.controls['EveryDay'].disable();
    } else {
      this.DairyForm.controls['countvalue'].disable();
      this.DairyForm.controls['DaySelect'].disable();
      this.DairyForm.controls['EveryDay'].disable();
    }
  }

  //radiobtndate
  radiobtndate() {
    if (this.f.RedioDate.value === "End") {
      this.DairyForm.controls['EndDate'].disable();
    } else {
      this.DairyForm.controls['EndDate'].enable();
    }
  }
  //choosedDate

  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.DairyForm.controls['SendEndDate'].setValue(begin);
  }
}
