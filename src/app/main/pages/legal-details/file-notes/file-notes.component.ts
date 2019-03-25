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
  date: number;
  time: number;
  note: string;
}

const ELEMENT_DATA: PeriodicElement[] = [

  {date:211012,time:1530,note:'moon'},
  {date:221012,time:1530,note:'moon'},
  {date:231012,time:1530,note:'moon'},
  {date:241012,time:1530,note:'moon'},
  {date:251012,time:1530,note:'moon'},
  {date:261012,time:1530,note:'moon'},
  {date:271012,time:1530,note:'moon'},
  {date:281012,time:1530,note:'moon'},
  {date:291012,time:1530,note:'moon'},
  {date:301012,time:1530,note:'moon'},
  {date:311012,time:1530,note:'moon'}
];

