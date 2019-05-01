import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialogConfig, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { WorkInProgressService, TableColumnsService } from '../../../../_services';

@Component({
  selector: 'app-work-in-progress',
  templateUrl: './work-in-progress.component.html',
  styleUrls: ['./work-in-progress.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class WorkInProgressComponent implements OnInit {
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  displayedColumns: string[];
  ColumnsObj: any = [];
  pageSize: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoadingResults: boolean = false;
  constructor(private dialog: MatDialog, private WorkInProgress: WorkInProgressService, private TableColumnsService: TableColumnsService, private toastr: ToastrService) {

  }

  WorkInProgressdata
  ngOnInit() {
    this.getTableFilter();
    this.loadData();
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('WorkItems').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS, 'workInProgressColumns');
        console.log(data.showcol);
        this.displayedColumns = data.showcol;
        this.ColumnsObj = data.colobj;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  loadData() {
    this.isLoadingResults = true;
    let potData = { 'MatterGuid': this.currentMatter.MATTERGUID };
    this.WorkInProgress.WorkInProgressData(potData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.WorkInProgressdata = new MatTableDataSource(res.DATA.WORKITEMS);
        this.WorkInProgressdata.paginator = this.paginator;
      }
      this.isLoadingResults = false;
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
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
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'WorkItems' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        if (!result.columObj) {
          this.WorkInProgressdata = new MatTableDataSource([]);
          this.WorkInProgressdata.paginator = this.paginator;
        } else {
          this.loadData();
        }
      }
    });
  }


}



