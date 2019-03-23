import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ContactModule } from './contact/contact.module';
import { MattersModule } from './matters/matters.module';
import { TimeBillingComponent } from './time-billing/time-billing.component';
import { LegalDetailsComponent } from './legal-details/legal-details.component';
const appRoutes: Routes = [
  {  path: 'matters', loadChildren: './matters/matters.module#MattersModule'}
];


@NgModule({
  declarations: [TimeBillingComponent, LegalDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    ContactModule,
    MattersModule
  ]
})
export class PagesModule { }
