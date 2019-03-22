import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard } from '../../../_guards';

import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { MattersComponent } from './matters.component';
import { MatButtonModule, MatCheckboxModule, MatSlideToggleModule, MatCardModule, MatSelectModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule } from '@angular/material';
import { MattersListComponent } from './matters-list/matters-list.component';
import { MattersSortDetailComponent } from './matters-sort-detail/matters-sort-detail.component';

const routes = [{
  path: '', component: MattersComponent, canActivate: [AuthGuard]
}];

@NgModule({
  declarations: [
    MattersComponent,
    MattersListComponent,
    MattersSortDetailComponent
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
    MatSlideToggleModule
  ],
  exports: [
    MattersComponent
  ]

})
export class MattersModule { }
