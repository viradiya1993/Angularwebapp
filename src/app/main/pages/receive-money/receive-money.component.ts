import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { TableColumnsService, TimersService } from '../../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig, MatDatepickerInputEvent } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-receive-money',
  templateUrl: './receive-money.component.html',
  styleUrls: ['./receive-money.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ReceiveMoneyComponent implements OnInit {
  tempColobj: any;
  ColumnsObj: any;
  isLoadingResults: boolean;
  displayedColumns: any = [];
  receiveMoneydata: any;
  highlightedRows: any;
  pageSize: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private TableColumnsService: TableColumnsService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private Timersservice: TimersService,
    public datepipe: DatePipe,
  ) { }
  receiveMoneyForm: FormGroup;
  ngOnInit() {
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 130)) + 'px');
    this.receiveMoneyForm = this.fb.group({
      ShowWhat: [''],
      DateRange: [''],
      ReceiptsTotalInc: [''],
      ReceiptsTotalEx: [''],
    });
    this.getTableFilter();
    this.LoadData({});
  }

  getTableFilter() {
    this.TableColumnsService.getTableFilter('time entries', '').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS, 'WorkItemsColumns');
        this.tempColobj = data.tempColobj;
        this.displayedColumns = data.showcol;
        this.ColumnsObj = data.colobj;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  choosedDate(W, E) {

  }
  LoadData(Data) {
    this.isLoadingResults = true;
    this.Timersservice.getTimeEnrtyData(Data).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.WORKITEMS[0]) {
          this.highlightedRows = response.DATA.WORKITEMS[0].WORKITEMGUID;
          localStorage.setItem('edit_WORKITEMGUID', this.highlightedRows);
        }
        try {
          this.receiveMoneydata = new MatTableDataSource(response.DATA.WORKITEMS);
          this.receiveMoneydata.paginator = this.paginator;
        } catch (error) {
          console.log(error);
        }
      }
      this.isLoadingResults = false;
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'time entries', 'list': '' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tempColobj = result.tempColobj;
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        if (!result.columObj) {
          this.receiveMoneydata = new MatTableDataSource([]);
          this.receiveMoneydata.paginator = this.paginator;
        } else {
          this.LoadData(JSON.parse(localStorage.getItem('time_entries_filter')));
        }
      }
    });
  }
}
