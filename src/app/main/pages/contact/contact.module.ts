import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { AuthGuard } from '../../../_guards';

import { ContactComponent } from './contact.component';
import { ContactsService } from './contacts.service';

import { ContactsContactListComponent } from './contact-list/contact-list.component';
import { FinalSidebarComponent } from './final-sidebar/final-sidebar.component';

import { MatButtonModule, MatSelectModule, MatCardModule, MatSlideToggleModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule } from '@angular/material';
const routes = [
  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    ContactComponent,
    ContactsContactListComponent,
    FinalSidebarComponent,
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

    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule
  ],
  exports: [
    ContactComponent
  ]
})
export class ContactModule { }
