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
import {SelectionModel} from '@angular/cdk/collections';

export interface PeriodicElement {
  Chequeno: number;
  Chequetotal: number;
  Description: string;
  Withdrawals: number;
  Deposite:number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {Chequeno: 1, Chequetotal: 200, Description: 'abc', Withdrawals: 200,Deposite:800},
  {Chequeno: 2, Chequetotal: 400, Description: 'jkd', Withdrawals: 400,Deposite:600},
  {Chequeno: 3, Chequetotal: 600, Description: 'abc', Withdrawals: 500,Deposite:200},
  {Chequeno: 4, Chequetotal: 300, Description: 'def', Withdrawals: 600,Deposite:100},
  {Chequeno: 5, Chequetotal: 500, Description: 'lor', Withdrawals: 700,Deposite:500},
];

@Component({
  selector: 'app-recounciliation-item',
  templateUrl: './recounciliation-item.component.html',
  styleUrls: ['./recounciliation-item.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class RecounciliationItemComponent implements OnInit {
  isLoadingResults: boolean = false;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  Date = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  AccountRecouncile: FormGroup;
  @ViewChild(MatPaginator)paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private _formBuilder: FormBuilder) { }

  displayedColumns: string[] = ['select', 'Chequeno', 'Chequetotal', 'Description', 'Withdrawals','Deposite'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.AccountRecouncile = this._formBuilder.group({
      ReconciledDate:[''],
      Statement:[],
      Bankdate:[],
      closeBal:[],
      LastBal:[],
      OutBal:[],
      UnDeposite:[],
      PreBy:[],
      UnbankedCase:[],
      UnWith:[],
      searchFilter:[]
    });
  }
  //openDialog
  openDialog(){

  }
  //choosedDate
  choosedDate(){

  }
  //choosedDateOfBank
  choosedDateOfBank(){

  }
  //onSearch
  onSearch(){

  }
  //clickAc
  clickAc(){
    
  }
  //Table Function
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Chequeno + 1}`;
  }
}
