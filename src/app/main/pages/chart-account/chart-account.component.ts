import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, ViewChild, Injectable, ViewContainerRef, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialogRef, MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { MatSort } from '@angular/material';
import * as $ from 'jquery';
import { NestedTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, Observable } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { MainAPiServiceService, BehaviorService } from 'app/_services';

interface FoodNode {
  name: string;
  ACCOUNTGUID: string;
  ACCOUNTTYPE: string;
  ACCOUNTCLASS: any;
  ACTIVE: any;
  ACCOUNTNAME: any;
  ACCOUNTNUMBER: any;
  SUBACCOUNTS: any;
  MainList: any;
  acc: string;
  parent: string;
  index?: number;
  par
  children?: FoodNode[];
}
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
@Injectable()

@Component({
  selector: 'app-chart-account',
  templateUrl: './chart-account.component.html',
  styleUrls: ['./chart-account.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class ChartAccountComponent implements OnInit {
  @ViewChild('tree') tree;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  isLoadingResults: boolean = false;
  storeDataarray: any = [];
  accGUID: any = [];
  pageSize: any;
  acc: any;
  ACCOUNTGUIDsELECTED: any;
  arrayForIndex: any = [];

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.SUBACCOUNTS && node.SUBACCOUNTS.length > 0,
      name: node.ACCOUNTCLASS + ' - ' + node.ACCOUNTNUMBER + '        ' + node.ACCOUNTNAME,
      ACTIVE: node.ACTIVE == 1 ? '' : '(inactive)',
      class: node.ACCOUNTNAME,
      ACCOUNTGUID: node.ACCOUNTGUID,
      ACCOUNTTYPE: node.ACCOUNTTYPE,
      index: node.index,
      parent: node.parent,
      level: level,
      MainList: node.MainList
    };
  }
  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.SUBACCOUNTS);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  highlightedRows: number;
  accClass: any;
  public ChartData = {
    "AccountClass": 'All'
  }
  filterData: { 'Search': string; 'AccountClass': any; };

  constructor(
    public dialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    private behaviorService: BehaviorService) {

    this.filterData = {
      'Search': '', "AccountClass": "All"
    }
    if (!localStorage.getItem("chartAcc_filter")) {
      localStorage.setItem('chartAcc_filter', JSON.stringify(this.filterData));
    } else {
      this.filterData = JSON.parse(localStorage.getItem("chartAcc_filter"))
    }
    this.ChartData.AccountClass = this.filterData.AccountClass;
    this.loadData(this.filterData);


  }
  ngOnInit() {
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 80)) + 'px');
    this.acc = "";
  }

  loadData(data: any) {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(data, 'GetAccount').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.arrayForIndex = [];
        if (response.DATA.ACCOUNTS[0].ACCOUNTGUID == "") {
          this.storeDataarray = response.DATA.ACCOUNTS[0].SUBACCOUNTS;
          this.ACCOUNTGUIDsELECTED = response.DATA.ACCOUNTS[0].SUBACCOUNTS;
        } else {
          this.storeDataarray = response.DATA.ACCOUNTS;
        }
        this.showData(this.storeDataarray, 0, null);
        this.dataSource.data = this.storeDataarray;
        this.treeControl.dataNodes = this.storeDataarray;
        this.treeControl.expandAll();
        if (response.DATA.ACCOUNTS[0].SUBACCOUNTS)
          this.RowClick(response.DATA.ACCOUNTS[0].SUBACCOUNTS[0]);
        this.highlightedRows = 1;
      } else if (response.MESSAGE == 'Not logged in') {
        // this.dialogRef.close(false);
      }
      this.isLoadingResults = false;
    }, err => {
      // this.toastr.error(err);
      this.isLoadingResults = false;
    });
  }
  showData(element, level, parent) {
    element.forEach(x => {
      this.arrayForIndex.push({});
      x.level = level
      x.parent = this.acc
      x.MainList = x;
      if (level == 0) {
        this.acc = x.ACCOUNTNAME
        x.parent = null
      }
      x.index = this.arrayForIndex.length;
      if (x.SUBACCOUNTS) {
        this.showData(x.SUBACCOUNTS, x.level + 1, x.ACCOUNTNAME);
      }


    });
  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  RowClick(val) {
    this.behaviorService.ChartAccountData(val);
    this.behaviorService.setChartAccountDataEdit(val);
    localStorage.setItem('ChartAccountData', JSON.stringify({ "name": val.name, "class": val.class, "ACCOUNTGUID": val.ACCOUNTGUID, "ACCOUNTTYPE": val.ACCOUNTTYPE, "index": val.index, "parent": val.parent, "level": val.level }));
  }
  AccountClass(val) {
    this.filterData = JSON.parse(localStorage.getItem("chartAcc_filter"));
    this.filterData.AccountClass = val;
    localStorage.setItem('chartAcc_filter', JSON.stringify(this.filterData));
    this.loadData(this.filterData)
  }
  refreshChartACCTab() {
    this.loadData(this.filterData)
  }
  ngAfterViewInit() {
    this.treeControl.expandAll();
  }

  FilterSearch(val) {
    this.storeDataarray.filter = val;
  }
  // this.tree.treeControl.expandAll();
}
