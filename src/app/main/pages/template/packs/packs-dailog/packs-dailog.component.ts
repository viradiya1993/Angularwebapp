import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component'
import { NewPacksDailogComponent } from '../../packs/new-packs-dailog/new-packs-dailog.component';
import { fuseAnimations } from '@fuse/animations';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import * as $ from 'jquery';


@Component({
  selector: 'app-packs-dailog',
  templateUrl: './packs-dailog.component.html',
  styleUrls: ['./packs-dailog.component.scss'],
  animations: fuseAnimations,
})
export class PacksDailogComponent implements OnInit, OnDestroy {
  PackDocument: FormGroup;
  isLoadingResults: boolean = false;
  action: string;
  errorWarningData: any = {};
  getDataForTable: any = [];
  dialogTitle: string;
  isspiner: boolean = false;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  Order = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  displayedColumns: string[] = ['Order', 'TempleteFile', 'TemplateType'];
  DocumentPack: any = [];
  currentData: any = [];
  highlightedRows: any;
  // DocumentPack = new MatTableDataSource(ELEMENT_DATA);
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public MainKitData: any = {
    "KITGUID": "", "KITNAME": "", "CONTEXT": "",
  };
  kitguid: any;
  formAction: string;
  Index: any;
  Context: any;
  KitName: any;

  constructor(
    public MatDialog: MatDialog,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PacksDailogComponent>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    private behaviorService: BehaviorService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.action = data.action;
    this.dialogTitle = this.action === 'edit' ? 'Edit Pack' : 'New Pack';
    localStorage.setItem('packaction', this.action);
    this.behaviorService.packs$.subscribe(result => {
      if (result) {
        this.kitguid = result.KITGUID;
        this.KitName = result.KITNAME;
        this.Context = result.CONTEXT;


      }
    });
  }

  ngOnInit() {

    // this.PackDocument = this._formBuilder.group({
    //   packName:[''],
    //   Context:['']
    // });
    if (this.action == "edit") {
      this.MainKitData.KITNAME = this.KitName;
      this.MainKitData.CONTEXT = this.Context;
      // this.DocumentPack.paginator = this.paginator;
      // this.DocumentPack.sort = this.sort;
      this.LoadData();
    } else {
      //
    }
  }

