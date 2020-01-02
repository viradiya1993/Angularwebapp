import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColorPickerModule } from 'ngx-color-picker';
import { CalendarModule as AngularCalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule } from '@fuse/components';
import { MatTabsModule } from '@angular/material/tabs';
import { DiaryComponent } from './diary.component';
import { AuthGuard } from 'app/_guards';
import { EventFormComponent } from './event-form/event-form.component';
import { DiaryService } from './diary.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { DairyDailogComponent } from './dairy-dailog/dairy-dailog.component';
import { DetailsComponent } from './dairy-dailog/details/details.component';
import { RecurrancePatternComponent } from './dairy-dailog/recurrance-pattern/recurrance-pattern.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CreateDiaryComponent } from './create-diary/create-diary.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker'
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/date.adapter';
import { ApplicationPipesModule } from '../application-pipes.module';

// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
const routes = [
  {
    path: '',
    component: DiaryComponent,
    children: [], resolve: {
      chat: DiaryService
    }, canActivate: [AuthGuard]
  },
  { path: 'diary/create-diary', component: CreateDiaryComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    DiaryComponent,
    CreateDiaryComponent,
    EventFormComponent,
    DairyDailogComponent,

    DetailsComponent,
    RecurrancePatternComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatButtonModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatTableModule,
    SatDatepickerModule, SatNativeDateModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    DragDropModule,
    ApplicationPipesModule,

    //for  time picker web 6 
    // NgbModule,
    // NgbPaginationModule, NgbAlertModule,


    AngularCalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ColorPickerModule,

    FuseSharedModule,
    FuseConfirmDialogModule,
    MatSortModule
  ],
  exports: [
    DiaryComponent
  ],
  providers: [
    DiaryService,

  ],
  entryComponents: [
    EventFormComponent,
    DairyDailogComponent
  ],
})
export class DiaryModule { }
