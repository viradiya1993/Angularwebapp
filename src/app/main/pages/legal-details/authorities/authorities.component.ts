import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-authorities',
  templateUrl: './authorities.component.html',
  styleUrls: ['./authorities.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AuthoritiesComponent implements OnInit {
  displayedColumns: string[] = ['topic', 'authority', 'citation', 'reference', 'web_address', 'comment'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

}
export interface PeriodicElement {
  topic: number;
  authority: string;
  citation: number;
  reference: string;
  web_address: string;
  comment: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {topic:1, authority: 'xyz', citation: 1.0079, reference:'www.google.com',web_address:'xyz',comment:'not done yet'},
  {topic:2, authority: 'xyz', citation: 1.0079, reference:'www.google.com',web_address:'xyz',comment:'not done yet'},
  {topic:3, authority: 'xyz', citation: 1.0079, reference:'www.google.com',web_address:'xyz',comment:'not done yet'},
  {topic:4, authority: 'xyz', citation: 1.0079, reference:'www.google.com',web_address:'xyz',comment:'not done yet'},
  {topic:5, authority: 'xyz', citation: 1.0079, reference:'www.google.com',web_address:'xyz',comment:'not done yet'},
  {topic:6, authority: 'xyz', citation: 1.0079, reference:'www.google.com',web_address:'xyz',comment:'not done yet'},
];