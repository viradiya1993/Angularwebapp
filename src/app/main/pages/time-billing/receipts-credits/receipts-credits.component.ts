import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from 'app/main/sorting-dialog/sorting-dialog.component';
import { ReceiptsCreditsService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-receipts-credits',
  templateUrl: './receipts-credits.component.html',
  styleUrls: ['./receipts-credits.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ReceiptsCreditsComponent implements OnInit {
  
  displayedColumns: string[] = ['Income Code','Income Guid','Income Class','Income Type','Firmguid','Short Name','Client Name','Allocation','Income Date','Payee','Amount','Gst','Total','Bank AccountGuid','Income AccountGuid','Note'];
  @ViewChild(MatPaginator) paginator: MatPaginator;  
  constructor(private dialog: MatDialog,private ReceiptsCredits: ReceiptsCreditsService, private toastr: ToastrService) { }

  ReceiptsCreditsdata;  
  ngOnInit() {  
    //API Data fetch
    this.ReceiptsCredits.ReceiptsCreditsData().subscribe(res => {
       if(res.Receipts.response !="error - not logged in"){       
        localStorage.setItem('session_token', res.Receipts.SessionToken);
        this.ReceiptsCreditsdata = new MatTableDataSource(res.Receipts.DataSet)     
        this.ReceiptsCreditsdata.paginator = this.paginator
      }else{
        this.toastr.error(res.Receipts.response );
      }
    },
    err => {
      this.toastr.error(err);
    });    
  } 
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';   
    dialogConfig.data = { 'data': ['Income Code','Income Guid','Income Class','Income Type','Firmguid','Short Name','Client Name','Allocation','Income Date','Payee','Amount','Gst','Total','Bank AccountGuid','Income AccountGuid','Note'], 'type': 'receipts-credits' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      if(result){
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


