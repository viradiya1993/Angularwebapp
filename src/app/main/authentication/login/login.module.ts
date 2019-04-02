import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatDividerModule, MatProgressSpinnerModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from 'app/main/authentication/login/login.component';

import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDividerModule,
    MatProgressSpinnerModule,

    FuseSharedModule,
    HttpClientModule
  ]
})
export class LoginModule { }
