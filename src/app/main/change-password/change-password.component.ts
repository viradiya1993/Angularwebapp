import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  isLoadingResults: boolean = false;
  Chnagepass:FormGroup;
  constructor( 
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.Chnagepass = this._formBuilder.group({
      username:[''],
      passoword:['',Validators.required],
      newpass:['',Validators.required],
      repass:['',Validators.required]
    });
  }
  //Save passoword
  SavePass(){
    
  }
  closePassworld(){
   
  }

}
