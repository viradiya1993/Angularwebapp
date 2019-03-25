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
  class: string;
  cashbook: number;
  id: number;
  trans_date: Date;

  amount: number;
  payor: number;
  type: string;
  cheque_no: number;
  reason: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {class:'receipt',cashbook:32,id:21,trans_date:new Date('2/1/2014'),amount:2500.30,payor:9,type:'xyz',cheque_no:10,reason:'abcdef'},
  {class:'receipt',cashbook:32,id:21,trans_date:new Date('2/1/2014'),amount:2500.90,payor:9,type:'xyz',cheque_no:1,reason:'abcdef'},
  {class:'receipt',cashbook:32,id:21,trans_date:new Date('2/1/2014'),amount:2500.256,payor:9,type:'xyz',cheque_no:3,reason:'abcdef'},
  {class:'receipt',cashbook:32,id:21,trans_date:new Date('2/1/2014'),amount:2500.300,payor:9,type:'xyz',cheque_no:56,reason:'abcdef'},
  {class:'receipt',cashbook:32,id:21,trans_date:new Date('2/1/2014'),amount:2500.30,payor:9,type:'xyz',cheque_no:10,reason:'abcdef'},
  {class:'receipt',cashbook:32,id:21,trans_date:new Date('2/1/2014'),amount:2500.001,payor:9,type:'xyz',cheque_no:11,reason:'abcdef'},

];