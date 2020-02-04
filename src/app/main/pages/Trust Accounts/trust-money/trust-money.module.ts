import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { AuthGuard } from '../../../_guards';
import { RouterModule } from '@angular/router';


import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatSortModule } from '@angular/material/sort';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker'
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/date.adapter';

import { MatTreeModule } from '@angular/material/tree';
// import { TrustMoneyComponent } from './trust-money/trust-money.component';
// import { TrustMoneyDialogeComponent } from './trust-money/trust-money-dialoge/trust-money-dialoge.component';
// import { TrustEndOfMonthComponent } from './trust-end-of-month/trust-end-of-month.component';
// import { EndOfMonthHistroyComponent } from './trust-end-of-month/end-month-histroy/end-month-histroy.component';
// import { ToDoComponent } from './trust-end-of-month/to-do/to-do.component';
import { AuthGuard } from 'app/_guards';
import { TrustMoneyComponent } from './trust-money.component';
import { TrustMoneyDialogeComponent } from './trust-money-dialoge/trust-money-dialoge.component';
import { ApplicationPipesModule } from '../../application-pipes.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

const routes = [
  { path: 'trust-money', component: TrustMoneyComponent, canActivate: [AuthGuard] }];
@NgModule({
  declarations: [TrustMoneyComponent, TrustMoneyDialogeComponent],
  entryComponents: [TrustMoneyDialogeComponent],
  imports: [
    CommonModule,
    MatTreeModule,
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
    MatSortModule,
    ApplicationPipesModule,
    // FormsModule,
    // ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'})
  ],
  exports: [
    TrustMoneyComponent
  ],
  providers: [
    TrustMoneyComponent,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
})
export class TrustMoneyModule { }
