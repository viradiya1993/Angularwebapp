import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {  MainAPiServiceService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-user-select-popup',
  templateUrl: './user-select-popup.component.html',
  styleUrls: ['./user-select-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserSelectPopupComponent implements OnInit {
  displayedColumns: string[] = ['USERID', 'USERNAME'];
  getDataForTable: any = [];
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  isLoadingResults: boolean = false;
  pageSize: any;
  currentUserData: any;
  constructor(
    public MatDialog: MatDialog,

    private _mainAPiServiceService: MainAPiServiceService,
    public dialogRef: MatDialogRef<UserSelectPopupComponent>
  ) { }

  ngOnInit() {
    this.isLoadingResults = true;
      this._mainAPiServiceService.getSetData({ 'Active': 'yes' }, 'GetUsers').subscribe(response => {
      if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
        if (response.DATA.USERS[0]) {
          this.highlightedRows = response.DATA.USERS[0].USERGUID;
          this.currentUserData = response.DATA.USERS[0];
        }
        this.getDataForTable = new MatTableDataSource(response.DATA.USERS);
        this.getDataForTable.paginator = this.paginator;
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isLoadingResults = false;
    }, error => {
      console.log(error);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  selectUserId(Row: any) {
    this.currentUserData = Row;
  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
}
