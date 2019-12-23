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



import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
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

import { TimeEntryDialogComponent } from './time-entry-dialog/time-entry-dialog.component';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
import { MatterDialogComponent } from './matter-dialog/matter-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NumericDirective } from './time-entry-dialog/numericValidation.component';
import { MatSortModule } from '@angular/material/sort';
import { ResumeTimerComponent } from './resume-timer/resume-timer.component';
import { WriteOffTimeEntryComponent } from './write-off-time-entry/write-off-time-entry.component';
import { ApplicationPipesModule } from '../application-pipes.module';
const routes = [
  // { path: '', component: TimeEntriesComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/time-entries/full-time-entries', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'time-entries/full-time-entries', component: TimeEntriesComponent, canActivate: [AuthGuard] },
  { path: 'time-entries/quick-time-entries', component: TimeEntriesComponent, canActivate: [AuthGuard] },
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
    MatSortModule,
    ApplicationPipesModule
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
