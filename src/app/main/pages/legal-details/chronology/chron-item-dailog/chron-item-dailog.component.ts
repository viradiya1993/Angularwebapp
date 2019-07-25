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
      date:[],
      time:[],
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

  }
  //FormatChange
  FormatChange(val){

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
