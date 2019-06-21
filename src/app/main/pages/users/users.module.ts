import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../../../_guards';
import { RouterModule } from '@angular/router';


import { UsersComponent } from './users.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { FeeEarnerComponent } from './user-dialog/fee-earner/fee-earner.component';
import { SecurityComponent } from './user-dialog/security/security.component';
import { InfotrackComponent } from './user-dialog/infotrack/infotrack.component';
import { BudgetsComponent,UserBudget} from './user-dialog/budgets/budgets.component';


import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import {MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatInputModule, MatMenuModule, MatTableModule, MatToolbarModule, MatSlideToggleModule, MatCardModule, MatSelectModule, MatPaginatorModule, MatAutocompleteModule, MatTabsModule, MatProgressSpinnerModule, MatDialogModule } from '@angular/material';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
//import { SpendMoneyAddComponent } from './spend-money-add-dialog/spend-money-add.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';

import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTreeModule} from '@angular/material/tree';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSortModule} from '@angular/material/sort';





const routes = [
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },

];
@NgModule({  
  declarations: [
    UsersComponent,
    UserDialogComponent,
    FeeEarnerComponent,
    SecurityComponent,
    InfotrackComponent,
    BudgetsComponent,
    UserBudget
  
   // SpendMoneyAddComponent,    
  ],
  entryComponents: [
    UsersComponent,
    UserDialogComponent,
    BudgetsComponent,
    UserBudget
   // SpendMoneyAddComponent,
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
    DragDropModule,
    MatExpansionModule,
    MatRadioModule,
    // N level tree checkbox
    MatTreeModule,
    BrowserAnimationsModule,
    CdkTableModule,
    CdkTreeModule,
    ScrollDispatchModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatSortModule
   
  ],
  exports: [
    UsersComponent,
    MatTreeModule,
    CdkTableModule,
    CdkTreeModule,
    ScrollDispatchModule,
    MatDatepickerModule
  ],
  bootstrap: [UserBudget],
})
export class UsersModule { }
