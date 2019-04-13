import { Injectable, ɵConsole } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddContactService {

  constructor(private http: HttpClient) { }

  AddContactData(val) {
    this.http.post(environment.APIEndpoint + 'SetContact', val)
      .subscribe(res => console.log(res));
  }

}