  // refreshKitItemTab(){
  //   if(this.action == "edit"){
  //     console.log("fjksdfhjksdf");
  //     this.LoadData();
  //   }
  // }
  LoadData() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({ KITGUID: this.kitguid }, 'GetKitItem').subscribe(res => {
      this.getDataForTable = res.DATA.KITITEMS;
      // this.DocumentPack = new MatTableDataSource(res.DATA.KITITEMS);
      //  this.DocumentPack.paginator = this.paginator;
      // this.DocumentPack.sort = this.sort;
      // this.MainKitData=
      this.isLoadingResults = false;
      this.highlightedRows = 0;
      this.rowdata(res.DATA.KITITEMS, 0);
      this.currentData = res.DATA.KITITEMS[0];
    });
  }

  //ContextChnage Dropwown
  ContextChnage(value) {
  }


  //Click Pack Tbl
  ClickPackTbl(value) {
  }

  //Add Pack Item]
  AddPack() {
    // this.getDataForTable=[];
    const dialogRef = this.dialog.open(NewPacksDailogComponent, {
      disableClose: true,
      panelClass: 'AddPack-dialog',
      data: {
        action: 'new',
        data: this.currentData
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result == 'EditPack') {
        this.LoadData();
      } else if (result != false) {
        this.getDataForTable.push(result);
      }
      // this.DocumentPack = new MatTableDataSource(result);

    });
  }

  //Edit Pack Item
  EditPack() {
    const dialogRef = this.dialog.open(NewPacksDailogComponent, {
      disableClose: true,
      panelClass: 'EditPack-dialog',
      data: {
        action: 'edit',
        data: this.currentData,
        subdata: this.getDataForTable
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'EditPack') {
        this.LoadData();
      } else if (result != false) {
        this.getDataForTable[this.Index].ORDER = result.ORDER;
        this.getDataForTable[this.Index].TEMPLATEFILE = result.TEMPLATEFILE;
        this.getDataForTable[this.Index].TEMPLATETYPEDESC = result.TEMPLATETYPEDESC;
      }
    });
  }
  //Delete Pack Item
  DeletePack() {
    // let mainaction=localStorage.getItem('packaction');
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: true,
      width: '100%',
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.action == 'edit') {
          let sendadata = {
            DATA: {
              KITITEMGUID: this.currentData.KITITEMGUID, KITGUID: this.kitguid
            },
            FormAction: "delete"
          }
          this._mainAPiServiceService.getSetData(sendadata, 'SetKitItem').subscribe(res => {
            if (res.STATUS == "success") {
              this.LoadData();
              this.toastr.success(res.STATUS);

            } else {

            }
          });;
        } else {
          this.getDataForTable.splice(this.Index, 1);
          // this.getDataForTable
        }


      }
    });
  }
  //Close Pack
  ClosePack() {
    this.dialogRef.close(false);
  }
  rowdata(row, index) {
    this.currentData = row;
    this.Index = index;
  }
  //Pack Save
  PackSave() {
    this.isspiner = true;
    let sendData = {
      KITGUID: this.kitguid,
      KITNAME: this.MainKitData.KITNAME,
      CONTEXT: this.MainKitData.CONTEXT
    }
    let finalData = { FormAction: this.action === 'edit' ? 'update' : 'insert', DATA: sendData, VALIDATEONLY: true }
    this._mainAPiServiceService.getSetData(finalData, 'SetKit').subscribe(response => {

      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, finalData);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.checkValidation(response.DATA.VALIDATIONS, finalData);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.checkValidation(response.DATA.VALIDATIONS, finalData);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      } else {
        this.isspiner = false;
      }

    }, err => {
      this.toastr.error(err);
    });

  }
  checkValidation(bodyData: any, details: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'No') {
        errorData.push(value.ERRORDESCRIPTION);
        tempError[value.FIELDNAME] = value;
      }
      else if (value.VALUEVALID == 'Warning') {
        tempWarning[value.FIELDNAME] = value;
        warningData.push(value.ERRORDESCRIPTION);
      }

    });
    this.errorWarningData = { "Error": tempError, 'warning': tempWarning };
    if (Object.keys(errorData).length != 0) {
      this.toastr.error(errorData);
      this.isspiner = false;
    } else if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.kitItemData(details);
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.kitItemData(details);
      this.isspiner = false;
    }
  }
  kitItemData(data: any) {
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetKit').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        if (localStorage.getItem('packaction') != 'edit') {
          this.getDataForTable.forEach(element => {
            if (element.TEMPLATETYPEDESC == 'Document') {
              element.TEMPLATETYPE = 0;
            } else {
              element.TEMPLATETYPE = 1;
            }
            element.KITGUID = response.DATA.KITGUID,
              element.KITITEMGUI = ''
            this.saveKitItem({ FormAction: 'insert', VALIDATEONLY: false, DATA: element });
          });

        }

        if (this.action !== 'edit') {
          this.toastr.success(' save successfully');
        } else {
          this.toastr.success(' update successfully');
        }
        this.isspiner = false;
        this.dialogRef.close(true);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.toastr.warning(response.MESSAGE);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.toastr.error(response.MESSAGE);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, error => {
      this.toastr.error(error);
    });
  }
  saveKitItem(data) {
    this._mainAPiServiceService.getSetData(data, 'SetKitItem').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {

      }
    }, err => {
      this.toastr.error(err);
    });
  }
  ngOnDestroy() {
    this.behaviorService.packsitems(null);
  }


}
