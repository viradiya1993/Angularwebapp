import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../../../_guards';
import { RouterModule } from '@angular/router';

import { SettingSidebarComponent } from './setting-sidebar/setting-sidebar.component';
import { SystemSettingComponent } from './system-setting.component';
import { NameComponent } from './name/name.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatInputModule, MatMenuModule, MatTableModule, MatToolbarModule, MatSlideToggleModule, MatCardModule, MatSelectModule, MatPaginatorModule, MatAutocompleteModule, MatTabsModule, MatProgressSpinnerModule, MatDialogModule } from '@angular/material';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
//import { SpendMoneyAddComponent } from './spend-money-add-dialog/spend-money-add.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatExpansionModule} from '@angular/material/expansion';


const routes = [
  { path: 'system-setting', component: SystemSettingComponent, canActivate: [AuthGuard] },

];
@NgModule({  
  declarations: [
    SystemSettingComponent,
    NameComponent,
    SettingSidebarComponent
   // SpendMoneyAddComponent,    
  ],
  entryComponents: [
    SystemSettingComponent
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
    
  ],
  exports: [
    SystemSettingComponent
  ]
})
export class SystemSettingModule { }
