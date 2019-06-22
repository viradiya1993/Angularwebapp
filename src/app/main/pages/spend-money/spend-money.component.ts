import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SpendmoneyService, TableColumnsService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-spend-money',
  templateUrl: './spend-money.component.html',
  styleUrls: ['./spend-money.component.scss'],
  animations: fuseAnimations
})
export class SpendMoneyComponent implements OnInit {

  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  isLoadingResults: boolean = false;
  ColumnsObj: any = [];
  tempColobj: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  highlightedRows: any;
  displayedColumns: string[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentMatterData: any;
  Spendmoneydata: any;
  pageSize: any;

  constructor(
    private TableColumnsService: TableColumnsService,
    private SpendmoneyService: SpendmoneyService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
  ) {
    this.getTableFilter();
  }
  ngOnInit() {
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 130)) + 'px');
   
    this.loadData();
  }
  DateRange(a, s) {

  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('spend money', '').subscribe(response => {
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
  
  loadData() {
    
   
    let potData = { 'ITEMSTARTDATE': new Date() };
    this.isLoadingResults = true;
    this.SpendmoneyService.SpendmoneyListData(potData).subscribe(response => {
      console.log(response);
      if (response.CODE == 200 && response.STATUS == "success") {
        console.log("called");
        this.Spendmoneydata = new MatTableDataSource(response.DATA.EXPENDITURES)
        this.Spendmoneydata.paginator = this.paginator;
        if (response.DATA.EXPENDITURES[0]) {
          this.highlightedRows = response.DATA.EXPENDITURES[0].EXPENDITUREGUID;
          this.currentMatterData = response.DATA.EXPENDITURES[0].EXPENDITUREGUID;
        }
      
      } 
      this.isLoadingResults = false;
    }, error => {
      this.toastr.error(error);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }

  

  editmatter(Row: any) {
    this.currentMatterData = Row;
    console.log(Row);
    localStorage.setItem('spendMoney_data', JSON.stringify(Row));
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'time and billing', 'list': '' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      //   this.displayedColumns = result.columObj;
      //   this.ColumnsObj = result.columnameObj;
      //   this.tempColobj = result.tempColobj;
      //   if (!result.columObj) {
      //     this.MatterInvoicesdata = new MatTableDataSource([]);
      //     this.MatterInvoicesdata.paginator = this.paginator;
      //   } else {
      //     this.loadData();
      //   }
      // }
    });
  }
  onSearch(s) {

  }
  SpendClassChange(val){

  }
}
