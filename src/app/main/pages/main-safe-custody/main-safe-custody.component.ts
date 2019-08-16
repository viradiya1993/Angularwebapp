import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService } from 'app/_services';
import { MatterPopupComponent } from '../matters/matter-popup/matter-popup.component';
import { MatDialog } from '@angular/material';
import { MatterDialogComponent } from '../time-entries/matter-dialog/matter-dialog.component';
import { ContactSelectDialogComponent } from '../contact/contact-select-dialog/contact-select-dialog.component';


@Component({
  selector: 'app-main-safe-custody',
  templateUrl: './main-safe-custody.component.html',
  styleUrls: ['./main-safe-custody.component.scss'],
  animations: fuseAnimations
})
export class MainSafeCustodyComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  addData:any=[];
  constructor(private _mainAPiServiceService:MainAPiServiceService, private dialog: MatDialog,) { }

  ngOnInit() {
    // this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
    //  // console.log(response);
    //   this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
    // })
    
  }
  
  SelectMatter() {
    const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.spendmoneyForm.controls['Matter'].setValue(result.MATTER);
        // this.spendmoneyForm.controls['MatterGUID'].setValue(result.MATTERGUID);
      }
    });
  }
  SelectContactMatter() {
    const dialogRef = this.dialog.open(ContactSelectDialogComponent, { 
      width: '100%', 
      disableClose: true,
    data:{
      type:"fromcontact"
    } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

}
