import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatInputModule, MatMenuModule, MatTableModule, MatToolbarModule, MatSlideToggleModule, MatCardModule, MatSelectModule, MatPaginatorModule, MatAutocompleteModule, MatTabsModule, MatProgressSpinnerModule, MatDialogModule} from '@angular/material';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatSortModule } from '@angular/material/sort';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker'
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/date.adapter';

import {MatTreeModule} from '@angular/material/tree';
import { TrustEndOfMonthComponent } from './trust-end-of-month.component';
import { ToDoComponent } from './to-do/to-do.component';
import { EndOfMonthHistroyComponent } from './end-month-histroy/end-month-histroy.component';
import { AuthGuard } from 'app/_guards';
import { ApplicationPipesModule } from '../../application-pipes.module';

const routes = [
  { path: '', redirectTo: '/trust-end-month/to-do', pathMatch: 'full', canActivate: [AuthGuard] },
  {
    path: '', component: TrustEndOfMonthComponent, children: [
      { path: 'to-do', component: ToDoComponent },
      { path: 'end-month-histroy', component: EndOfMonthHistroyComponent },
    
    ], canActivate: [AuthGuard]
  }
];
@NgModule({
  declarations: [TrustEndOfMonthComponent,EndOfMonthHistroyComponent,ToDoComponent],
  entryComponents: [],
  imports: [
    CommonModule,
    MatTreeModule,
    RouterModule.forRoot(routes),
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
    ApplicationPipesModule

  ],
  exports: [
    RouterModule,
    TrustEndOfMonthComponent
  ],
  providers: [
    TrustEndOfMonthComponent,
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ],
})
export class TrustEndOfMonthModule { }
