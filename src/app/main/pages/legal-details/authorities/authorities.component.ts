import { Component, OnInit, ViewEncapsulation, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig, MatTreeFlattener, MatTreeFlatDataSource, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { TableColumnsService, MainAPiServiceService, BehaviorService } from './../../../../_services';
import * as $ from 'jquery';
import {MatSort} from '@angular/material';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

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
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  authorities_table:any=[];
  tempColobj: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoadingResults: boolean = false;
  storeDataarray:any=[];
  highlightedRows: any;
  
  public LegalAuthority={
    Matter:this.currentMatter.MATTER,Contact:this.currentMatter.CLIENT
  }
   errorWarningData: any = { "Error": [], 'Warning': [] };
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
  highlightedRows2: any;
  LegalAuthorityData: any;
  LegalAuthorityToolbar: any;
  secondauthodata: any;
  // pageSize: string;
  
  constructor(private dialog: MatDialog, private TableColumnsService: TableColumnsService, 
    private _mainAPiServiceService: MainAPiServiceService,  private toastr: ToastrService,public behaviorService: BehaviorService,
    public _matDialog: MatDialog,) { 

      this.behaviorService.LegalAuthorityData$.subscribe(result => {
        if (result) {
        this.LegalAuthorityData = result;
        }
      });
      this.behaviorService.LegalAuthorityToolbar$.subscribe(result => {
        if (result) {
        this.LegalAuthorityToolbar = result;
        }
      });
    }

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
      this.showData(x.AUTHORITIES, x.level + 1,x.AUTHORITY);
      if (x.SUBTOPICS)
      this.showData(x.SUBTOPICS,x.level + 1, x.TOPICNAME);
        // this.showData(x.SUBTOPICS, x.level + 1, x.TOPICNAME);
    });
  }
  LoadData() {
    this.isLoadingResults = true;
    let potData = {'MatterGuid': this.currentMatter.MATTERGUID };
    this._mainAPiServiceService.getSetData(potData, 'GetMatterAuthority').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.authorities_table = new MatTableDataSource(response.DATA.MATTERAUTHORITIES);
        this.authorities_table.paginator = this.paginator;
        this.authorities_table.sort = this.sort;
        if (response.DATA.MATTERAUTHORITIES[0]) {
          this.RowClick(response.DATA.MATTERAUTHORITIES[0]);
          this.highlightedRows2 = response.DATA.MATTERAUTHORITIES[0].AUTHORITYGUID;
        }
        else{
        
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

  editContact(val){
    this.behaviorService.LegalAuthorityData(val);
  }
  RowClick(val){
    this.secondauthodata=val;
    this.behaviorService.LegalAuthorityForSubAuthToolbar(val);
  }
  refreshLegalAuthorityADD(){
    if(this.LegalAuthorityToolbar == 'add'){
      this.LegalAuthorityData.Main.AUTHORITYGUID
      let Data ={
        MATTERAUTHORITYGUID:'',
        MATTERGUID:this.currentMatter.MATTERGUID,
        AUTHORITYGUID:this.LegalAuthorityData.Main.AUTHORITYGUID
      }
      let finalData = {DATA: Data,FormAction:'insert',VALIDATEONLY: true};
      // let finalData = { DATA: data, FormAction: this.FormAction, VALIDATEONLY: true }
      // this._mainAPiServiceService.getSetData(potData, 'SetMatterAuthority').subscribe(response => {
        this._mainAPiServiceService.getSetData(finalData, 'SetMatterAuthority').subscribe(response => {
          if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
            this.checkValidation(response.DATA.VALIDATIONS, finalData);
          } else if (response.CODE == 451 && response.STATUS == 'warning') {
            this.checkValidation(response.DATA.VALIDATIONS, finalData);
          } else if (response.CODE == 450 && response.STATUS == 'error') {
            this.checkValidation(response.DATA.VALIDATIONS, finalData);
          } else if (response.MESSAGE == 'Not logged in') {
            // this.dialogRef.close(false);
          } else {
            // this.isspiner = false;
          }
    
        }, err => {
          this.toastr.error(err);
        });
  
    }else if(this.LegalAuthorityToolbar == 'delete'){
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
            let MatterData: any = JSON.parse(localStorage.getItem('set_active_matters'));
            let postData = { FormAction: "delete", DATA: { MATTERAUTHORITYGUID:this.secondauthodata.MATTERAUTHORITYGUID,
            MATTERGUID:this.currentMatter.MATTERGUID,AUTHORITYGUID: this.secondauthodata.AUTHORITYGUID} }
            this._mainAPiServiceService.getSetData(postData, 'SetMatterAuthority').subscribe(res => {
                if (res.STATUS == "success" && res.CODE == 200) {
                    // $('#refreshMatterTab').click();
                    this.LoadData();
                    this.toastr.success('Delete successfully');
                }
            });
        }
        this.confirmDialogRef = null;
    });
    }
    
  }
  checkValidation(bodyData: any, details: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'No') {
        errorData.push(value.ERRORDESCRIPTION);
        tempError[value.FIELDNAME] = value;
      }
      else if (value.VALUEVALID == 'Warning') {
        tempWarning[value.FIELDNAME] = value;
        warningData.push(value.ERRORDESCRIPTION);
      }

    });
    this.errorWarningData = { "Error": tempError, 'Warning': tempWarning };
    if (Object.keys(errorData).length != 0)
      this.toastr.error(errorData);
    if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
         
          this.taskSaveData(details);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.taskSaveData(details);
  }
  taskSaveData(data: any) {
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetMatterAuthority').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.toastr.success(' save successfully');
        this.LoadData();
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.toastr.warning(response.MESSAGE);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.toastr.error(response.MESSAGE);
      } else if (response.MESSAGE == 'Not logged in') {   
      }
    }, error => {
      this.toastr.error(error);
    });
  }

}
