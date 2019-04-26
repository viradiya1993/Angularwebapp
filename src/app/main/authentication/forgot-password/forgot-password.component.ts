import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';

import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from '../../../_services';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  isspiner: boolean = false;
  currentYear: any;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
  ) {
    this.currentYear = new Date().getFullYear();
    // Configure the layout
    this._fuseConfigService.config = {
      layout: { navbar: { hidden: true }, toolbar: { hidden: true }, footer: { hidden: true }, sidepanel: { hidden: true } }
    };
  }

  ngOnInit() {
    this.authenticationService.notLogin();
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

  }
  // convenience getter for easy access to form fields
  get formdata() {
    return this.forgotPasswordForm.controls;
  }

  forgetpassword() {
    this.isspiner = true;
    this.authenticationService.forgetpassword(this.formdata.email.value).pipe(first()).subscribe(data => {
      this.isspiner = false;
    }, error => {
      this.isspiner = false;
      this.toastr.error(error);
    });
  }
}
