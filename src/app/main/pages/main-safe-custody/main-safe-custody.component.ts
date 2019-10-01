import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService, TableColumnsService } from 'app/_services';
import { MatterPopupComponent } from '../matters/matter-popup/matter-popup.component';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { MatterDialogComponent } from '../time-entries/matter-dialog/matter-dialog.component';
import { ContactSelectDialogComponent } from '../contact/contact-select-dialog/contact-select-dialog.component';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main-safe-custody',
  templateUrl: './main-safe-custody.component.html',
  styleUrls: ['./main-safe-custody.component.scss'],
  animations: fuseAnimations
})
export class MainSafeCustodyComponent implements OnInit {
  ColumnsObj = [];
  pageSize: any;
  isLoadingResults: boolean = false;
  tempColobj: any;
  highlightedRows: any;
  displayedColumns: any;
  addData: any = [];
  MainSafeCustodyData: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private _mainAPiServiceService: MainAPiServiceService, private dialog: MatDialog,
    private TableColumnsService: TableColumnsService, private toastr: ToastrService, ) { }

  ngOnInit() {
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 70)) + 'px');
    this.getTableFilter();
    this.LoadData();
    // this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
    //  // console.log(response);
    //   this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
    // })

  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('safe custody', '').subscribe(response => {
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
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }
  LoadData() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({}, 'GetSafeCustody').subscribe(res => {
      return
      if (res.CODE == 200 && res.STATUS == "success") {
        // this.behaviorService.DocumentRegisterData(res.DATA.DOCUMENTS[0]);
        this.MainSafeCustodyData = new MatTableDataSource(res.DATA.DOCUMENTS);
        this.MainSafeCustodyData.sort = this.sort;
        this.MainSafeCustodyData.paginator = this.paginator;
        this.highlightedRows = res.DATA.DOCUMENTS[0].DOCUMENTGUID;
        this.isLoadingResults = false;
      }
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);

    });
  }

  SelectMatter() {
    const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.spendmoneyForm.controls['Matter'].setValue(result.MATTER);
        // this.spendmoneyForm.controls['MatterGUID'].setValue(result.MATTERGUID);
      }
    });
  }
  SelectContactMatter() {
    const dialogRef = this.dialog.open(ContactSelectDialogComponent, {
      width: '100%',
      disableClose: true,
      data: {
        type: "fromcontact"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

}
