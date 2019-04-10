import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthoritiesService {

  constructor(private http: HttpClient) { }

  getData(potData) {
    return this.http.post<any>(environment.APIEndpoint + 'GetMatterAuthority', potData);
  }
}
