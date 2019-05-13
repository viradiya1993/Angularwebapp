import { Component, OnInit, Inject, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDatepickerInputEvent, MatPaginator, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MattersService, TimersService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-matter-dialog',
  templateUrl: './matter-dialog.component.html',
  styleUrls: ['./matter-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MatterDialogComponent implements OnInit {
  displayedColumns: string[] = ['matternumber', 'matter', 'client'];
  getDataForTable: any = [];
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  @ViewChild(MatPaginator) paginator: MatPaginator;
  matterFilterForm: FormGroup;
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  isLoadingResults: boolean = false;
  pageSize: any;
  currentMatterData: any;
  MatterDropData: any;
  filterVal: any = { 'Active': '', 'FeeEarner': '', 'SearchString': '' };

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private mattersService: MattersService,
    private toastr: ToastrService,
    private Timersservice: TimersService
  ) {
    this.matterFilterForm = this.fb.group({ MatterFilter: [''], UserFilter: [''], searchFilter: [''], InvoiceFilter: [''], });
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
    this.isLoadingResults = true;
    this.mattersService.getMatters(filterVal).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.MATTERS[0]) {
          this.highlightedRows = response.DATA.MATTERS[0].MATTERGUID;
          this.currentMatterData = response.DATA.MATTERS[0];
        }
        this.getDataForTable = new MatTableDataSource(response.DATA.MATTERS);
        this.getDataForTable.paginator = this.paginator;
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

}
