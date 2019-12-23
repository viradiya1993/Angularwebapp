import { Component, OnInit, Inject, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TimersService, MainAPiServiceService, BehaviorService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { MatterPopupComponent } from '../../matters/matter-popup/matter-popup.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-matter-dialog',
  templateUrl: './matter-dialog.component.html',
  styleUrls: ['./matter-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MatterDialogComponent implements OnInit {
  appPermissions: any = JSON.parse(localStorage.getItem('app_permissions'));
  displayedColumns: string[] = ['matternumber', 'matter', 'client'];
  getDataForTable: any = [];
  highlightedRows: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  matterFilterForm: FormGroup;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  isLoadingResults: boolean = false;
  pageSize: any;
  currentMatterData: any;
  MatterDropData: any;
  filterVal: any = { 'Active': '', 'FeeEarner': '', 'SearchString': '' };

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    private toastr: ToastrService,
    private behaviorService: BehaviorService,
    private Timersservice: TimersService
  ) {
    this.matterFilterForm = this.fb.group({ MatterFilter: [''], UserFilter: [''], searchFilter: [''], InvoiceFilter: [''], });
    this.matterFilterForm.controls['MatterFilter'].setValue('active')
  }

  ngOnInit() {
    if (this.appPermissions == null)
      this.appPermissions = [];
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
    this.behaviorService.MatterData(this.currentMatterData);
  }
  getMatterList() {
    this.filterVal.Active = 'active';
    this.getList(this.filterVal);
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
    this.isLoadingResults = true;

    this._mainAPiServiceService.getSetData(filterVal, 'GetMatter').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.MATTERS[0]) {
          this.highlightedRows = response.DATA.MATTERS[0].MATTERGUID;
          this.currentMatterData = response.DATA.MATTERS[0];
          this.behaviorService.MatterData(this.currentMatterData);
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
    let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
    const dialogRef = this.dialog.open(MatterPopupComponent, {
      width: '100%',
      disableClose: true,
      data: { action: 'edit', 'matterGuid': mattersData.MATTERGUID }
    });
    dialogRef.afterClosed().subscribe(result => { });
  }

}
