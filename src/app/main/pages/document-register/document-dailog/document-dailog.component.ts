import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-dailog',
  templateUrl: './document-dailog.component.html',
  styleUrls: ['./document-dailog.component.scss']
})
export class DocumentDailogComponent implements OnInit {
  DocumentForm:FormGroup;
  isLoadingResults: boolean = false;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;

  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<DocumentDailogComponent>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) 
  {
    this.action = data.action;
    if(this.action === 'new'){
      this.dialogTitle = 'New Document';
    }else if(this.action === 'edit'){
      this.dialogTitle = 'Edit Document';
    }else{
      this.dialogTitle = 'Duplicate Document';
    }
  }

  ngOnInit() {
    this.DocumentForm = this._formBuilder.group({
      Document:[''],
      time:[],
      Class:[],
      Description:['',Validators.required],
      Draft:[],
      DocNo:['',Validators.required],
      Type:[],
      author:['',Validators.required],
      Recipients:[],
      DocumentName:[],
      Keywords:['',Validators.required]
    });
  }
  //Document Date
  DocumentDate(value){
    console.log(value);
  }

  //Class Drop Down
  ClassChange(value){
    console.log(value);
  }
  //Draft Drop Down
  DraftChange(value){
    console.log(value);
  }

  //Type Drop Down
  TypeChnage(value){
    console.log(value);
  }

  //Dcoument Floder
  DcoumentFloder(){
    console.log('DcoumentFloder Work!!');
  }
  //Document Save
  DocumentSave(){

  }
  //Document Close
  CloseDocument():void{
    this.dialogRef.close(false);
  }
}
