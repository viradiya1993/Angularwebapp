import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordModule } from 'app/main/authentication/forgot-password/forgot-password.module';
import { LoginModule } from 'app/main/authentication/login/login.module';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseSharedModule } from '@fuse/shared.module';


const appRoutes: Routes = [
  { path: '', loadChildren: './login/login.module#LoginModule' },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule' }
];

@NgModule({
  declarations: [],
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
