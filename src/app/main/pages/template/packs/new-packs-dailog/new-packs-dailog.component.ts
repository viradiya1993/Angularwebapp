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


@Component({
  selector: 'app-new-packs-dailog',
  templateUrl: './new-packs-dailog.component.html',
  styleUrls: ['./new-packs-dailog.component.scss']
})
export class NewPacksDailogComponent implements OnInit {
  isLoadingResults: boolean = false;
  PackTbl:FormGroup;
  action: string;
  emailname:any=[];
  dialogTitle: string;
  isspiner: boolean = false;
  TemplateType: any;
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
  //PackSave
  PackSave(){
    let data={
      TempleteType:this.f.TempleteType.value,
      TempleteFile:this.f.TempleteFile.value,
      Copies:this.f.Copies.value,
      Order:this.f.Order.value,
      Prom:this.f.Prompt.value

    }
    this.dialogRef.close(data);
  }
  //Close Pack Tabl 
  ClosePackTabl(){
    this.dialogRef.close(false);
  }

}
