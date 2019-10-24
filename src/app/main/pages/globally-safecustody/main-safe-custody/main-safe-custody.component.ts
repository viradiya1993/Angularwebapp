import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  MainSafeCustody: FormGroup;
  ColumnsObj = [];
  pageSize: any;
  isLoadingResults: boolean = false;
  tempColobj: any;
  displayedColumns: any;
  addData: any = [];
  MainSafeCustodyData: any = [];
  ImgDisAb:any;
  isDisplay: boolean = false;
  filterData: {'STATUS': any,'MATTERGUID': any, "Matter": any,"Contactguid":any, "Contact":any,'Search': string; };
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private _mainAPiServiceService: MainAPiServiceService, private dialog: MatDialog,
    private TableColumnsService: TableColumnsService, private toastr: ToastrService,public behaviorService: BehaviorService, private _formBuilder: FormBuilder ) { }

  ngOnInit() {
    this.ImgDisAb = "menu-disabled";
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 70)) + 'px');
    this.getTableFilter();
    this.MainSafeCustody = this._formBuilder.group({
      STATUS: [''],
      MATTERCHECK:[''],
      MATTER:[''],
      CLIENTCHECK:[''],
      CLIENT:[''],
      SEARCH:['']
    });
    this.filterData = {
      'STATUS': '', 'MATTERGUID':'','Matter':'','Contactguid':'','Contact':'','Search':''
    }
    if (!localStorage.getItem("mainsafecustody_filter")) {
        localStorage.setItem('mainsafecustody_filter', JSON.stringify(this.filterData));
    } else {
        this.filterData = JSON.parse(localStorage.getItem("mainsafecustody_filter"));
    }
    this.MainSafeCustody.controls['STATUS'].setValue(this.filterData.STATUS);
    this.MainSafeCustody.controls['MATTER'].setValue(this.filterData.Matter);
    this.MainSafeCustody.controls['CLIENT'].setValue(this.filterData.Contact);
    if (this.filterData.MATTERGUID == '') {
      this.MainSafeCustody.controls['MATTERCHECK'].setValue(true);
      this.MainSafeCustody.controls['MATTER'].disable();
      this.MatterChecxed();
    }else if(this.filterData.Contactguid == ''){
      this.MainSafeCustody.controls['CLIENTCHECK'].setValue(true);
      this.MainSafeCustody.controls['CLIENT'].disable();
      this.ContactChecxed();
    }else{
       this.LoadData(this.filterData);
    }

  }
  get f() {
    return this.MainSafeCustody.controls;
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
  LoadData(data) {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData(data, 'GetSafeCustody').subscribe(res => {   
      //console.log(res);  
      if (res.CODE == 200 && res.STATUS == "success") {
        this.MainSafeCustodyData = new MatTableDataSource(res.DATA.SAFECUSTODIES);
        this.MainSafeCustodyData.sort = this.sort;
        this.MainSafeCustodyData.paginator = this.paginator;
        if (res.DATA.SAFECUSTODIES[0]) {
          this.editsafecustody(res.DATA.SAFECUSTODIES[0]);
          this.highlightedRows = res.DATA.SAFECUSTODIES[0].SAFECUSTODYGUID;
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
  selectStatus(val){
    this.filterData = JSON.parse(localStorage.getItem("mainsafecustody_filter"));
    this.filterData.STATUS = val;
    localStorage.setItem('mainsafecustody_filter',JSON.stringify(this.filterData));
    this.LoadData(this.filterData);
  }
  MatterChecxed(){
    if(this.f.MATTERCHECK.value == true){
      this.ImgDisAb = "menu-disabled";
      this.MainSafeCustody.controls['MATTER'].disable();
      this.filterData = JSON.parse(localStorage.getItem("mainsafecustody_filter"));
      this.filterData.MATTERGUID = "";
      localStorage.setItem('mainsafecustody_filter',JSON.stringify(this.filterData));
      this.LoadData(this.filterData);
    }else{
      this.ImgDisAb = "";
      this.MainSafeCustody.controls['MATTER'].enable();
      const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
      dialogRef.afterClosed().subscribe(result => {
        if(result != false){
          if (result) {
            localStorage.setItem('set_active_matters', JSON.stringify(result));
            this.MainSafeCustody.controls['MATTER'].setValue(result.MATTER);
            this.filterData = JSON.parse(localStorage.getItem("mainsafecustody_filter"));
            this.filterData.MATTERGUID = result.MATTERGUID;
            this.filterData.Matter = result.MATTER;
            localStorage.setItem('mainsafecustody_filter', JSON.stringify(this.filterData));
            this.LoadData(this.filterData);
          }
          else if (this.f.MATTER.value == '') {
            this.MainSafeCustody.controls['MATTERCHECK'].setValue(true);
          }
        }else{
          this.ImgDisAb = "menu-disabled";
          this.MainSafeCustody.controls['MATTERCHECK'].setValue(true);
          this.MainSafeCustody.controls['MATTER'].disable();
        }
      });
    }
  }
  SelectMatter() {
    const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true, data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.MainSafeCustody.controls['MATTER'].setValue(result.MATTER);
        this.filterData = JSON.parse(localStorage.getItem("mainsafecustody_filter"));
        this.filterData.MATTERGUID = result.MATTERGUID;
        this.filterData.Matter = result.MATTER;
        localStorage.setItem('mainsafecustody_filter', JSON.stringify(this.filterData));
        this.LoadData(this.filterData);
      }
    });
  }
  ContactChecxed(){
    if(this.f.CLIENTCHECK.value == true){
      this.ImgDisAb = "menu-disabled";
      this.MainSafeCustody.controls['CLIENT'].disable();
      this.filterData = JSON.parse(localStorage.getItem("mainsafecustody_filter"));
      this.filterData.Contactguid = "";
      localStorage.setItem('mainsafecustody_filter',JSON.stringify(this.filterData));
      this.LoadData(this.filterData);
    }else{
      this.ImgDisAb = "";
      this.MainSafeCustody.controls['CLIENT'].enable();
      const dialogRef = this.dialog.open(ContactSelectDialogComponent, { width: '100%', disableClose: true, data: '' });
      dialogRef.afterClosed().subscribe(result => {
        if(result != false){
          if (result) {
            localStorage.setItem('contact_active', JSON.stringify(result));
            this.MainSafeCustody.controls['CLIENT'].setValue(result.CONTACTNAME);
            this.filterData = JSON.parse(localStorage.getItem("mainsafecustody_filter"));
            this.filterData.Contactguid = result.CONTACTGUID;
            this.filterData.Contact = result.CONTACTNAME;
            localStorage.setItem('mainsafecustody_filter', JSON.stringify(this.filterData));
            this.LoadData(this.filterData);
          }else if (this.f.CLIENT.value == '') {
            this.MainSafeCustody.controls['CLIENTCHECK'].setValue(true);
          }
        }else{
          this.ImgDisAb = "menu-disabled";
          this.MainSafeCustody.controls['CLIENTCHECK'].setValue(true);
          this.MainSafeCustody.controls['CLIENT'].disable();
        }
      });
    }  
  }
  SelectContact() {
    const dialogRef = this.dialog.open(ContactSelectDialogComponent, { width: '100%', disableClose: true, data: '' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {       
        this.MainSafeCustody.controls['CLIENT'].setValue(result.CONTACTNAME);
        this.filterData = JSON.parse(localStorage.getItem("mainsafecustody_filter"));
        this.filterData.Contactguid = result.CONTACTGUID;
        this.filterData.Contact = result.CONTACTNAME;
        localStorage.setItem('mainsafecustody_filter', JSON.stringify(this.filterData));
        this.LoadData(this.filterData);
      }
    });
  }
  onSearch(searchFilter:any){
    this.filterData = JSON.parse(localStorage.getItem("mainsafecustody_filter"));
    if (searchFilter['key'] === "Enter" || searchFilter == 'Enter') {
      this.filterData.Search = this.f.SEARCH.value;
      localStorage.setItem('mainsafecustody_filter', JSON.stringify(this.filterData));
      this.LoadData(this.filterData);
    }
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
          this.isDisplay = true;
        } else {
         this.LoadData(this.filterData);
        }
      }
    });  
  }
  refreshmainsafecusday(){
    this.filterData = JSON.parse(localStorage.getItem("mainsafecustody_filter"));
    this.LoadData(this.filterData);
  }
}
