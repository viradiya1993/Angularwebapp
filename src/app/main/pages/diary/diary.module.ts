import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { MatButtonModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSlideToggleModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { ColorPickerModule } from 'ngx-color-picker';
import { CalendarModule as AngularCalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule } from '@fuse/components';

import { DiaryComponent } from './diary.component';
import { AuthGuard } from 'app/_guards';
import { EventFormComponent } from './event-form/event-form.component';
import { DiaryService } from './diary.service';


const routes = [
  {
    path: '',
    component: DiaryComponent,
    children: [], resolve: {
      chat: DiaryService
    }, canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    DiaryComponent,
    EventFormComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatTooltipModule,

    AngularCalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ColorPickerModule,

    FuseSharedModule,
    FuseConfirmDialogModule
  ],
  exports: [
    DiaryComponent
  ],
  providers: [
    DiaryService
  ],
  entryComponents: [
    EventFormComponent
  ]
})
export class DiaryModule { }
