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
import { MatterPopupComponent } from '../matters/matter-popup/matter-popup.component';
import { ContactDialogComponent } from '../contact/contact-dialog/contact-dialog.component';


interface FoodNode {
  name: string;
  index?:number;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',index:1,
    children: [
      {name: 'Apple',index:2},
      {name: 'Banana',index:3},
      {name: 'Fruit loops', index:4},
    ]
  }, {
    name: 'Vegetables',index:5,
    children: [
      {
        name: 'Green',index:6,
        children: [
          {name: 'Broccoli',index:7},
          {name: 'Brussel sprouts',index:8},
        ]
      }, {
        name: 'Orange',index:9,
        children: [
          {name: 'Pumpkins',index:10},
          {name: 'Carrots',index:11},
        ]
      },
    ]
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
@Component({
  selector: 'app-main-authorities',
  templateUrl: './main-authorities.component.html',
  styleUrls: ['./main-authorities.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,

})
export class MainAuthoritiesComponent implements OnInit {
  Accountlist: FormGroup;
  isLoadingResults: boolean = false;
  highlightedRows: any;
  
  theme_type = localStorage.getItem('theme_type');
 
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  index = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      index:node.index,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
  
  )
  { 
       this.dataSource.data = TREE_DATA;
  }
  
  
  ngOnInit() {
    this.Accountlist = this._formBuilder.group({
      AccountType:[''],
      searchFilter:[''],
      Matter:[''],
      Client:['']
    });
    let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
    this.Accountlist.controls['Matter'].setValue(mattersData.MATTER);
    this.Accountlist.controls['Client'].setValue(mattersData.CONTACTNAME);
  }
  //TypeOfAccounts Dropdown
  TypeOfAccounts(value){
    console.log(value);
  }
  //openDialog
  openDialog(){

  }
  //selectTreeNode
  selectTreeNode(){
    console.log('selected Work!!!');
  }

  SelectMatter(){
    let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
    let MaterPopupData = { action: 'edit', 'matterGuid': mattersData.MATTERGUID }
//    let contactPopupData = { action:'edit' };
    const dialogRef = this.dialog.open(MatterPopupComponent, {
        disableClose: true, panelClass: 'contact-dialog', data: MaterPopupData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    // this.SearchForm.controls['Matter'].setValue(result);  
    });
  }
//   const dialogRef = this.dialog.open(ContactDialogComponent, {
//     disableClose: true, panelClass: 'contact-dialog', data: contactPopupData
  SelectContact(){
    let contactPopupData = { action:'edit' };
    const dialogRef = this.dialog.open(ContactDialogComponent, {
        disableClose: true, panelClass: 'contact-dialog', data: contactPopupData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    // this.SearchForm.controls['Client'].setValue(result);  
        
    });
  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  editContact(val){

  }
}
