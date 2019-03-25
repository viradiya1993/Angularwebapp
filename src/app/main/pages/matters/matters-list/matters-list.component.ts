import { Component, OnDestroy, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { MattersService } from '../matters.service';
import { SortingDialogComponent } from '../../../sorting-dialog/sorting-dialog.component';

@Component({
  selector: 'app-matters-list',
  templateUrl: './matters-list.component.html',
  styleUrls: ['./matters-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MattersListComponent implements OnInit, OnDestroy {

  mattersData: any;
  displayedColumns = ['name', 'email', 'phone', 'jobTitle'];
  // Private

  @Output() matterDetail: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _mattersService: MattersService, public dialog: MatDialog) { }



  ngOnInit(): void {
    this.getMatterList();
  }
  ngOnDestroy(): void { }

  editmatter(matters) {
    this.matterDetail.emit(matters);
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.data = { 'data': ['name', 'email', 'phone', 'jobTitle'], 'type': 'matters' };
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
    this._mattersService.getMatters().subscribe(response => {
      this.mattersData = response;
    });
  }
  tableSetting(data: any) {
    if (data !== false) {
      this.displayedColumns = data;
      this.getMatterList();
    }
  }


}
