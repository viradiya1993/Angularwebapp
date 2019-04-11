import { Component, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import {MAT_DIALOG_DATA} from '@angular/material';
import { MattersService, ContactService } from './../../../../_services';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';



@Component({
  selector: 'app-contact-corres-details',
  templateUrl: './contact-corres-details.component.html',
  styleUrls: ['./contact-corres-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ContactCorresDetailsComponent implements OnInit {
  displayedColumns: string[] = ['contact', 'type'];
  getMatterGuid:any;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : 'green';
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  getin: any;
  getDataForTable: any;
  getContactData: any;
  constructor(  public _getContact: ContactService,private _getMattersService: MattersService,private dialog: MatDialog,public dialogRef: MatDialogRef<ContactCorresDetailsComponent>,@Inject(MAT_DIALOG_DATA) public data: any) 
  
  { 
  
    this.getMatterGuid=this.data
    

   }

 
  ngOnInit() {

    //call service
    this.getin={MatterGuid:this.getMatterGuid}
    this._getMattersService.getMattersContact(this.getin).subscribe(res =>{
      console.log(res);
      if (res.MatterContact.DataSet[0]) {
        // localStorage.setItem('contactGuid', res.CONTACT.DATASET[0].CONTACTGUID);
        this.highlightedRows = res.MatterContact.DataSet[0].MATTERGUID;
      }
      this.getDataForTable=res.MatterContact.DataSet;
      
    });
    // console.log(this.getMatterGuid);
    this.dataSource.paginator = this.paginator;
  }
  ondialogcloseClick(): void {
    this.dialogRef.close(false);
  }
  editContact(event) {
    this.getMatterGuid=event;
    //console.log(event);
  }

  selectButton(){
    console.log(this.getMatterGuid);
    let matteridforcontect ={CONTACTGUID:this.getMatterGuid}
    console.log(matteridforcontect);
    this._getContact.getContact(matteridforcontect).subscribe(res => {
      console.log(res);
        this.getContactData = res.CONTACT.DATASET[0];
        const dialogRef = this.dialog.open(ContactDialogComponent, {

            data: {
                contact: this.getContactData,
                action: 'edit'
            }
        });
        dialogRef.afterClosed().subscribe(result => {


            console.log(result);

        });
    });
  }


}

export interface PeriodicElement {
  contact: string;
  type: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
];
