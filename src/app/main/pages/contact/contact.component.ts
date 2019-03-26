import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ContactComponent implements OnInit {
  displayedColumns: string[] = ['contact', 'company', 'phone', 'address', 'suburb', 'state'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.data = { 'data': ['contact', 'company', 'phone', 'address', 'suburb', 'state'], 'type': 'contact' };
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
  contact: string;
  company: string;
  phone: number;
  address: string;
  suburb: string;
  state: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { contact: 'AAA insurance', company: 'Toree and Fallow', phone: 68952153234558, address: '3/344 George Street', suburb: 'SYDENY', state: 'NSW' },
  { contact: 'BCA insurance', company: 'Toree and Fallow', phone: 2302153234558, address: '3/344 George Street', suburb: 'SYDENY', state: 'NSW' },
  { contact: 'Cannan Goight', company: 'Toree and Fallow', phone: 21532345581111,     address: '3/344 George Street', suburb: 'SYDENY', state: 'NSW' },
  { contact: 'AAA insurance', company: 'Toree and Fallow', phone: 68952153234558, address: '3/344 George Street', suburb: 'SYDENY', state: 'NSW' },
  { contact: 'AAA insurance', company: 'Toree and Fallow', phone: 68952153234558, address: '3/344 George Street', suburb: 'SYDENY', state: 'NSW' },
  { contact: 'AAA insurance', company: 'Toree and Fallow', phone: 68952153234558, address: '3/344 George Street', suburb: 'SYDENY', state: 'NSW' },
];
