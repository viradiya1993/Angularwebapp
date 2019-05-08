import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { SafeCustodyService, TableColumnsService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';

@Component({
  selector: 'app-safecustody',
  templateUrl: './safecustody.component.html',
  styleUrls: ['./safecustody.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SafecustodyComponent implements OnInit {
  ColumnsObj: any = [];
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  displayedColumns: string[];
  isLoadingResults: boolean = false;
  pageSize: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog, private TableColumnsService: TableColumnsService, private safeCustody_service: SafeCustodyService, private toastr: ToastrService) { }
  safeCustody_table;
  ngOnInit() {
    $('content').addClass('inner-scroll');
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + 140)) + 'px');
    this.getTableFilter();
    this.LoadData();
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('SafeCustody','').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS, 'safeCustodyColumns');
        this.displayedColumns = data.showcol;
        this.ColumnsObj = data.colobj;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  LoadData() {
    this.isLoadingResults = true;
    //get autorites  
    let potData = { 'MatterGUID': this.currentMatter.MATTERGUID };
    this.safeCustody_service.getData(potData).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.safeCustody_table = new MatTableDataSource(response.DATA.SAFECUSTODIES);
        this.safeCustody_table.paginator = this.paginator;
      }
      this.isLoadingResults = false;
    }, error => {
      this.toastr.error(error);
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
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'SafeCustody' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        if (!result.columObj) {
          this.safeCustody_table = new MatTableDataSource([]);
          this.safeCustody_table.paginator = this.paginator;
        } else
          this.LoadData();
      }
    });
  }
}




