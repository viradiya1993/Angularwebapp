import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard } from '../../../_guards';

import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { MattersComponent } from './matters.component';
import { MatButtonModule, MatPaginatorModule, MatDividerModule, MatDialogModule, MatCheckboxModule, MatTabsModule, MatExpansionModule, MatSlideToggleModule, MatCardModule, MatSelectModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule } from '@angular/material';
import { MattersListComponent } from './matters-list/matters-list.component';
import { SortingDialogComponent, filterNames } from '../../sorting-dialog/sorting-dialog.component';
import { MattersSortDetailComponent } from './matters-sort-detail/matters-sort-detail.component';
import { MattersDetailComponent } from './matters-detail/matters-detail.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

const routes = [
  { path: '', component: MattersComponent, canActivate: [AuthGuard] },
  { path: ':id/details', component: MattersDetailComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    MattersComponent,
    MattersListComponent,
    SortingDialogComponent,
    filterNames,
    MattersSortDetailComponent,
    MattersDetailComponent
  ],
  entryComponents: [
    SortingDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    //mat 
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
    MatSelectModule,
    MatCardModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatTabsModule,
    MatPaginatorModule,
    MatDividerModule,
    DragDropModule,
    MatDialogModule
  ],
  exports: [
    MattersComponent,
    SortingDialogComponent
  ]

})
export class MattersModule { }
