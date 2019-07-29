import { Component, OnInit, Injectable, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog, MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatterReceiptDialogComponentForTemplate } from 'app/main/pages/receive-money/matter-dialog/matter-dialog.component';
//Tree Table

import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MainAPiServiceService } from 'app/_services';

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
  selector: 'app-packs',
  templateUrl: './packs.component.html',
  styleUrls: ['./packs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class PacksComponent implements OnInit {
  packForm: FormGroup;
  @ViewChild('tree') tree;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  isLoadingResults: boolean = false;
  arrayForIndex:any=[];
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
  highlightedRows: number;
  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
  
    private _mainAPiServiceService: MainAPiServiceService
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
    this.packForm = this._formBuilder.group({
      Filter: [],
      search: []
    });
    this.loadData();
    this.treeControl.expandAll();
  }
  loadData() {
    // this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({}, 'GetKit').subscribe(res => {
      console.log(res);
      if (res.CODE == 200 && res.STATUS == "success") {

      }
    }, err => {
      this.toastr.error(err);
    });
    // this.pageSize = localStorage.getItem('lastPageSize');
  }
  //SelectMatter
  SelectMatter() {
    const dialogRef = this._matDialog.open(MatterReceiptDialogComponentForTemplate, {
      width: '100%',
      disableClose: true,
      data: null
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
  FilterSearch(filtervalue: any) {
    //this.PackTbl.filter = filtervalue;
  }
  editContact(val){

  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
 }
