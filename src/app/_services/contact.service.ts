import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  ContactData(){
    return this.http.get<any>(environment.APIEndpoint + 'GetContact');
  }

  //get data for popup
  getContact(val){
    return this.http.get<any>(environment.APIEndpoint + 'GetContact?ContactGUID='+val);
  }
}
