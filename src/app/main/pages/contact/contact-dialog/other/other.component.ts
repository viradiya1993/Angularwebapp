import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig, MatDatepickerInputEvent } from '@angular/material';
import { DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/date.adapter';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss'],
  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
    ]
})
export class OtherComponent implements OnInit {

  common: any;
  selectGender: any;
  status: { Id: number; Name: string; }[];
  constructor(public datepipe: DatePipe) { }
  @Input() contactForm: FormGroup;

  choosedDateOfBirth(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    localStorage.setItem('DATEOFBIRTH', begin);
  }
  choosedDateOfDath(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    localStorage.setItem('DATEOFDEATH', begin);
  }

  ngOnInit() {
    this.common = [
      { Id: 1, Name: "Male" },
      { Id: 2, Name: "Female" },
      { Id: 3, Name: "Unknown" },
    ];

    this.status = [

      { Id: 1, Name: "Single" },
      { Id: 2, Name: "Married" },
      { Id: 3, Name: "Divorced" },
      { Id: 4, Name: "Separated" },
      { Id: 5, Name: "De facto" },
    ];
  }

}
