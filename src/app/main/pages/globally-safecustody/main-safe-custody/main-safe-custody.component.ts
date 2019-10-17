import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService, TableColumnsService,BehaviorService } from 'app/_services';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator, MatDialogConfig } from '@angular/material';
// import { MatterDialogComponent } from '../time-entries/matter-dialog/matter-dialog.component';
// import { ContactSelectDialogComponent } from '../contact/contact-select-dialog/contact-select-dialog.component';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { ContactSelectDialogComponent } from '../../contact/contact-select-dialog/contact-select-dialog.component';
import { MatterDialogComponent } from '../../time-entries/matter-dialog/matter-dialog.component';

@Component({
  selector: 'app-main-safe-custody',
  templateUrl: './main-safe-custody.component.html',
  styleUrls: ['./main-safe-custody.component.scss'],
  animations: fuseAnimations
})
export class MainSafeCustodyComponent implements OnInit {
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  highlightedRows: any;
  ColumnsObj = [];
  pageSize: any;
  isLoadingResults: boolean = false;
  tempColobj: any;
  displayedColumns: any;
  addData: any = [];
  MainSafeCustodyData: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private _mainAPiServiceService: MainAPiServiceService, private dialog: MatDialog,
    private TableColumnsService: TableColumnsService, private toastr: ToastrService,public behaviorService: BehaviorService ) { }

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
    this.TableColumnsService.getTableFilter('Safe Custody', 'Safe Custody').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        //console.log(response);
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
      //console.log(res);  
      if (res.CODE == 200 && res.STATUS == "success") {
        // this.behaviorService.DocumentRegisterData(res.DATA.DOCUMENTS[0]);
        this.MainSafeCustodyData = new MatTableDataSource(res.DATA.SAFECUSTODIES);
        this.MainSafeCustodyData.sort = this.sort;
        this.MainSafeCustodyData.paginator = this.paginator;
        if (res.DATA.SAFECUSTODIES[0]) {
          this.editsafecustody(res.DATA.SAFECUSTODIES[0]);
          this.highlightedRows = res.DATA.SAFECUSTODIES[0].SAFECUSTODYGUID;
        }
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
  editsafecustody(row){
    this.behaviorService.SafeCustody(row);
  }
  openDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'contacts', 'list': '' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.tempColobj = result.tempColobj;
        this.ColumnsObj = result.columnameObj;
        if (!result.columObj) {
          this.MainSafeCustodyData = new MatTableDataSource([]);
        } else {
          this.LoadData();
        }
      }
    });  
  }
  refreshmainsafecusday(){
    this.LoadData();
  }
}
