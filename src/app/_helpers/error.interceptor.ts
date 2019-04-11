import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';

import { AuthenticationService } from '../_services';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        public toasterService: ToastrService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap(evt => {
                if (evt instanceof HttpResponse) {
                    console.log(evt);
                    if (evt.body.CODE == 200 && evt.body.STATUS == "success") {
                        return true;
                    } else if (evt.body.CODE == 402 && evt.body.STATUS == "error") {
                        this.toasterService.error(evt.body.RESPONSEMESSAGE);
                        this.authenticationService.logout();
                        this.router.navigate(['login']);
                    }
                    // else {
                    //     this.toasterService.error(evt.body.MESSAGE);
                    // }
                }
            }),
            catchError(err => {
                if (err.status === 400) {
                    // auto logout if 401 response returned from api
                    this.authenticationService.logout();
                    this.router.navigate(['login']);
                }
                const error = err.error.message || err.statusText;
                return throwError(error);
            })
        )
    }
}