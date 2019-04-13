import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  ContactData(){
    console.log("lsdhf");
    return this.http.get<any>(environment.APIEndpoint + 'GetContact');
  }

  //get data for popup
  getContact(val){
    
    return this.http.get<any>(environment.APIEndpoint + 'GetContact?ContactGUID='+val);
  }

  //for delete contact

  deleteContact(getContactGuId){
    console.log(getContactGuId);
    this.http.post(environment.APIEndpoint + 'SetContact?FormAction=delete',getContactGuId)
    .subscribe(res => console.log(res));
  }
}
