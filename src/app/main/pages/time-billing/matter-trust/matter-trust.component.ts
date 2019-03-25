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


  displayedColumns: string[] = ['class', 'cashbook', 'id', 'trans_date', 'amount', 'payor', 'type', 'cheque_no', 'reason','button'];
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
  type: string;
  cheque_no: number;
  reason: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {class:1,cashbook:32,id:21,trans_date:55,amount:2500,payor:9,type:'xyz',cheque_no:10,reason:'abcdef'},
  {class:2,cashbook:32,id:21,trans_date:55,amount:2500,payor:9,type:'xyz',cheque_no:10,reason:'abcdef'},
  {class:3,cashbook:32,id:21,trans_date:55,amount:2500,payor:9,type:'xyz',cheque_no:10,reason:'abcdef'},
  {class:4,cashbook:32,id:21,trans_date:55,amount:2500,payor:9,type:'xyz',cheque_no:10,reason:'abcdef'},
  {class:5,cashbook:32,id:21,trans_date:55,amount:2500,payor:9,type:'xyz',cheque_no:10,reason:'abcdef'},
  {class:6,cashbook:32,id:21,trans_date:55,amount:2500,payor:9,type:'xyz',cheque_no:10,reason:'abcdef'},

];