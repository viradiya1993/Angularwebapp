import { Component, OnInit, ViewEncapsulation, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { AuthoritiesService, TableColumnsService } from './../../../../_services';

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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoadingResults: boolean = false;

  constructor(private dialog: MatDialog, private TableColumnsService: TableColumnsService, private authorities_service: AuthoritiesService) { }
  authorities_table;
  ngOnInit() {
    this.getTableFilter();
    this.LoadData();
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('MatterAuthority').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS, 'authoritiesColumns');
        this.displayedColumns = data.showcol;
        this.ColumnsObj = data.colobj;
      }
    }, error => {
      console.log(error);
    });
  }
  LoadData() {
    this.isLoadingResults = true;
    let potData = { 'MatterGuid': this.currentMatter.MATTERGUID };
    this.authorities_service.getData(potData).subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.authorities_table = new MatTableDataSource(response.DATA.MATTERAUTHORITIES);
        this.authorities_table.paginator = this.paginator;
      }
      this.isLoadingResults = false;
    }, err => {
      console.log(err);
    });
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'MatterAuthority' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        if (!result.columObj) {
          this.authorities_table = new MatTableDataSource([]);
          this.authorities_table.paginator = this.paginator;
        } else {
          this.LoadData();
        }
      }
    });
  }

}
