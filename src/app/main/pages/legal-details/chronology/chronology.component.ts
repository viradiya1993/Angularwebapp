import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';


@Component({
  selector: 'app-chronology',
  templateUrl: './chronology.component.html',
  styleUrls: ['./chronology.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ChronologyComponent implements OnInit {

  displayedColumns: string[] = ['date', 'topic', 'reference', 'event_agreed', 'brief_page_no', 'comment', 'privileged', 'witnesses', 'text'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }


}
export interface PeriodicElement {
  date: number;
  topic: string;
  reference: number;
  event_agreed: number;
  brief_page_no: number;
  comment: number;
  privileged: number;
  witnesses: number;
  text: number;
}

const ELEMENT_DATA: PeriodicElement[] = [

];
