import { Component, OnInit, Inject ,ViewChild} from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatDialogConfig } from '@angular/material';
import { MatSort } from '@angular/material'


@Component({
  selector: 'app-new-packs-dailog',
  templateUrl: './new-packs-dailog.component.html',
  styleUrls: ['./new-packs-dailog.component.scss']
})
export class NewPacksDailogComponent implements OnInit {
  isLoadingResults: boolean = false;
  PackTbl:FormGroup;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;
  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<NewPacksDailogComponent>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
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
  }
  //Templete Chnage Dropdown
  TempleteChnage(value){
    console.log(value);
  }    
  //Templete FileChnage Dropdown
  TempleteFileChnage(value){
    console.log(value);
  }
  //Select File
  SelectFile(){
    console.log('SelectFile work!!');
  }
  //PackSave
  PackSave(){
    
  }
  //Close Pack Tabl 
  ClosePackTabl(){
    this.dialogRef.close(false);
  }

}
