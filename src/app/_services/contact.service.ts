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
    
    return this.http.post<any>(environment.APIEndpoint + 'GetContact',val);
  }

  //for delete contact

  deleteContact(getContactGuId){
    console.log(getContactGuId);
    this.http.post(environment.APIEndpoint + 'SetContact?FormAction=delete',getContactGuId)
    .subscribe(res => console.log(res));
  }

    UpdateContact(val){
    
    this.http.post(environment.APIEndpoint + 'SetContact',val)
    .subscribe(res =>{
      console.log(res);
      // localStorage.setItem('refres',"yes");
     // this.ContactData();
      // this.http.get<any>(environment.APIEndpoint + 'GetContact');
    });
    localStorage.removeItem('contactGuid');

  }

}
