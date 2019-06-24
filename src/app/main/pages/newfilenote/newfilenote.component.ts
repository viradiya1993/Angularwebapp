import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-newfilenote',
  templateUrl: './newfilenote.component.html',
  styleUrls: ['./newfilenote.component.scss']
})
export class NewfilenoteComponent implements OnInit {
  NewFileNote:FormGroup;
  isLoadingResults: boolean = false;
  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<NewfilenoteComponent>,
    private _formBuilder: FormBuilder)
   { }

  ngOnInit() {
    this.NewFileNote = this._formBuilder.group({
      newfiledate:[''],
      User:[''],
      time:[''],
      comment:['']
    });
  }
  //Save File Note
  ActivitySave(){
    alert('File Save');
  }
  //Close File Note
  CloseFileNote(){
    this.dialogRef.close(false);
  }
  //New Date 
  NewNoteDate(value){
   console.log(value);
  }
  //User DropDown
  UserChange(value){
    console.log(value);
  }

}
