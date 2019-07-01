import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material';
import { DatePipe } from '@angular/common';
import { MattersService } from 'app/_services';

@Component({
  selector: 'app-criminal',
  templateUrl: './criminal.component.html',
  styleUrls: ['./criminal.component.scss']
})
export class CriminalComponent implements OnInit {
  CourtData: any;
  DivisionData: any;
  RegistryData: any;
  ListData: any;
  constructor(private datepipe: DatePipe, private _mattersService: MattersService, ) {

  }

  @Input() matterdetailForm: FormGroup;
  @Input() errorWarningData: any;
  ngOnInit() {
    this._mattersService.getMattersClasstype({ 'LookupType': 'court' }).subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.CourtData = responses.DATA.LOOKUPS;
      }
    });
    this._mattersService.getMattersClasstype({ 'LookupType': 'division' }).subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.DivisionData = responses.DATA.LOOKUPS;
      }
    });
    this._mattersService.getMattersClasstype({ 'LookupType': 'registry' }).subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.RegistryData = responses.DATA.LOOKUPS;
      }
    });
    this._mattersService.getMattersClasstype({ 'LookupType': 'Court List' }).subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.ListData = responses.DATA.LOOKUPS;
      }
    });
  }


  BriefServiceDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['BRIEFSERVICEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  CommittalDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['COMMITTALDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  ReplyDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['REPLYDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  BailDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['BAILDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  SentencingDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['SENTENCINGDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
}
