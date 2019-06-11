import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ContactSelectDialogComponent } from '../../../contact/contact-select-dialog/contact-select-dialog.component';
import { FormGroup } from '@angular/forms';
import { CorrespondDailogComponent } from '../../correspond-dailog/correspond-dailog.component';
import { MattersService } from 'app/_services';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  Correspond = [];
  name: string;
  position: number;
  weight: number;
  symbol: string;
  isspiner: boolean;
  @Output() CorrespondDetail: EventEmitter<any> = new EventEmitter<any>();
  @Input() isEdit: any;
  @Input() isEditMatter: any;
  @Input() matterdetailForm: FormGroup;


  constructor(public MatDialog: MatDialog, private _mattersService: MattersService, ) {

  }
  get f() {
    return this.matterdetailForm.controls;
  }
  ngOnInit() {
    if (this.isEdit) {
      this._mattersService.getMattersContact({ MATTERGUID: this.isEditMatter }).subscribe(response => {
        console.log(response);
      }, error => { console.log(error); });
    }
  }
  Addcorres_party() {
    const dialogRef = this.MatDialog.open(CorrespondDailogComponent, { width: '100%', disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.CorrespondDetail.emit(result.saveData);
        this.Correspond.push(result.showData);
      }
    });
  }
  ContactMatter() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, { width: '100%', disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.matterdetailForm.controls['FIRMGUID'].setValue(result.CONTACTGUID);
        this.matterdetailForm.controls['Clientmattertext'].setValue(result.CONTACTNAME + ' - ' + result.SUBURB);
      }
    });
  }
  editElement() {
    alert('editElement');
  }
  deleteElement() {
    alert('deleteElement');
  }

}
