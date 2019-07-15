import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { ContactSelectDialogComponent } from '../../../contact/contact-select-dialog/contact-select-dialog.component';
import { FormGroup } from '@angular/forms';
import {  MainAPiServiceService } from 'app/_services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss']
})
export class OthersComponent implements OnInit {
  MatterType: any[];
  ClientSource: any[];
  Industry: any[];
  FiledOfLaw: any[];
  @Input() errorWarningData: any;
  @Input() matterdetailForm: FormGroup;

  constructor(
    public MatDialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    public datepipe: DatePipe
  ) { }

  ngOnInit() {
   
    this._mainAPiServiceService.getSetData({ 'LookupType': 'Client Source' }, 'GetLookups').subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.ClientSource = responses.DATA.LOOKUPS;
      }
    });
  
    this._mainAPiServiceService.getSetData({ 'LookupType': 'Matter Type' }, 'GetLookups').subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.MatterType = responses.DATA.LOOKUPS;
      }
    });
   
    this._mainAPiServiceService.getSetData({ 'LookupType': 'Industry' }, 'GetLookups').subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.Industry = responses.DATA.LOOKUPS;
      }
    });
    
    this._mainAPiServiceService.getSetData({ 'LookupType': 'Field Of Law' }, 'GetLookups').subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.FiledOfLaw = responses.DATA.LOOKUPS;
      }
    });
  }
  ContactMatter() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, {
      width: '100%', disableClose: true, data: {
        type: ""
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.matterdetailForm.controls['REFERRERGUID'].setValue(result.CONTACTGUID);
        this.matterdetailForm.controls['REFERRERGUIDTEXT'].setValue(result.CONTACTNAME + ' - ' + result.SUBURB);
      }
    });
  }
  ArchiveDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.matterdetailForm.controls['ARCHIVEDATE'].setValue(this.datepipe.transform(event.value, 'dd/MM/yyyy'));
  }
}
