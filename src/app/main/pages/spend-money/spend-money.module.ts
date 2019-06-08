import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../../../_guards';
import { RouterModule } from '@angular/router';

import { SpendMoneyComponent } from './spend-money.component';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatInputModule, MatMenuModule, MatTableModule, MatToolbarModule, MatSlideToggleModule, MatCardModule, MatSelectModule, MatPaginatorModule, MatAutocompleteModule, MatTabsModule, MatProgressSpinnerModule, MatDialogModule } from '@angular/material';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
import { SpendMoneyAddComponent } from './spend-money-add-dialog/spend-money-add.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

const routes = [
  { path: '', component: SpendMoneyComponent, canActivate: [AuthGuard] },

];
@NgModule({  
  declarations: [
    SpendMoneyComponent,
    SpendMoneyAddComponent,    
  ],
  entryComponents: [
    SpendMoneyAddComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,

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
    MatSlideToggleModule,
    MatCardModule,
    MatSelectModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatDialogModule,
    MatProgressSpinnerModule,

    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    SatDatepickerModule, SatNativeDateModule,

    MaterialTimePickerModule,
    MatCheckboxModule,
    DragDropModule
  ],
  exports: [
    SpendMoneyComponent, SpendMoneyAddComponent
  ]
})
export class SpendMoneyModule { }
