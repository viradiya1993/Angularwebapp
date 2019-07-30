import { Component, OnInit, Inject ,ViewChild} from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material'
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component'
import { NewPacksDailogComponent } from '../../packs/new-packs-dailog/new-packs-dailog.component';
import { fuseAnimations } from '@fuse/animations';
import { MainAPiServiceService } from 'app/_services';


@Component({
  selector: 'app-packs-dailog',
  templateUrl: './packs-dailog.component.html',
  styleUrls: ['./packs-dailog.component.scss'],
  animations: fuseAnimations,
})
export class PacksDailogComponent implements OnInit {
  PackDocument:FormGroup;
  isLoadingResults: boolean = false;
  action: string;
  errorWarningData: any = {};
  getDataForTable:any=[];
  dialogTitle: string;
  isspiner: boolean = false;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
  Order = this.theme_type == "theme-default" ? 'Solicitor' : 'Client';
  displayedColumns: string[] = ['Order', 'TempleteFile','Prom','Copies'];
  DocumentPack:any=[];
  // DocumentPack = new MatTableDataSource(ELEMENT_DATA);
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  public MainKitData: any = {
    "KITGUID": "", "KITNAME": "", "CONTEXT": "",
  };
  constructor(
    public MatDialog: MatDialog,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PacksDailogComponent>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) 
  { 
    this.action = data.action;
    this.dialogTitle = this.action === 'edit' ? 'Edit Pack' : 'New Pack';
  }

  ngOnInit() {
    
    this.DocumentPack.paginator = this.paginator;
    this.DocumentPack.sort = this.sort;
    this.PackDocument = this._formBuilder.group({
      packName:['',Validators.required],
      Context:['']
    });
  }

  //ContextChnage Dropwown
  ContextChnage(value){
    console.log(value);
  }

 
  //Click Pack Tbl
  ClickPackTbl(value){
    console.log(value);
  }

  //Add Pack Item]
  AddPack(){
    // this.getDataForTable=[];
    console.log('Add pack');
    const dialogRef = this.dialog.open(NewPacksDailogComponent, {
      disableClose: true,
      panelClass: 'AddPack-dialog',
      data: {
          action: 'new',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != false){
        this.getDataForTable.push(result);
      }
      // this.DocumentPack = new MatTableDataSource(result);
        console.log(result);
    });
  }

  //Edit Pack Item
  EditPack(){
    console.log('Edit pack');
    const dialogRef = this.dialog.open(NewPacksDailogComponent, {
      disableClose: true,
      panelClass: 'EditPack-dialog',
      data: {
          action: 'edit',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
        console.log(result);
    });
  }
   //Delete Pack Item
  DeletePack(){
    console.log('Delete pack');
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: true,
      width: '100%',
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
  //Close Pack
  ClosePack(){
    this.dialogRef.close(false);
  }
  rowdata(row){

  }
   //Pack Save
   PackSave(){
     let sendData={
      KITGUID :this.MainKitData.KITGUID,
      KITNAME:this.MainKitData.KITNAME,
      CONTEXT:this.MainKitData.CONTEXT
     }
     let finalData={FormAction:'insert',DATA:sendData }
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
    if (Object.keys(errorData).length != 0)
      this.toastr.error(errorData);
    if (Object.keys(warningData).length != 0) {
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
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.kitItemData(details);
    this.isspiner = false;
  }
  kitItemData(data: any) {
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetKit').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
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

}
