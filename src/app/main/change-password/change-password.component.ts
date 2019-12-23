import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  isspiner: boolean = false;
  oldhide: boolean = true;
  phide: boolean = true;
  cnhide: boolean = true;

  postData: any = { "request": "ChangePassword", "user": "", "password": "", "NewPassword": "" };
  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.changePasswordForm = this._formBuilder.group({
      username: ['', Validators.required],
      oldpassword: ['', Validators.required],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    });
  }
  get f() {
    return this.changePasswordForm.controls;
  }
  //Save passoword
  updatePassword() {
    if (this.f.password.value != this.f.confirmPassword.value) {
      this.toastr.error('Passwords must match');
      return false;
    }
    this.isspiner = true;
    this.postData.user = this.f.username.value;
    this.postData.password = this.f.oldpassword.value;
    this.postData.NewPassword = this.f.password.value;
    this.authenticationService.changePassword(this.postData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.toastr.success('Password update successfully');
        this.dialogRef.close(true);
        this.authenticationService.ForcLogout();
        localStorage.setItem('session_token', res['DATA'].SESSIONTOKEN);
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      console.log(err);
    });
  }
}
