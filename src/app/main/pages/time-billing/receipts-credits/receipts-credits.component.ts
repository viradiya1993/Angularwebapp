import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-receipts-credits',
  templateUrl: './receipts-credits.component.html',
  styleUrls: ['./receipts-credits.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ReceiptsCreditsComponent implements OnInit {

  displayedColumns: string[] = ['receipt_no', 'date', 'total', 'gst', 'allocation', 'note','button'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor() { }

  ngOnInit() {

    this.dataSource.paginator = this.paginator;
  }

}

export interface PeriodicElement {
  receipt_no: number;
  date: number;
  total: number;
  gst: number;
  allocation: string;
  note: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
   {receipt_no: 1, date:22122018, total: 5500.0524, gst: 30,allocation:'xyz',note:'abcdefgh'},
   {receipt_no: 2, date:22122018, total: 5500.0524, gst: 30,allocation:'xyz',note:'abcdefgh'},
   {receipt_no: 3, date:22122018, total: 5500.0524, gst: 30,allocation:'xyz',note:'abcdefgh'},
   {receipt_no: 4, date:22122018, total: 5500.0524, gst: 30,allocation:'xyz',note:'abcdefgh'},
   {receipt_no: 5, date:22122018, total: 5500.0524, gst: 30,allocation:'xyz',note:'abcdefgh'},
   {receipt_no: 6, date:22122018, total: 5500.0524, gst: 30,allocation:'xyz',note:'abcdefgh'},

];