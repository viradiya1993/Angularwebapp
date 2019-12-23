import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { AuthGuard } from '../../../_guards';

import { ContactComponent } from './contact.component';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';


import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
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
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';

import { PersonComponent } from './contact-dialog/person/person.component';
import { PhComponent } from './contact-dialog/ph/ph.component';
import { AddressComponent } from './contact-dialog/address/address.component';
import { IdComponent } from './contact-dialog/id/id.component';
import { OtherComponent } from './contact-dialog/other/other.component';

import { FormsModule } from '@angular/forms';
import { CompanyComponent } from './contact-dialog/company/company.component';

import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { ContactCorresDetailsComponent } from './contact-corres-details/contact-corres-details.component';
import { ContactSelectDialogComponent } from './contact-select-dialog/contact-select-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSortModule } from '@angular/material/sort';
import { ApplicationPipesModule } from '../application-pipes.module';
const routes = [
  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    ContactComponent,
    ContactDialogComponent,
    PersonComponent,
    PhComponent,
    AddressComponent,
    IdComponent,
    OtherComponent,
    CompanyComponent,
    ContactCorresDetailsComponent,
    ContactSelectDialogComponent,


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
    MatProgressSpinnerModule,
    MatPaginatorModule,
    ScrollDispatchModule,
    MatTabsModule,
    MatDialogModule,

    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatProgressSpinnerModule,
    DragDropModule,
    MatSortModule,
    ApplicationPipesModule
  ],
  exports: [
    ContactComponent
  ],
  entryComponents: [ContactDialogComponent, ContactCorresDetailsComponent, ContactSelectDialogComponent]
})
export class ContactModule { }
