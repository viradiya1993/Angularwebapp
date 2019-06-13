import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { AuthGuard } from '../../../_guards';

import { TimeEntriesComponent } from './../time-entries/time-entries.component';

import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
// import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule } from 'saturn-datepicker';
// import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'




import { MatDialogModule, MatTabsModule, MatProgressSpinnerModule, MatPaginatorModule, MatButtonModule, MatSelectModule, MatCardModule, MatSlideToggleModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule, MatAutocompleteModule } from '@angular/material';

import { TimeEntryDialogComponent } from './time-entry-dialog/time-entry-dialog.component';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
import { MatterDialogComponent } from './matter-dialog/matter-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NumericDirective } from './time-entry-dialog/numericValidation.component';
const routes = [
  { path: '', component: TimeEntriesComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    TimeEntriesComponent,
    TimeEntryDialogComponent,
    MatterDialogComponent,
    NumericDirective
    // SatDatepickerModule,
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
    DragDropModule
  ],
  providers: [
    // {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    // {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  entryComponents: [
    TimeEntryDialogComponent,
    MatterDialogComponent
  ],

  exports: [
    TimeEntriesComponent
  ],
})
export class TimeEntriesModule { }
