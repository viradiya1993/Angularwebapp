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
  review_date: Date;
}


const ELEMENT_DATA: PeriodicElement[] = [

   {packet_number:11112,packet_description:'in process ',document:2521,status:'not done yet',document_name:'xyz',description:'abcdefgh',review_date:new Date('2/1/2014')},
   {packet_number:12362,packet_description:'in process',document:2521,status:' done ',document_name:'xyz ',description:'abcdefgh ',review_date:new Date('2/1/2014')},
   {packet_number:15634,packet_description:'in process ',document:2521,status:'not done yet',document_name:'xyz',description:'abcdefgh ',review_date:new Date('2/1/2014')},
   {packet_number:11411,packet_description:'in process',document:2521,status:'not done yet',document_name:'xyz',description:'abcdefgh ',review_date:new Date('2/1/2014')},
   {packet_number:12153,packet_description:'in process',document:2521,status:'done',document_name:' xyz',description:' abcdefgh',review_date:new Date('2/1/2014')},
   {packet_number:12316,packet_description:'in process',document:2521,status:'not done yet',document_name:'xyz',description:' abcdefgh',review_date:new Date('2/1/2014')},
];

