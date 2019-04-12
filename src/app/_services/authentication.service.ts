import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { User } from '../_models';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;


    constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(uesrname: string, password: string) {
        let detail = {
            user: uesrname, password: password, formatting: 'JSON', EmailAddress: "", SessionToken: ""
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
    notLogin() {
        const currentUser = this.currentUserValue;
        if (currentUser) {
            this.router.navigate(['matters']);
            return false;
        }
        // not logged in so return true
        return true;
    }
    logout() {
        // remove user from local storage to log user out
        this.http.get<any>(environment.APIEndpoint + 'Login?request=Logout').subscribe(loginResponse => {
            if (loginResponse.MESSAGE == "Not logged in") {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('app_permissions');
                localStorage.removeItem('session_token');
                this.currentUserSubject.next(null);
                this.router.navigate(['login']);
            } else if (loginResponse.CODE != 402 && loginResponse.STATUS != "error") {
                this.toastr.success('success');
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
