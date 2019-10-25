import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../../../_guards';
import { RouterModule } from '@angular/router';

import { InvoiceComponent } from './invoice.component';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatInputModule, MatMenuModule, MatTableModule, MatToolbarModule, MatSlideToggleModule, MatCardModule, MatSelectModule, MatPaginatorModule, MatAutocompleteModule, MatTabsModule, MatProgressSpinnerModule, MatDialogModule } from '@angular/material';

import { MaterialTimePickerModule } from '@candidosales/material-time-picker';
import { ReceiptDilogComponent } from './receipt-dilog/receipt-dilog.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { InstantInvoiceDailogComponent } from './instant-invoice-dailog/instant-invoice-dailog.component';
import { InvoiceAddDailogComponent } from './invoice-add-dailog/invoice-add-dailog.component';
import { InvoiceDialogComponentForTemplate } from './select-invoice-dialog/select-invoice-dialog.component';
import { SummaryComponent } from './invoice-add-dailog/summary/summary.component';
import { DetailsComponent } from './invoice-add-dailog/details/details.component';
import { DiscountIncreaseComponent } from './invoice-add-dailog/discount-increase/discount-increase.component';
import { MatDividerModule } from '@angular/material/divider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSortModule } from '@angular/material/sort';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker'
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/date.adapter';
import { WriteOffInvoiceComponent } from './newWriteOffInvoice/newWriteOffInvoice.component';
import { InvoiceNumberPipe } from './invoicenumber.pipe'
import { GenerateInvoiceComponent } from './generate-invoice/generate-invoice.component';
import { ApplicationPipesModule } from '../application-pipes.module';

const routes = [
  { path: '', component: InvoiceComponent, canActivate: [AuthGuard] },

];
@NgModule({
  declarations: [
    InvoiceComponent,
    ReceiptDilogComponent,
    InvoiceDetailComponent,
    InstantInvoiceDailogComponent,
    InvoiceAddDailogComponent,
    InvoiceDialogComponentForTemplate,
    SummaryComponent,
    DetailsComponent,
    DiscountIncreaseComponent,
    WriteOffInvoiceComponent,
    InvoiceNumberPipe,
    GenerateInvoiceComponent
  ],
  entryComponents: [
    ReceiptDilogComponent,
    InvoiceDetailComponent,
    InstantInvoiceDailogComponent,
    InvoiceAddDailogComponent,
    InvoiceDialogComponentForTemplate,
    WriteOffInvoiceComponent,
    GenerateInvoiceComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    SatDatepickerModule,
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
    MatDividerModule,

    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    SatDatepickerModule, SatNativeDateModule,

    MaterialTimePickerModule,
    MatCheckboxModule,
    DragDropModule,
    MatSortModule,
    ApplicationPipesModule
  ],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
  exports: [
    InvoiceComponent
  ]
})
export class InvoiceModule { }
