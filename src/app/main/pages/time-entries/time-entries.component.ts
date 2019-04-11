import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig, MatDatepickerInputEvent } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from '../../sorting-dialog/sorting-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TimersService } from '../../../_services';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common'


@Component({
  selector: 'app-time-entries',
  templateUrl: './time-entries.component.html',
  styleUrls: ['./time-entries.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TimeEntriesComponent implements OnInit {
  TimeEnrtyForm: FormGroup;

  displayedColumns: string[] = ['date', 'matter', 'description', 'quantity', 'price_ex', 'price_inc', 'invoice_no'];
  TimerData;
  TimerDropData: any;
  isShowDrop: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  lastFilter: any;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private Timersservice: TimersService,
    public datepipe: DatePipe
  ) {
    this.lastFilter = JSON.parse(localStorage.getItem('time_entries_filter'));
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.isShowDrop = currentUser.ProductType == "Barrister" ? false : true;
    this.TimeEnrtyForm = this.fb.group({ date: [''], uninvoicedWork: [''], dlpdrop: [''], });
    if (this.lastFilter) {
      let Sd = new Date(this.lastFilter.ItemDateStart);
      let ed = new Date(this.lastFilter.ItemDateEnd);
      this.TimeEnrtyForm.controls['date'].setValue({ begin: Sd, end: ed });
      this.TimeEnrtyForm.controls['uninvoicedWork'].setValue(this.lastFilter.ItemType);
      this.TimeEnrtyForm.controls['dlpdrop'].setValue(this.lastFilter.FeeEarner);
    }
  }

  ngOnInit() {
    let d = {};
    this.Timersservice.GetUsers(d).subscribe(res => {
      if (res.Users.response != "error - not logged in") {
        localStorage.setItem('session_token', res.Users.SessionToken);
        this.TimerDropData = res.Users.DataSet;
      }
    }, err => {
      console.log(err);
      // this.toastr.error(err);
    });
    this.LoadData(this.lastFilter);
  }
  get f() {
    return this.TimeEnrtyForm.controls;
  }
  LoadData(Data) {
    this.Timersservice.getTimeEnrtyData(Data).subscribe(res => {
      if (res.WorkItems.response != "error - not logged in") {
        localStorage.setItem('session_token', res.WorkItems.SessionToken);
        this.TimerData = new MatTableDataSource(res.WorkItems.DataSet)
        this.TimerData.paginator = this.paginator
      } else {
        this.toastr.error(res.WorkItems.response);
      }
    }, err => {
      this.toastr.error(err);
    });
  }
  uninvoicedWorkChange(value) {
    let filterVal = { 'FeeEarner': '', 'ItemType': value, 'ItemDateStart': '', 'ItemDateEnd': '' };
    if (!localStorage.getItem('time_entries_filter')) {
      localStorage.setItem('time_entries_filter', JSON.stringify(filterVal));
    } else {
      filterVal = JSON.parse(localStorage.getItem('time_entries_filter'));
      filterVal.ItemType = value;
      localStorage.setItem('time_entries_filter', JSON.stringify(filterVal));
    }
    this.LoadData(filterVal);
  }
  dlpChange(value) {
    let filterVal = { 'FeeEarner': value, 'ItemType': '', 'ItemDateStart': '', 'ItemDateEnd': '' };
    if (!localStorage.getItem('time_entries_filter')) {
      localStorage.setItem('time_entries_filter', JSON.stringify(filterVal));
    } else {
      filterVal = JSON.parse(localStorage.getItem('time_entries_filter'));
      filterVal.FeeEarner = value;
      localStorage.setItem('time_entries_filter', JSON.stringify(filterVal));
    }
    this.LoadData(filterVal);
  }


  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
    let end = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');
    let filterVal = { 'FeeEarner': '', 'ItemType': '', 'ItemDateStart': begin, 'ItemDateEnd': end };
    if (!localStorage.getItem('time_entries_filter')) {
      localStorage.setItem('time_entries_filter', JSON.stringify(filterVal));
    } else {
      filterVal = JSON.parse(localStorage.getItem('time_entries_filter'));
      filterVal.ItemDateStart = begin;
      filterVal.ItemDateEnd = end;
      localStorage.setItem('time_entries_filter', JSON.stringify(filterVal));
    }
    this.LoadData(filterVal);
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.data = { 'data': ['date', 'matter', 'description', 'quantity', 'price_ex', 'price_inc', 'invoice_no'], 'type': 'estimate' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(result);
    // });
    dialogRef.afterClosed().subscribe(data =>
      this.tableSetting(data)
    );
  }
  tableSetting(data: any) {
    if (data !== false) {
      this.displayedColumns = data;
    }
  }

}
