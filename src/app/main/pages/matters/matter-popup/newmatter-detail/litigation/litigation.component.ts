import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material';
import { MattersService } from 'app/_services';

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
  constructor(private datepipe: DatePipe, private _mattersService: MattersService) { }

  @Input() matterdetailForm: FormGroup;
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
    this._mattersService.getMattersClasstype({ 'LookupType': 'list' }).subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.ListData = responses.DATA.LOOKUPS;
      }
    });
    this._mattersService.getMattersClasstype({ 'LookupType': 'client type' }).subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.ClientTypeData = responses.DATA.LOOKUPS;
      }
    });
    this._mattersService.getMattersClasstype({ 'LookupType': 'court below' }).subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.CourtBelowData = responses.DATA.LOOKUPS;
      }
    });
  }
  DateOfHearings(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['DATEOFHEARINGS'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
  MaterialDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['MATERIALDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }

}
