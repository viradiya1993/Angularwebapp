import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-general-receipt-dilog',
  templateUrl: './general-receipt-dilog.component.html',
  styleUrls: ['./general-receipt-dilog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class GeneralReceiptDilogComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<GeneralReceiptDilogComponent>,
    public datepipe: DatePipe,
    public MatDialog: MatDialog
  ) { }
  generalReceiptForm: FormGroup;
  isspiner: boolean;
  isLoadingResults: boolean;

  ngOnInit() {
    this.generalReceiptForm = this._formBuilder.group({
      classType: [''],
      date: [''],
      type: [''],
      payor: [''],
      amount: [''],
      gsttype: [''],
      gst: [''],
      bank_ac: [''],
      income_ac: [''],
      notes: [''],
    });
  }


}
