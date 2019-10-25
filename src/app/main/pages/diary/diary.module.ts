import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { MatButtonModule, MatSelectModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSlideToggleModule, MatToolbarModule, MatTooltipModule, MatProgressSpinnerModule } from '@angular/material';
import { ColorPickerModule } from 'ngx-color-picker';
import { CalendarModule as AngularCalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule } from '@fuse/components';
import { MatTabsModule } from '@angular/material';
import { DiaryComponent } from './diary.component';
import { AuthGuard } from 'app/_guards';
import { EventFormComponent } from './event-form/event-form.component';
import { DiaryService } from './diary.service';
import { MatTableModule, MatPaginatorModule } from '@angular/material'
import { MatSortModule } from '@angular/material/sort';
import { DairyDailogComponent } from './dairy-dailog/dairy-dailog.component';
import { DetailsComponent } from './dairy-dailog/details/details.component';
import { RecurrancePatternComponent } from './dairy-dailog/recurrance-pattern/recurrance-pattern.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CreateDiaryComponent } from './create-diary/create-diary.component';
import { MatNativeDateModule } from '@angular/material';
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
