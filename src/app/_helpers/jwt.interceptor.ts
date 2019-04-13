import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../_services';
import { environment } from '../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }
    SessionToken: any;
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        let SessionToken = localStorage.getItem('session_token');
        if (currentUser && SessionToken) {
            if (request.method.toLowerCase() === 'post') {
                if (typeof request.body == 'object') {
                    request.body.SessionToken = localStorage.getItem('session_token');
                    request.body.apikey = environment.APIKEY;
                    request.body.formatting = 'JSON';
                    request.body;
                }
            } else if (request.method.toLowerCase() === 'get') {
                request = request.clone({
                    params: request.params.set('SessionToken', localStorage.getItem('session_token'))
                });
            }
        }
        return next.handle(request);
    }
}