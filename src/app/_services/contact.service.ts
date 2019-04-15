import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  ContactData(d) {

    return this.http.post<any>(environment.APIEndpoint + 'GetContact', d);
  }

  //get data for popup
  getContact(val) {

    return this.http.post<any>(environment.APIEndpoint + 'GetContact', val);
  }

  //for delete contact

  deleteContact(getContactGuId) {
    console.log(getContactGuId);
    this.http.post(environment.APIEndpoint + 'SetContact', getContactGuId)
      .subscribe(res => console.log(res));
      localStorage.removeItem('contactGuid');
      
  }

}
