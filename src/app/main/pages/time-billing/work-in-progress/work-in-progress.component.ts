import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-work-in-progress',
  templateUrl: './work-in-progress.component.html',
  styleUrls: ['./work-in-progress.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class WorkInProgressComponent implements OnInit {

  displayedColumns: string[] = ['date', 'type', 'quantity', 'price', 'description', 'invoice_no', 'price_in_gst', 'button'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {

    this.dataSource.paginator = this.paginator;
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
  {date:new Date('2/1/2014'),type:'XYZ',quantity:100,price:250.30,description:'not done yet',invoice_no:5,price_in_gst:885.30},
  {date:new Date('2/1/2014'),type:'XYZ',quantity:120,price:278.301,description:'not done yet',invoice_no:5,price_in_gst:88.30},
  {date:new Date('2/1/2014'),type:'XYZ',quantity:130,price:2500.301,description:'not done yet',invoice_no:5,price_in_gst:60.30},
  {date:new Date('2/1/2014'),type:'XYZ',quantity:140,price:2500.301,description:'not done yet',invoice_no:5,price_in_gst:78.30},
  {date:new Date('2/1/2014'),type:'XYZ',quantity:150,price:2500.201,description:'not done yet',invoice_no:5,price_in_gst:45.30},
  {date:new Date('2/1/2014'),type:'XYZ',quantity:160,price:2500.0012,description:'not done yet',invoice_no:5,price_in_gst:550.30},
];