import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-spend-money-add',
  templateUrl: './spend-money-add.component.html',
  styleUrls: ['./spend-money-add.component.scss']
})
export class SpendMoneyAddComponent implements OnInit {
  action: any;
  dialogTitle: string;

  constructor(public dialogRef: MatDialogRef<SpendMoneyAddComponent>,@Inject(MAT_DIALOG_DATA) public _data: any) { 
    this.action = _data.action;
    this.dialogTitle = this.action === 'edit' ? 'Update Spend Money' : 'Add Spend Money';
  }

  ngOnInit() {
  }
  
}
