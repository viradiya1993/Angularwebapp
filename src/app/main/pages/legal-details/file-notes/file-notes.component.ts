import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';


@Component({
  selector: 'app-file-notes',
  templateUrl: './file-notes.component.html',
  styleUrls: ['./file-notes.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class FileNotesComponent implements OnInit {
  displayedColumns: string[] = ['date', 'time', 'note','button'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

 constructor() { }

  ngOnInit() {
     this.dataSource.paginator = this.paginator;
  }
}
export interface PeriodicElement {
  date: Date;
  time: number;
  note: string;
}

const ELEMENT_DATA: PeriodicElement[] = [

  {date:new Date('2/1/2014'),time:11.30,note:'work in progress '},
  {date:new Date('2/12/2014'),time:15.30,note:'work in progress '},
  {date:new Date('6/13/2014'),time:15.30,note:'work in progress '},
  {date:new Date('5/13/2014'),time:14.56,note:' work in progress'},
  {date:new Date('1/13/2014'),time:13.30,note:' work in progress'},
  {date:new Date('1/11/2014'),time:23.30,note:'work in progress '},
  
];

