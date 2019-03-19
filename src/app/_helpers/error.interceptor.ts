import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,
        private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                this.router.navigate(['']);
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}