import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { TableColumnsService, MainAPiServiceService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import {MatSort} from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ContactDialogComponent } from '../../contact/contact-dialog/contact-dialog.component';
import { MatterPopupComponent } from '../../matters/matter-popup/matter-popup.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SearchComponent implements OnInit {
  ColumnsObj: any = [];
  SearchForm:FormGroup;
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  displayedColumns: string[];
  isLoadingResults: boolean = false;
  pageSize: any;
  Search_table:any=[];
  filterData: any = [];
  tempColobj: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private _formBuilder: FormBuilder,private dialog: MatDialog, private TableColumnsService: TableColumnsService, 
    private _mainAPiServiceService: MainAPiServiceService, private toastr: ToastrService) { }
  safeCustody_table;
  ngOnInit() {
    let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
    this.SearchForm = this._formBuilder.group({
        Matter:[''],
        Client:[''],
        status:[''],
        Search:['']
    });
    this.getTableFilter();
    this.filterData = {
      'MATTERGUID': this.currentMatter.MATTERGUID, 'STATUS': ' '
    }
    if (!localStorage.getItem("search_filter_legal")) {
      localStorage.setItem('search_filter_legal', JSON.stringify(this.filterData));
    } else {
      this.filterData = JSON.parse(localStorage.getItem("search_filter_legal"));
    }
    this.LoadData(this.filterData);
    this.SearchForm.controls['status'].setValue(this.filterData.STATUS);  
    this.SearchForm.controls['Matter'].setValue(mattersData.MATTER);  
    this.SearchForm.controls['Client'].setValue(mattersData.CONTACTNAME);  
    $('content').addClass('inner-scroll');
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + 140)) + 'px');
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('legal details', 'searching').subscribe(response => {
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
  LoadData(data) {
    this.isLoadingResults = true;
    //get autorites  
    // let potData = { 'MatterGUID': this.currentMatter.MATTERGUID };
    this._mainAPiServiceService.getSetData(data, 'GetCostRecovery').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.Search_table = new MatTableDataSource(response.DATA.SAFECUSTODIES);
        this.Search_table.paginator = this.paginator;
        this.Search_table.sort = this.sort;
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
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'legal details', 'list': 'searching' };
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
        } else{
          this.filterData = JSON.parse(localStorage.getItem("search_filter_legal"));
          this.LoadData(this.filterData);
        }
       
      }
    });
  }
  SelectMatter(){
    let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
    let MaterPopupData = { action: 'edit', 'matterGuid': mattersData.MATTERGUID }
//    let contactPopupData = { action:'edit' };
    const dialogRef = this.dialog.open(MatterPopupComponent, {
        disableClose: true, panelClass: 'contact-dialog', data: MaterPopupData
    });
    dialogRef.afterClosed().subscribe(result => {
    this.SearchForm.controls['Matter'].setValue(result);  
    
        
    });
  }
//   const dialogRef = this.dialog.open(ContactDialogComponent, {
//     disableClose: true, panelClass: 'contact-dialog', data: contactPopupData
  SelectContact(){
    let contactPopupData = { action:'edit' };
    const dialogRef = this.dialog.open(ContactDialogComponent, {
        disableClose: true, panelClass: 'contact-dialog', data: contactPopupData
    });
    dialogRef.afterClosed().subscribe(result => {
    // this.SearchForm.controls['Client'].setValue(result);  
        
    });
  }
  selectStatus(val){
    this.filterData = JSON.parse(localStorage.getItem("search_filter_legal"));
    this.filterData.STATUS = val;
    localStorage.setItem('search_filter_legal', JSON.stringify(this.filterData));
    this.LoadData(this.filterData);

  }
}




