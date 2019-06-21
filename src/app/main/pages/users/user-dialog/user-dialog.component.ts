import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  isLoadingResults: boolean = false;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;
  theCheckbox = true;
  

  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) 
  { 
    this.action = data.action;
    if(this.action === 'new'){
      this.dialogTitle = 'New User';
    }else if(this.action === 'edit'){
     this.dialogTitle = 'Edit User';
    }else{
       this.dialogTitle = 'Duplicate User';
    }

  }
  userForm: FormGroup;
  ngOnInit() {
    this.userForm = this._formBuilder.group({
      username: ['', Validators.required],
      fullname: ['', Validators.required],
      password: ['',Validators.required],
      active:[''],
      isprocipal:[''],
      // Fee Earner
      feeearnerid:[''],
      posotion:[''],
      hours:[''],
      day:[''],
      // Redio left
      ph1:[''],
      ph2:[''],
      fax1:[''],
      fax2:[''],
      mobile:[''],
      pracno:[''],
      comment:[''],

      //Security
      allowaccess:[''],

      //Info Track
      usernameinfo:[''],
      passwordinfo:['']

      //Budgets
    });
  }
  ondialogSaveClick():void{
    alert('save work!!!');
  }
  ondialogusercloseClick(): void {
    this.dialogRef.close(false);
  }

}
