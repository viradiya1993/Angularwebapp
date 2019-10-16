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
import { MainAPiServiceService, BehaviorService } from 'app/_services';

interface FoodNode {
  name: string;
  index?: number;
  children?: FoodNode[];
  SUBTOPICS?: FoodNode[];
  TOPICNAME:string;
  AUTHORITY:string;
  AUTHORITIES?:FoodNode[];
  MainList?: FoodNode[];
}
/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  AUTHORITY:string;
}
@Component({
  selector: 'app-main-authorities',
  templateUrl: './main-authorities.component.html',
  styleUrls: ['./main-authorities.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,

})
export class MainAuthoritiesComponent implements OnInit {
  storeDataarray:any=[];
  Accountlist: FormGroup;
  isLoadingResults: boolean = false;
  highlightedRows: any;
 
  arrayForIndex: any = [];
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  index = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.AUTHORITIES && node.AUTHORITIES.length > 0 ,
      name: node.TOPICNAME,
      SUBTOPICS: node.SUBTOPICS,
      AUTHORITY:node.AUTHORITY,
      AUTHORITIES:node.AUTHORITIES,
      // Context: node.CONTEXT,
       Main: node.MainList,
      // child: node.TEMPLATEFILE,
      // iconType: node.TEMPLATETYPEDESC,
      // KitGUid: node.KITGUID,
      index: node.index,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
  this._transformer, node => node.level, node => node.expandable, node => node.SUBTOPICS || node.AUTHORITIES);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  pageSize: string;

  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private behaviorService: BehaviorService,
    private _mainAPiServiceService: MainAPiServiceService,

  ) {
    // this.arrayForIndex = [];
    // // this.showData(TREE_DATA, 0, null);
    // this.dataSource.data = TREE_DATA;
    // this.highlightedRows = 1;
  }

  // showData(element, level, parent) {
  //   element.forEach(x => {
  //     this.arrayForIndex.push({});
  //     x.level = level
  //     x.parent = parent
  //     x.index = this.arrayForIndex.length;
  //     if (x.children)
  //       this.showData(x.children, x.level + 1, x.name);
  //   });
  // }


  showData(element, level, parent) {
    element.forEach(x => {
      // this.MainKitArray=x;
      this.arrayForIndex.push({});
      x.level = level
      x.parent = parent
      x.MainList = x;
      x.index = this.arrayForIndex.length;
      if (x.AUTHORITIES)
      this.showData(x.AUTHORITIES, x.level + 1,x.AUTHORITY);
      if (x.SUBTOPICS)
      this.showData(x.SUBTOPICS,x.level + 1, x.TOPICNAME);
        // this.showData(x.SUBTOPICS, x.level + 1, x.TOPICNAME);
    });
  }
  ngOnInit() {
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 50)) + 'px');
    this.Accountlist = this._formBuilder.group({
      AccountType: [''],
      searchFilter: [''],
      Matter: [''],
      Client: ['']
    });
    let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
    this.Accountlist.controls['Matter'].setValue(mattersData.MATTER);
    this.Accountlist.controls['Client'].setValue(mattersData.CONTACTNAME);
    this.LoadData();
  }

  LoadData() {
   this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({}, 'GetAuthority').subscribe(res => {
      if ((res.CODE == 200 || res.CODE == '200') && res.STATUS == "success") {
        this.arrayForIndex = [];
         this.storeDataarray = res.DATA.TOPICS;
         this.showData(this.storeDataarray, 0, null);
         this.dataSource.data = this.storeDataarray;
         this.editContact(this.storeDataarray[0]);
         this.highlightedRows = 1;
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
      this.isLoadingResults = false;
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }

  //TypeOfAccounts Dropdown
  TypeOfAccounts(value) {

  }
  //openDialog
  openDialog() {
  }
  //selectTreeNode
  selectTreeNode() {
    console.log('selected Work!!!');
  }
    // this._mainAPiServiceService.getSetData({}, 'GetAuthority').subscribe(response => {
    //   console.log(response);
    
    // }, err => {
    //   this.isLoadingResults = false;
    //   this.toastr.error(err);
    // });

    // this._mainAPiServiceService.getSetData({}, 'GetMatterAuthority').subscribe(response => {
    //   console.log(response);
    
    // }, err => {
    //   this.isLoadingResults = false;
    //   this.toastr.error(err);
    // });
  // SelectMatter() {
  //   let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
  //   let MaterPopupData = { action: 'edit', 'matterGuid': mattersData.MATTERGUID }
  //   const dialogRef = this.dialog.open(MatterPopupComponent, {
  //     disableClose: true, panelClass: 'contact-dialog', data: MaterPopupData
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     // this.SearchForm.controls['Matter'].setValue(result);  
  //   });
  // }
  // SelectContact() {
  //   let contactPopupData = { action: 'edit' };
  //   const dialogRef = this.dialog.open(ContactDialogComponent, {
  //     disableClose: true, panelClass: 'contact-dialog', data: contactPopupData
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }


  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  
  
  editContact(val) {
    this.behaviorService.MainAuthorityData(val);

  }
  refresMainAuthority(){
    this.LoadData();
  }
}
