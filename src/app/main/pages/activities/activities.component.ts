import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { TableColumnsService, UsersService } from 'app/_services';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';



@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ActivitiesComponent implements OnInit {
  activitiesFilter: FormGroup;
  isLoadingResults: boolean = false;
  displayedColumns: string[];
  ColumnsObj: any = [];
  tempColobj: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  highlightedRows: any;
  currentActivitieData: any;
  pageSize: any;
  Activitiesdata: any = [];
  lastFilter: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private TableColumnsService: TableColumnsService,
    private _UsersService: UsersService,
    private toastr: ToastrService) { }
  ngOnInit() {
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 130)) + 'px');
    this.activitiesFilter = this._formBuilder.group({ ACTIVE: [] });
    this.getTableFilter();
    this.loadData({});
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('activities', '').subscribe(response => {
      console.log(response);
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS);
        this.displayedColumns = data.showcol;
        this.tempColobj = data.tempColobj;
        this.ColumnsObj = data.colobj;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  loadData(filterData) {
    this.isLoadingResults = true;
    this._UsersService.GetActivityData({}).subscribe(response => {
      console.log(response);
      if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
        if (response.DATA.ACTIVITIES[0]) {
          this.highlightedRows = response.DATA.ACTIVITIES[0].ACTIVITYGUID;
          this.Activitiesdata = response.DATA.ACTIVITIES[0];
        }
        this.Activitiesdata = new MatTableDataSource(response.DATA.ACTIVITIES);
        this.Activitiesdata.paginator = this.paginator;
        this.Activitiesdata.sort = this.sort;
      }
      this.isLoadingResults = false;
    }, error => {
      this.toastr.error(error);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'activities', 'list': '' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        this.tempColobj = result.tempColobj;
        if (!result.columObj) {
          this.Activitiesdata = new MatTableDataSource([]);
          this.Activitiesdata.paginator = this.paginator;
          this.Activitiesdata.sort = this.sort;
        } else {
          this.loadData(this.lastFilter);
        }
      }
    });
  }
}
