import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { User } from '../_models';
import { ToastrService } from 'ngx-toastr';
import { SpendMoneyAddComponent } from 'app/main/pages/spend-money/spend-money-add-dialog/spend-money-add.component';
import { MatDialogRef } from '@angular/material';
import { BehaviorService } from './Behavior.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient, private router: Router, private toastr: ToastrService,
        public behaviorService: BehaviorService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(uesrname: string, password: string, ipAddress: any, BROWSER: any, OPERATINGSYSTEM: any, USERAGENT: any) {
        let detail = {
            user: uesrname, password: password, formatting: 'JSON', EmailAddress: "", SessionToken: "", IPADDRESS: ipAddress, BROWSER: BROWSER, USERAGENT: USERAGENT, OPERATINGSYSTEM: OPERATINGSYSTEM
        };
        return this.http.post<any>(environment.APIEndpoint + 'login', detail).pipe(map(loginResponse => {
            if (loginResponse && loginResponse.CODE == 200 && loginResponse.STATUS == "success") {
                let LoggedInStatus = loginResponse.DATA.LOGGEDINSTATUS;
                if (LoggedInStatus) {
                    localStorage.setItem('Login_response', JSON.stringify(loginResponse.DATA));
                    localStorage.setItem('session_token', loginResponse.DATA.SESSIONTOKEN);
                    this.currentUserSubject.next(loginResponse.DATA);
                    this.toastr.success('success');
                    return true;
                }
            }
        }));
    }
    changePassword(postData) {
        if (postData == null) {
            postData = {};
        }
        return this.http.post<any>(environment.APIEndpoint + 'login', postData);
    }
    notLogin() {
        const currentUser = this.currentUserValue;
        if (currentUser) {
            return false;
        }
        // Not logged in so return true
        return true;
    }
    logout() {
        // remove user from local storage to log user out
        this.http.post<any>(environment.APIEndpoint + 'Login', { request: 'Logout' }).subscribe(loginResponse => {
            this.behaviorService.dialogClose(loginResponse);
            this.removeDataFunction(loginResponse);
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });
    }
    MaintainLicence() {
        let TimeVal: any = localStorage.getItem('currentTime');
        if (new Date().getTime() > TimeVal) {
            let currentTime: any = new Date();
            currentTime.setMinutes(currentTime.getMinutes() + 1);
            localStorage.setItem('currentTime', currentTime.getTime());
            // remove user from local storage to log user out
            this.http.post<any>(environment.APIEndpoint + 'Login', { request: 'maintainlicence' }).subscribe(loginResponse => {
                this.behaviorService.dialogClose(loginResponse);
                if (loginResponse.MESSAGE == 'Not logged in') {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('app_permissions');
                    localStorage.removeItem('session_token');
                    this.currentUserSubject.next(null);
                    this.router.navigate(['login']);
                }
            }, error => {
                console.log(error);
                this.toastr.error(error);
            });
        } else {
            return true;
        }
    }
    removeDataFunction(loginResponse) {
        if (loginResponse.MESSAGE == 'Not logged in') {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('app_permissions');
            localStorage.removeItem('session_token');
            this.currentUserSubject.next(null);
            this.router.navigate(['login']);
        } else if (loginResponse.CODE != 402 && loginResponse.STATUS != 'error') {
            this.toastr.success('success');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('app_permissions');
            localStorage.removeItem('session_token');
            this.currentUserSubject.next(null);
            this.router.navigate(['login']);
        }
    }
    ForcLogout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('app_permissions');
        localStorage.removeItem('session_token');
        this.currentUserSubject.next(null);
        this.router.navigate(['login']);
    }

    forgetpassword(email: string) {
        return this.http.post<any>(environment.APIEndpoint + 'Login?Request=ForgottenPassword&EmailAddress=' + email, '').pipe(map(loginResponse => {
            if (loginResponse.CODE == 200 && loginResponse.STATUS == 'success') {
                this.toastr.success('We send forgot password link to your mail.');
                this.router.navigate(['login']);
            }
        }));
    }
}
