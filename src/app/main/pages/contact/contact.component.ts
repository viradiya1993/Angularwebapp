import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { ContactService, AuthenticationService } from '../../../_services';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';

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
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  displayedColumns: string[] = ['Contact Guid', 'Company Contactguid', 'Contact Type', 'User Guid', 'Useparent Address', 'Contact Name', 'Salutation', 'Position', 'Name Title', 'Given Names', 'Middle Names', 'Family Name', 'Name Letters', 'Knownby Othername', 'Otherfamily Name', 'Thergiven Names', 'Reason For Change', 'Marital Status', 'Spouse', 'Numberof Dependants', 'Occupation', 'Gender', 'Dateof Birth', 'Birthday Reminder', 'Townof Birth'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  datanull: null;
  isLoadingResults: boolean = false;
  contactFilter: FormGroup;
  constructor(private dialog: MatDialog, private Contact: ContactService, private toastr: ToastrService, private _formBuilder: FormBuilder, private authenticationService: AuthenticationService, ) {
    this.contactFilter = this._formBuilder.group({
      Filter1: [''],
      Filter2: [''],
    });
  }
  Contactdata;

  ngOnInit() {
    let filterVals = JSON.parse(localStorage.getItem('contact_Filter'));
    let filterVal = { 'active': filterVals.active, 'FirstLetter': filterVals.FirstLetter };
    this.LoadData(filterVal);
    if (filterVals.active) {
      if (filterVals.FirstLetter) {
        this.contactFilter.controls['Filter1'].setValue(filterVals.active);
        this.contactFilter.controls['Filter2'].setValue(filterVals.FirstLetter);
      } else {
        this.contactFilter.controls['Filter1'].setValue(filterVals.active);
        this.contactFilter.controls['Filter2'].setValue('-1');
      }
    } else if (filterVals.FirstLetter) {
      if (filterVals.active) {
        this.contactFilter.controls['Filter1'].setValue(filterVals.active);
        this.contactFilter.controls['Filter2'].setValue(filterVals.FirstLetter);
      } else {
        this.contactFilter.controls['Filter1'].setValue('all');
        this.contactFilter.controls['Filter2'].setValue(filterVals.FirstLetter);
      }
    } else {
      this.contactFilter.controls['Filter1'].setValue('all');
      this.contactFilter.controls['Filter2'].setValue('-1');
    }
  }
  get f() {
    return this.contactFilter.controls;
  }
  LoadData(data) {
    this.isLoadingResults = true;
    this.Contact.ContactData(data).subscribe(response => {
      if (response.CODE == 200 && (response.RESPONSE == "success" || response.STATUS == "success")) {
        this.Contactdata = new MatTableDataSource(response.DATA.CONTACTS)
        this.Contactdata.paginator = this.paginator
        if (response.DATA.CONTACTS[0]) {
          localStorage.setItem('contactGuid', response.DATA.CONTACTS[0].CONTACTGUID);
          this.highlightedRows = response.DATA.CONTACTS[0].CONTACTGUID;
        }
        this.isLoadingResults = false;
      }
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
  }


  //for edit popup
  editContact(val) {
    localStorage.setItem('contactGuid', val);
    //  this.Contact.getContact(val).subscribe(res => { 
    //    this.getContactDta=res;
    //    console.log(res);      
    // });
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.disableClose = true;
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

  //Filter:
  ContactChange(active) {
    if (active != 'all') {
      let filterVal = { 'active': active, 'FirstLetter': '' };
      if (!localStorage.getItem('contact_Filter')) {
        localStorage.setItem('contact_Filter', JSON.stringify(filterVal));
      } else {
        filterVal = JSON.parse(localStorage.getItem('contact_Filter'));
        filterVal.active = active;
        localStorage.setItem('contact_Filter', JSON.stringify(filterVal));
      }
      this.LoadData(filterVal);
    } else {
      let filterVals = JSON.parse(localStorage.getItem('contact_Filter'));
      let filterVal = { 'active': '', 'FirstLetter': filterVals.FirstLetter };
      localStorage.setItem('contact_Filter', JSON.stringify(filterVal))
      this.LoadData(filterVal);
    }
  }

  Contactvalue(FirstLetter) {
    if (FirstLetter != -1) {
      let filterVals = { 'active': '', 'FirstLetter': FirstLetter };
      if (!localStorage.getItem('contact_Filter')) {
        localStorage.setItem('contact_Filter', JSON.stringify(filterVals));
      } else {
        filterVals = JSON.parse(localStorage.getItem('contact_Filter'));
        filterVals.FirstLetter = FirstLetter;
        localStorage.setItem('contact_Filter', JSON.stringify(filterVals));
      }
      this.LoadData(filterVals);
    } else {
      let filterVals = JSON.parse(localStorage.getItem('contact_Filter'));
      let filterVal = { 'active': filterVals.active, 'FirstLetter': '' };
      localStorage.setItem('contact_Filter', JSON.stringify(filterVal))
      this.LoadData(filterVal);
    }
  }

}
