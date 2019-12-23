import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../../../_guards';
import { RouterModule } from '@angular/router';

import { SettingSidebarComponent } from './setting-sidebar/setting-sidebar.component';
import { SystemSettingComponent } from './system-setting.component';
import { DefultsComponent } from './defaults/defaults.component';
import { NameComponent } from './name/name.component';
import { BusinessComponent } from './business/business.component';
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
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
//import { SpendMoneyAddComponent } from './spend-money-add-dialog/spend-money-add.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { EstimatesSettingComponent } from './estimates-setting/estimates-setting.component';
import { ReginoalSettingComponent } from './regional-setting/reginoal-setting.component';
import { TrustComponent } from './trust/trust.component';
import { TemplatesComponent } from './templates/templates.component';
import { GenerateTemplatesDialoagComponent } from './templates/gennerate-template-dialoag/generate-template.component';
import { MatSortModule } from '@angular/material/sort';
import { AccountComponent } from './account/account.component';
import { AccountDialogComponent } from './account/account-edit-dialog/account-dialog.component';
import { AccountInnerDialogComponent } from './account/account-edit-dialog/account-inner-dialoge/account-inner-dialog.component';
// import { AccountInnerDialogComponent } from './account/account-edit-dialog/account-inner-dialog/account-inner-dialog.component';
import { MatTreeModule } from '@angular/material/tree';
const routes = [
  { path: 'system-setting/name', component: SystemSettingComponent, canActivate: [AuthGuard] },
  // { path: 'system-setting/name', component: SystemSettingComponent },
  { path: 'system-setting/business', component: SystemSettingComponent },
  { path: 'system-setting/defaults', component: SystemSettingComponent },
  { path: 'system-setting/reginoal', component: SystemSettingComponent },
  { path: 'system-setting/trust', component: SystemSettingComponent },
  { path: 'system-setting/templates', component: SystemSettingComponent },
  { path: 'system-setting/estimates', component: SystemSettingComponent },
  { path: 'system-setting/account', component: SystemSettingComponent },
];
@NgModule({
  declarations: [
    SystemSettingComponent,
    GenerateTemplatesDialoagComponent,
    NameComponent,
    SettingSidebarComponent,
    BusinessComponent,
    DefultsComponent,
    EstimatesSettingComponent,
    ReginoalSettingComponent,
    TrustComponent,
    TemplatesComponent,
    AccountComponent,
    AccountDialogComponent,
    AccountInnerDialogComponent
    // SpendMoneyAddComponent,    
  ],
  entryComponents: [
    SystemSettingComponent,
    GenerateTemplatesDialoagComponent,
    AccountDialogComponent,
    AccountInnerDialogComponent
    // SpendMoneyAddComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    MatTreeModule,

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
    MatSortModule

  ],
  exports: [
    SystemSettingComponent,
    GenerateTemplatesDialoagComponent,
    AccountDialogComponent,
    AccountInnerDialogComponent,
    MatTreeModule


  ],
  bootstrap: [AccountInnerDialogComponent],
})
export class SystemSettingModule { }
