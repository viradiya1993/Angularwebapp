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
  Everydayval: any
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
    if (this.f.RedioChnage.value == "0") {
      this.RedioBtnValue = "Once"
    } else if (this.f.RedioChnage.value == "1") {
      this.RedioBtnValue = "Daily"
    } else if (this.f.RedioChnage.value == "2") {
      this.RedioBtnValue = "Weekly"
    } else if (this.f.RedioChnage.value == "3") {
      this.RedioBtnValue = "Monthly"
    } else if (this.f.RedioChnage.value == "4") {
      this.RedioBtnValue = "Yearly"
    }

  }


  radiobtnday() {
    if (this.f.MONTHOPTIONS.value == '3') {

      this.DairyForm.controls['Sendcountvalue'].setValue('');
      this.DairyForm.controls['SendDaySelect'].setValue('');
      this.DairyForm.controls['SendEveryDay'].setValue(this.f.EveryDay.value);
      console.log(this.f.SendEveryDay.value);
      this.DairyForm.controls['EveryDay'].enable();
      this.DairyForm.controls['countvalue'].disable();
      this.DairyForm.controls['DaySelect'].disable();
    } else if (this.f.MONTHOPTIONS.value == '4') {

      this.DairyForm.controls['Sendcountvalue'].setValue(this.f.countvalue.value);
      this.DairyForm.controls['SendDaySelect'].setValue(this.f.DaySelect.value);
      this.DairyForm.controls['SendEveryDay'].setValue('');

      this.DairyForm.controls['countvalue'].enable();
      this.DairyForm.controls['DaySelect'].enable();
      this.DairyForm.controls['EveryDay'].disable();
    } else {

      this.DairyForm.controls['Sendcountvalue'].setValue('');
      this.DairyForm.controls['SendDaySelect'].setValue('');
      this.DairyForm.controls['SendEveryDay'].setValue('');

      this.DairyForm.controls['countvalue'].disable();
      this.DairyForm.controls['DaySelect'].disable();
      this.DairyForm.controls['EveryDay'].disable();
    }
  }
  EveryDaypress(val) {
    this.DairyForm.controls['SendEveryDay'].setValue(this.f.EveryDay.value);
  }
  whichweek() {

    this.DairyForm.controls['SendEveryDay'].setValue(this.f.countvalue.value);
  }
  whichday() {
    this.DairyForm.controls['SendDaySelect'].setValue(this.f.DaySelect.value);
  }

  //radiobtndate
  radiobtndate() {
    if (this.f.RedioDate.value === "End") {
      this.DairyForm.controls['EndDate'].disable();
      this.DairyForm.controls['ToSendEndDate'].setValue('');
    } else {
      this.DairyForm.controls['EndDate'].enable();
      this.DairyForm.controls['ToSendEndDate'].setValue(this.f.SendEndDate.value);
    }
  }
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.DairyForm.controls['SendEndDate'].setValue(begin);
    this.DairyForm.controls['ToSendEndDate'].setValue(begin);
  }
  weekmonth(val) {
    this.DairyForm.controls['Senddayweek'].setValue(Number(val.source.value));
  }
}
