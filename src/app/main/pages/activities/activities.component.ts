import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';


export interface ActivityElement {
  ID: number;
  Description: string;
  GSTType: string;
  Unit: number;
  DescSingle: string;
  DescPlural: string;

}
const ELEMENT_DATA: ActivityElement[] = [
  { ID: 1, Description: 'Hydrogen', GSTType:'Inclusive',Unit:20.00,DescSingle: 'Unit',DescPlural: 'pages'},
  { ID: 2, Description: 'Helium', GSTType: 'Exclusive',Unit:10.00,DescSingle: 'page',DescPlural: 'pages'},
  { ID: 3, Description: 'Lithium', GSTType: 'Inclusive',Unit:50.00,DescSingle: 'Unit',DescPlural:'Unit' },
  { ID: 4, Description: 'Beryllium', GSTType:'Exclusive',Unit: 25.00,DescSingle: 'Item',DescPlural:'Item'},
];

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  ID = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  isLoadingResults: boolean = false;
  isspiner: boolean = false;
  displayedColumns: string[] = ['ID', 'Description', 'GSTType','Unit','DescSingle','DescPlural'];
  ActivityData = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() { }
  ngOnInit() {
    this.ActivityData.sort = this.sort;
    this.ActivityData.paginator = this.paginator;
  }
  openActivity(){
    
  }
  //Click Active Row
  activityclick(val){
    
  }
}
