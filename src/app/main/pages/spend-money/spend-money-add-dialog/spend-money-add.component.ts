import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-spend-money-add',
  templateUrl: './spend-money-add.component.html',
  styleUrls: ['./spend-money-add.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SpendMoneyAddComponent implements OnInit {
  action: any;
  dialogTitle: string;
  isLoadingResults:boolean;
  spendmoneyForm: FormGroup;
  displayedColumnsTime: string[] = ['class', 'amount', 'Gst', 'note'];

  constructor(public dialogRef: MatDialogRef<SpendMoneyAddComponent>, @Inject(MAT_DIALOG_DATA) public _data: any, private _formBuilder: FormBuilder,) { 
    this.action = _data.action;
    this.dialogTitle = this.action === 'edit' ? 'Update Spend Money' : 'Add Spend Money';
  }


  ngOnInit() {
    this.spendmoneyForm = this._formBuilder.group({
      DateIncurred: [''],
      Paid: [''],
      DatePaid: [''],
      Client: [''],
      Amount: [''],
      GST: [''],
      Bankac: [''],
      Notes: [''],
      Type: [''],
      ChequeNo: [''],
      Payee: [''],
      Invoice: [''],
      MultiLineExpense: [''],
      Class: [''],
      Matter: [''],
      AmountIncGST: [''],
      GSTType: [''],
      GST1: [''],
      AmountExGST: [''],
      Expenseac: [''],
      Note: [''],
    });
    if (this.action === 'edit') {
      this.spendmoneyForm.controls['Class'].disable();
      this.spendmoneyForm.controls['Matter'].disable();
      this.spendmoneyForm.controls['AmountIncGST'].disable();
      this.spendmoneyForm.controls['GSTType'].disable();
      this.spendmoneyForm.controls['GST1'].disable();
      this.spendmoneyForm.controls['AmountExGST'].disable();
      this.spendmoneyForm.controls['Expenseac'].disable();
      this.spendmoneyForm.controls['Note'].disable();
    }
  }
}
 
