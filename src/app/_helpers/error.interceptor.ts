import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
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
                    if (evt.body.CODE == 200 && (evt.body.STATUS == "success" || evt.body.RESPONSE == "success" || evt.body.STATUS == "OK")) {
                        return true;
                    } else if (evt.body.CODE == 200 && evt.body.STATUS != "success") {
                        this.toasterService.error(evt.body.STATUS);
                    } else if (evt.body.CODE == 450 && evt.body.STATUS == "error") {
                        let bodyData = evt.body.DATA.VALIDATIONS;
                        let errorData: any = [];
                        let warningData: any = [];
                        bodyData.forEach(function (value) {
                            if (value.VALUEVALID == 'NO')
                                errorData.push(value.ERRORDESCRIPTION);
                            else if (value.VALUEVALID == 'WARNING')
                                warningData.push(value.ERRORDESCRIPTION);
                        });
                        if (Object.keys(errorData).length != 0)
                            this.toasterService.error(errorData);
                        if (Object.keys(warningData).length != 0)
                            this.toasterService.warning(warningData);
                    } else if ((evt.body.CODE > 400 && evt.body.CODE < 499) && (evt.body.STATUS == "error" || evt.body.RESPONSE == "error")) {
                        this.toasterService.error(evt.body.MESSAGE);
                        if (evt.body.MESSAGE == "Not logged in") {
                            this.authenticationService.ForcLogout();
                        }
                    }
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