import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-select-account',
  templateUrl: './select-account.component.html',
  styleUrls: ['./select-account.component.scss']
})
export class SelectAccountComponent implements OnInit {
  isLoadingResults: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<SelectAccountComponent>,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
  }
  //SelectAccount
  SelectAccount(){
    console.log('Select Account Work!!');
  }
  //NewAccount
  NewAccount(){
    console.log("New Account Work!!!");
  }
  //EditAccount
  EditAccount(){
    console.log("Edit Account Work!!!");
  }

}
