import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddContactService {

  constructor(private http: HttpClient) { }

  AddContactData(val){

    this.http.post(environment.APIEndpoint + 'SetContact?FormAction=insert',val)
    .subscribe(res => console.log(res));

    // return this.http.post<any>(environment.APIEndpoint + 'SetContact',);
  }

}
