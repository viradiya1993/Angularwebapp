import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TimersService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';


@Component({
  selector: 'app-time-entry-dialog',
  templateUrl: './time-entry-dialog.component.html',
  styleUrls: ['./time-entry-dialog.component.scss']
})
export class TimeEntryDialogComponent implements OnInit, AfterViewInit {

  private exportTime = { hour: 7, minute: 15, meriden: 'PM', format: 24 };


  constructor(
    public dialogRef: MatDialogRef<TimeEntryDialogComponent>,
    private Timersservice: TimersService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    let GetMatterList = { "GetAssociatedDataSets": 'yes', 'Active': 1 };
    this.Timersservice.matterListFetch(GetMatterList).subscribe(res => {
      console.log(res);
      // if (res.WorkItems.response != "error - not logged in") {
      //   localStorage.setItem('session_token', res.WorkItems.SessionToken);
      //   this.TimerData = new MatTableDataSource(res.WorkItems.DataSet)
      //   this.TimerData.paginator = this.paginator
      // } else {
      //   this.toastr.error(res.WorkItems.response);
      // }
    }, err => {
      this.toastr.error(err);
    });
  }
  ngAfterViewInit(): void {
    $('#time_Control').attr('placeholder', 'Select time');
  }
  onChangeHour(event) {
    console.log('event', event);
  }
  ondialogcloseClick(): void {
    this.dialogRef.close(false);
  }

}
