import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';

@Component({
  selector: 'app-receipts-credits',
  templateUrl: './receipts-credits.component.html',
  styleUrls: ['./receipts-credits.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ReceiptsCreditsComponent implements OnInit {

  displayedColumns: string[] = ['receipt_no', 'date', 'total', 'gst', 'allocation', 'note'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private dialog: MatDialog) { }

  ngOnInit() {

    this.dataSource.paginator = this.paginator;
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.data = { 'data': ['receipt_no', 'date', 'total', 'gst', 'allocation', 'note'], 'type': 'receipts-credits' };
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

export interface PeriodicElement {
  receipt_no: number;
  date: Date;
  total: number;
  gst: number;
  allocation: number;
  note: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { receipt_no: 1, date: new Date('2/1/2014'), total: 5500.0524, gst: 30, allocation: 100.30, note: 'not done yet' },
  { receipt_no: 2, date: new Date('2/1/2014'), total: 5500.0524, gst: 30, allocation: 12.30, note: 'not done yet' },
  { receipt_no: 3, date: new Date('2/1/2014'), total: 5500.0524, gst: 30, allocation: 123.30, note: 'not done yet' },
  { receipt_no: 4, date: new Date('2/1/2014'), total: 5500.0524, gst: 30, allocation: 112.30, note: 'not done yet' },
  { receipt_no: 5, date: new Date('2/1/2014'), total: 5500.0524, gst: 30, allocation: 56.30, note: 'not done yet' },
  { receipt_no: 6, date: new Date('2/1/2014'), total: 5500.0524, gst: 30, allocation: 52.03, note: 'not done yet' },

];