import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ContactModule } from './contact/contact.module';
import { MattersModule } from './matters/matters.module';
import { TimeEntriesModule } from './time-entries/time-entries.module';
import { DiaryModule } from './diary/diary.module';
import { InvoiceModule } from './invoice/invoice.module';
import { SpendMoneyModule } from './spend-money/spend-money.module';

const appRoutes: Routes = [
  { path: 'matters', loadChildren: './matters/matters.module#MattersModule' },
  { path: 'time-billing', loadChildren: './time-billing/time-billing.module#TimeBillingModule' },
  { path: 'legal-details', loadChildren: './legal-details/legal-details.module#LegalDetailsModule' },
  { path: 'time-entries', loadChildren: './time-entries/time-entries.module#TimeEntriesModule' },
  { path: 'invoice', loadChildren: './invoice/invoice.module#InvoiceModule' },
  { path: 'spend-money', loadChildren: './spend-money/spend-money.module#SpendMoneyModule' },
  { path: 'diary', loadChildren: './diary/diary.module#DiaryModule' }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    ContactModule,
    MattersModule,
    TimeEntriesModule,
    DiaryModule,
    InvoiceModule,
    SpendMoneyModule,
  ]
})
export class PagesModule { }  
