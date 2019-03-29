import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SortingDialogComponent } from '../../../sorting-dialog/sorting-dialog.component';


@Component({
  selector: 'app-estimate',
  templateUrl: './estimate.component.html',
  styleUrls: ['./estimate.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EstimateComponent implements OnInit {
  displayedColumns: string[] = ['service', 'quantity_from_10', 'price_from', 'price_from_inc', 'quantity_to', 'price_to', 'price_toinc'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.data = { 'data': ['service', 'quantity_from_10', 'price_from', 'price_from_inc', 'quantity_to', 'price_to', 'price_toinc'], 'type': 'estimate' };
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
export interface PeriodicElement {
  service: string;
  quantity_from_10: number;
  price_from: number;
  price_from_inc: number;
  quantity_to: number;
  price_to: number;
  price_toinc: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {service:'xyz',quantity_from_10:51.30,price_from:31.50,price_from_inc:25.50,quantity_to:11,price_to:320.30,price_toinc:50},
  {service:'abc',quantity_from_10:536.60,price_from:321.65,price_from_inc:6.56,quantity_to:16,price_to:41.30,price_toinc:51.32},
  {service:'def',quantity_from_10:41.30,price_from:41.60,price_from_inc:56.30,quantity_to:56,price_to:56.50,price_toinc:60.32},
  {service:'ghi',quantity_from_10:63.50,price_from:55.30,price_from_inc:89.360,quantity_to:10,price_to:60.12,price_toinc:45.12},
  {service:'jkl',quantity_from_10:89.30,price_from:123.60,price_from_inc:56.30,quantity_to:15,price_to:45.30,price_toinc:78.32},
  {service:'mno',quantity_from_10:96.30,price_from:1023.546,price_from_inc:25.30,quantity_to:6,price_to:56.301,price_toinc:89.20},
  {service:'xyz',quantity_from_10:51.30,price_from:31.50,price_from_inc:25.50,quantity_to:11,price_to:320.30,price_toinc:50},
  {service:'abc',quantity_from_10:536.60,price_from:321.65,price_from_inc:6.56,quantity_to:16,price_to:41.30,price_toinc:51.32},
  {service:'def',quantity_from_10:41.30,price_from:41.60,price_from_inc:56.30,quantity_to:56,price_to:56.50,price_toinc:60.32},
  {service:'ghi',quantity_from_10:63.50,price_from:55.30,price_from_inc:89.360,quantity_to:10,price_to:60.12,price_toinc:45.12},
  {service:'jkl',quantity_from_10:89.30,price_from:123.60,price_from_inc:56.30,quantity_to:15,price_to:45.30,price_toinc:78.32},
  {service:'mno',quantity_from_10:96.30,price_from:1023.546,price_from_inc:25.30,quantity_to:6,price_to:56.301,price_toinc:89.20},

  {service:'xyz',quantity_from_10:51.30,price_from:31.50,price_from_inc:25.50,quantity_to:11,price_to:320.30,price_toinc:50},
  {service:'abc',quantity_from_10:536.60,price_from:321.65,price_from_inc:6.56,quantity_to:16,price_to:41.30,price_toinc:51.32},
  {service:'def',quantity_from_10:41.30,price_from:41.60,price_from_inc:56.30,quantity_to:56,price_to:56.50,price_toinc:60.32},
  {service:'ghi',quantity_from_10:63.50,price_from:55.30,price_from_inc:89.360,quantity_to:10,price_to:60.12,price_toinc:45.12},
  {service:'jkl',quantity_from_10:89.30,price_from:123.60,price_from_inc:56.30,quantity_to:15,price_to:45.30,price_toinc:78.32},
  {service:'mno',quantity_from_10:96.30,price_from:1023.546,price_from_inc:25.30,quantity_to:6,price_to:56.301,price_toinc:89.20},

  {service:'xyz',quantity_from_10:51.30,price_from:31.50,price_from_inc:25.50,quantity_to:11,price_to:320.30,price_toinc:50},
  {service:'abc',quantity_from_10:536.60,price_from:321.65,price_from_inc:6.56,quantity_to:16,price_to:41.30,price_toinc:51.32},
  {service:'def',quantity_from_10:41.30,price_from:41.60,price_from_inc:56.30,quantity_to:56,price_to:56.50,price_toinc:60.32},
  {service:'ghi',quantity_from_10:63.50,price_from:55.30,price_from_inc:89.360,quantity_to:10,price_to:60.12,price_toinc:45.12},
  {service:'jkl',quantity_from_10:89.30,price_from:123.60,price_from_inc:56.30,quantity_to:15,price_to:45.30,price_toinc:78.32},
  {service:'mno',quantity_from_10:96.30,price_from:1023.546,price_from_inc:25.30,quantity_to:6,price_to:56.301,price_toinc:89.20},

];