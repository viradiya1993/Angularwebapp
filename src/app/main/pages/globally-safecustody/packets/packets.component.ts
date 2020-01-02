import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MainAPiServiceService, TableColumnsService,BehaviorService } from 'app/_services';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';

@Component({
  selector: 'app-packets',
  templateUrl: './packets.component.html',
  styleUrls: ['./packets.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PacketsComponent implements OnInit {
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  highlightedRows: any;
  isLoadingResults: boolean = false; 
  displayedColumns: any;
  ColumnsObj = [];
  tempColobj: any;
  MainPacketsData:any = [];
  isDisplay: boolean = false;
  @ViewChild(MatPaginator,{static: false}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: false}) sort: MatSort;
  constructor(
    private _mainAPiServiceService: MainAPiServiceService,
    private dialog: MatDialog,
    private TableColumnsService: TableColumnsService,
    private toastr: ToastrService,
    public behaviorService: BehaviorService) { }

  ngOnInit() {
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 70)) + 'px');
    this.getTableFilter();
    this.LoadData();
  }
  //getTableFilter
  getTableFilter(){
    this.TableColumnsService.getTableFilter('Safe Custody', 'Packets').subscribe(response => {
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
  LoadData(){
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({}, 'GetSafeCustodyPacket').subscribe(res => {   
      //console.log(res);  
      if (res.CODE == 200 && res.STATUS == "success") {
        this.MainPacketsData = new MatTableDataSource(res.DATA.SAFECUSTODYPACKETS);
        this.MainPacketsData.sort = this.sort;
        this.MainPacketsData.paginator = this.paginator;
        this.behaviorService.Packets(null);
        if (res.DATA.SAFECUSTODYPACKETS[0]) {
          this.isDisplay = false;
          this.EditPackets(res.DATA.SAFECUSTODYPACKETS[0]);
          this.highlightedRows = res.DATA.SAFECUSTODYPACKETS[0].SAFECUSTODYPACKETGUID;
        }else {
          this.isDisplay = true;
        }
        this.isLoadingResults = false;
      }
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
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
          this.MainPacketsData = new MatTableDataSource([]);
          this.isDisplay = true;
        } else {
          this.LoadData();
        }
      }
    });  
  }
  //EditPackets
  EditPackets(row){
    this.behaviorService.Packets(row);
  }
  RefreshPacketsData(){
    this.LoadData();
  }
}
