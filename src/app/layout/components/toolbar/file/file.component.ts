import { Component, OnInit } from '@angular/core';
import {  ViewEncapsulation, Output, EventEmitter, Injectable, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { MatDialog } from '@angular/material';
import { SystemSettingComponent } from 'app/main/pages/system-settings/system-setting.component';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileComponent implements OnInit {
    appPermissions: any = JSON.parse(localStorage.getItem('app_permissions'));
    constructor(
      public dialog: MatDialog,
    ) { }

  ngOnInit() {
      console.log("file called");
  }
  // SystemSettingpopup(){
  //   const dialogRef = this.dialog.open(SystemSettingComponent, {
  //     disableClose: true,
  //     panelClass: 'contact-dialog',
  //     data: {
  //         action: 'new',
  //     }
  // });
  // dialogRef.afterClosed().subscribe(result => {
  //     if (result)
  //         $('#refreshContactTab').click();
  // });
  // }


}
