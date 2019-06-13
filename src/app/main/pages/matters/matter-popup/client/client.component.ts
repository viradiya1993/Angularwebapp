import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
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
  CorrespondData = [];
  name: string;
  position: number;
  weight: number;
  symbol: string;
  isspiner: boolean;
  @Output() CorrespondDetail: EventEmitter<any> = new EventEmitter<any>();
  @Input() isEdit: any;
  @Input() isEditMatter: any;
  @Input() matterdetailForm: FormGroup;


  constructor(public MatDialog: MatDialog, private _mattersService: MattersService, public dialogRef: MatDialogRef<ClientComponent>, ) {

  }
  get f() {
    return this.matterdetailForm.controls;
  }
  ngOnInit() {
    if (this.isEdit) {
      this._mattersService.getMattersContact({ MATTERGUID: this.isEditMatter }).subscribe(response => {
        console.log(response);
        if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
          this.CorrespondData = response.DATA;
        } else if (response.MESSAGE == "Not logged in") {
          this.dialogRef.close(false);
        }
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
