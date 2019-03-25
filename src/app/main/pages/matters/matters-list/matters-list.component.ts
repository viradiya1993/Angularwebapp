import { Component, OnDestroy, OnInit, Output, ViewEncapsulation, EventEmitter, Pipe, PipeTransform, Inject } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag } from '@angular/cdk/drag-drop';

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
  displayedColumns = ['name', 'email', 'phone', 'jobTitle', 'buttons'];
  // Private

  @Output() matterDetail: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _mattersService: MattersService, public dialog: MatDialog) { }



  ngOnInit(): void {
    this._mattersService.getMatters().subscribe(response => {
      this.mattersData = response;
      // console.log(response);
    });
  }
  ngOnDestroy(): void { }

  editmatter(matters) {
    this.matterDetail.emit(matters);
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = { 'data': this.displayedColumns, 'type': 'matters' };
    //open pop-up
    const dialogRef = this.dialog.open(SortingDialogComponent, dialogConfig);
    //Save button click
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

}
