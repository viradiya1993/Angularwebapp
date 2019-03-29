import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialogConfig, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from '../../../sorting-dialog/sorting-dialog.component';

@Component({
  selector: 'app-matter-invoices',
  templateUrl: './matter-invoices.component.html',
  styleUrls: ['./matter-invoices.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MatterInvoicesComponent implements OnInit {

  displayedColumns: string[] = ['invoice_no', 'date', 'total', 'gst', 'paid', 'outstanding', 'written_off'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private dialog: MatDialog) { }

  ngOnInit() {

    this.dataSource.paginator = this.paginator;
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.data = { 'data': ['invoice_no', 'date', 'total', 'gst', 'paid', 'outstanding', 'written_off'], 'type': 'matter_invoices' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      if(result){
        localStorage.setItem(dialogConfig.data.type, JSON.stringify(result)); 
       }
    });
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
  invoice_no: number;
  date: Date;
  total: number;
  gst: number;

  paid: number;
  outstanding: number;
  written_off: number;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { invoice_no: 35, date: new Date('2/1/2014'), total: 321.0079, gst: 50.30, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 32, date: new Date('2/1/2014'), total: 5581.0079, gst: 12.30, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 35, date: new Date('2/1/2014'), total: 3211.0079, gst: 60.32, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 35, date: new Date('2/1/2014'), total: 1231.0079, gst: 40.25, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 35, date: new Date('2/1/2014'), total: 1569.0079, gst: 78.32, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 35, date: new Date('2/1/2014'), total: 158.0079, gst: 12.01, paid: 212, outstanding: 89, written_off: 45 }

];