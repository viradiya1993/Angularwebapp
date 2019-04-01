import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog} from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-time-entry-dialog',
  templateUrl: './time-entry-dialog.component.html',
  styleUrls: ['./time-entry-dialog.component.scss']
})
export class TimeEntryDialogComponent implements OnInit {
  private exportTime = { hour: 7, minute: 15, meriden: 'PM', format: 24 };


  constructor(public dialogRef: MatDialogRef<TimeEntryDialogComponent>) { }

  ngOnInit() {
  }
  onChangeHour(event) {
    console.log('event', event);
  }
  ondialogcloseClick(): void {
    this.dialogRef.close(false);
  }

}
