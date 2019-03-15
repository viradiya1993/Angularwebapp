import { NgModule } from '@angular/core';

import { LoginModule } from 'app/main/authentication/login/login.module';
import { ForgotPasswordModule } from 'app/main/authentication/forgot-password/forgot-password.module';

@NgModule({
  declarations: [],
  imports: [
    // Authentication
    LoginModule,
    ForgotPasswordModule
  ]
})
export class AuthenticationModule { }
