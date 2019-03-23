import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-matter-trust',
  templateUrl: './matter-trust.component.html',
  styleUrls: ['./matter-trust.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MatterTrustComponent implements OnInit {


  displayedColumns: string[] = ['class', 'cashbook', 'id', 'trans_date', 'amount', 'payor', 'type', 'cheque_no', 'reason'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

}
export interface PeriodicElement {
  class: number;
  cashbook: number;
  id: number;
  trans_date: number;

  amount: number;
  payor: number;
  type: number;
  cheque_no: number;
  reason: number;

}

const ELEMENT_DATA: PeriodicElement[] = [


];