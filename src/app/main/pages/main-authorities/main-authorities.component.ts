import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, ViewChild, Injectable, ViewContainerRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material';
import * as $ from 'jquery';
import { NestedTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, Observable } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { MatterPopupComponent } from '../matters/matter-popup/matter-popup.component';
import { ContactDialogComponent } from '../contact/contact-dialog/contact-dialog.component';


interface FoodNode {
  name: string;
  index?: number;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [
      { name: 'Apple' },
      { name: 'Banana' },
      { name: 'Fruit loops' },
    ]
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          { name: 'Broccoli' },
          { name: 'Brussel sprouts' },
        ]
      }, {
        name: 'Orange',
        children: [
          { name: 'Pumpkins' },
          { name: 'Carrots' },
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
  arrayForIndex: any = [];
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  index = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      index: node.index,
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

  ) {
    this.arrayForIndex = [];
    this.showData(TREE_DATA, 0, null);
    this.dataSource.data = TREE_DATA;
    this.highlightedRows = 1;
  }

  showData(element, level, parent) {
    element.forEach(x => {
      this.arrayForIndex.push({});
      x.level = level
      x.parent = parent
      x.index = this.arrayForIndex.length;
      if (x.children)
        this.showData(x.children, x.level + 1, x.name);
    });
  }

  ngOnInit() {
    this.Accountlist = this._formBuilder.group({
      AccountType: [''],
      searchFilter: [''],
      Matter: [''],
      Client: ['']
    });
    let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
    this.Accountlist.controls['Matter'].setValue(mattersData.MATTER);
    this.Accountlist.controls['Client'].setValue(mattersData.CONTACTNAME);
  }
  //TypeOfAccounts Dropdown
  TypeOfAccounts(value) {
    console.log(value);
  }
  //openDialog
  openDialog() {
  }
  //selectTreeNode
  selectTreeNode() {
    console.log('selected Work!!!');
  }

  SelectMatter() {
    let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
    let MaterPopupData = { action: 'edit', 'matterGuid': mattersData.MATTERGUID }
    const dialogRef = this.dialog.open(MatterPopupComponent, {
      disableClose: true, panelClass: 'contact-dialog', data: MaterPopupData
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.SearchForm.controls['Matter'].setValue(result);  
    });
  }
  SelectContact() {
    let contactPopupData = { action: 'edit' };
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      disableClose: true, panelClass: 'contact-dialog', data: contactPopupData
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.SearchForm.controls['Client'].setValue(result);  

    });
  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  editContact(val) {
    // console.log(val)
  }
}
