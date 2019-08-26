import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import {  MainAPiServiceService ,TableColumnsService} from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';

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
  isLoadingResults: boolean = false;
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  addData:any=[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  Task_table:any=[];
  pageSize: any;
  constructor(private _mainAPiServiceService:MainAPiServiceService,
  private toastr: ToastrService,private dialog: MatDialog,private TableColumnsService: TableColumnsService) { }

  ngOnInit() {
    this.getTableFilter();
 this.LoadData();
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
    this.isLoadingResults = true;
    //get chronology
    // let potData = { 'MatterGuid': this.currentMatter.MATTERGUID };
    this._mainAPiServiceService.getSetData({MATTERGUID:this.currentMatter.MATTERGUID}, 'GetTask').subscribe(response => {
        console.log(response);
      if (response.CODE == 200 && response.STATUS == "success") {
        this.Task_table = new MatTableDataSource(response.DATA.TASKS);
        this.Task_table.paginator = this.paginator;
        this.Task_table.sort = this.sort;
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
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }

}
