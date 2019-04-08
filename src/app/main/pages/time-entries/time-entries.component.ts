import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from '../../sorting-dialog/sorting-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TimersService } from '../../../_services';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-time-entries',
  templateUrl: './time-entries.component.html',
  styleUrls: ['./time-entries.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TimeEntriesComponent implements OnInit {
  form: FormGroup;

  displayedColumns: string[] = ['date', 'matter', 'description', 'quantity', 'price_ex', 'price_inc', 'invoice_no'];
  TimerData;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog, fb: FormBuilder, private toastr: ToastrService, private Timersservice: TimersService) {
    this.form = fb.group({
      date: [{ begin: new Date(2018, 7, 5), end: new Date(2018, 7, 25) }]
    });
  }

  ngOnInit() {
    this.LoadData({ 'SessionToken': localStorage.getItem('session_token') });
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
  uninvoicedWorkChange(dart) {
    if (!localStorage.getItem('time_entries_filter')) {
      let filterVal = { 'FeeEarner': '', 'ItemType': dart, 'ItemDateStart': '', 'ItemDateEnd': '' };
      localStorage.setItem('time_entries_filter', JSON.stringify(filterVal));
    }
    console.log(dart);
  }
  dlpChange(dart) {
    console.log(dart);
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
