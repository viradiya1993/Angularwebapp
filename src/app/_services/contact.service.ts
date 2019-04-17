import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  getdata: any;

  constructor(private http: HttpClient, private toastr: ToastrService, ) { }


  ContactData(d) {
    return this.http.post<any>(environment.APIEndpoint + 'GetContact', d);
  }

  //get data for popup
  getContact(val) {
    return this.http.post<any>(environment.APIEndpoint + 'GetContact', val);
  }

  AddContactData(val) {
    return this.http.post<any>(environment.APIEndpoint + 'SetContact', val);
  }

}
