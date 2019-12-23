import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { TableColumnsService, MainAPiServiceService, BehaviorService } from 'app/_services';
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
  FilterVal: any = [];
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  highlightedRows: any;
  currentActivitieData: any;
  pageSize: any;
  Activitiesdata: any = [];
  lastFilter: any;
  isDisplay: boolean = false;
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;


  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private TableColumnsService: TableColumnsService,
    private _mainAPiServiceService: MainAPiServiceService,
    private toastr: ToastrService,public behaviorService: BehaviorService) { }
  ngOnInit() {
    this.behaviorService.resizeTableForAllView();
    const behaviorService = this.behaviorService;
    $(window).resize(function () {
      behaviorService.resizeTableForAllView();
    });
    this.activitiesFilter = this._formBuilder.group({ TYPE: [" "] });
    this.getTableFilter();
    if (JSON.parse(localStorage.getItem('activity_filter'))) {
      this.FilterVal = JSON.parse(localStorage.getItem('activity_filter'));
      this.activitiesFilter.controls['TYPE'].setValue(this.FilterVal.ACTIVITYTYPE);
      this.loadData(this.FilterVal);
    } else {
      this.FilterVal = localStorage.setItem('activity_filter', JSON.stringify({ ACTIVITYTYPE: ' ' }));
      this.activitiesFilter.controls['TYPE'].setValue('');
    }
    this.loadData(this.FilterVal);
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('Activities', '').subscribe(response => {
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
  refreshActivities() {
    let filterval = JSON.parse(localStorage.getItem('activity_filter'));
    this.loadData(filterval);
  }
  loadData(filterData) {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(filterData, 'GetActivity').subscribe(response => {
      if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
        if (response.DATA.ACTIVITIES[0]) {
          this.isDisplay = false;
          this.highlightedRows = response.DATA.ACTIVITIES[0].ACTIVITYGUID;
          this.Activitiesdata = response.DATA.ACTIVITIES[0];
          localStorage.setItem('current_ActivityData', JSON.stringify(response.DATA.ACTIVITIES[0]));
        } else {
          this.isDisplay = true;
        }
        this.Activitiesdata = new MatTableDataSource(response.DATA.ACTIVITIES);
        this.Activitiesdata.paginator = this.paginator;
        this.Activitiesdata.sort = this.sort;
      } else {
        this.Activitiesdata = new MatTableDataSource([]);
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
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'Activities', 'list': '' };
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
          this.isDisplay = true;
        } else {
          this.loadData({ ACTIVITYTYPE: "" });
        }
      }
    });
  }
  TypeChange(EventVal: any) {
    let filterval = JSON.parse(localStorage.getItem('activity_filter'))
    filterval.ACTIVITYTYPE = EventVal.value;
    localStorage.setItem('activity_filter', JSON.stringify({ ACTIVITYTYPE: EventVal.value }));
    this.loadData(filterval);
  }
  setActiveData(rowData: any) {
    localStorage.setItem('current_ActivityData', JSON.stringify(rowData));
  }
 
  
}
