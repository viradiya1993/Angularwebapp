import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { User } from '../_models';
import { RequestOptions } from '@angular/http';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        let Loginapi = "https://api.silq.com.au/login";
        let detail = {
            user: username, password: password, formatting: 'JSON', EmailAddress: "", SessionToken: ""
        };
        const httpOptions = {
            headers: new HttpHeaders().set("Content-Type", "application/json").set("apikey", "SNGMTUEEB2AJBFC9")
        };
        return this.http.post<any>(Loginapi, detail, httpOptions).pipe(map(user => {
            console.log(user);
            if (user && user.SessionToken) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
            }
            return user;
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
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['login']);
    }
}