import { FormGroup } from '@angular/forms';
import {Component, Injectable,OnInit, Input } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';
import {ChangeDetectionStrategy} from '@angular/core';

/**
 * Node for to-do item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

/**
 * The Json object for to-do list data.
 */

const TREE_DATA = {

//General
MatterDetails: [
  'Access',
  'Create',
  'Edit',
  'Delete',
  'Window Report',
  'Export Data',
  'Tagging',
  'View Balances'
],
DayBookTimeEntries: [
  'Access',
  'Create WIP',
  'Create Disbursements',
  'Edit',
  'Delete',
  'Window Report',
  'Export Data',
  'Override WIP Price',
  'View Other Fee Earner Entries',
  'Create WIP for Other Fee Earner',
  'View WIP Totals'
],
Contacts:[
  'Access',
  'Create',
  'Edit',
  'Delete',
  'Window Report',
  'Export Data',
  'Tagging'
],
Estimates:[
  'Access',
  'Create',
  'Edit',
  'Delete',
  'Window Report',
  'Export Data'
],
DocumentEmailGeneration:[
  'Access',
  'Generate Template',
  'Create Template',
  'Edit Template',
  'Generate Pack',
  'Create Pack',
  'Edit Pack',
  'Delete Pack',
  'Generate Email',
  'Create Email',
  'Edit Email',
  'Delete Email'
],
DocumentRegister:[
    'Access',
    'Create',
    'Edit',
    'Delete',
    'Window Report',
    'Export Data',
    'Tagging'
  ],
//Transactions  
Invoicing:[
  'Access',
  'Create',
  'Delete',
  'Window Report',
  'Export Data',
  'Tagging',
  'Draft Invoice',
  'Print',
  'Write Off'
],
ReceiveMoney:[
  'Access',
  'Create',
  'Edit',
  'Delete',
  'Print',
  'Window Report',
  'Export Data',
  'Tagging'
],
SpendMoney:[
    'Access',
    'Create',
    'Edit',
    'Delete',
    'Window Report',
    'Export Data'
   ],
//Legal
Chronology:[
    'Access',
    'Create',
    'Edit',
    'Delete',
    'Window Report',
    'Export Data'
],
Topics:[
    'Access',
    'Create',
    'Edit',
    'Delete',
    'Window Report',
    'Export Data'
],
Authorities:[
    'Access',
    'Create',
    'Edit',
    'Delete',
    'Window Report',
    'Export Data'
],
FileNotes:[
    'Access',
    'Create',
    'Edit',
    'Delete',
    'Window Report',
    'Export Data'
],
SafeCustody:[
    'Access',
    'Create',
    'Edit',
    'Delete',
    'Window Report',
    'Export Data',
    'Check In/Out'
],
SafeCustodyPacket:[
    'Access',
    'Create',
    'Edit',
    'Delete',
    'Window Report',
    'Export Data'
],
Searching:[
  'Access',
  'Create',
  'Edit',
  'Delete',
  'Window Report',
  'Export Data',
  'Execute Search',
  'Import Result',
  'Download Result File',
  'View Result Online'
],
//Diary and Tasks
Dairy:[
  'Access',
  'Create',
  'Edit',
  'Delete',
  'Personal'
],
Tasks:[
  'Access',
  'Create',
  'Edit',
  'Delete',
  'Window Report',
  'Export Data'
],
//Accounting
ChartofAccounts:[
  'Access',
  'Create',
  'Edit',
  'Delete',
  'Print',
  'Window Report',
  'Export Data',
  'View Balances'
],
GeneralJournal:[
  'Access',
  'Create',
  'Edit',
  'Delete',
  'Print',
  'Window Report',
  'Export Data'
],
OtherAccounting:[
  'Bank Reconciliations',
  'Account Transactions',
  'Close Year Accounts',
  'Export Accounts'
],
//Trust Accounts
TrustMoney:[
  'Access',
  'Trust Receipt',
  'Trust Withdrawal',
  'Trust Transfer',
  'Controlled Money Receipt',
  'Controlled Money Withdrawal',
  'Reversals',
  'Statutory Deposite/Withdrawal',
  'Allow Overdraws',
  'End Of Months',
  'Banking',
  'Reconcile Trust Account',
  'Window Report',
  'Export Data'
  
],
TrustChartofAccounts:[
  'Access',
  'Create',
  'Edit',
  'Delete',
  'Print',
  'Window Report',
  'Export Data'
],
TrustGeneralJournal:[
  'Access'
],
TrustReport:[
  'Trail Balances',
  'Audit Log',
  'Overdraws Balances',
  'Cashbook',
  'Account Reconciliations',
  'Ledgers',
  'Trust Money Statements',
  'Controlled Money Statements',
  'Controlled Money Listing'

],
//Reports
AccountingReports:[
  'Profit and Loss',
  'Balance Sheet',
  'General Journal',
  'General Ledgers Summary',
  'General Ledgers Details',
  'Trail Balance'
],
ManagementReport:[
  'Aged Debtors',
  'Payments History',
  'Individual Matter Finacials',
  'Aged Matter Summary',
  'Issued Invoices',
  'Unbilled Work',
  'Fee Earner Summary',
  'GST Report',
  'Snap Shot'
  
],
//Setup
System:[
  'System Settings'
],
Users:[
  'Access',
  'Create',
  'Edit',
  'Delete',
  'Window Report',
  'Export Data'
],
ActivitiesSundries:[
  'Access',
  'Create',
  'Edit',
  'Delete',
  'Window Report',
  'Export Data'
]

};

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {

  dataChange = new BehaviorSubject<TodoItemNode[]>([]);
  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(TREE_DATA, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: object, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }
      return accumulator.concat(node);
    }, []);
  }
}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
  providers: [ChecklistDatabase]
})
export class SecurityComponent implements OnInit {
  dialogTitle: string;
  maincheckbox = true;
  @Input() userForm: FormGroup;
  ngOnInit() {
  }

  allcheckbox(){
    console.log("checkbox clicked");
  }
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  constructor(private database: ChecklistDatabase) {
    this.dialogTitle = 'General';
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
    this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  getLevel = (node: TodoItemFlatNode) => node.level;
  isExpandable = (node: TodoItemFlatNode) => node.expandable;
  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;
  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;
  

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

}
