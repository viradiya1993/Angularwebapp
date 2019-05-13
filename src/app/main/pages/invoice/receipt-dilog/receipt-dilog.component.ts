import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatPaginator, MatDialog, MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { ContactSelectDialogComponent } from '../../contact/contact-select-dialog/contact-select-dialog.component';

@Component({
  selector: 'app-receipt-dilog',
  templateUrl: './receipt-dilog.component.html',
  styleUrls: ['./receipt-dilog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ReceiptDilogComponent implements OnInit {
  constructor(
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ReceiptDilogComponent>,
    public datepipe: DatePipe,
    public MatDialog: MatDialog,
  ) {

  }
  displayedColumns: string[] = ['Invoice', 'Total', 'Outstanding', 'Allocated', 'Matter'];
  PrepareReceiptForm: FormGroup;
  PrepareReceiptData: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit() {
    this.PrepareReceiptData = new MatTableDataSource([]);
    this.PrepareReceiptData.paginator = this.paginator;

    this.PrepareReceiptForm = this._formBuilder.group({
      client: ['', Validators.required],
      ReceiptCode: [''],
      DateReceived: [''],
      AmountReceived: [''],
      AmountExGST: [''],
      GST: [''],
      IncomeType: [''],
      Payor: [''],
      BankAccount: [''],
      Note: [''],
      Show: [''],
      Unallocated: [''],
      Amount: [''],
    });
  }
  selectClient() {
    const dialogRef = this.MatDialog.open(ContactSelectDialogComponent, { width: '100%', disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.PrepareReceiptForm.controls['client'].setValue('');
      }
    });
  }

}
