import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MatterAddressPopupComponent } from '../matter-address-popup/matter-address-popup.component';



@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {

  constructor(public MatDialog: MatDialog,) { }

  @Input() matterdetailForm: FormGroup;
  ngOnInit() {
  }
  public Matteraddress() {
    const dialogRef = this.MatDialog.open(MatterAddressPopupComponent, { width: '100%', disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
    //  console.log(result);
      if (result) {
        // this.matterdetailForm.controls['Clientmatter'].setValue(result.MATTERGUID);
         //this.matterdetailForm.controls['Clientmatter'].setValue(result.SHORTNAME + ' : ' + result.MATTER);
        // this.matterChange('MatterGuid', result.MATTERGUID);
      }
    });
  }
}
