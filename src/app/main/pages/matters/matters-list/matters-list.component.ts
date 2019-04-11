import { Component, OnDestroy, OnInit, Output, ViewEncapsulation, EventEmitter, ViewChild } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogConfig } from '@angular/material';

//import { MattersService } from '../matters.service';
import { SortingDialogComponent } from '../../../sorting-dialog/sorting-dialog.component';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { MattersService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-matters-list',
  templateUrl: './matters-list.component.html',
  styleUrls: ['./matters-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MattersListComponent implements OnInit, OnDestroy {
  [x: string]: any;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : 'green';
  displayedColumns = ['matter_num', 'matter', 'unbilled', 'invoiced', 'received', 'unpaid', 'total_value'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  mattersData: any;
  lastFilter = {};

  @Output() matterDetail: EventEmitter<any> = new EventEmitter<any>();


  constructor(
    private dialog: MatDialog,
    private _mattersService: MattersService,
    private toastr: ToastrService
  ) {
    if (JSON.parse(localStorage.getItem('matter_filter'))) {
      this.lastFilter = JSON.parse(localStorage.getItem('matter_filter'));
    }
    // this.highlightedRows = JSON.parse(localStorage.getItem('set_active_matters')).MATTERGUID
  }

  ngOnInit(): void {
    this.getMatterList(this.lastFilter);
  }
  ngOnDestroy(): void { }

  editmatter(matters) {
    this.matterDetail.emit(matters);
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.data = { 'data': ['matter_num', 'matter', 'unbilled', 'invoiced', 'received', 'unpaid', 'total_value'], 'type': 'matters' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        localStorage.setItem(dialogConfig.data.type, JSON.stringify(result));
      }
    });
    dialogRef.afterClosed().subscribe(data =>
      this.tableSetting(data)
    );
  }
  getMatterList(data) {
    this._mattersService.getMatters(data).subscribe(response => {
      localStorage.setItem('session_token', response.MATTER.SESSIONTOKEN);
      if (response.MATTER.RESPONSE != "error - not logged in") {
        if (response.MATTER.DATASET[0]) {
          this.highlightedRows = response.MATTER.DATASET[0].MATTERGUID;
          this.matterDetail.emit(response.MATTER.DATASET[0]);
        }
        this.mattersData = new MatTableDataSource(response.MATTER.DATASET);
        this.mattersData.paginator = this.paginator;
      } else {
        this.toastr.error(response.MATTER.RESPONSE);
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  tableSetting(data: any) {
    if (data !== false) {
      this.displayedColumns = data;
      this.getMatterList(this.lastFilter);
    }
  }
  toggleRow(value: any) {
  }
}






