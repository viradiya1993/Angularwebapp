import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-chart-ac-dailog',
  templateUrl: './chart-ac-dailog.component.html',
  styleUrls: ['./chart-ac-dailog.component.scss']
})
export class ChartAcDailogComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  isLoadingResults: boolean = false;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;
  AccountForm: FormGroup;

  constructor
  (
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<ChartAcDailogComponent>,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) 
  { 
    this.action = data.action;
    if (this.action === 'add') {
      this.dialogTitle = 'New Account';
    } else if (this.action === 'edit') {
      this.dialogTitle = 'Update Account';
    } else if(this.action === 'copy') {
      this.dialogTitle = 'Duplicate Account';
    }
  }

  ngOnInit() {
    this.AccountForm = this._formBuilder.group({
      AccountClass:[''],
      accountname:['',Validators.required]
    });
  }
  //Account Class Dropdown
  AccountChange(value){
    console.log(value);
  }
  //SaveAccount
  SaveAccount(){
    console.log('save account work!!');
  }

}
