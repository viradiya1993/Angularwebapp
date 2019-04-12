import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialogConfig, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from '../../../sorting-dialog/sorting-dialog.component';
import { MatterInvoicesService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-matter-invoices',
  templateUrl: './matter-invoices.component.html',
  styleUrls: ['./matter-invoices.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MatterInvoicesComponent implements OnInit {
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  displayedColumns: string[] = ['Invoice Guid', 'Invoice ReversalGuid', 'Matter Guid', 'Short Name', 'Client Name', 'Parent InvoiceGuid', 'Invoice Code', 'Invoice Date', 'Due Date', 'Printed Date', 'Invoice Total', 'Gst', 'Agency Total', 'Agency Gst', 'Amount PaidexGst', 'Amount PaidincGst', 'Amount WrittenoffexGst', 'Amount WrittenoffincGst', 'Amount OutstandingexGst', 'Amount OutstandingincGst', 'Disbursement AmountexGst', 'Disbursement AmountincGst', 'Foreign currencyid', 'Foreign currencyrate', 'Foreign currencyamount', 'Foreign currencyGst', 'Comment'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoadingResults: boolean = false;
  constructor(private dialog: MatDialog, private MatterInvoices: MatterInvoicesService, private toastr: ToastrService) { }

  MatterInvoicesdata;
  ngOnInit() {
    this.isLoadingResults = true;
    let potData = { 'MatterGuid': this.currentMatter.MATTERGUID };
    this.MatterInvoices.MatterInvoicesData(potData).subscribe(res => {
      if (res.Invoice.response != "error - not logged in") {
        localStorage.setItem('session_token', res.Invoice.SessionToken);
        this.MatterInvoicesdata = new MatTableDataSource(res.Invoice.DataSet)
        this.MatterInvoicesdata.paginator = this.paginator
        this.isLoadingResults = false;
      } else {
        this.isLoadingResults = false;
        this.toastr.error(res.Invoice.response);
      }
    },
      err => {
        this.toastr.error(err);
      });
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.disableClose = true;
    dialogConfig.data = { 'data': ['Invoice Guid', 'Invoice ReversalGuid', 'Matter Guid', 'Short Name', 'Client Name', 'Parent InvoiceGuid', 'Invoice Code', 'Invoice Date', 'Due Date', 'Printed Date', 'Invoice Total', 'Gst', 'Agency Total', 'Agency Gst', 'Amount PaidexGst', 'Amount PaidincGst', 'Amount WrittenoffexGst', 'Amount WrittenoffincGst', 'Amount OutstandingexGst', 'Amount OutstandingincGst', 'Disbursement AmountexGst', 'Disbursement AmountincGst', 'Foreign currencyid', 'Foreign currencyrate', 'Foreign currencyamount', 'Foreign currencyGst', 'Comment'], 'type': 'matter_invoices' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      if (result) {
        localStorage.setItem(dialogConfig.data.type, JSON.stringify(result));
      }
    });
    dialogRef.afterClosed().subscribe(data =>
      this.tableSetting(data)
    );
  }
  tableSetting(data: any) {
    if (data !== false) {
      this.displayedColumns = data;
    }
  }
}
