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
import {MatSortModule} from '@angular/material/sort';

const routes = [
  { path: '', component: TemplateComponent, canActivate: [AuthGuard] },
  { path: 'create-document/matter', component: TemplateComponent },
  { path: 'create-document/invoice', component: TemplateComponent },


];
@NgModule({
  declarations: [TemplateComponent, MatterContactDailogComponent,MatterDialogComponentForTemplate],
  entryComponents: [MatterContactDailogComponent,MatterDialogComponentForTemplate],
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
    MatSortModule
  ],
  exports: [
    TemplateComponent
  ],
  providers: [ TemplateComponent ]
})
export class TemplateModule { }

