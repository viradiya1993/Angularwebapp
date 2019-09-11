import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordModule } from 'app/main/authentication/forgot-password/forgot-password.module';
import { LoginModule } from 'app/main/authentication/login/login.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatIconModule, MatDividerModule, MatProgressSpinnerModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';


const appRoutes: Routes = [
  { path: '', loadChildren: './login/login.module#LoginModule' },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule' }
];

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    // Authentication
    RouterModule.forChild(appRoutes),
    LoginModule,
    ForgotPasswordModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    FuseSharedModule,
  ]
})

export class AuthenticationModule { }
