import { Component, OnInit, Injectable, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatTreeFlattener, MatTreeFlatDataSource, MatPaginator } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatterReceiptDialogComponentForTemplate } from 'app/main/pages/receive-money/matter-dialog/matter-dialog.component';
//Tree Table
import { FlatTreeControl } from '@angular/cdk/tree';
import { fuseAnimations } from '@fuse/animations';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import * as $ from 'jquery';

interface FoodNode {
  name: string;
  KITNAME: string;
  CONTEXT: string;
  KITGUID: string;
  TEMPLATEFILE: string;
  TEMPLATETYPEDESC: string;
  index?: number;
  children?: FoodNode[];
  KITITEMS?: FoodNode[];
  MainList?: FoodNode[];
}


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

export class PacksComponent implements OnInit, AfterViewInit {
  packForm: FormGroup;
  @ViewChild('tree') tree;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  isLoadingResults: boolean = false;
  storeDataarray: any = [];
  MainKitArray: any = [];
  pageSize: any;
  sendItemDataToPopup: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  arrayForIndex: any = [];
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.KITITEMS && node.KITITEMS.length > 0,
      name: node.KITNAME,
      kititem: node.KITITEMS,
      Context: node.CONTEXT,
      Main: node.MainList,
      child: node.TEMPLATEFILE,
      iconType: node.TEMPLATETYPEDESC,
      KitGUid: node.KITGUID,
      index: node.index,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.KITITEMS);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  highlightedRows: number;
  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    private behaviorService: BehaviorService,

    private _mainAPiServiceService: MainAPiServiceService
  ) {
    this.loadData();
  }
  showData(element, level, parent) {
    element.forEach(x => {
      // this.MainKitArray=x;
      this.arrayForIndex.push({});
      x.level = level
      x.parent = parent
      x.MainList = x;
      x.index = this.arrayForIndex.length;
      if (x.KITITEMS)
        this.showData(x.KITITEMS, x.level + 1, x.KITNAME);
    });
  }


  ngOnInit() {
    this.packForm = this._formBuilder.group({
      Filter: [],
      search: []
    });
    // this.loadData();

  }
  ngAfterViewInit() {
    this.treeControl.expandAll();
  }
  refreshKitTab() {
    this.loadData();
  }
  loadData() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({}, 'GetKit').subscribe(res => {
      console.log(res);
      if (res.CODE == 200 && res.STATUS == "success") {
        // this.dataSource.paginator = this.paginator;
        this.arrayForIndex = [];
        this.storeDataarray = res.DATA.KITS;
        this.showData(this.storeDataarray, 0, null);
        this.dataSource.data = this.storeDataarray;
        this.RowClick(res.DATA.KITS[0]);
        this.highlightedRows = 1;
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
      this.isLoadingResults = false;
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  //SelectMatter
  SelectMatter() {
    const dialogRef = this._matDialog.open(MatterReceiptDialogComponentForTemplate, {
      width: '100%',
      disableClose: true,
      data: null
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  FilterSearch(filtervalue: any) {
    //this.PackTbl.filter = filtervalue;
  }
  RowClick(main) {
    console.log(main);
    $("#packsToolbarHide").click();
    this.behaviorService.packsitems(main);
    this.behaviorService.EmailGenerateData({ 'NAME': main.TEMPLATEFILE });
    this.behaviorService.TemplateGenerateData({ 'TEMPLATENAME': main.TEMPLATEFILE });
  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
