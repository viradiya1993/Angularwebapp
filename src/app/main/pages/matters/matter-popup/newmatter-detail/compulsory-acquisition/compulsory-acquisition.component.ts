import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatterAddressPopupComponent } from '../matter-address-popup/matter-address-popup.component';

@Component({
  selector: 'app-compulsory-acquisition',
  templateUrl: './compulsory-acquisition.component.html',
  styleUrls: ['./compulsory-acquisition.component.scss']
})
export class CompulsoryAcquisitionComponent implements OnInit {

  constructor(private MatDialog: MatDialog) { }

  @Input() matterdetailForm: FormGroup;
  @Input() errorWarningData: any;
  ngOnInit() {
  }
  Matteraddress() {
    const dialogRef = this.MatDialog.open(MatterAddressPopupComponent, { width: '100%', disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.matterdetailForm.controls['Clientmatter'].setValue(result.MATTERGUID);
        //this.matterdetailForm.controls['Clientmatter'].setValue(result.SHORTNAME + ' : ' + result.MATTER);
        // this.matterChange('MatterGuid', result.MATTERGUID);
      }
    });
  }

}
