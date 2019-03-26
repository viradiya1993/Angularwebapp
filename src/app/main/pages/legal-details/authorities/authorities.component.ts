import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';

@Component({
  selector: 'app-authorities',
  templateUrl: './authorities.component.html',
  styleUrls: ['./authorities.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AuthoritiesComponent implements OnInit {
  displayedColumns: string[] = ['topic', 'authority', 'citation', 'reference', 'web_address', 'comment'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.data = { 'data': ['topic', 'authority', 'citation', 'reference', 'web_address', 'comment'], 'type': 'authorities' };
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
  topic: number;
  authority: string;
  citation: number;
  reference: string;
  web_address: string;
  comment: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { topic: 1, authority: 'xyz', citation: 1.0079, reference: 'www.google.com', web_address: 'xyz', comment: 'not done yet' },
  { topic: 2, authority: 'xyz', citation: 1.0079, reference: 'www.google.com', web_address: 'xyz', comment: 'not done yet' },
  { topic: 3, authority: 'xyz', citation: 1.0079, reference: 'www.google.com', web_address: 'xyz', comment: 'not done yet' },
  { topic: 4, authority: 'xyz', citation: 1.0079, reference: 'www.google.com', web_address: 'xyz', comment: 'not done yet' },
  { topic: 5, authority: 'xyz', citation: 1.0079, reference: 'www.google.com', web_address: 'xyz', comment: 'not done yet' },
  { topic: 6, authority: 'xyz', citation: 1.0079, reference: 'www.google.com', web_address: 'xyz', comment: 'not done yet' },
];