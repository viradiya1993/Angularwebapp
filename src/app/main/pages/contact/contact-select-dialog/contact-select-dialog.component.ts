import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {  MainAPiServiceService, } from './../../../../_services';
import { MatTableDataSource, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import * as $ from 'jquery';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import {MatSort} from '@angular/material';

@Component({
  selector: 'app-contact-select-dialog',
  templateUrl: './contact-select-dialog.component.html',
  styleUrls: ['./contact-select-dialog.component.scss'],
  animations: fuseAnimations
})
export class ContactSelectDialogComponent implements OnInit {
  displayedColumns: string[] = ['CONTACTNAME', 'SUBURB'];
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  highlightedRows: any;
  currentMatterData: any;
  Contactdata: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoadingResults: boolean;
  SelectcontactForm: FormGroup;
  pageSize: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  filterVals: any = { 'Active': '1', 'FirstLetter': 'a', 'ContactType': 'Company', 'SEARCH': '' };


  constructor(
    public dialogRef: MatDialogRef<ContactSelectDialogComponent>,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public _matDialog: MatDialog,
    public _mainAPiServiceService: MainAPiServiceService,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.SelectcontactForm = this.fb.group({ ContactType: ['Company'], startsWith: ['a'], ActiveContacts: ['1'], SEARCH: [''], });
  }
  ngOnInit() {
    this.loadContectData(this.filterVals);
    if (this._data.type == "fromcontact") {
      this.SelectcontactForm.get('ContactType').disable();
    }
  }
  Contactvalue(value) {
    this.filterVals.FirstLetter = value != -1 ? value : '';
    this.loadContectData(this.filterVals);
  }
  ActiveContactsChange(data) {
    this.filterVals.Active = this.f.ActiveContacts.value == 'all' ? "" : this.f.ActiveContacts.value;
    this.loadContectData(this.filterVals);
  }
  ContactTypeChange(value) {
    this.filterVals.ContactType = value == 'all' ? "" : value;
    this.loadContectData(this.filterVals);
  }
  onSearch(searchFilter: any) {
    if (searchFilter['key'] === "Enter" || searchFilter == 'Enter') {
      this.filterVals.SEARCH = this.f.SEARCH.value;
      this.loadContectData(this.filterVals);
    }
  }
  loadContectData(postData) {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(postData, 'GetContact').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.Contactdata = new MatTableDataSource(response.DATA.CONTACTS);
        this.Contactdata.paginator = this.paginator;
        this.Contactdata.sort = this.sort;
        if (response.DATA.CONTACTS[0]) {
          this.currentMatterData = response.DATA.CONTACTS[0];
          localStorage.setItem('contactGuid', response.DATA.CONTACTS[0].CONTACTGUID);
          this.highlightedRows = response.DATA.CONTACTS[0].CONTACTGUID;
        }
        this.isLoadingResults = false;
      } else if (response.MESSAGE == "Not logged in") {
        this.dialogRef.close(false);
      }
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  get f() {
    return this.SelectcontactForm.controls;
  }
  editContact(Row: any) {
    this.currentMatterData = Row;
    localStorage.setItem('contactGuid', Row.CONTACTGUID);
  }

  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  // Add pop-up
  AddContactsDialog() {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      disableClose: true,
      panelClass: 'contact-dialog',
      data: {
        action: 'new',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        $('#refreshContactTab').click();
    });
  }
  // Delete Pop-up
  deleteContact(): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: true,
      width: '100%',
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        let getContactGuId = localStorage.getItem('contactGuid');
        let postData = { FormAction: "delete", CONTACTGUID: getContactGuId }
        this._mainAPiServiceService.getSetData(postData, 'SetContact').subscribe(res => {
          if (res.STATUS == "success") {
            $('#refreshContactTab').click();
            this.toastr.success(res.STATUS);
          } else {
            this.toastr.error("You Can't Delete Contact Which One Is To Related to Matters");
          }
        });;
      }
      this.confirmDialogRef = null;
    });
  }
  // Edit pop-up
  EditContactsDialog() {
    if (!localStorage.getItem('contactGuid')) {
      this.toastr.error("Please Select Contact");
    } else {
      const dialogRef = this.dialog.open(ContactDialogComponent, { disableClose: true, data: { action: 'edit' } });
      dialogRef.afterClosed().subscribe(result => {
        if (result)
          $('#refreshContactTab').click();
      });
    }

  }
}
