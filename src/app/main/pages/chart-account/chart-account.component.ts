import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, ViewChild,Injectable} from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material';
import * as $ from 'jquery';
import {NestedTreeControl} from '@angular/cdk/tree';
import {BehaviorSubject, Observable} from 'rxjs';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener,MatTreeNestedDataSource} from '@angular/material/tree';


interface FoodNode {
  name: string;
  children?: FoodNode[];
}
const TREE_DATA: FoodNode[] = [
  {
    name: '1-0000 Assets',
    children: [
      {name: '1-1000 Current Assets'},
      {name: '1-2000 None Current Assets'},
    ]
  }, 
  {
    name: '2-0000 Liabilities',
    children: [
      {
        name: '2-1000 Current Liabilities',
        children: [
          {name: '2-1100 Trade Creditors'}
        ]
      }
    ]
  },
  {
    name: '3-0000 Equity',
    children: [
      {name: '3-1000 Issued Capital'},
      {name: '3-2000 Retained Earnings'},
      {name: '3-3000 Current Earnings'},
      {name: '3-9999 Historical Balancing Accounts'}
    ]
  }
];

@Component({
  selector: 'app-chart-account',
  templateUrl: './chart-account.component.html',
  styleUrls: ['./chart-account.component.scss'],
  animations: fuseAnimations
})
export class ChartAccountComponent implements OnInit {
  Accountlist: FormGroup;
  isLoadingResults: boolean = false;
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  
  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
    //private database: LoadmoreDatabase
  )
  { 
    this.dataSource.data = TREE_DATA;
  }
  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
  ngOnInit() {
    this.Accountlist = this._formBuilder.group({
      AccountType:[''],
      searchFilter:['']
    });
  }
  //TypeOfAccounts Dropdown
  TypeOfAccounts(value){
    console.log(value);
  }
  //openDialog
  openDialog(){

  }
}
