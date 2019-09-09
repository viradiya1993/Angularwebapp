import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatDialog, MatTableDataSource, MatDialogConfig } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { MainAPiServiceService, BehaviorService,TableColumnsService } from 'app/_services';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component'
@Component({
  selector: 'app-past-reconciliation',
  templateUrl: './past-reconciliation.component.html',
  styleUrls: ['./past-reconciliation.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class PastReconciliationComponent implements OnInit {
  subscription: Subscription;
  chartAccountDetail: any;
  pageSize: any;
  isLoadingResults: boolean = false;
  highlightedRows: any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  bankingPastData: any = [];
  displayedColumns: string[];
  tempColobj: any;
  ColumnsObj = [];
  PastRECData:any=[];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private dialog: MatDialog, private _mainAPiServiceService: MainAPiServiceService, private toastr: ToastrService, private _formBuilder: FormBuilder, public behaviorService: BehaviorService, private TableColumnsService: TableColumnsService, ) { }

  ngOnInit() {
    this.behaviorService.ChartAccountData$.subscribe(result => {
      if (result) {
        this.chartAccountDetail = result;
      }
    });
    this.getTableFilter();
    this.LoadData({AccountGuid: "ACCAAAAAAAAAAAA4" });
    // this.LoadData({ AccountGuid: this.chartAccountDetail.ACCOUNTGUID });
  }
  getTableFilter() {
    this.TableColumnsService.getTableFilter('Reconciliation', 'PastReconciliations').subscribe(response => {
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
  LoadData(data) {
    this.bankingPastData = [];
    this.isLoadingResults = true;
    this.subscription = this._mainAPiServiceService.getSetData(data,'GetReconciliation').subscribe(response => {
         console.log(response);
      
      if (response.CODE == 200 && response.STATUS == "success") {
       this.PastRECData = new MatTableDataSource(response.DATA.RECONCILIATIONS);
         this.PastRECData.paginator = this.paginator;
         this.PastRECData.sort = this.sort;
        if (response.DATA.RECONCILIATIONS[0]) {
          // localStorage.setItem('BANKINGGUID', response.DATA.BANKINGS[0].BANKINGGUID);
         this.highlightedRows = response.DATA.RECONCILIATIONS[0].RECONCILIATIONGUID;
        }
        this.isLoadingResults = false;
      } else if (response.CODE == 406 && response.MESSAGE == "Permission denied") {
        this.PastRECData = new MatTableDataSource([]);
        this.PastRECData.paginator = this.paginator;
        this.PastRECData.sort = this.sort;
        this.isLoadingResults = false;
      }
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
    this.pageSize = localStorage.getItem('lastPageSize');
  }
  editBanking(val){

  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '100%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': this.ColumnsObj, 'type': 'Reconciliation', 'list': 'PastReconciliations' };
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tempColobj = result.tempColobj;
        this.displayedColumns = result.columObj;
        this.ColumnsObj = result.columnameObj;
        if (!result.columObj) {
          this.bankingPastData = new MatTableDataSource([]);
          this.bankingPastData.paginator = this.paginator;
          this.bankingPastData.sort = this.sort;
        } else {
          this.LoadData({ AccountGuid: this.chartAccountDetail.ACCOUNTGUID });
        }
      }
    });
  }
}
