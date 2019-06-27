import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../../../_guards';
import { RouterModule } from '@angular/router';

import { TemplateComponent } from './template.component';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatInputModule, MatMenuModule, MatTableModule, MatToolbarModule, MatSlideToggleModule, MatCardModule, MatSelectModule, MatPaginatorModule, MatAutocompleteModule, MatTabsModule, MatProgressSpinnerModule, MatDialogModule } from '@angular/material';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
import { MatterContactDailogComponent } from './matter-contact-dailog/matter-contact-dailog.component';
import { MatterDialogComponentForTemplate } from './matter-dialog/matter-dialog.component';
import { MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TemplateListComponent } from './template-list/template-list.component';

const routes = [
  { path: '', redirectTo: '/create-document/matter-template', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '', redirectTo: '/create-document/invoice-template', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '', redirectTo: '/create-document/receive-money-template', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '', redirectTo: '/create-document/contact-template', pathMatch: 'full', canActivate: [AuthGuard] },
  {
    path: '', component: TemplateComponent, children: [
      { path: 'matter-template', component: TemplateListComponent },
      { path: 'invoice-template', component: TemplateListComponent },
      { path: 'receive-money-template', component: TemplateListComponent },
      { path: 'contact-template', component: TemplateListComponent },
      // {
      //   path: 'work-in-progress', component: WorkInProgressComponent, children: [
      //     { path: '', component: EstimateComponent },
      //     { path: 'invoice', component: EstimateComponent },
      //   ]
      // },
      // { path: 'matter-invoices', component: MatterInvoicesComponent },
      // { path: 'receipts-credits', component: ReceiptsCreditsComponent },
      // { path: 'matter-trust', component: MatterTrustComponent },
    ], canActivate: [AuthGuard]
  }
];
@NgModule({
  declarations: [TemplateComponent, MatterContactDailogComponent, MatterDialogComponentForTemplate, TemplateListComponent],
  entryComponents: [MatterContactDailogComponent, MatterDialogComponentForTemplate],
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
    DragDropModule,

    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    SatDatepickerModule, SatNativeDateModule,

    MaterialTimePickerModule,
    MatCheckboxModule,
    MatSortModule
  ],
  exports: [
    TemplateComponent
  ],
  providers: [TemplateComponent]
})
export class TemplateModule { }

