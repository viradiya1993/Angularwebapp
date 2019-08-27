import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import {  MainAPiServiceService ,TableColumnsService, BehaviorService} from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { MatterPopupComponent } from '../../matters/matter-popup/matter-popup.component';
import { ContactDialogComponent } from '../../contact/contact-dialog/contact-dialog.component';

@Component({
  selector: 'app-legal-task',
  templateUrl: './legal-task.component.html',
  styleUrls: ['./legal-task.component.scss'],
  animations: fuseAnimations
})
export class legalDetailTaskComponent implements OnInit {
  displayedColumns: string[];
  ColumnsObj: any = [];
  tempColobj: any;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  isLoadingResults: boolean = false;
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  addData:any=[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  Task_table:any=[];
  pageSize: any;
  public legalTaskData ={
    "MatterName":'',"ContactName":'',"Search": ''
  }
  constructor(private _mainAPiServiceService:MainAPiServiceService,
  private toastr: ToastrService,private dialog: MatDialog,private TableColumnsService: TableColumnsService,
  public behaviorService: BehaviorService) { }

  ngOnInit() {
    this.getTableFilter();
    this.LoadData();
 this.legalTaskData.MatterName=this.currentMatter.SHORTNAME;
 this.legalTaskData.ContactName=this.currentMatter.CONTACTNAME;
  }
  
  getTableFilter() {
    this.TableColumnsService.getTableFilter('legal details', 'tasks').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS);
        this.displayedColumns = data.showcol;
        this.ColumnsObj = data.colobj;
        this.tempColobj = data.tempColobj;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  LoadData() {
    this.Task_table=[];
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({MATTERGUID:this.currentMatter.MATTERGUID}, 'GetTask').subscribe(response => {
        console.log(response);
      if (response.CODE == 200 && response.STATUS == "success") {
        this.Task_table = new MatTableDataSource(response.DATA.TASKS);
        this.Task_table.paginator = this.paginator;
        this.Task_table.sort = this.sort;

        if (response.DATA.TASKS[0]) {
          this.behaviorService.TaskData(response.DATA.TASKS[0]);
          this.highlightedRows=response.DATA.TASKS[0].TASKGUID;
        //this.highlightedRows = response.DATA.TASKS[0].TASKGUID;

        } else {
          //this.toastr.error("No Data Selected");
        }
      }
      this.isLoadingResults = false;
    }, error => {
      this.toastr.error(error);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'legal details', 'list': 'chronology' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        this.tempColobj = result.tempColobj;
        if (!result.columObj) {
          this.Task_table = new MatTableDataSource([]);
          this.Task_table.paginator = this.paginator;
          this.Task_table.sort = this.sort;
        } else {
          this.LoadData();
        }
      }
    });
  }
  SelectMatter(){
    let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
    let MaterPopupData = { action: 'edit', 'matterGuid': mattersData.MATTERGUID }
    const dialogRef = this.dialog.open(MatterPopupComponent, {
        disableClose: true, panelClass: 'contact-dialog', data: MaterPopupData
    });
    dialogRef.afterClosed().subscribe(result => {
     
    });
  }
  SelectContact(){
    let contactPopupData = { action:'edit' };
    const dialogRef = this.dialog.open(ContactDialogComponent, {
        disableClose: true, panelClass: 'contact-dialog', data: contactPopupData
    });
    dialogRef.afterClosed().subscribe(result => {
    
        
    });
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  RowClick(row){
    console.log(row);
  }
  refreshLegalTask(){
    this.LoadData();
  }
}
