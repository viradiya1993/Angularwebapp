import { Component, OnInit, Inject ,ViewChild} from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material'
import { GenerateTemplatesDialoagComponent } from 'app/main/pages/system-settings/templates/gennerate-template-dialoag/generate-template.component';
import { MainAPiServiceService } from 'app/_services';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-new-packs-dailog',
  templateUrl: './new-packs-dailog.component.html',
  styleUrls: ['./new-packs-dailog.component.scss']
})
export class NewPacksDailogComponent implements OnInit {
  isLoadingResults: boolean = false;
  errorWarningData: any = {};
  PackTbl:FormGroup;
  confirmDialogRef: any;
  action: string;
  emailname:any=[];

  dialogTitle: string;
  isspiner: boolean = false;
  TemplateType: any;

  public KitItemData: any = {
    "KITGUID": "", "ORDER": "", "TEMPLATEFILE": "", "TEMPLATETYPE": "", "KITITEMGUID": "", "COPIES":0,"PROMT":false 
  };
  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<NewPacksDailogComponent>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _mainAPiServiceService: MainAPiServiceService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.action = data.action;
    this.dialogTitle = this.action === 'edit' ? 'Edit Pack' : 'New Pack';
   }

  ngOnInit() {
    
    this.PackTbl = this._formBuilder.group({
      TempleteType:[''],
      TempleteFile:[''],
      Copies:[''],
      Order:[''],
      Prompt:['']
    });

  // for template type dropdown
  this.templateFile();

  }
  templateFilefordoc(){
    this.emailname=[];
    this._mainAPiServiceService.getSetData({}, 'GetEmail').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        console.log(response);
        if (response.DATA.EMAILS[0]) {
             this.emailname=response.DATA.EMAILS
         //  localStorage.setItem('GenerateEmailData', JSON.stringify(response.DATA.EMAILS[0]));
        }}
    }, err => {
       this.toastr.error(err);
    });
  }
  templateFile(){
    this.emailname=[];
    this.emailname.push({NAME:'DEFI'});
    this.emailname.push({NAME:'DEFR'});
    // this.emailname={
    //   name:'DEFI'
    // }
  }
  //Templete Chnage Dropdown
  TempleteChnage(value){
    this.TemplateType=value;
    if(value=="Document"){
      this.templateFile();
    }else{
      this.templateFilefordoc();
    
    }
    // console.log(value);
  }    
  //Templete FileChnage Dropdown
  TempleteFileChnage(value){
    console.log(value);
  }
  //Select File
  SelectFile(){
    const dialogRef = this._matDialog.open(GenerateTemplatesDialoagComponent, {
      disableClose: true,
      panelClass: 'contact-dialog',
      data: {
          action: 'new',
      }
  });
  dialogRef.afterClosed().subscribe(result => {
  this.PackTbl.controls['TempleteFile'].setValue(result);  
      
  });
  }
  get f (){
    return this.PackTbl.controls;
  }

  // let data={
  //   TempleteType:this.f.TempleteType.value,
  //   TempleteFile:this.f.TempleteFile.value,
  //   Copies:this.f.Copies.value,
  //   Order:this.f.Order.value,
  //   Prom:this.f.Prompt.value

  // }


  //PackSave
  PackSave(){
    let data={
      TempleteType:this.KitItemData.TEMPLATETYPE,
      TempleteFile:this.KitItemData.TEMPLATEFILE,
      Copies:this.KitItemData.COPIES,
      Order:this.KitItemData.ORDER,
      Prom:this.KitItemData.PROMT

    }

    let SendData={
        KITITEMGUID:this.KitItemData.KITITEMGUID,
        KITGUID:this.KitItemData.KITGUID,
        ORDER:this.KitItemData.ORDER,
        TEMPLATEFILE:this.KitItemData.TEMPLATEFILE,
        TEMPLATETYPE:this.KitItemData.TEMPLATETYPE
    }

    let finalData={FormAction:'insert',DATA:SendData }
    this._mainAPiServiceService.getSetData(finalData, 'SetKitItem').subscribe(response => {
      console.log(response);
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, finalData,data);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.checkValidation(response.DATA.VALIDATIONS, finalData,data);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.checkValidation(response.DATA.VALIDATIONS, finalData,data);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      } else {
        this.isspiner = false;
      }
       
      }, err => {
        this.toastr.error(err);
     });
  
   


    // this.dialogRef.close(data);
  }
  checkValidation(bodyData: any, details: any,data) {
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
          this.kitItemData(details,data);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.kitItemData(details,data);
    this.isspiner = false;
  }
  kitItemData(data: any,val) {
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetKitItem').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        if (this.action !== 'edit') {
          this.toastr.success(' save successfully');
        } else {
          this.toastr.success(' update successfully');
        }
        this.isspiner = false;
        this.dialogRef.close(val);
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
  //Close Pack Tabl 
  ClosePackTabl(){
    this.dialogRef.close(false);
  }

}
