import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-safecustody',
  templateUrl: './safecustody.component.html',
  styleUrls: ['./safecustody.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SafecustodyComponent implements OnInit {
  displayedColumns: string[] = ['packet_number', 'packet_description', 'document','status','document_name','description','review_date','button'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

}
export interface PeriodicElement {
  packet_number: number;
  packet_description: string;
  document: number;
  status: string;
  document_name: string;
  description: string;
  review_date: number;
}


const ELEMENT_DATA: PeriodicElement[] = [

   {packet_number:111,packet_description:'dummy data',document:2521,status:'not done yet',document_name:'xyz',description:'abcdefgh',review_date:25122018},
   {packet_number:112,packet_description:'dummy data',document:2521,status:'not done yet',document_name:'xyz',description:'abcdefgh',review_date:25122018},
   {packet_number:113,packet_description:'dummy data',document:2521,status:'not done yet',document_name:'xyz',description:'abcdefgh',review_date:25122018},
   {packet_number:114,packet_description:'dummy data',document:2521,status:'not done yet',document_name:'xyz',description:'abcdefgh',review_date:25122018},
   {packet_number:115,packet_description:'dummy data',document:2521,status:'not done yet',document_name:'xyz',description:'abcdefgh',review_date:25122018},
   {packet_number:116,packet_description:'dummy data',document:2521,status:'not done yet',document_name:'xyz',description:'abcdefgh',review_date:25122018},
];

