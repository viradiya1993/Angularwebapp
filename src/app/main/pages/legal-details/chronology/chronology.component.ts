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

  displayedColumns: string[] = ['date', 'topic', 'reference', 'event_agreed', 'brief_page_no', 'comment', 'privileged', 'witnesses', 'text','button'];
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
  reference: string;
  event_agreed: string;
  brief_page_no: number;
  comment: string;
  privileged: number;
  witnesses: number;
  text: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {date:22122008,topic:'silq',reference:'xyz',event_agreed:'yes',brief_page_no:10,comment:'abcd',privileged:10,witnesses:5,text:12},
  {date:23122008,topic:'silq',reference:'xyz',event_agreed:'yes',brief_page_no:10,comment:'abcd',privileged:10,witnesses:5,text:12},
  {date:24122008,topic:'silq',reference:'xyz',event_agreed:'yes',brief_page_no:10,comment:'abcd',privileged:10,witnesses:5,text:12},
  {date:25122008,topic:'silq',reference:'xyz',event_agreed:'yes',brief_page_no:10,comment:'abcd',privileged:10,witnesses:5,text:12},
  {date:26122008,topic:'silq',reference:'xyz',event_agreed:'yes',brief_page_no:10,comment:'abcd',privileged:10,witnesses:5,text:12},
  {date:27122008,topic:'silq',reference:'xyz',event_agreed:'yes',brief_page_no:10,comment:'abcd',privileged:10,witnesses:5,text:12},
  {date:28122008,topic:'silq',reference:'xyz',event_agreed:'yes',brief_page_no:10,comment:'abcd',privileged:10,witnesses:5,text:12},

];
