import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SystemSettingModule } from './system-settings/system-setting.module';
import { UsersModule } from './users/users.module';
import { ContactModule } from './contact/contact.module';
import { MattersModule } from './matters/matters.module';
import { TimeEntriesModule } from './time-entries/time-entries.module';
import { DiaryModule } from './diary/diary.module';
import { InvoiceModule } from './invoice/invoice.module';
import { SpendMoneyModule } from './spend-money/spend-money.module';
import { ReceiveMoneyModule } from './receive-money/receive-money.module';
import { TemplateModule } from './template/template.module';
import { SystemSettingTemplateModule } from './system-settings/templates/templates.module';
import { ActivitiesModule } from './activities/activities.module';
import { SortingDialogModule } from '../sorting-dialog/sorting-dialog.module';
// import { NewfilenoteModule } from './newfilenote/newfilenote.module';
import { DocumentRegitser } from './document-register/document-register.module';
// import { ChartOfAccount } from './chart-account/chart-account.module';
import { ChartOfAccount } from './chart-account/chart-account.module';
import { SelectAccountModule } from './select-account/select-account.module';
import { BankingDialogModule } from './banking/banking-dialog.module';
import { GeneralJoural } from './general-journal/general-journal.module';
import { ConflictCheckModule } from './conflict-check/conflict-check.module';
import { MainAuthoritiesModule } from './main-authorities/main-authorities.module';
import { LegalDetailsModule } from './legal-details/legal-details.module';
import { AccountRecountciliation } from './account-reconciliation/account-reconciliation.module';









const appRoutes: Routes = [
  { path: 'matters', loadChildren: './matters/matters.module#MattersModule' },
  { path: 'time-billing', loadChildren: './time-billing/time-billing.module#TimeBillingModule' },
  { path: 'legal-details', loadChildren: './legal-details/legal-details.module#LegalDetailsModule' },
  { path: 'time-entries', loadChildren: './time-entries/time-entries.module#TimeEntriesModule' },
  { path: 'invoice', loadChildren: './invoice/invoice.module#InvoiceModule' },

  { path: 'authorities', loadChildren: './main-authorities/main-authorities.module#MainAuthoritiesModule' },
  { path: 'searching', loadChildren: './main-searching/main-searching.module#MainSearchingModule' },
  { path: 'spend-money', loadChildren: './spend-money/spend-money.module#SpendMoneyModule' },
  { path: 'receive-money', loadChildren: './receive-money/receive-money.module#ReceiveMoneyModule' },
  { path: 'create-document', loadChildren: './template/template.module#TemplateModule' },
  { path: 'diary', loadChildren: './diary/diary.module#DiaryModule' },
  { path: 'document-register', loadChildren: './document-register/document-register.module#DocumentRegitser' },
  { path: 'chart-account', loadChildren: './chart-account/chart-account.module#ChartOfAccount' },
  { path: 'genral-journal', loadChildren: './general-journal/general-journal.module#GeneralJoural' },
  { path: 'account-reconciliation', loadChildren: './account-reconciliation/account-reconciliation.module#AccountRecountciliation' }

  //added by web 19
  //  { path: ' ', loadChildren: './system-setting/system-settings.module#SystemSettingModule' },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LegalDetailsModule,
    ConflictCheckModule,
    RouterModule.forChild(appRoutes),
    ContactModule,
    SystemSettingModule,
    UsersModule,
    MattersModule,
    TimeEntriesModule,
    DiaryModule,
    InvoiceModule,
    MainAuthoritiesModule,
    SpendMoneyModule,
    ReceiveMoneyModule,
    TemplateModule,
    SystemSettingTemplateModule,
    ActivitiesModule,
    SortingDialogModule,
    BankingDialogModule,
    // NewfilenoteModule,
    DocumentRegitser,
    ChartOfAccount,
    SelectAccountModule,
    GeneralJoural,
    AccountRecountciliation
  ]
})
export class PagesModule { }  
