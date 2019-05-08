import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard } from '../../../_guards';

import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { MattersComponent } from './matters.component';
import { MatButtonModule, MatPaginatorModule, MatDividerModule, MatDialogModule, MatCheckboxModule, MatTabsModule, MatExpansionModule, MatSlideToggleModule, MatCardModule, MatSelectModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule, MatProgressSpinnerModule } from '@angular/material';
import { MattersListComponent } from './matters-list/matters-list.component';
import { MattersSortDetailComponent } from './matters-sort-detail/matters-sort-detail.component';
import { MattersDetailComponent } from './matters-detail/matters-detail.component';
import { MatterPopupComponent } from './matter-popup/matter-popup.component';
import { GeneralComponent } from './matter-popup/general/general.component';
import { ClientComponent } from './matter-popup/client/client.component';
import { RatesComponent } from './matter-popup/rates/rates.component';
import { DetailsComponent } from './matter-popup/details/details.component';
import { OthersComponent } from './matter-popup/others/others.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';

const routes = [
  { path: '', component: MattersComponent, canActivate: [AuthGuard] },
  { path: ':id/details', component: MattersDetailComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    MattersComponent,
    MattersListComponent,
    MattersSortDetailComponent,
    MattersDetailComponent,
    MatterPopupComponent,
    GeneralComponent,
    ClientComponent,
    RatesComponent,
    DetailsComponent,
    OthersComponent
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
    // MatRippleModule,
    MatTableModule,
    MatToolbarModule,
    MatSelectModule,
    MatCardModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatTabsModule,
    MatPaginatorModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatGridListModule,
    MatRadioModule,
  ],
  exports: [
    MattersComponent
  ]
})
export class MattersModule { }
