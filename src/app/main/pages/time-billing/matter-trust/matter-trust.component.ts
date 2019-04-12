import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { MatterTrustService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-matter-trust',
  templateUrl: './matter-trust.component.html',
  styleUrls: ['./matter-trust.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MatterTrustComponent implements OnInit {
  currentMatter: any = JSON.parse(localStorage.getItem('set_active_matters'));
  displayedColumns: string[] = ['Trust Transaction ItemGuid', 'Trust Transaction Guid', 'Entered Date', 'Entered Time', 'Amount', 'Item Type', 'Account Guid', 'Matter Guid', 'Short Name', 'Matter Description', 'Client Guid', 'Client Name', 'Bankbsb', 'Bank Account Number', 'Ledger Balance', 'Purpose', 'Contact Name', 'Transaction Class', 'Transaction Type', 'Cashbook', 'Cashbook Code', 'Transaction Date', 'Payor', 'Cheque No'];
  isLoadingResults: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog, private MatterTrust: MatterTrustService, private toastr: ToastrService) { }

  MatterTrustdata;
  ngOnInit() {
    //API Data fetch
    this.isLoadingResults = true;
    let potData = { 'MatterGUID': this.currentMatter.MATTERGUID };
    this.MatterTrust.MatterTrustData(potData).subscribe(res => {
      if (res.TrustTransaction.response != "error - not logged in") {
        localStorage.setItem('session_token', res.TrustTransaction.SessionToken);
        this.MatterTrustdata = new MatTableDataSource(res.TrustTransaction.DataSet)
        this.MatterTrustdata.paginator = this.paginator
        this.isLoadingResults = false;
      } else {
        this.isLoadingResults = false;
        this.toastr.error(res.TrustTransaction.response);
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
    dialogConfig.data = { 'data': ['Trust Transaction ItemGuid', 'Trust Transaction Guid', 'Entered Date', 'Entered Time', 'Amount', 'Item Type', 'Account Guid', 'Matter Guid', 'Short Name', 'Matter Description', 'Client Guid', 'Client Name', 'Bankbsb', 'Bank Account Number', 'Ledger Balance', 'Purpose', 'Contact Name', 'Transaction Class', 'Transaction Type', 'Cashbook', 'Cashbook Code', 'Transaction Date', 'Payor', 'Cheque No'], 'type': 'matter_trust' };
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
