import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../../../_guards';
import { RouterModule } from '@angular/router';

import { EmailTempleteComponent } from './email-templete.component';
import { EmailDailogComponent } from './email-dailog/email-dailog.component';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import {MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatInputModule, MatMenuModule, MatTableModule, MatToolbarModule, MatSlideToggleModule, MatCardModule, MatSelectModule, MatPaginatorModule, MatAutocompleteModule, MatTabsModule, MatProgressSpinnerModule, MatDialogModule } from '@angular/material';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker'
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/date.adapter';

import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTreeModule} from '@angular/material/tree';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSortModule} from '@angular/material/sort';
import { CKEditorModule } from 'ckeditor4-angular';

const routes = [
    { path: 'email-templete', component: EmailTempleteComponent, canActivate: [AuthGuard] },
  
 ];

@NgModule({  
    declarations: [
        EmailTempleteComponent,
        EmailDailogComponent
    ],
    entryComponents: [EmailDailogComponent],
    imports: [
      CommonModule,
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
      MatExpansionModule,
      MatRadioModule,
      // N level tree checkbox
      MatTreeModule,
      BrowserAnimationsModule,
      CdkTableModule,
      CdkTreeModule,
      ScrollDispatchModule,
      MatNativeDateModule,
      ReactiveFormsModule,
      MatSortModule,
      CKEditorModule
     
    ],
    exports: [
      MatTreeModule,
      CdkTableModule,
      CdkTreeModule,
      ScrollDispatchModule,
      MatDatepickerModule
    ],
    providers: [
      {provide: DateAdapter, useClass: AppDateAdapter},
      {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
    ],
    bootstrap: [],
  })
  export class EmailTemplete { }