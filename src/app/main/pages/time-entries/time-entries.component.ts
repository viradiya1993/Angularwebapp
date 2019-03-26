import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from '../../sorting-dialog/sorting-dialog.component';


@Component({
  selector: 'app-time-entries',
  templateUrl: './time-entries.component.html',
  styleUrls: ['./time-entries.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TimeEntriesComponent implements OnInit {
  displayedColumns: string[] = ['service', 'quantity_from_10', 'price_from', 'price_from_inc', 'quantity_to', 'price_to', 'price_toinc'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.data = { 'data': ['service', 'quantity_from_10', 'price_from', 'price_from_inc', 'quantity_to', 'price_to', 'price_toinc'], 'type': 'estimate' };
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
  service: string;
  quantity_from_10: number;
  price_from: number;
  price_from_inc: number;
  quantity_to: number;
  price_to: number;
  price_toinc: number;
}const ELEMENT_DATA: PeriodicElement[] = [];