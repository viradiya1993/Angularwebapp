import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { MainAPiServiceService, TableColumnsService } from 'app/_services';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';



@Component({
  selector: 'app-general-journal',
  templateUrl: './general-journal.component.html',
  styleUrls: ['./general-journal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class GeneralJournalComponent implements OnInit {
  highlightedRows: any;
  ColumnsObj = [];
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  contectTitle = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  displayedColumns: string[];
  tempColobj: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoadingResults: boolean = false;
  pageSize: any;
  generalJournalData: any = [];
  filterVals = { 'searching': '', 'ShowReceipts': false, 'ShowInvoices': true, 'ShowReceiveMoney': true, 'ShowSpendMoney': true, 'ShowGeneralJournal': true };
  constructor(
    private TableColumnsService: TableColumnsService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
  ) { }

  ngOnInit() {
    this.getTableFilter();
    this.LoadData();
  }
  changeValueOfCheckbox() {
    this.LoadData();
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('general-journal', '').subscribe(response => {
      console.log(response);
      if (response.CODE == 200 && response.STATUS == "success") {
        let data = this.TableColumnsService.filtertableColum(response.DATA.COLUMNS);
        this.tempColobj = data.tempColobj;
        this.displayedColumns = data.showcol;
        this.ColumnsObj = data.colobj;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  LoadData() {
    this.generalJournalData = [];
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(this.filterVals, 'GetJournal').subscribe(response => {
      console.log(response);
      return;
      if (response.CODE == 200 && response.STATUS == "success") {
        this.generalJournalData = new MatTableDataSource(response.DATA.CONTACTS);
        this.generalJournalData.paginator = this.paginator;
        this.generalJournalData.sort = this.sort;
        if (response.DATA.CONTACTS[0]) {
          // localStorage.setItem('contactGuid', response.DATA.CONTACTS[0].CONTACTGUID);
          // localStorage.setItem('contactData',  JSON.stringify(response.DATA.CONTACTS[0]));

          this.highlightedRows = response.DATA.CONTACTS[0].CONTACTGUID;
        }
        this.isLoadingResults = false;
      } else if (response.CODE == 406 && response.MESSAGE == "Permission denied") {
        this.generalJournalData = new MatTableDataSource([]);
        this.generalJournalData.paginator = this.paginator;
        this.generalJournalData.sort = this.sort;
        this.isLoadingResults = false;
      }
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
    // this.pageSize = localStorage.getItem('lastPageSize');
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'contacts', 'list': '' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tempColobj = result.tempColobj;
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        if (!result.columObj) {
          this.generalJournalData = new MatTableDataSource([]);
          this.generalJournalData.paginator = this.paginator;
          this.generalJournalData.sort = this.sort;
        } else {
          this.LoadData();
        }
      }
    });
  }
}
