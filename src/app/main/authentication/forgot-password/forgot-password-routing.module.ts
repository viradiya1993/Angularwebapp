import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotPasswordComponent } from 'app/main/authentication/forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: '', component: ForgotPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotPasswordRoutingModule { }
