import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { SystemSetting } from '../../../../../_services';
import { MatDialog } from '@angular/material';
import { AccountInnerDialogComponent } from './account-inner-dialoge/account-inner-dialog.component';

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss'],
  animations: fuseAnimations
})
export class AccountDialogComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  addData:any=[];
  constructor(private SystemSetting:SystemSetting,public dialog: MatDialog) { }

  ngOnInit() {
     
  }

  openAccount(){
 const dialogRef = this.dialog.open(AccountInnerDialogComponent, {
      disableClose: true,
      panelClass: '',
      data: {
          action: '',
      }
  });

  dialogRef.afterClosed().subscribe(result => {
      console.log(result);
  });
  }

}



