import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';


@Component({
  selector: 'app-contact-corres-details',
  templateUrl: './contact-corres-details.component.html',
  styleUrls: ['./contact-corres-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ContactCorresDetailsComponent implements OnInit {
  displayedColumns: string[] = ['contact', 'type'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private dialog: MatDialog,public dialogRef: MatDialogRef<ContactCorresDetailsComponent>) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }
  ondialogcloseClick(): void {
    this.dialogRef.close(false);
  }
  editContact(event) {
    console.log(event);
  }

}

export interface PeriodicElement {
  contact: string;
  type: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
  { contact: 'hhkuh', type: 'xyz' },
];
