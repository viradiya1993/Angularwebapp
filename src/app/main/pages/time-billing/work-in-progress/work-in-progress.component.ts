import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialogConfig, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { WorkInProgressService, TableColumnsService } from '../../../../_services';
import * as $ from 'jquery';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-work-in-progress',
  templateUrl: './work-in-progress.component.html',
  styleUrls: ['./work-in-progress.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class WorkInProgressComponent implements OnInit {
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  displayedColumns: string[];
  TimeEnrtyForm: FormGroup;
  ColumnsObj: any = [];
  pageSize: any;
  tempColobj: any;
  isShowDrop: boolean;
  lastFilter:any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoadingResults: boolean = false;
  constructor( public datepipe: DatePipe,private dialog: MatDialog, private fb: FormBuilder, private WorkInProgress: WorkInProgressService, private TableColumnsService: TableColumnsService, private toastr: ToastrService) {
    this.lastFilter = JSON.parse(localStorage.getItem('Work_in_progress_filter'));
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.isShowDrop = currentUser.ProductType == "Barrister" ? false : true;
    this.TimeEnrtyForm = this.fb.group({ date: [''], uninvoicedWork: [''], dlpdrop: [''], });
    if (this.lastFilter) {
      if (this.lastFilter.ItemDateStart && this.lastFilter.ItemDateEnd) {
        let tempDate = this.lastFilter.ItemDateStart.split("/");
        let tempDate2 = this.lastFilter.ItemDateEnd.split("/");
        let Sd = new Date(tempDate[1] + '/' + tempDate[0] + '/' + tempDate[2]);
        let ed = new Date(tempDate2[1] + '/' + tempDate2[0] + '/' + tempDate2[2]);
        this.TimeEnrtyForm.controls['date'].setValue({ begin: Sd, end: ed });
      } else {
        var dt = new Date();
        dt.setMonth(dt.getMonth() + 1);
        this.TimeEnrtyForm.controls['date'].setValue({ begin: new Date(), end: dt });
        this.lastFilter.ItemDateStart = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
        this.lastFilter.ItemDateEnd = this.datepipe.transform(dt, 'dd/MM/yyyy');
      }
      this.TimeEnrtyForm.controls['uninvoicedWork'].setValue(this.lastFilter.Invoiced);
      this.TimeEnrtyForm.controls['dlpdrop'].setValue(this.lastFilter.FeeEarner);
    } else {
      var dt = new Date();
      dt.setMonth(dt.getMonth() + 1);
      this.TimeEnrtyForm.controls['date'].setValue({ begin: new Date(), end: dt });
      this.lastFilter = {'MatterGuid':this.currentMatter.MATTERGUID ,'FeeEarner': '', 'Invoiced': "", 'ItemDateStart': this.datepipe.transform(new Date(), 'dd/MM/yyyy'), 'ItemDateEnd': this.datepipe.transform(dt, 'dd/MM/yyyy') };
      localStorage.setItem('Work_in_progress_filter', JSON.stringify(this.lastFilter));
    }

  }

  WorkInProgressdata:any
  ngOnInit() {
    $('content').addClass('inner-scroll');
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + 140)) + 'px');
    this.getTableFilter();
    // console.log(this.currentMatter.MATTERGUID );
    // console.log(this.lastFilter)
    this.loadData(this.lastFilter);
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('time and billing', 'work in progress').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS);
        this.displayedColumns = data.showcol;
        this.ColumnsObj = data.colobj;
        this.tempColobj = data.tempColobj;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  loadData(potData) {
    console.log(potData);
    potData.MatterGuid=this.currentMatter.MATTERGUID
    this.isLoadingResults = true;
    // let potData = { 'MatterGuid': this.currentMatter.MATTERGUID };
    this.WorkInProgress.WorkInProgressData(potData).subscribe(res => {
      console.log(res);
      if (res.CODE == 200 && res.STATUS == "success") {
        this.WorkInProgressdata = new MatTableDataSource(res.DATA.WORKITEMS);
        this.WorkInProgressdata.paginator = this.paginator;
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
  uninvoicedWorkChange(value) {
    let filterVal = {'MatterGuid':this.currentMatter.MATTERGUID, 'FeeEarner': '', 'Invoiced': value, 'ItemDateStart': '', 'ItemDateEnd': '' };
    if (!localStorage.getItem('Work_in_progress_filter')) {
      localStorage.setItem('Work_in_progress_filter', JSON.stringify(filterVal));
    } else {
      filterVal = JSON.parse(localStorage.getItem('Work_in_progress_filter'));
      filterVal.Invoiced = value;
      localStorage.setItem('Work_in_progress_filter', JSON.stringify(filterVal));
    }
    this.loadData(filterVal);
  }
  dlpChange(value) {
    let filterVal = { 'MatterGuid':this.currentMatter.MATTERGUID,'FeeEarner': value, 'Invoiced': '', 'ItemDateStart': '', 'ItemDateEnd': '' };
    if (!localStorage.getItem('Work_in_progress_filter')) {
      localStorage.setItem('Work_in_progress_filter', JSON.stringify(filterVal));
    } else {
      filterVal = JSON.parse(localStorage.getItem('Work_in_progress_filter'));
      filterVal.FeeEarner = value;
      localStorage.setItem('Work_in_progress_filter', JSON.stringify(filterVal));
    }
    this.loadData(filterVal);
  }


  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
    let end = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');
    let filterVal = { 'FeeEarner': '', 'Invoiced': '', 'ItemDateStart': begin, 'ItemDateEnd': end };
    if (!localStorage.getItem('Work_in_progress_filter')) {
      localStorage.setItem('Work_in_progress_filter', JSON.stringify(filterVal));
    } else {
      filterVal = JSON.parse(localStorage.getItem('Work_in_progress_filter'));
      filterVal.ItemDateStart = begin;
      filterVal.ItemDateEnd = end;
      localStorage.setItem('Work_in_progress_filter', JSON.stringify(filterVal));
    }
    this.loadData(filterVal);
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'time and billing', 'list': 'work in progress' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        this.tempColobj = result.tempColobj;
        if (!result.columObj) {
          this.WorkInProgressdata = new MatTableDataSource([]);
          this.WorkInProgressdata.paginator = this.paginator;
        } else {
          this.loadData({});
        }
      }
    });
  }


}



