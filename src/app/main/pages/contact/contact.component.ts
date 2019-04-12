import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { ContactService, AuthenticationService } from '../../../_services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ContactComponent implements OnInit {

  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : 'green';
  displayedColumns: string[] = ['Contact Guid', 'Company Contactguid', 'Contact Type', 'User Guid', 'Useparent Address', 'Contact Name', 'Salutation', 'Position', 'Name Title', 'Given Names', 'Middle Names', 'Family Name', 'Name Letters', 'Knownby Othername', 'Otherfamily Name', 'Thergiven Names', 'Reason For Change', 'Marital Status', 'Spouse', 'Numberof Dependants', 'Occupation', 'Gender', 'Dateof Birth', 'Birthday Reminder', 'Townof Birth'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog, private Contact: ContactService, private toastr: ToastrService, private authenticationService: AuthenticationService, ) { }
  Contactdata;

  ngOnInit() {
    
    //First 25 record Dispay here 
    this.Contact.ContactData().subscribe(res => {
      if (res.CONTACT.RESPONSE != "error - not logged in") {
        localStorage.setItem('session_token', res.CONTACT.SESSIONTOKEN);
        this.Contactdata = new MatTableDataSource(res.CONTACT.DATASET)
        this.Contactdata.paginator = this.paginator
        if (res.CONTACT.DATASET[0]) {
          localStorage.setItem('contactGuid', res.CONTACT.DATASET[0].CONTACTGUID);
          this.highlightedRows = res.CONTACT.DATASET[0].CONTACTGUID;
        }
      } else {
        this.toastr.error(res.CONTACT.RESPONSE);
      }
    },
      err => {
        this.toastr.error(err);
      });
  }


  //for edit popup
  editContact(val){

    localStorage.setItem('contactGuid', val);
  //  this.Contact.getContact(val).subscribe(res => { 
  //    this.getContactDta=res;
  //    console.log(res);      
  // });
}

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.data = { 'data': ['Contact Guid', 'Company Contactguid', 'Contact Type', 'User Guid', 'Useparent Address', 'Contact Name', 'Salutation', 'Position', 'Name Title', 'Given Names', 'Middle Names', 'Family Name', 'Name Letters', 'Knownby Othername', 'Otherfamily Name', 'Thergiven Names', 'Reason For Change', 'Marital Status', 'Spouse', 'Numberof Dependants', 'Occupation', 'Gender', 'Dateof Birth', 'Birthday Reminder', 'Townof Birth'], 'type': 'contact' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      if (result) {
        localStorage.setItem(dialogConfig.data.type, JSON.stringify(result));
      }
    });
    dialogRef.afterClosed().subscribe(data =>
      this.tableSetting(data)
    );
  }
  tableSetting(data: any) {
    if (data !== false) {
      this.displayedColumns = data;
    }
  }
}
