import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MatterPopupComponent } from '../matters/matter-popup/matter-popup.component';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-main-searching',
  templateUrl: './main-searching.component.html',
  styleUrls: ['./main-searching.component.scss'],
  animations: fuseAnimations
})
export class MainSearchingComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  addData:any=[];
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
   
  }
  SelectMatter(){
    let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
    let MaterPopupData = { action: 'edit', 'matterGuid': mattersData.MATTERGUID }
//    let contactPopupData = { action:'edit' };
    const dialogRef = this.dialog.open(MatterPopupComponent, {
        disableClose: true, panelClass: 'contact-dialog', data: MaterPopupData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    // this.SearchForm.controls['Matter'].setValue(result);  
    });
  }
  DateRange(){

  }
DateRange1(){
  
}
}
