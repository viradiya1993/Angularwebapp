import { Component, OnInit,Injectable,Inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, Observable} from 'rxjs';
import { MatDialog, MatDialogRef, MatDialogConfig,MAT_DIALOG_DATA } from '@angular/material';
import { ChartAcDailogComponent } from './../../../main/pages/chart-account/chart-ac-dailog/chart-ac-dailog.component';
import { Router } from '@angular/router';
const LOAD_MORE = 'LOAD_MORE';
/** Nested node */
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
  selector: 'app-select-account',
  templateUrl: './select-account.component.html',
  styleUrls: ['./select-account.component.scss'],
  animations: fuseAnimations,
  providers: [LoadmoreDatabase]
})
export class SelectAccountComponent implements OnInit {
  isLoadingResults: boolean = false;
  AccountFrom:FormGroup;
  action: string;
  dialogTitle:string;
  nodeMap = new Map<string, LoadmoreFlatNode>();
  treeControl: FlatTreeControl<LoadmoreFlatNode>;
  treeFlattener: MatTreeFlattener<LoadmoreNode, LoadmoreFlatNode>;
  dataSource: MatTreeFlatDataSource<LoadmoreNode, LoadmoreFlatNode>;
  constructor(private database: LoadmoreDatabase,
    public dialogRef: MatDialogRef<SelectAccountComponent>,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
  ) 
  {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
    this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<LoadmoreFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
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
  
  loadMore(item: string) {
    this.database.loadMore(item);
  }

  loadChildren(node: LoadmoreFlatNode) {
    this.database.loadMore(node.item, true);
  }

  array(n: number): any[] {
    return Array(n);
  }

  ngOnInit() {
    this.AccountFrom= this._formBuilder.group({
      showinactive:[''],
      filter:['']
    });
  }
  //SelectAccount
  SelectAccount(): void {
    console.log('11111');
    //this.router.navigate(['/account-reconciliation']);
    this.dialogRef.close();
  }
  //NewAccount
  NewAccount(){
    const dialogRef = this.dialog.open(ChartAcDailogComponent, {
      disableClose: true,
      panelClass: 'ChartAc-dialog',
      data: {
          action: 'new',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  //EditAccount
  EditAccount(){
    const dialogRef = this.dialog.open(ChartAcDailogComponent, {
      disableClose: true,
      panelClass: 'ChartAc-dialog',
      data: {
          action: 'edit',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  //openDialog
  openDialog(){
   
  }

}
