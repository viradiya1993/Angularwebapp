import { Component, OnInit, ViewEncapsulation, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig, MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { TableColumnsService, MainAPiServiceService } from './../../../../_services';
import * as $ from 'jquery';
import { MatSort } from '@angular/material';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ToastrService } from 'ngx-toastr';

interface FoodNode {
  name: string;
  index?: number;
  children?: FoodNode[];
  SUBTOPICS?: FoodNode[];
  TOPICNAME: string;
  AUTHORITY: string;
  AUTHORITIES?: FoodNode[];
  MainList?: FoodNode[];
}
/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  AUTHORITY: string;
}
@Component({
  selector: 'app-authorities',
  templateUrl: './authorities.component.html',
  styleUrls: ['./authorities.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AuthoritiesComponent implements OnInit {
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  ColumnsObj: any = [];
  displayedColumns: string[];
  pageSize: any;
  tempColobj: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoadingResults: boolean = false;
  storeDataarray: any = [];
  highlightedRows: any;

  public LegalAuthority = {
    Matter: this.currentMatter.MATTER, Contact: this.currentMatter.CLIENT
  }

  arrayForIndex: any = [];
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  index = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.AUTHORITIES && node.AUTHORITIES.length > 0,
      name: node.TOPICNAME,
      SUBTOPICS: node.SUBTOPICS,
      AUTHORITY: node.AUTHORITY,
      AUTHORITIES: node.AUTHORITIES,
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
  highlightedRows2: any;
  // pageSize: string;

  constructor(private dialog: MatDialog, private TableColumnsService: TableColumnsService,
    private _mainAPiServiceService: MainAPiServiceService, private toastr: ToastrService, ) { }
  authorities_table;
  ngOnInit() {
    $('content').addClass('inner-scroll');
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + 140)) + 'px');
    this.getTableFilter();
    this.LoadData();
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('legal details', 'authorities').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS);
        this.displayedColumns = data.showcol;
        this.ColumnsObj = data.colobj;
        this.tempColobj = data.tempColobj;
      }
    }, error => {
      console.log(error);
    });
  }
  showData(element, level, parent) {
    element.forEach(x => {
      // this.MainKitArray=x;
      this.arrayForIndex.push({});
      x.level = level
      x.parent = parent
      x.MainList = x;
      x.index = this.arrayForIndex.length;
      if (x.AUTHORITIES)
        this.showData(x.AUTHORITIES, x.level + 1, x.AUTHORITY);
      if (x.SUBTOPICS)
        this.showData(x.SUBTOPICS, x.level + 1, x.TOPICNAME);
      // this.showData(x.SUBTOPICS, x.level + 1, x.TOPICNAME);
    });
  }
  LoadData() {
    this.isLoadingResults = true;
    let potData = { 'MatterGuid': this.currentMatter.MATTERGUID };
    this._mainAPiServiceService.getSetData(potData, 'GetMatterAuthority').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.authorities_table = new MatTableDataSource(response.DATA.MATTERAUTHORITIES);
        this.authorities_table.paginator = this.paginator;
        this.authorities_table.sort = this.sort;
        if (response.DATA.MATTERAUTHORITIES[0]) {
          this.highlightedRows2 = response.DATA.MATTERAUTHORITIES[0].AUTHORITYGUID;
        }
        else {

        }
      }
      this.isLoadingResults = false;
    }, err => {
      console.log(err);
    });
    this.pageSize = localStorage.getItem('lastPageSize');

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
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }


  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'legal details', 'list': 'authorities' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        this.tempColobj = result.tempColobj;
        if (!result.columObj) {
          this.authorities_table = new MatTableDataSource([]);
          this.authorities_table.paginator = this.paginator;
          this.authorities_table.sort = this.sort;
        } else {
          this.LoadData();
        }
      }
    });
  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  editContact(val) {
    console.log(val);
  }
  RowClick(val) {
    console.log(val);
  }
}
