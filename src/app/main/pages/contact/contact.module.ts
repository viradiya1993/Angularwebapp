import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { AuthGuard } from '../../../_guards';

import { ContactComponent } from './contact.component';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';


import { MatDialogModule, MatTabsModule, MatPaginatorModule, MatProgressSpinnerModule, MatButtonModule, MatSelectModule, MatCardModule, MatSlideToggleModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule } from '@angular/material';
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
    MatRippleModule,
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
    MatProgressSpinnerModule
  ],
  exports: [
    ContactComponent
  ],
  entryComponents: [ContactDialogComponent, ContactCorresDetailsComponent]
})
export class ContactModule { }
