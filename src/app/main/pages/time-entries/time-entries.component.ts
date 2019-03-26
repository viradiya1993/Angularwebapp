import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from '../../sorting-dialog/sorting-dialog.component';
import {FormBuilder, FormGroup} from '@angular/forms';


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
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog,fb: FormBuilder) {
    this.form = fb.group({
      date: [{begin: new Date(2018, 7, 5), end: new Date(2018, 7, 25)}]
    });
   }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
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
export interface PeriodicElement {
  date: Date;
  matter: string;
  description:string;
  quantity: number;
  price_ex: number;
  price_inc: number;
  invoice_no: number;
}const ELEMENT_DATA: PeriodicElement[] = [
  {date: new Date('2/1/2014'),matter:'not yet',description:'not done yet',quantity:200.30,price_ex:123.032,price_inc:89.30,invoice_no:3012010},
  {date: new Date('2/1/2014'),matter:'not yet',description:'not done yet',quantity:200.30,price_ex:123.032,price_inc:89.30,invoice_no:3012010},
  {date: new Date('2/1/2014'),matter:'not yet',description:'not done yet',quantity:200.30,price_ex:123.032,price_inc:89.30,invoice_no:3012010},
  {date: new Date('2/1/2014'),matter:'not yet',description:'not done yet',quantity:200.30,price_ex:123.032,price_inc:89.30,invoice_no:3012010},
  {date: new Date('2/1/2014'),matter:'not yet',description:'not done yet',quantity:200.30,price_ex:123.032,price_inc:89.30,invoice_no:3012010},
  {date: new Date('2/1/2014'),matter:'not yet',description:'not done yet',quantity:200.30,price_ex:123.032,price_inc:89.30,invoice_no:3012010},
  {date: new Date('2/1/2014'),matter:'not yet',description:'not done yet',quantity:200.30,price_ex:123.032,price_inc:89.30,invoice_no:3012010},
  
];