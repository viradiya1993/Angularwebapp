import { Component, OnInit } from '@angular/core';
import {  ViewEncapsulation, Output, EventEmitter, Injectable, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { MatDialog } from '@angular/material';
import { SystemSettingComponent } from 'app/main/pages/system-settings/system-setting.component';

@Component({
  selector: 'app-user-tab',
  templateUrl: './user-tab.component.html',
  styleUrls: ['./user-tab.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserTabComponent implements OnInit {
    appPermissions: any = JSON.parse(localStorage.getItem('app_permissions'));
    constructor(
      public dialog: MatDialog,
    ) { }

  ngOnInit() {
     
  }
  
  userclick(){

  }
}
