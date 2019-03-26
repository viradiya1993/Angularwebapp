import { Component, OnDestroy, OnInit, Output, ViewEncapsulation, EventEmitter, ViewChild } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogConfig } from '@angular/material';

//import { MattersService } from '../matters.service';
import { SortingDialogComponent } from '../../../sorting-dialog/sorting-dialog.component';
import { MatPaginator, MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-matters-list',
  templateUrl: './matters-list.component.html',
  styleUrls: ['./matters-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MattersListComponent implements OnInit, OnDestroy {
  displayedColumns = ['matter_num', 'matter', 'unbilled', 'invoiced', 'received', 'unpaid', 'total_value'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;


  mattersData: any;
  //displayedColumns = ['name', 'email', 'phone', 'jobTitle'];
  // Private

  @Output() matterDetail: EventEmitter<any> = new EventEmitter<any>();

  //constructor(private _mattersService: MattersService, private dialog: MatDialog) { }

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {

    this.dataSource.paginator = this.paginator;
    this.getMatterList();
  }
  ngOnDestroy(): void { }

  editmatter(matters) {
    this.matterDetail.emit(matters);
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.data = { 'data': ['matter_num', 'matter', 'unbilled', 'invoiced','received','unpaid','total_value'], 'type': 'matters' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(result);
    // });
    dialogRef.afterClosed().subscribe(data =>
      this.tableSetting(data)
    );
  }
  getMatterList() {
    // this._mattersService.getMatters().subscribe(response => {
    //   this.mattersData = response;
    // });
    this.mattersData = ELEMENT_DATA;
  }
  tableSetting(data: any) {
    if (data !== false) {
      this.displayedColumns = data;
      this.getMatterList();
    }
  }


}

export interface PeriodicElement {
  matter_num: number;
  matter: string;
  unbilled: number;
  invoiced: number;
  received: number;
  unpaid: number;
  total_value: number;


}

const ELEMENT_DATA: PeriodicElement[] = [
  { matter_num: 20140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 21140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 220140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 23140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 24140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 25140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 26140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 27140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 28140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 20140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 21140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 220140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 23140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 24140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 25140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 26140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 27140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 28140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 20140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 21140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 220140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 23140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 24140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 25140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 26140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 27140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },
  { matter_num: 28140008, matter: 'your family law matter', unbilled: 102.30, invoiced: 45.30, received: 500.30, unpaid: 366.01, total_value: 568.30 },

];


