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

  displayedColumns: string[] = ['date', 'type', 'quantity', 'price', 'description', 'invoice_no', 'price_in_gst', 'buttons'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {

    this.dataSource.paginator = this.paginator;
  }

}

export interface PeriodicElement {
  date: number;
  type: number;
  quantity: number;
  price: number;
  description: string;
  invoice_no: number;
  price_in_gst: number;

}

const ELEMENT_DATA: PeriodicElement[] = [

];