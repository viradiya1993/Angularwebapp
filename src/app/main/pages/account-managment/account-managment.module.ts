import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../../../_guards';
import { RouterModule } from '@angular/router';



import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatInputModule, MatMenuModule, MatTableModule, MatToolbarModule, MatSlideToggleModule, MatCardModule, MatSelectModule, MatPaginatorModule, MatAutocompleteModule, MatTabsModule, MatProgressSpinnerModule, MatDialogModule } from '@angular/material';
import { MaterialTimePickerModule } from '@candidosales/material-time-picker';

import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatSortModule} from '@angular/material/sort';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker'
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/date.adapter';
import { AccountManagmentComponent } from './account-managment.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { ProductsComponent } from './products/products.component';
import { ReceiptsComponent } from './receipts/receipts.component';
import { PaymentComponent } from './payment/payment.component';
import {MatExpansionModule} from '@angular/material/expansion';

const routes = [
    { path: '', redirectTo: '/account-management/basicinfo', pathMatch: 'full', canActivate: [AuthGuard] },
    {
        path: '', component: AccountManagmentComponent, children: [
          { path: 'basicinfo', component: AccountManagmentComponent },
          { path: 'products', component: AccountManagmentComponent },
          { path: 'receipts', component: AccountManagmentComponent },
          { path: 'payment', component: AccountManagmentComponent },
         
        ], canActivate: [AuthGuard]
      }
//   { path: '', component:AccountManagmentComponent , canActivate: [AuthGuard] },

];
@NgModule({  
  declarations: [
    AccountManagmentComponent,
    BasicInfoComponent,
    ProductsComponent,
    ReceiptsComponent,
    PaymentComponent
  ],
  entryComponents: [

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
    MatSortModule,
    MatExpansionModule
  ],
  exports: [
  
  ],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ],
})
export class AccountManagmentModule { }
