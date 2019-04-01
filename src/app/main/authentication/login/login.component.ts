import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { AuthenticationService } from '../../../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations

})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;


  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private http:HttpClient,
  ) {
    // Configure the layout
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };
  }
  //For my Api
   Loginapi="https://api.silq.com.au/login";
  // forgetpassword:"https://api.silq.com.au/Login?Request=ForgottenPassword&EmailAddress=a@b.c";

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.authenticationService.notLogin();  
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }
  loginUser() {
    // this.authenticationService.login(this.f.email.value, this.f.password.value)
    //   .pipe(first()).subscribe(data => {
    //     console.log(data);
    //     this.router.navigate(['matters']);
    //   }, error => {
    //     console.log(error);
    //   });
    const httpOptions = {
      headers: new HttpHeaders().set("Content-Type", "application/json").set("apikey", "SNGMTUEEB2AJBFC9")
    };
    let detail = {
      user:this.f.email.value ,
      password: this.f.password.value,   
      formatting:'JSON',
      EmailAddress:"",
      SessionToken:""
    };
   

   //Api Call
    let obj=this.http.post(this.Loginapi,detail,httpOptions)
    obj.subscribe((res: any) => { 
        console.log(res.login_response);        
        },error => {
          console.log(error);
        });    

        // let data = { "SessionToken": "", "user": "", "password": "a", "formatting": "JSON", "EmailAddress": "" };
        // data.user = username;
        // data.password = password;
        // const httpOptions = {
        //     headers: new HttpHeaders().set("Content-Type", "application/json").set("apikey", "SNGMTUEEB2AJBFC9")
        // };
        // return this.http.post<any>(`https://api.silq.com.au/login`, data, httpOptions).pipe(map(user => {
        //     if (user && user.SessionToken) {
        //         // store user details and jwt token in local storage to keep user logged in between page refreshes
        //         localStorage.setItem('currentUser', JSON.stringify(user));
        //         this.currentUserSubject.next(user);
        //     }
        //     return user;
        // }));
  }

}
