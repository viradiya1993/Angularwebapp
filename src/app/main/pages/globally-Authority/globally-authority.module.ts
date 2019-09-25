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
// import { MainAuthoritiesComponent } from './main-authorities.component';
import {MatTreeModule} from '@angular/material/tree';
// import { AuthorityDialogComponent } from './authority-dialog/authority-dialog.component';
// import { TopicComponent } from './topic/topic.component';
import { GloballyAuthorityComponent } from './globally-authority.component';
import { MainAuthoritiesComponent } from './main-authorities/main-authorities.component';
import { AuthorityDialogComponent } from './main-authorities/authority-dialog/authority-dialog.component';
import { TopicDialogComponent } from './main-authorities/topic/topic-dialog/topic-dialog.component';
import { TopicComponent } from './main-authorities/topic/topic.component';
// import { MainAuthoritiesComponent } from '../main-authorities/main-authorities.component';
// import { TopicComponent } from '../main-authorities/topic/topic.component';
// import { AuthorityDialogComponent } from '../main-authorities/authority-dialog/authority-dialog.component';
// import { TopicDialogComponent } from '../main-authorities/topic/topic-dialog/topic-dialog.component';
// const routes = [
//   { path: 'authorities/authorities', component: MainAuthoritiesComponent, canActivate: [AuthGuard] },
//   { path: 'authorities/topic', component: TopicComponent, canActivate: [AuthGuard] },
// ];
const routes = [
    { path: '', redirectTo: '/authorities/authorities', pathMatch: 'full', canActivate: [AuthGuard] },
    {
      path: '', component: GloballyAuthorityComponent, children: [
        { path: 'authorities', component: MainAuthoritiesComponent },
        { path: 'topic', component: TopicComponent },
      ], canActivate: [AuthGuard]
  }
  ];
@NgModule({
  declarations: [GloballyAuthorityComponent,MainAuthoritiesComponent,AuthorityDialogComponent,TopicComponent,TopicDialogComponent],
  entryComponents: [AuthorityDialogComponent,TopicDialogComponent],
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
    MainAuthoritiesComponent
  ],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ],
})
export class GloballyAuthorityModule { }
