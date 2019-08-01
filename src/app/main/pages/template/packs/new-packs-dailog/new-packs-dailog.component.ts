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
import { MainAPiServiceService, BehaviorService } from 'app/_services';
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
  SendDataForNew:any=[];

  dialogTitle: string;
  isspiner: boolean = false;
  TemplateType: any;

  public KitItemData: any = {
    "KITGUID": "", "ORDER": 0, "TEMPLATEFILE": "", "TEMPLATETYPE": "", "KITITEMGUID": "", "COPIES":0,"PROMT":false 
  };
  formAction: string;
  kitId: any;
  kitguid: any;
  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<NewPacksDailogComponent>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _mainAPiServiceService: MainAPiServiceService,
    public _matDialog: MatDialog,
    private behaviorService:BehaviorService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    this.action = data.action;
    this.dialogTitle = this.action === 'edit' ? 'Edit Pack' : 'New Pack';

    this.behaviorService.packs$.subscribe(result => {
      if(result){
        this.kitguid=result.KITGUID;
      }          
    });
   }

  ngOnInit() {
    // this.KitItemData.TEMPLATETYPE='0';
    let mainaction =localStorage.getItem('packaction');
    if(mainaction == 'edit'){
      if(this.action =="edit"){
        this.isLoadingResults=true;
        this._mainAPiServiceService.getSetData({KITITEMGUID:this.data.data.KITITEMGUID}, 'GetKitItem').subscribe(res => {
         this.KitItemData.TEMPLATEFILE=res.DATA.KITITEMS[0].TEMPLATEFILE;
         this.KitItemData.TEMPLATETYPE=res.DATA.KITITEMS[0].TEMPLATETYPE.toString();
         this.KitItemData.ORDER=res.DATA.KITITEMS[0].ORDER;
         this.KitItemData.KITGUID=res.DATA.KITITEMS[0].KITGUID;
         this.KitItemData.KITITEMGUID=res.DATA.KITITEMS[0].KITITEMGUID;
        //  this.KitItemData.TEMPLATEFILE=res.DATA.KITITEMS[0].TEMPLATEFILE;
        this.isLoadingResults=false;
        });
     
      }
    }else{
      if(this.action =='edit'){
        this.KitItemData.TEMPLATEFILE=this.data.data.TEMPLATEFILE;
        this.KitItemData.TEMPLATETYPE=this.data.data.TEMPLATETYPEDESC == "Document" ? '0' : '1';
        this.KitItemData.ORDER=this.data.data.ORDER;
      }else{
         this.KitItemData.TEMPLATETYPE = '0';
        this.TempleteChnage(0);
      }
      
     
    }


    
  // for template type dropdown
  this.templateFile();

  }
  templateFilefordoc(){
    this.emailname=[];
    this._mainAPiServiceService.getSetData({}, 'GetEmail').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        if (response.DATA.EMAILS[0]) {
             this.emailname=response.DATA.EMAILS
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
    if(value == 0){
      this.templateFile();
    }else{
      this.templateFilefordoc();
    
    }
    // console.log(value);
  }    
  //Templete FileChnage Dropdown
  TempleteFileChnage(value){
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
  PackItemSave(){
  let mainaction =localStorage.getItem('packaction');
 
    if(this.KitItemData.TEMPLATEFILE==''||this.KitItemData.TEMPLATEFILE==null || this.KitItemData.TEMPLATEFILE==undefined){
      this.toastr.error('TEMPLATEFILE Requried');
      return;
    }else if(this.KitItemData.TEMPLATETYPE==''||this.KitItemData.TEMPLATETYPE==null || this.KitItemData.TEMPLATETYPE==undefined){
      this.toastr.error('TEMPLATETYPE Requried');
      return;
    }


    if(mainaction =='edit'){

      if(this.action == 'edit'){
        this.formAction="update";
      }else{
        this.formAction="insert";
      }
    }else{
      //for add only
      this.SendDataForNew={
        ORDER:this.KitItemData.ORDER,
        TEMPLATEFILE:this.KitItemData.TEMPLATEFILE,
        TEMPLATETYPEDESC:this.KitItemData.TEMPLATETYPE == 0 ? "Document" : "Email"
    }
      if(this.action !='edit'){
        this.formAction="insert";
       
          this.dialogRef.close(this.SendDataForNew);
      }else{
        this.formAction="update";
        this.dialogRef.close(this.SendDataForNew);
      }
    
       
    }
    let SendData={
        KITITEMGUID:this.KitItemData.KITITEMGUID,
        KITGUID:this.kitguid,
        ORDER:this.KitItemData.ORDER,
        TEMPLATEFILE:this.KitItemData.TEMPLATEFILE,
        TEMPLATETYPE:Number(this.KitItemData.TEMPLATETYPE)
    }

    
    if(mainaction =='edit'){
      this.isspiner = true;
      let finalData={FormAction:this.formAction,DATA:SendData ,VALIDATEONLY: true }
      this._mainAPiServiceService.getSetData(finalData, 'SetKitItem').subscribe(response => {
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
    
   


    // this.dialogRef.close(data);
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
    this._mainAPiServiceService.getSetData(data, 'SetKitItem').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        if (this.action !== 'edit') {
          this.toastr.success(' save successfully');
        } else {
          this.toastr.success(' update successfully');
        }
        this.isspiner = false;
        this.dialogRef.close("EditPack");
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
