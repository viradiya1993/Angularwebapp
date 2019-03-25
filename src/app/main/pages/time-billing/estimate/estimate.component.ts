import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EstimateComponent implements OnInit {
  displayedColumns: string[] = ['service', 'quantity_from_10', 'price_from', 'price_from_inc', 'quantity_to', 'price_to', 'price_toinc','button'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

}
export interface PeriodicElement {
  service: string;
  quantity_from_10: number;
  price_from: number;
  price_from_inc: number;
  quantity_to: number;
  price_to: number;
  price_toinc: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {service:'xyz',quantity_from_10:51,price_from:31,price_from_inc:25,quantity_to:11,price_to:32,price_toinc:5},
  {service:'abc',quantity_from_10:51,price_from:31,price_from_inc:25,quantity_to:11,price_to:32,price_toinc:5},
  {service:'def',quantity_from_10:51,price_from:31,price_from_inc:25,quantity_to:11,price_to:32,price_toinc:5},
  {service:'ghi',quantity_from_10:51,price_from:31,price_from_inc:25,quantity_to:11,price_to:32,price_toinc:5},
  {service:'jkl',quantity_from_10:51,price_from:31,price_from_inc:25,quantity_to:11,price_to:32,price_toinc:5},
  {service:'mno',quantity_from_10:51,price_from:31,price_from_inc:25,quantity_to:11,price_to:32,price_toinc:5},

];