import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { AuthGuard } from '../../../_guards';

import { TimeEntriesComponent } from './../time-entries/time-entries.component';

import { MatDialogModule,MatTabsModule,MatPaginatorModule,MatButtonModule, MatSelectModule, MatCardModule, MatSlideToggleModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule } from '@angular/material';
const routes = [
    { path: '', component: TimeEntriesComponent, canActivate: [AuthGuard] }
  ];
  
  @NgModule({
    declarations: [
        TimeEntriesComponent,
    ],
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      FuseSharedModule,
      //mat import
      MatButtonModule,
      MatCheckboxModule,
      MatDatepickerModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatMenuModule,
      MatRippleModule,
      MatTableModule,
      MatToolbarModule,
      MatSlideToggleModule,
      MatCardModule,
      MatSelectModule,
      MatPaginatorModule,
      MatTabsModule,
      MatDialogModule,
  
      FuseSharedModule,
      FuseConfirmDialogModule,
      FuseSidebarModule
    ],
    exports: [
        TimeEntriesComponent
    ],
  })
  export class TimeEntriesModule { }
  