import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { TableColumnsService, MainAPiServiceService, BehaviorService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import {MatSort} from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatterDialogComponent } from '../../time-entries/matter-dialog/matter-dialog.component';
import { ContactSelectDialogComponent } from '../../contact/contact-select-dialog/contact-select-dialog.component';
import { MatterPopupComponent } from '../../matters/matter-popup/matter-popup.component';
import { ContactDialogComponent } from '../../contact/contact-dialog/contact-dialog.component';

@Component({
  selector: 'app-safecustody',
  templateUrl: './safecustody.component.html',
  styleUrls: ['./safecustody.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SafecustodyComponent implements OnInit {
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  highlightedRows: any;
  ColumnsObj: any = [];
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  displayedColumns: string[];
  isLoadingResults: boolean = false;
  pageSize: any;
  tempColobj: any;
  SafeCustody: FormGroup;
  cuurentmatter = JSON.parse(localStorage.getItem('set_active_matters'));
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog, private TableColumnsService: TableColumnsService, 
     private _mainAPiServiceService: MainAPiServiceService,
      private toastr: ToastrService,
      public behaviorService: BehaviorService,
      private _formBuilder: FormBuilder) { }
  safeCustody_table;
  ngOnInit() {
    $('content').addClass('inner-scroll');
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + 140)) + 'px');
    this.getTableFilter();
    this.LoadData();
    this.SafeCustody = this._formBuilder.group({
      MATTER:[''],     
      CLIENT:[''],
    });
    this.SafeCustody.controls['MATTER'].setValue(this.cuurentmatter.MATTER);
    this.SafeCustody.controls['CLIENT'].setValue(this.cuurentmatter.CLIENT);
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('legal details', 'safe custody').subscribe(response => {
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
    let postData = { 'MatterGUID': this.currentMatter.MATTERGUID };
    this._mainAPiServiceService.getSetData(postData, 'GetSafeCustody').subscribe(response =>{
      if (response.CODE == 200 && response.STATUS == "success") {
        this.safeCustody_table = new MatTableDataSource(response.DATA.SAFECUSTODIES);
        this.safeCustody_table.paginator = this.paginator;
        this.safeCustody_table.sort = this.sort;
        if (response.DATA.SAFECUSTODIES[0]) {
          this.EditLegalCustody(response.DATA.SAFECUSTODIES[0]);
          this.highlightedRows = response.DATA.SAFECUSTODIES[0].SAFECUSTODYGUID;
        }
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
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'legal details', 'list': 'safe custody' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        this.tempColobj = result.tempColobj;
        if (!result.columObj) {
          this.safeCustody_table = new MatTableDataSource([]);
          this.safeCustody_table.paginator = this.paginator;
          this.safeCustody_table.sort = this.sort;
        } else
          this.LoadData();
      }
    });
  }
  EditLegalCustody(row){
    this.behaviorService.SafeCustody(row);
  }
  RefreshLegalCustody(){
    this.LoadData();
  }
  SelectMatter(){
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(MatterPopupComponent, {
      width: '100%',
      disableClose: true,
      data: { action: 'edit', 'matterGuid': this.cuurentmatter.MATTERGUID }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
  SelectContact(){   
    if (!localStorage.getItem('contactGuid')) {
      this.toastr.error("Please Select Contact");
    } else {
      const dialogRef = this.dialog.open(ContactDialogComponent, { disableClose: true, data: { action: 'edit' } });
      dialogRef.afterClosed().subscribe(result => {
        if (result){
           $('#Legalsafecusday').click();
        }
      });
    }
  }
}




