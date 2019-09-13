import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chron-item-dailog',
  templateUrl: './chron-item-dailog.component.html',
  styleUrls: ['./chron-item-dailog.component.scss']
})
export class ChronItemDailogComponent implements OnInit {
  ChroneItem:FormGroup;
  isLoadingResults: boolean = false;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;

  public ChronologyADD={
      'Format':'',
      "date":'',
      "time":'',
      "dateto":'',
      "timeto":'',
      "text":'',
      "topic":'',
      "COMMENT":'',
      "Privileged":'',
      "Reference":'',
      "brif":'',
      "Witnesses":'',
      "eventAgereed":'',
      "document":''
  }
  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<ChronItemDailogComponent>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) 
  { 
    this.action = data.action;
    if(this.action === 'new'){
      this.dialogTitle = 'New Chronology';
    }else if(this.action === 'edit'){
      this.dialogTitle = 'Update Chronology';
    }else{
      this.dialogTitle = 'Duplicate Chronology';
    }
  }

  ngOnInit() {
    this.ChroneItem = this._formBuilder.group({
      Format:[],
      dateForm:[],
      timeForm:[],
      dateto:[],
      timeto:[],
      text:[],
      topic:[],
      COMMENT:[],
      Privileged:[],
      Reference:[],
      brif:[],
      Witnesses:[],
      eventAgereed:[],
      document:[]
    });
  }
  //ChroneItemSave
  ChroneItemSave(){

    console.log(this.ChronologyADD);


  }
  commonOdd(){
    this.ChroneItem.controls['dateForm'].enable();
    this.ChroneItem.controls['timeForm'].disable();
     this.ChroneItem.controls['dateto'].disable();
     this.ChroneItem.controls['timeto'].disable();
  }
  commonEven(){
    this.ChroneItem.controls['dateForm'].enable();
    this.ChroneItem.controls['dateto'].enable();
    this.ChroneItem.controls['timeForm'].disable();
     this.ChroneItem.controls['timeto'].disable();
  }
  //FormatChange
  FormatChange(val){

  if(val=='1'){
    this.commonOdd();
   
  }else if(val=='2'){
    this.commonEven();
  }else if(val=='3'){
    this.commonOdd();
  }else if(val=='4'){
    this.commonEven();
  }else if(val=='5'){
    this.commonOdd();
  }else if(val=='6'){
    this.commonEven();
  }else if(val=='7'){
    this.ChroneItem.controls['dateForm'].enable();
    this.ChroneItem.controls['timeForm'].enable();
    this.ChroneItem.controls['dateto'].disable();
     this.ChroneItem.controls['timeto'].disable();
  }else if(val=='8'){
    this.ChroneItem.controls['dateForm'].enable();
    this.ChroneItem.controls['timeForm'].enable();
    this.ChroneItem.controls['timeto'].enable();
    this.ChroneItem.controls['dateto'].disable();
  }
  }
  //choosedDate
  choosedDateFrom(){

  }
  //DateFrom
  DateFrom(){

  }
  //choosedDateTo
  choosedDateTo(){

  }
  //DateTo
  DateTo(){

  }
  //Event
  Event(){
    
  }
  //selectDoc
  selectDoc(){

  }
}
