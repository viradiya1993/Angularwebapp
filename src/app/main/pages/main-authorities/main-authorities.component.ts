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


const LOAD_MORE = 'LOAD_MORE';
export class LoadmoreNode {
  childrenChange = new BehaviorSubject<LoadmoreNode[]>([]);
  get children(): LoadmoreNode[] {
    return this.childrenChange.value;
  }
  constructor(public item: string,public hasChildren = false,public loadMoreParentItem: string | null = null) {}
}
export class LoadmoreFlatNode {
  constructor(public item: string,public level = 1,public expandable = false,public loadMoreParentItem: string | null = null) {}
}
@Injectable()
export class LoadmoreDatabase {
  batchNumber = 5;
  dataChange = new BehaviorSubject<LoadmoreNode[]>([]);
  nodeMap = new Map<string, LoadmoreNode>();  
  
  /** The data */
  rootLevelNodes: string[] = ['1-0000 Assets', '2-0000 Liabilities'];
  dataMap = new Map<string, string[]>([
    ['1-0000 Assets', ['1-1000 Current assets']],
    ['2-0000 Liabilities', ['2-1000 Current Liablities']],
    ['1-1000 Current assets', ['1-1200 General Cheque Account']],
    ['2-1000 Current Liablities', ['1-1200 General Cheque Account']]
  ]);

  initialize() {
    const data = this.rootLevelNodes.map(name => this._generateNode(name));
    this.dataChange.next(data);
  }  
  loadMore(item: string, onlyFirstTime = false) {
    if (!this.nodeMap.has(item) || !this.dataMap.has(item)) {
      return;
    }
    const parent = this.nodeMap.get(item)!;
    const children = this.dataMap.get(item)!;
    if (onlyFirstTime && parent.children!.length > 0) {
      return;
    }
    const newChildrenNumber = parent.children!.length + this.batchNumber;
    const nodes = children.slice(0, newChildrenNumber)
      .map(name => this._generateNode(name));
    if (newChildrenNumber < children.length) {
      nodes.push(new LoadmoreNode(LOAD_MORE, false, item));
    }
    parent.childrenChange.next(nodes);
    this.dataChange.next(this.dataChange.value);
  }

  private _generateNode(item: string): LoadmoreNode {
    if (this.nodeMap.has(item)) {
      return this.nodeMap.get(item)!;
    }
    const result = new LoadmoreNode(item, this.dataMap.has(item));
    this.nodeMap.set(item, result);
    return result;
  }
}

@Component({
  selector: 'app-main-authorities',
  templateUrl: './main-authorities.component.html',
  styleUrls: ['./main-authorities.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
  providers: [LoadmoreDatabase]
})
export class MainAuthoritiesComponent implements OnInit {
  Accountlist: FormGroup;
  isLoadingResults: boolean = false;
  highlightedRows: any;
  nodeMap = new Map<string, LoadmoreFlatNode>();
  treeControl: FlatTreeControl<LoadmoreFlatNode>;
  treeFlattener: MatTreeFlattener<LoadmoreNode, LoadmoreFlatNode>;
  dataSource: MatTreeFlatDataSource<LoadmoreNode, LoadmoreFlatNode>;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  index = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  
  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private database: LoadmoreDatabase
  )
  { 
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<LoadmoreFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    console.log(this.dataSource);
    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
    database.initialize();
  }
  getChildren = (node: LoadmoreNode): Observable<LoadmoreNode[]> => node.childrenChange;
  transformer = (node: LoadmoreNode, level: number) => {
    const existingNode = this.nodeMap.get(node.item);
    if (existingNode) {
      return existingNode;
    }
    const newNode = new LoadmoreFlatNode(node.item, level, node.hasChildren, node.loadMoreParentItem);
    this.nodeMap.set(node.item, newNode);
    return newNode;
  }

  getLevel = (node: LoadmoreFlatNode) => node.level;
  isExpandable = (node: LoadmoreFlatNode) => node.expandable;
  hasChild = (_: number, _nodeData: LoadmoreFlatNode) => _nodeData.expandable;
  isLoadMore = (_: number, _nodeData: LoadmoreFlatNode) => _nodeData.item === LOAD_MORE;
  loadChildren(node: LoadmoreFlatNode) {
    this.database.loadMore(node.item, true);
  }
  array(n: number): any[] {
    return Array(n);
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
}
