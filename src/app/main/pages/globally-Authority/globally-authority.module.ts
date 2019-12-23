import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../../../_guards';
import { RouterModule } from '@angular/router';


import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
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
    { path: '', redirectTo: '/authorities/full-authorities', pathMatch: 'full', canActivate: [AuthGuard] },
    {
      path: '', component: GloballyAuthorityComponent, children: [
        { path: 'full-authorities', component: MainAuthoritiesComponent },
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
