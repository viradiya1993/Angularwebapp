import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { SystemSetting } from './../../../../_services';
import { AccountDialogComponent } from './account-edit-dialog/account-dialog.component';
import { MatDialog } from '@angular/material';
export interface PeriodicElement {
  Description: string;
  AccNoAccount: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
 
  {Description: "Receivable", AccNoAccount : 'Hydrogen'},
  {Description: "Receivable", AccNoAccount : 'Hydrogen'},
  {Description: "Receivable", AccNoAccount : 'Hydrogen'},
  {Description: "Receivable", AccNoAccount : 'Hydrogen'},
  {Description: "Receivable", AccNoAccount : 'Hydrogen'},
  {Description: "Receivable", AccNoAccount : 'Hydrogen'},
  {Description: "Receivable", AccNoAccount : 'Hydrogen'},
  {Description: "Receivable", AccNoAccount : 'Hydrogen'},
  {Description: "Receivable", AccNoAccount : 'Hydrogen'},
  {Description: "Receivable", AccNoAccount : 'Hydrogen'},
  {Description: "Receivable", AccNoAccount : 'Hydrogen'},
  {Description: "Receivable", AccNoAccount : 'Hydrogen'},
  {Description: "Receivable", AccNoAccount : 'Hydrogen'},
  
];

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  animations: fuseAnimations
})
export class AccountComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  displayedColumns: string[] = ['Description', 'AccNoAccount'];
  dataSource = ELEMENT_DATA;
  addData:any=[];
  constructor(private SystemSetting:SystemSetting, public dialog: MatDialog,) { }

  ngOnInit() {
        
  }
  ondialogClick(){
    const dialogRef = this.dialog.open(AccountDialogComponent, {
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
