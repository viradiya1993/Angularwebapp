import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ContactSelectDialogComponent } from '../../../contact/contact-select-dialog/contact-select-dialog.component';
import { FormGroup } from '@angular/forms';
import { MattersService } from 'app/_services';

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
    this._mattersService.getMattersClasstype({ 'LookupType': 'Filed Of Law' }).subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.FiledOfLaw = responses.DATA.LOOKUPS;
      }
    });
  }
  ContactMatter() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, { width: '100%', disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  ArchiveDate(s: any, ss: any) {

  }
}
