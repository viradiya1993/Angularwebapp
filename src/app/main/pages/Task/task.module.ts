import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../../../_guards';
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
import { TaskComponent } from './task.component';
import { TaskDialogeComponent } from './task-dialoge/task-dialoge.component';
const routes = [
 
    { path: '', component: TaskComponent, canActivate: [AuthGuard] },

];
@NgModule({
  declarations: [TaskComponent,TaskDialogeComponent],
  entryComponents: [TaskDialogeComponent],
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
    MatSortModule
  ],
  exports: [
    TaskComponent
  ],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ],
})
export class TaskModule { }
