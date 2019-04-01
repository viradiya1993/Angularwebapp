import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private httpOptions = { headers: new HttpHeaders().set("Content-Type", "application/json").set("apikey", environment.APIKEY) };

    constructor(private http: HttpClient, private router: Router) {
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
        return this.http.post<any>(environment.APIEndpoint + 'login', detail, this.httpOptions).pipe(map(user => {
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