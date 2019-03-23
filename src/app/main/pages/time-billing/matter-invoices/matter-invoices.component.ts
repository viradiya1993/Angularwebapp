import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

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
  constructor() { }

  ngOnInit() {

    this.dataSource.paginator = this.paginator;
  }

}
export interface PeriodicElement {
  invoice_no: number;
  date: number;
  total: number;
  gst: number;

  paid: number;
  outstanding: number;
  written_off: number;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },
  { invoice_no: 1, date: 1012, total: 1.0079, gst: 12, paid: 212, outstanding: 89, written_off: 45 },

];