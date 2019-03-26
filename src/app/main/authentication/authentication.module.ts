import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordModule } from 'app/main/authentication/forgot-password/forgot-password.module';
import { LoginModule } from 'app/main/authentication/login/login.module';


const appRoutes: Routes = [
  { path: '', loadChildren: './login/login.module#LoginModule'},
  { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule'}
];

@NgModule({
  declarations: [],
  imports: [
    // Authentication
    RouterModule.forChild(appRoutes),
    LoginModule,
    ForgotPasswordModule
  ]
})

export class AuthenticationModule { }
