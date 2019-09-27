import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';

import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { MatSort } from '@angular/material';
import { MainAPiServiceService, BehaviorService } from 'app/_services';

@Component({
  selector: 'app-conflict-check',
  templateUrl: './conflict-check.component.html',
  styleUrls: ['./conflict-check.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ConflictCheckComponent implements OnInit {
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  ColumnsObj: any = [];
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  isLoadingResults: boolean = false;
  displayedColumns: string[] = ['CHRONOLOGYCONFLICT', 'COMPLETEDDATE', 'CONTACTCONFLICT', 'DATE', 'DETAILS', 'FILENOTECONFLICT',
    'MATDESCCONFLICT', 'MATTER', 'MATTERGUID', 'RESULTID', 'SHORTNAME', 'WIPCONFLICT'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  highlightedRows: any;
  ConflictData: any = [];
  pageSize: any;
  tempColobj: any;
  StartbtnSendData = {
    "NameToCheck": '', "CheckWIP": "", "CheckFilesNotes": "", "CheckChronologies": ""
  }
  ConflictNGData: any = [];

  constructor(private dialog: MatDialog, private toastr: ToastrService,
    private _mainAPiServiceService: MainAPiServiceService, public behaviorService: BehaviorService) {
    this.ConflictNGData = {
      "NameToCheck": '', "CheckWIP": true, "CheckFilesNotes": true, "CheckChronologies": true
    }
  }
  ngOnInit() {

    this.LoadData({});
    this.StartbtnSendData.CheckWIP = this.ConflictNGData.CheckWIP;
    this.StartbtnSendData.CheckFilesNotes = this.ConflictNGData.CheckFilesNotes;
    this.StartbtnSendData.CheckChronologies = this.ConflictNGData.CheckChronologies;
    this.behaviorService.ConflictMainData(this.StartbtnSendData);
  }
  LoadData(data) {
    this.ConflictData = [];
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(data, 'GetConflictCheck').subscribe(res => {
      this.ConflictData = new MatTableDataSource(res.DATA.RECONCILIATIONITEMS);
      this.ConflictData.sort = this.sort;
      this.ConflictData.paginator = this.paginator;
      if (res.CODE == 200 && res.STATUS == "success") {
        if (res.DATA.RECONCILIATIONITEMS[0]) {
          this.behaviorService.ConflictDataList(res.DATA.RECONCILIATIONITEMS[0]);
          this.RowClick(res.DATA.RECONCILIATIONITEMS[0]);
          this.highlightedRows = res.DATA.RECONCILIATIONITEMS[0].MATTERGUID;
        } else {
          this.behaviorService.ConflictDataList(null);
          // this.toastr.error("No Data Selected");
        }
        this.isLoadingResults = false;
      }
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);

    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  
  RowClick(val) {
    localStorage.setItem('set_active_matters', JSON.stringify({ MATTERGUID: val.MATTERGUID, SHORTNAME: val.SHORTNAME }))
    // let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));

  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  nameClick() {
    this.StartbtnSendData.NameToCheck = this.ConflictNGData.NameToCheck;
    this.behaviorService.ConflictMainData(this.StartbtnSendData);
  }
  CheckWPI() {
    this.StartbtnSendData.CheckWIP = this.ConflictNGData.CheckWIP;

    this.behaviorService.ConflictMainData(this.StartbtnSendData);
  }
  CheckFileNote() {
    this.StartbtnSendData.CheckFilesNotes = this.ConflictNGData.CheckFilesNotes;

    this.behaviorService.ConflictMainData(this.StartbtnSendData);
  }
  CheckChronology() {
    this.StartbtnSendData.CheckChronologies = this.ConflictNGData.CheckChronologies;

    this.behaviorService.ConflictMainData(this.StartbtnSendData);
  }
  refreshConflict() {
    this.LoadData(this.StartbtnSendData);
  }
  onSearch(searchFilter: any) {
    this.LoadData({Search: this.ConflictNGData.Search });

  }
}
