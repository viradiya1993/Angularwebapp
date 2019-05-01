import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { ChronologyService, TableColumnsService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-chronology',
  templateUrl: './chronology.component.html',
  styleUrls: ['./chronology.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ChronologyComponent implements OnInit {
  ColumnsObj: any = [];
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  displayedColumns: string[];
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  isLoadingResults: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  chronology_table;
  pageSize: any;

  constructor(private dialog: MatDialog, private TableColumnsService: TableColumnsService, private chronology_service: ChronologyService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getTableFilter();
    this.LoadData();
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('MatterChronology').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS, 'chronologyColumns');
        this.displayedColumns = data.showcol;
        this.ColumnsObj = data.colobj;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  LoadData() {
    this.isLoadingResults = true;
    //get chronology
    let potData = { 'MatterGuid': this.currentMatter.MATTERGUID };
    this.chronology_service.getData(potData).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.chronology_table = new MatTableDataSource(response.DATA.CHRONOLOGIES);
        this.chronology_table.paginator = this.paginator;
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
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'MatterChronology' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        if (!result.columObj) {
          this.chronology_table = new MatTableDataSource([]);
          this.chronology_table.paginator = this.paginator;
        } else {
          this.LoadData();
        }
      }
    });
  }


}
