import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { AuthGuard } from '../../../_guards';

import { TimeEntriesComponent } from './../time-entries/time-entries.component';

//import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
// import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule } from 'saturn-datepicker';
// import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker'
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/date.adapter';



import { MatDialogModule, MatTabsModule, MatProgressSpinnerModule, MatPaginatorModule, MatButtonModule, MatSelectModule, MatCardModule, MatSlideToggleModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule, MatAutocompleteModule, MatDividerModule } from '@angular/material';

import { TimeEntryDialogComponent } from './time-entry-dialog/time-entry-dialog.component';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
import { MatterDialogComponent } from './matter-dialog/matter-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NumericDirective } from './time-entry-dialog/numericValidation.component';
import { MatSortModule } from '@angular/material/sort';
import { ResumeTimerComponent } from './resume-timer/resume-timer.component';
import { WriteOffTimeEntryComponent } from './write-off-time-entry/write-off-time-entry.component';
const routes = [
  { path: '', component: TimeEntriesComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    TimeEntriesComponent,
    TimeEntryDialogComponent,
    MatterDialogComponent,
    NumericDirective,
    ResumeTimerComponent,
    WriteOffTimeEntryComponent
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
    MatDividerModule,

    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    SatDatepickerModule, SatNativeDateModule,

    MaterialTimePickerModule,
    DragDropModule,
    MatSortModule
  ],
  // providers: [
  //   // {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
  //   // {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  // ],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
  entryComponents: [
    TimeEntryDialogComponent,
    MatterDialogComponent,
    ResumeTimerComponent,
    WriteOffTimeEntryComponent
  ],
  exports: [
    TimeEntriesComponent
  ],
})
export class TimeEntriesModule { }
