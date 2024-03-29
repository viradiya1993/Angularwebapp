import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { TableColumnsService, MainAPiServiceService, BehaviorService } from '../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  highlightedRows: any;
  ColumnsObj = [];
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  contectTitle = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  displayedColumns: string[];
  tempColobj: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  datanull: null;
  isLoadingResults: boolean = false;
  contactFilter: FormGroup;
  pageSize: any;
  Contactdata;
  selectedVal: any;
  isDisplay: boolean = false;
  filterVals = { 'active': 'all', 'FirstLetter': 'a', 'SEARCH': '', 'ContactType': '' };
  constructor(
    private dialog: MatDialog,
    private TableColumnsService: TableColumnsService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
    private _mainAPiServiceService: MainAPiServiceService,
    private cd: ChangeDetectorRef,
    private behaviorService: BehaviorService,
  ) {
    this.contactFilter = this._formBuilder.group({
      ContactType: [''],
      active: [''],
      FirstLetter: [''],
      search: [''],
    });
  }



  ngOnInit() {
    this.getTableFilter();
    if (JSON.parse(localStorage.getItem('contact_Filter'))) {
      this.filterVals = JSON.parse(localStorage.getItem('contact_Filter'));
      this.contactFilter.controls['active'].setValue(this.filterVals.active == '' ? "all" : this.filterVals.active);
      this.contactFilter.controls['ContactType'].setValue(this.filterVals.ContactType == '' ? "all" : this.filterVals.ContactType);
      this.contactFilter.controls['FirstLetter'].setValue(this.filterVals.FirstLetter == '' ? "-1" : this.filterVals.FirstLetter);
    } else {
      localStorage.setItem('contact_Filter', JSON.stringify(this.filterVals));
    }
    this.LoadData(this.filterVals);
  }
  ngAfterViewInit() {
    this.behaviorService.resizeTableForAllView();
    const behaviorService = this.behaviorService;
    $(window).resize(function () {
      behaviorService.resizeTableForAllView();
    });
    this.cd.detectChanges();
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('contacts', '').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS);
        this.tempColobj = data.tempColobj;
        this.displayedColumns = data.showcol;
        this.ColumnsObj = data.colobj;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  get f() {
    return this.contactFilter.controls;
  }
  refreshContactTab() {
    this.LoadData(this.filterVals);
  }
  LoadData(data) {
    // GetContact
    // this._mainAPiServiceService.getSetData(postData, 'SetActivity').subscribe
    this.Contactdata = [];
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(data, 'GetContact').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.Contactdata = new MatTableDataSource(response.DATA.CONTACTS);
        this.Contactdata.paginator = this.paginator;
        this.Contactdata.sort = this.sort;
        this.behaviorService.contactData(null);
        if (response.DATA.CONTACTS[0]) {
          this.behaviorService.contactData(response.DATA.CONTACTS[0]);
          localStorage.setItem('contactGuid', response.DATA.CONTACTS[0].CONTACTGUID);
          // localStorage.setItem('contactData',  JSON.stringify(response.DATA.CONTACTS[0]));
          this.isDisplay = false;
          this.highlightedRows = response.DATA.CONTACTS[0].CONTACTGUID;
        } else {
          this.isDisplay = true;
        }
        this.isLoadingResults = false;
      } else if (response.CODE == 406 && response.MESSAGE == "Permission denied") {
        this.Contactdata = new MatTableDataSource([]);
        this.Contactdata.paginator = this.paginator;
        this.Contactdata.sort = this.sort;
        this.isLoadingResults = false;
      }
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  //for edit popup
  editContact(val, row) {
  
    localStorage.setItem('contactGuid', val);
    // localStorage.setItem('contactData',row);
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'contacts', 'list': '' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tempColobj = result.tempColobj;
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        if (!result.columObj) {
          this.Contactdata = new MatTableDataSource([]);
          this.Contactdata.paginator = this.paginator;
          this.Contactdata.sort = this.sort;
          this.isDisplay = true;
        } else {
          let filterVals = JSON.parse(localStorage.getItem('contact_Filter'));
          let filterVal = { 'active': filterVals.active, 'FirstLetter': filterVals.FirstLetter };

          this.LoadData(filterVal);
        }
      }
    });
  }
  ContactChange(data) {
    this.filterVals.active = this.f.active.value == 'all' ? "" : this.f.active.value;
    localStorage.setItem('contact_Filter', JSON.stringify(this.filterVals));
    this.LoadData(this.filterVals);
  }
  ContactTypeChange(value) {
    this.filterVals.ContactType = value == 'all' ? "" : value;
    localStorage.setItem('contact_Filter', JSON.stringify(this.filterVals));
    this.LoadData(this.filterVals);
  }
  Contactvalue(value) {
    this.filterVals.FirstLetter = value != -1 ? value : '';
    localStorage.setItem('contact_Filter', JSON.stringify(this.filterVals));
    this.LoadData(this.filterVals);
  }
  onSearch(searchFilter: any) {
    this.filterVals.SEARCH = this.f.search.value;
    localStorage.setItem('contact_Filter', JSON.stringify(this.filterVals));
    this.LoadData(this.filterVals);
  }
  ngOnDestroy(): void {
    // this.filterVals = JSON.parse(localStorage.getItem('contact_Filter'));
    // this.filterVals.SEARCH = '';
    // localStorage.setItem('contact_Filter', JSON.stringify(this.filterVals));
  }
}


