import { Injectable, ɵConsole } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddContactService {

  constructor(private http: HttpClient) { }

  AddContactData(val) {
    return this.http.post<any>(environment.APIEndpoint + 'SetContact', val);
  }

}
