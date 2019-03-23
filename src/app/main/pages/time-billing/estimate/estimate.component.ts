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
  displayedColumns: string[] = ['service', 'quantity_from_10', 'price_from', 'price_from_inc', 'quantity_to', 'price_to', 'price_toinc'];
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

];