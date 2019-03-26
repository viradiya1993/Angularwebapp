import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { AuthGuard } from '../../../_guards';

import { DiaryComponent } from './diary.component';
import { EventFormComponent } from './event-form/event-form.component';
import { MatIconModule } from '@angular/material';

const routes = [
  { path: '', component: DiaryComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    DiaryComponent,
    EventFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,

    //Material element
    MatIconModule
  ],
  exports: [
    DiaryComponent
  ]
})
export class DiaryModule { }
