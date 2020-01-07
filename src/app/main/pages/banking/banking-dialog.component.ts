import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Inject, Injectable, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { fuseAnimations } from '@fuse/animations';
import { BehaviorService, MainAPiServiceService } from 'app/_services';
import { ChartAcDailogComponent } from '../chart-account/chart-ac-dailog/chart-ac-dailog.component';
import { SelectBankingDialogComponent } from './select-banking-dialog/select-banking-dialog.component';
import { Router } from '@angular/router';

interface FoodNode {
  name: string;
  ACCOUNTGUID: string;
  ACCOUNTCLASS: any;
  ACCOUNTNAME: any;
  ACCOUNTNUMBER: any;
  SUBACCOUNTS: any;
  MainList: any;
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
  @ViewChild('tree', { static: false }) tree;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  isLoadingResults: boolean = false;
  storeDataarray: any = [];
  accGUID: any = [];
  pageSize: any;
  ACCOUNTGUIDsELECTED: any;
  arrayForIndex: any = [];
  isDisplay: boolean = false;


  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.SUBACCOUNTS && node.SUBACCOUNTS.length > 0,
      name: node.ACCOUNTCLASS + ' - ' + node.ACCOUNTNUMBER + '        ' + node.ACCOUNTNAME,
      ACCOUNTGUID: node.ACCOUNTGUID,
      index: node.index,
      level: level,
      MainList: node.MainList
    };
  }
  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.SUBACCOUNTS);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  highlightedRows: number;
  isDisabledselect: any;
  abcd: any;
  accountTypeData: any;
  title: string;
  ChartHandlingData: { ClickType: any; UseTrust: string; PopUp: string; Lable: string; };


  constructor(
    public dialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    private behaviorService: BehaviorService,
    public dialogRef: MatDialogRef<BankingDialogComponent>, @Inject(MAT_DIALOG_DATA) public _data: any, private router: Router, ) {

    this.behaviorService.dialogClose$.subscribe(result => {
      if (result != null) {
        if (result.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
      }
    });

    // this.title = "Select Account";
    // this.loadData({ AccountClass: _data.AccountType });
    //    this.behaviorService.TrustDuplicateModuleHandling$.subscribe(result => {
    //     if (result != null) {
    //         this.accountTypeData=result;
    //     }
    //     if(this.accountTypeData.ClickType =='WithoutTrust'){
    //       this.title="Select Account";
    //       this.loadData({AccountClass:_data.AccountType,UseTrust:this.accountTypeData.UseTrust});
    //     }else{
    //       this.title="Select Trust Account";
    //       this.loadData({AccountClass:_data.AccountType,UseTrust:this.accountTypeData.UseTrust});
    //     }
    // });
    this.title = "Select Account";
    this.loadData({ AccountClass: _data.AccountType, UseTrust: _data.UseTrust == "Yes" ? true : false });
    //    this.behaviorService.TrustDuplicateModuleHandling$.subscribe(result => {
    //     if (result != null) {
    //         this.accountTypeData=result;
    //     }
    //     if(this.accountTypeData.ClickType =='WithoutTrust'){
    //       this.title="Select Account";
    //       this.loadData({AccountClass:_data.AccountType,UseTrust:this.accountTypeData.UseTrust});
    //     }else{
    //       this.title="Select Trust Account";
    //       this.loadData({AccountClass:_data.AccountType,UseTrust:this.accountTypeData.UseTrust});
    //     }
    // });
  }
  ngOnInit() {
    this.treeControl.expandAll();
  }
  loadData(type: any) {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(type, 'GetAccount').subscribe(response => {

      if (response.CODE == 200 && response.STATUS == "success") {
        this.arrayForIndex = [];
        if (response.DATA.ACCOUNTS[0]) {
          this.storeDataarray = response.DATA.ACCOUNTS[0].SUBACCOUNTS;
          this.ACCOUNTGUIDsELECTED = response.DATA.ACCOUNTS[0].SUBACCOUNTS;
        } else {
          this.storeDataarray = response.DATA.ACCOUNTS;
        }
        this.showData(this.storeDataarray, 0, null);
        this.dataSource.data = this.storeDataarray;
        this.treeControl.expandAll();
        if (this.storeDataarray[0]) {
          this.isDisplay = false;
          this.RowClick(this.storeDataarray[0]);
        } else {
          this.isDisplay = true;
        }
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
  showData(element, level, parent) {
    element.forEach(x => {
      this.arrayForIndex.push({});
      x.level = level
      x.parent = parent
      x.MainList = x;
      x.index = this.arrayForIndex.length;
      if (x.SUBACCOUNTS)
        this.showData(x.SUBACCOUNTS, x.level + 1, x.ACCOUNTNAME);
    });
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  RowClick(node) {
    this.behaviorService.ChartAccountData(node);
    localStorage.setItem('ChartAccountData', JSON.stringify({ 'ACCOUNTTYPENAME': node.MainList.ACCOUNTTYPENAME, "name": node.name, "class": node.class, "ACCOUNTGUID": node.ACCOUNTGUID, "ACCOUNTTYPE": node.ACCOUNTTYPE, "index": node.index, "parent": node.parent, "level": node.level }));
    node.AccountType = this._data.AccountType;
    this.ACCOUNTGUIDsELECTED = node;
    // this.isDisabledselect = node.MainList.ACCOUNTTYPENAME;
    if (this._data.RoterPath == 'Reconclie Practice') {
      if (node.MainList.ACCOUNTTYPENAME != 'Bank Account') {
        this.isDisabledselect = 'Header';
      } else {
        this.isDisabledselect = '';
      }
    } else {
      this.isDisabledselect = node.MainList.ACCOUNTTYPENAME;
    }

    // if (this._data.FromWhere == 'systemSetting') {
    //   this.isDisabledselect = 'Bank Account';
    // } else if (this._data.FromWhere == 'spendMonyExpense') {
    //   if (node.MainList.ACCOUNTTYPENAME == 'Detail') {
    //     this.isDisabledselect = 'Bank Account';
    //   } else {
    //     this.isDisabledselect = 'None Bank Account';
    //   }
    // } else if (this._data.FromWhere == 'generalReceiptIncome' && this._data.AccountType == "INCOME") {
    //   if (node.MainList.ACCOUNTTYPENAME == 'Detail') {
    //     this.isDisabledselect = 'Bank Account';
    //   } else {
    //     this.isDisabledselect = 'None Bank Account';
    //   }
    // }
    // generalReceiptIncome this.abcd=node;
  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  AccountDialogOpen(val) {

    //by defaults have to set chart account not trust chart account 
    this.ChartHandlingData = {
      ClickType: 'WithoutTrust',
      UseTrust: 'No',
      PopUp: '',
      Lable: "CHART ACCOUNT",
    }
    localStorage.setItem('ChartURL', JSON.stringify(this.ChartHandlingData));
    this.behaviorService.TrustDuplicateModuleHandling(this.ChartHandlingData);

    const dialogRef = this.dialog.open(ChartAcDailogComponent, {
      disableClose: true,
      panelClass: 'ChartAc-dialog',
      data: {
        action: val,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.loadData(this._data.AccountType);
        this.loadData({ AccountClass: this._data.AccountType });
      }
    });
  }

  SelectDialogOpen() {
    const dialogRef = this.dialog.open(SelectBankingDialogComponent, {

    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  SelectClick(val) {
    if (this._data.RoterPath == 'Reconclie Practice') {
      this.behaviorService.ChartAccountData(val);
      this.behaviorService.RecouncileConstName(val.name);
      localStorage.setItem('ChartAccountData', JSON.stringify({ "name": val.name, "class": val.class, "ACCOUNTGUID": val.ACCOUNTGUID, "ACCOUNTTYPE": val.ACCOUNTTYPE, "index": val.index, "parent": val.parent, "level": val.level }));
      this.router.navigate(['/account-reconciliation/reconciliation-item']);
    }
  }
  refreshBank() {

  }
}
