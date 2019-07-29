import { Component, OnInit, Inject, AfterViewInit, ViewChild, ViewEncapsulation, Input, ɵConsole } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDatepickerInputEvent, MatPaginator, MatTableDataSource, MatDialogConfig } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TimersService, MainAPiServiceService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { MatterPopupComponent } from '../../matters/matter-popup/matter-popup.component';

import { MatSort } from '@angular/material';

@Component({
  selector: 'app-matter-dialog',
  templateUrl: './matter-dialog.component.html',
  styleUrls: ['./matter-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MatterReceiptDialogComponentForTemplate implements OnInit {
  message: string;
  displayedColumns: string[] = ['matternumber', 'matter', 'client'];
  getDataForTable: any = [];
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  matterFilterForm: FormGroup;
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  isLoadingResults: boolean = false;
  pageSize: any;
  currentMatterData: any;
  MatterDropData: any;
  filterVal: any = { 'Active': ' ', 'FeeEarner': '', 'SearchString': '' };
  @Input() mattersDetailData;
  isShowDrop: boolean = false;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    private toastr: ToastrService,
    private Timersservice: TimersService,
    public _matDialog: MatDialog,
    // private data:TemplateComponent
  ) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.isShowDrop = currentUser.ProductType == "Barrister" ? false : true;
    this.matterFilterForm = this.fb.group({ MatterFilter: [' '], UserFilter: [''], searchFilter: [''], InvoiceFilter: [''], });
  }

  ngOnInit() {
    this.getDropValue();
    this.getMatterList();
  }
  getDropValue() {
    let d = {};
    this.Timersservice.GetUsers(d).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.MatterDropData = response.DATA.USERS;
      }
    }, err => {
      console.log(err);
    });
  }
  selectMatterId(Row: any) {
    this.currentMatterData = Row;
  }
  getMatterList() {
    this.getList({});
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  get f() {
    return this.matterFilterForm.controls;
  }
  MatterChange(value) {
    this.filterVal.Active = value;
    this.getList(this.filterVal);
  }
  onSearch(searchFilter: any) {
    if (searchFilter['key'] === "Enter" || searchFilter == 'Enter') {
      this.filterVal.SearchString = this.f.searchFilter.value;
      this.getList(this.filterVal);
    }
  }
  MatterUserChange(value) {
    this.filterVal.FeeEarner = value;
    this.getList(this.filterVal);
  }
  getList(filterVal: any) {
    this.getDataForTable=[];
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(filterVal, 'GetMatter').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.MATTERS[0]) {
          this.highlightedRows = response.DATA.MATTERS[0].MATTERGUID;
          this.currentMatterData = response.DATA.MATTERS[0];
          localStorage.setItem('matterName', response.DATA.MATTERS[0].MATTER);
        }
        this.getDataForTable = new MatTableDataSource(response.DATA.MATTERS);
        this.getDataForTable.paginator = this.paginator;
        this.getDataForTable.sort = this.sort;
        this.isLoadingResults = false;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  // New matter Pop-up
  AddNewmatterpopup() {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(MatterPopupComponent, {
      width: '100%',
      disableClose: true,
      data: {
        action: 'new'
      }
    });

    dialogRef.afterClosed().subscribe(result => { });
  }
  // Edit matter Pop-up
  EditNewmatterpopup() {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(MatterPopupComponent, {
      width: '100%',
      disableClose: true,
      data: {
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => { });
  }
}
