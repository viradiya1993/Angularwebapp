import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator,MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import {MatSort} from '@angular/material';
import {MatTableDataSource} from '@angular/material/table';
import * as $ from 'jquery';
import { MatterPopupComponent } from 'app/main/pages/matters/matter-popup/matter-popup.component';
import { ContactDialogComponent } from './../../../main/pages/contact/contact-dialog/contact-dialog.component';
import { MainAPiServiceService,TableColumnsService } from 'app/_services';


@Component({
  selector: 'app-document-register',
  templateUrl: './document-register.component.html',
  styleUrls: ['./document-register.component.scss'],
  animations: fuseAnimations
})
export class DocumentRegisterComponent implements OnInit {
  documentform: FormGroup;
  isLoadingResults: boolean = false;
  highlightedRows:any;
  ColumnsObj = [];
  tempColobj: any;
  displayedColumns:any;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  DocNo = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  DocumentAllData:any=[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private _mainAPiServiceService: MainAPiServiceService,
    private TableColumnsService: TableColumnsService,
  ) 
  {}

  ngOnInit() {
  
    this.documentform = this._formBuilder.group({
      matter:[],
      Client:[],
      search:[],
      foldervalue:[],
      showfolder:[]
    });
    this.getTableFilter();
    this.LoadData();
   
    let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
    this.documentform.controls['matter'].setValue(mattersData.MATTER); 
  }

  getTableFilter() {
    this.TableColumnsService.getTableFilter('Matter Documents', '').subscribe(response => {
      console.log(response);
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
    this.isLoadingResults=true;
    this._mainAPiServiceService.getSetData({}, 'GetDocument').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.DocumentAllData = new MatTableDataSource(res.DATA.DOCUMENTS);
        this.DocumentAllData.sort = this.sort;
        this.DocumentAllData.paginator = this.paginator;
        this.highlightedRows=res.DATA.DOCUMENTS[0].DOCUMENTGUID;
        this.isLoadingResults=false;
      }
    }, err => {
      this.isLoadingResults=false;
      this.toastr.error(err);

    });
  }
  //DcoumentFloder
  DcoumentFloder(){
    const dialogConfig = new MatDialogConfig();
        let mattersData = JSON.parse(localStorage.getItem('set_active_matters'));
        const dialogRef = this.dialog.open(MatterPopupComponent, {
            width: '100%',
            disableClose: true,
            data: { action: 'edit', 'matterGuid': mattersData.MATTERGUID }
        });
        dialogRef.afterClosed().subscribe(result => { });
  }
  //Client
  SelectClient(){
    if (!localStorage.getItem('contactGuid')) {
      this.toastr.error("Please Select Contact");
    } else {
      const dialogRef = this.dialog.open(ContactDialogComponent, { disableClose: true, data: { action: 'edit' } });
      dialogRef.afterClosed().subscribe(result => {
          if (result)
          $('#refreshContactTab').click();
      });
    }
  }
  //FilterSearch
  FilterSearch(filterValue:any){
    this.DocumentAllData.filter = filterValue;
  }
  //DocumentDialog

  DocumentDialog(){
    console.log('DocumentDialog Work!!');
  }
  //FloderChnage
  FloderChnage(value){
    console.log(value);
  }
  //Click Doc
  clickDoc(value){
    console.log(value);
  }
  RowClick(row){
console.log(row);
  }
}
