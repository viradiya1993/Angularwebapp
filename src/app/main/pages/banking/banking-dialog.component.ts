import { Component, OnInit, Input, Injectable, ViewEncapsulation, ViewChild, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatTreeFlattener, MatTreeFlatDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChartAcDailogComponent } from '../chart-account/chart-ac-dailog/chart-ac-dailog.component';
import { SelectBankingDialogComponent } from './select-banking-dialog/select-banking-dialog.component';
import { MainAPiServiceService } from 'app/_services';
import { FlatTreeControl } from '@angular/cdk/tree';

interface FoodNode {
  name: string;
  ACCOUNTGUID: string;
  ACCOUNTCLASS: any;
  ACCOUNTNAME: any;
  ACCOUNTNUMBER: any;
  index?: number;
  children?: FoodNode[];
}
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
@Injectable()

@Component({
  selector: 'app-banking-dialog',
  templateUrl: './banking-dialog.component.html',
  styleUrls: ['./banking-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BankingDialogComponent implements OnInit {
  @ViewChild('tree') tree;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  isLoadingResults: boolean = false;
  storeDataarray: any = [];
  pageSize: any;
  arrayForIndex: any = [];

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.ACCOUNTCLASS + ' - ' + node.ACCOUNTNUMBER + '        ' + node.ACCOUNTNAME,
      ACCOUNTGUID: node.ACCOUNTGUID,
      index: node.index,
      level: level,
    };
  }
  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  highlightedRows: number;

  constructor(
    public dialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    public dialogRef: MatDialogRef<BankingDialogComponent>, @Inject(MAT_DIALOG_DATA) public _data: any) {
    this.loadData(_data.AccountType);
  }
  ngOnInit() {
    this.treeControl.expandAll();
  }
  loadData(type: any) {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({ AccountClass: type }, 'GetAccount').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.arrayForIndex = [];
        this.storeDataarray = response.DATA.ACTIVITIES;
        let tempArray = [];
        this.storeDataarray.forEach(x => {
          if (x.PARENTGUID) {
            x.children = [];
            tempArray[x.ACCOUNTGUID] = x;
          } else {
            x.children = [];
            if (tempArray[x.PARENTGUID])
              tempArray[x.PARENTGUID].children.push(x);
            else
              tempArray[x.ACCOUNTGUID] = x;
          }
        });
        this.storeDataarray = tempArray;
        this.dataSource.data = this.storeDataarray;
        this.highlightedRows = 1;
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isLoadingResults = false;
    }, err => {
      // this.toastr.error(err);
      this.isLoadingResults = false;
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  RowClick(node) {
    console.log(node);
    // this.behaviorService.packsitems(data);
  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  AccountDialogOpen(val) {
    const dialogRef = this.dialog.open(ChartAcDailogComponent, {
      disableClose: true,
      panelClass: 'ChartAc-dialog',
      data: {
        action: val,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  SelectDialogOpen() {
    console.log("fdfh");
    const dialogRef = this.dialog.open(SelectBankingDialogComponent, {

    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
