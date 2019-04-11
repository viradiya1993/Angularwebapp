import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MattersService {
  constructor(
    private httpClient: HttpClient
  ) { }
  getMatters(data) {
    if (data == null) {
      data = {};
    }
    return this.httpClient.post<any>(environment.APIEndpoint + 'GetMatter', data);
  }
  getMattersDetail(postData) {
    return this.httpClient.post<any>(environment.APIEndpoint + 'GetMatter', postData);
  }
  getMattersContact(postData) {
    return this.httpClient.post<any>(environment.APIEndpoint + 'GetMatterContact', postData);
  }
}
