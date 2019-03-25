import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialogConfig, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';

@Component({
  selector: 'app-work-in-progress',
  templateUrl: './work-in-progress.component.html',
  styleUrls: ['./work-in-progress.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class WorkInProgressComponent implements OnInit {

  displayedColumns: string[] = ['date', 'type', 'quantity', 'price', 'description', 'invoice_no', 'price_in_gst'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {

    this.dataSource.paginator = this.paginator;
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.data = { 'data': ['date', 'type', 'quantity', 'price', 'description', 'invoice_no', 'price_in_gst'], 'type': 'work-in-progress' };
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
  date: Date;
  type: string;
  quantity: number;
  price: number;
  description: string;
  invoice_no: number;
  price_in_gst: number;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { date: new Date('2/1/2014'), type: 'XYZ', quantity: 100, price: 250.30, description: 'not done yet', invoice_no: 5, price_in_gst: 885.30 },
  { date: new Date('2/1/2014'), type: 'XYZ', quantity: 120, price: 278.301, description: 'not done yet', invoice_no: 5, price_in_gst: 88.30 },
  { date: new Date('2/1/2014'), type: 'XYZ', quantity: 130, price: 2500.301, description: 'not done yet', invoice_no: 5, price_in_gst: 60.30 },
  { date: new Date('2/1/2014'), type: 'XYZ', quantity: 140, price: 2500.301, description: 'not done yet', invoice_no: 5, price_in_gst: 78.30 },
  { date: new Date('2/1/2014'), type: 'XYZ', quantity: 150, price: 2500.201, description: 'not done yet', invoice_no: 5, price_in_gst: 45.30 },
  { date: new Date('2/1/2014'), type: 'XYZ', quantity: 160, price: 2500.0012, description: 'not done yet', invoice_no: 5, price_in_gst: 550.30 },
];