import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material';
import {  MainAPiServiceService } from 'app/_services';

@Component({
  selector: 'app-litigation',
  templateUrl: './litigation.component.html',
  styleUrls: ['./litigation.component.scss']
})
export class LitigationComponent implements OnInit {
  CourtData: any;
  DivisionData: any;
  RegistryData: any;
  ListData: any;
  ClientTypeData: any;
  CourtBelowData: any;
  constructor(private datepipe: DatePipe,
    private _mainAPiServiceService: MainAPiServiceService ) { }

  @Input() matterdetailForm: FormGroup;
  @Input() errorWarningData: any;
  ngOnInit() {
    
    this._mainAPiServiceService.getSetData({ 'LookupType': 'court' }, 'GetLookups').subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.CourtData = responses.DATA.LOOKUPS;
      }
    });
   
    this._mainAPiServiceService.getSetData({ 'LookupType': 'division' }, 'GetLookups').subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.DivisionData = responses.DATA.LOOKUPS;
      }
    });
    
    this._mainAPiServiceService.getSetData({ 'LookupType': 'registry' }, 'GetLookups').subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.RegistryData = responses.DATA.LOOKUPS;
      }
    });
    
    this._mainAPiServiceService.getSetData({ 'LookupType': 'Court List' }, 'GetLookups').subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.ListData = responses.DATA.LOOKUPS;
      }
    });
   
    this._mainAPiServiceService.getSetData({ 'LookupType': 'client type' }, 'GetLookups').subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.ClientTypeData = responses.DATA.LOOKUPS;
      }
    });
    
    this._mainAPiServiceService.getSetData({ 'LookupType': 'court below' }, 'GetLookups').subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.CourtBelowData = responses.DATA.LOOKUPS;
      }
    });
  }
  DateOfHearingsClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['DATEOFHEARINGS'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  MaterialDateClick(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['MATERIALDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }

}
