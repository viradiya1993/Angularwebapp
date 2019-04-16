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
  isLoadingResults: boolean = false;
  displayedColumns: string[] = ['date', 'matter', 'description', 'quantity', 'price_ex', 'price_inc', 'invoice_no'];
  TimerData;
  TimerDropData: any;
  isShowDrop: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  lastFilter: any;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';

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
      this.TimeEnrtyForm.controls['uninvoicedWork'].setValue(this.lastFilter.Invoiced);
      this.TimeEnrtyForm.controls['dlpdrop'].setValue(this.lastFilter.FeeEarner);
    } else {
      this.lastFilter = { 'FeeEarner': '', 'Invoiced': "", 'ItemDateStart': '', 'ItemDateEnd': '' };
      localStorage.setItem('time_entries_filter', JSON.stringify(this.lastFilter));
    }
  }

  ngOnInit() {
    let d = {};
    this.Timersservice.GetUsers(d).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.TimerDropData = res.DATA.USERS;
      }
    }, err => {
      console.log(err);
    });
    this.LoadData(this.lastFilter);
  }
  get f() {
    return this.TimeEnrtyForm.controls;
  }
  editTimeEntry(Data: any) {
    localStorage.setItem('edit_WORKITEMGUID', Data);
  }
  LoadData(Data) {
    this.isLoadingResults = true;
    this.Timersservice.getTimeEnrtyData(Data).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.WORKITEMS[0]) {
          this.highlightedRows = response.DATA.WORKITEMS[0].WORKITEMGUID;
          localStorage.setItem('edit_WORKITEMGUID', this.highlightedRows);
        }
        this.TimerData = new MatTableDataSource(response.DATA.WORKITEMS)
        this.TimerData.paginator = this.paginator
      }
      this.isLoadingResults = false;
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
  }
  uninvoicedWorkChange(value) {
    let filterVal = { 'FeeEarner': '', 'Invoiced': value, 'ItemDateStart': '', 'ItemDateEnd': '' };
    if (!localStorage.getItem('time_entries_filter')) {
      localStorage.setItem('time_entries_filter', JSON.stringify(filterVal));
    } else {
      filterVal = JSON.parse(localStorage.getItem('time_entries_filter'));
      filterVal.Invoiced = value;
      localStorage.setItem('time_entries_filter', JSON.stringify(filterVal));
    }
    this.LoadData(filterVal);
  }
  dlpChange(value) {
    let filterVal = { 'FeeEarner': value, 'Invoiced': '', 'ItemDateStart': '', 'ItemDateEnd': '' };
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
    let filterVal = { 'FeeEarner': '', 'Invoiced': '', 'ItemDateStart': begin, 'ItemDateEnd': end };
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
    dialogConfig.disableClose = true;
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
