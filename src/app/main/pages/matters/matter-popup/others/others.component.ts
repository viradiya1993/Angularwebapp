import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { ContactSelectDialogComponent } from '../../../contact/contact-select-dialog/contact-select-dialog.component';
import { FormGroup } from '@angular/forms';
import { MattersService } from 'app/_services';
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

  constructor(
    public MatDialog: MatDialog,
    private _mattersService: MattersService,
    public datepipe: DatePipe
  ) {
  }

  @Input() matterdetailForm: FormGroup;

  ngOnInit() {
    this._mattersService.getMattersClasstype({ 'LookupType': 'Client Source' }).subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.ClientSource = responses.DATA.LOOKUPS;
      }
    });
    this._mattersService.getMattersClasstype({ 'LookupType': 'Matter Type' }).subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.MatterType = responses.DATA.LOOKUPS;
      }
    });
    this._mattersService.getMattersClasstype({ 'LookupType': 'Industry' }).subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.Industry = responses.DATA.LOOKUPS;
      }
    });
    this._mattersService.getMattersClasstype({ 'LookupType': 'Field Of Law' }).subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.FiledOfLaw = responses.DATA.LOOKUPS;
      }
    });
  }
  ContactMatter() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, { width: '100%', disableClose: true });
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
