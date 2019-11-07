import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../../../_guards';
import { RouterModule } from '@angular/router';

import { TemplateComponent } from './template.component';
import { MatterContactDailogComponent } from './matter-contact-dailog/matter-contact-dailog.component';
import { MatterDialogComponentForTemplate } from './matter-dialog/matter-dialog.component';
import { EmailTempleteComponent } from './email-templete/email-templete.component';
import { EmailDailogComponent } from './email-templete/email-dailog/email-dailog.component';
import { PacksComponent } from './packs/packs.component';
import { PacksDailogComponent } from './packs/packs-dailog/packs-dailog.component';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatInputModule, MatMenuModule, MatTableModule, MatToolbarModule, MatSlideToggleModule, MatCardModule, MatSelectModule, MatPaginatorModule, MatAutocompleteModule, MatTabsModule, MatProgressSpinnerModule, MatDialogModule } from '@angular/material';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
import { MatTreeModule } from '@angular/material/tree';

import { MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TemplateListComponent } from './template-list/template-list.component';
import { NewPacksDailogComponent } from './packs/new-packs-dailog/new-packs-dailog.component';
import { SetLetterHeadComponent } from './template-list/set-letterhead/set-letterhead.component';
import { EditTemplateComponent } from './template-list/edit-template/edit-template.component';
import { CopyTemplateComponent } from './template-list/copy-template/copy-template.component';
import { FormatVariableComponent } from './template-list/edit-template/insert-with-formating/format-variable.component';
import { NewFieldComponent } from './template-list/edit-template/new-field/new-field.component';
//  import { NgxEditorModule } from 'ngx-editor';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
const routes = [
  { path: '', redirectTo: '/create-document/matter-template', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '', redirectTo: '/create-document/invoice-template', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '', redirectTo: '/create-document/receive-money-template', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '', redirectTo: '/create-document/contact-template', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '', redirectTo: '/create-document/safe-custody-template', pathMatch: 'full', canActivate: [AuthGuard] },

  { path: '', redirectTo: '/create-document/email-matter-template', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '', redirectTo: '/create-document/email-invoice-template', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '', redirectTo: '/create-document/email-contact-template', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '', redirectTo: '/create-document/email-receive-money-template', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '', redirectTo: '/create-document/email-safe-custody-template', pathMatch: 'full', canActivate: [AuthGuard] },

  { path: '', redirectTo: '/create-document/packs', pathMatch: 'full', canActivate: [AuthGuard] },
  {
    path: '', component: TemplateComponent, children: [
      //for template 
      { path: 'matter-template', component: TemplateListComponent },
      { path: 'invoice-template', component: TemplateListComponent },
      { path: 'receive-money-template', component: TemplateListComponent },
      { path: 'contact-template', component: TemplateListComponent },
      { path: 'safe-custody-template', component: TemplateListComponent },

      //for email template
      { path: 'email-matter-template', component: EmailTempleteComponent },
      { path: 'email-invoice-template', component: EmailTempleteComponent },
      { path: 'email-contact-template', component: EmailTempleteComponent },
      { path: 'email-receive-money-template', component: EmailTempleteComponent },
      { path: 'email-safe-custody-template', component: EmailTempleteComponent },

      // { path: 'email-templete', component: EmailTempleteComponent },
      // { path: 'packs', component: PacksComponent },
      { path: 'packs-matter-template', component: PacksComponent },
      { path: 'packs-invoice-template', component: PacksComponent },
      { path: 'packs-contact-template', component: PacksComponent },
      { path: 'packs-receive-money-template', component: PacksComponent },
      { path: 'packs-safe-custody-template', component: PacksComponent },
      { path: 'email-templete', component: EmailTempleteComponent },
      { path: 'packs', component: PacksComponent },
    ], canActivate: [AuthGuard]
  }
];
@NgModule({
  declarations: [EditTemplateComponent,SetLetterHeadComponent,TemplateComponent, MatterContactDailogComponent, MatterDialogComponentForTemplate, TemplateListComponent
    , EmailTempleteComponent, CopyTemplateComponent,EmailDailogComponent, PacksComponent, 
    PacksDailogComponent, NewPacksDailogComponent,FormatVariableComponent,NewFieldComponent],
  
  
    entryComponents: [MatterContactDailogComponent, MatterDialogComponentForTemplate, 
    EmailDailogComponent, PacksDailogComponent,
     NewPacksDailogComponent,SetLetterHeadComponent,EditTemplateComponent,CopyTemplateComponent,FormatVariableComponent,NewFieldComponent],
  imports: [
    // NgxEditorModule,
    CKEditorModule,
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
    DragDropModule,

    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    SatDatepickerModule, SatNativeDateModule,

    MaterialTimePickerModule,
    MatCheckboxModule,
    MatSortModule,
    MatTreeModule

  ],
  exports: [
    TemplateComponent,
    MatTreeModule
  ],
  providers: [TemplateComponent]
})
export class TemplateModule { }

