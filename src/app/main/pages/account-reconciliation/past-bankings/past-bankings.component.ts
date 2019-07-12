import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, ViewChild,Injectable,ViewContainerRef} from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material';
import * as $ from 'jquery';
import {NestedTreeControl} from '@angular/cdk/tree';
import {BehaviorSubject, Observable} from 'rxjs';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener,MatTreeNestedDataSource} from '@angular/material/tree';

export interface PeriodicElement {
  
  Date: number;
  SlipID: number;
  Case: number;
  Cheques: number;
  Total:number;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {Date: 11/10/2019, SlipID: 5, Case: 1.0079,Cheques:2, Total: 200},
  {Date: 12/10/2019, SlipID: 4, Case: 4.0026,Cheques:4, Total: 500},
  {Date: 13/10/2019, SlipID: 9, Case: 6.941,Cheques:9,  Total: 900},
  {Date: 15/10/2019, SlipID: 3, Case: 9.0122,Cheques:10,  Total: 1000},
 
];

@Component({
  selector: 'app-past-bankings',
  templateUrl: './past-bankings.component.html',
  styleUrls: ['./past-bankings.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class PastBankingsComponent implements OnInit {
  PastBanking: FormGroup;
  isLoadingResults: boolean = false;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  Chequeno = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  displayedColumns: string[] = ['Date', 'SlipID', 'Case', 'Cheques','Total'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator)paginator: MatPaginator;
  constructor(private _formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.PastBanking = this._formBuilder.group({
     
      searchFilter:[]
    });
  }
  //openDialog
  openDialog(){

  }
  //clickPastBank
  clickPastBank(){
    
  }
  //onSearch
  onSearch(){
    
  }
}
