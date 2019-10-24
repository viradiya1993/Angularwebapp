import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { TableColumnsService, MainAPiServiceService, BehaviorService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { MatSort } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatterPopupComponent } from '../../matters/matter-popup/matter-popup.component';
import { ContactDialogComponent } from '../../contact/contact-dialog/contact-dialog.component';

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
  SearchForm: FormGroup;
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  isLoadingResults: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  chronology_table;
  pageSize: any;
  tempColobj: any;
  highlightedRows: any;
  isDisplay: boolean = false;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  constructor(private _formBuilder: FormBuilder, private dialog: MatDialog, private TableColumnsService: TableColumnsService,
    private _mainAPiServiceService: MainAPiServiceService, private toastr: ToastrService, public behaviorService: BehaviorService
  ) { }

  ngOnInit() {

    this.SearchForm = this._formBuilder.group({
      Matter: [],
      Client: [],
      search: [],
      foldervalue: [],
      showfolder: []
    });
    this.SearchForm.controls['Matter'].setValue(this.currentMatter.MATTER);
    this.SearchForm.controls['Client'].setValue(this.currentMatter.CLIENT);
    $('content').addClass('inner-scroll');
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + 140)) + 'px');
    this.getTableFilter();
    this.LoadData();
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('legal details', 'chronology').subscribe(response => {
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
    this.chronology_table = [];
    this.isLoadingResults = true;
    //get chronology
    let potData = { 'MatterGuid': this.currentMatter.MATTERGUID };
    this._mainAPiServiceService.getSetData({ 'MatterGuid': this.currentMatter.MATTERGUID }, 'GetChronology').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.chronology_table = new MatTableDataSource(response.DATA.CHRONOLOGIES);
        this.chronology_table.paginator = this.paginator;
        this.chronology_table.sort = this.sort;
        if (response.DATA.CHRONOLOGIES[0]) {
          this.RowClick(response.DATA.CHRONOLOGIES[0])
          this.highlightedRows = response.DATA.CHRONOLOGIES[0].CHRONOLOGYGUID;

        } else {
          this.isDisplay = true;
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
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'legal details', 'list': 'chronology' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        this.tempColobj = result.tempColobj;
        if (!result.columObj) {
          this.chronology_table = new MatTableDataSource([]);
          this.chronology_table.paginator = this.paginator;
          this.chronology_table.sort = this.sort;
          this.isDisplay = true;
        } else {
          this.LoadData();
        }
      }
    });
  }
  SelectMatter() {
    let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
    let MaterPopupData = { action: 'edit', 'matterGuid': mattersData.MATTERGUID }
    const dialogRef = this.dialog.open(MatterPopupComponent, {
      disableClose: true, panelClass: 'contact-dialog', data: MaterPopupData
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  SelectContact() {
    let contactPopupData = { action: 'edit' };
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      disableClose: true, panelClass: 'contact-dialog', data: contactPopupData
    });
    dialogRef.afterClosed().subscribe(result => {


    });
  }

  RowClick(val) {
    this.behaviorService.LegalChronologyData(val);
  }
  refreshLegalChronology() {
    this.LoadData();
  }
  FilterSearch(filterValue: any) {
    this.chronology_table.filter = filterValue;
  }

}
