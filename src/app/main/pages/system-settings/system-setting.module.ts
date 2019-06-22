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
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatInputModule, MatMenuModule, MatTableModule, MatToolbarModule, MatSlideToggleModule, MatCardModule, MatSelectModule, MatPaginatorModule, MatAutocompleteModule, MatTabsModule, MatProgressSpinnerModule, MatDialogModule } from '@angular/material';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
//import { SpendMoneyAddComponent } from './spend-money-add-dialog/spend-money-add.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import { EstimatesSettingComponent } from './estimates-setting/estimates-setting.component';
import { ReginoalSettingComponent } from './regional-setting/reginoal-setting.component';
import { TrustComponent } from './trust/trust.component';
import { TemplatesComponent } from './templates/templates.component';
import { GenerateTemplatesDialoagComponent } from './templates/gennerate-template-dialoag/generate-template.component';
import {MatSortModule} from '@angular/material/sort';

const routes = [
  { path: 'system-setting/name', component: SystemSettingComponent, canActivate: [AuthGuard] },
  // { path: 'system-setting/name', component: SystemSettingComponent },
  { path: 'system-setting/business', component: SystemSettingComponent },
  { path: 'system-setting/defaults', component: SystemSettingComponent },
  { path: 'system-setting/reginoal', component: SystemSettingComponent },
  { path: 'system-setting/trust',  component: SystemSettingComponent },
  { path: 'system-setting/templates', component: SystemSettingComponent },
  { path: 'system-setting/estimates', component: SystemSettingComponent },
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
    TemplatesComponent
   // SpendMoneyAddComponent,    
  ],
  entryComponents: [
    SystemSettingComponent,
    GenerateTemplatesDialoagComponent
   // SpendMoneyAddComponent,
  ],
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
    MatSortModule
    
  ],
  exports: [
    SystemSettingComponent,
    GenerateTemplatesDialoagComponent
  ]
})
export class SystemSettingModule { }
