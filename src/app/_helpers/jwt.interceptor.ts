import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }
    SessionToken : any;
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        let SessionToken = localStorage.getItem('session_token');
        if (currentUser && SessionToken) {
            if (request.method.toLowerCase() === 'post') {
                /* if (request.body instanceof FormData) {
                    request = request.clone({
                        setHeaders: {
                            // apikey: `SNGMTUEEB2AJBFC9`
                        },
                        body: request.body.append('SessionToken', localStorage.getItem('session_token'))
                    })
                } */
                if (typeof request.body == 'object') {
                    request.body.SessionToken = localStorage.getItem('session_token');
                    request.body;
                    
                }
            } else if (request.method.toLowerCase() === 'get') {
                request = request.clone({
                    setHeaders: {
                        // apikey: `SNGMTUEEB2AJBFC9`
                    },
                    params: request.params.set('SessionToken', localStorage.getItem('session_token'))
                });
            }
        } else {
            request = request.clone({
                setHeaders: {
                    // apikey: `SNGMTUEEB2AJBFC9`
                }
            });
        }
        return next.handle(request);
    }
}