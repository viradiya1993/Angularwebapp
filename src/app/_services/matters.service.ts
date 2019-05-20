import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { post } from 'selenium-webdriver/http';

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
    // return this.httpClient.post<any>(environment.APIEndpoint + 'GetMatter?GetAllFields', postData);
  }
  getMattersContact(postData) {
    return this.httpClient.post<any>(environment.APIEndpoint + 'GetMatterContact', postData);
  }
  AddNewMatter(postDatas) {
    return this.httpClient.post<any>(environment.APIEndpoint + 'SetMatter', postDatas);
  }
  getMattersClasstype(getdata) {
    return this.httpClient.post<any>(environment.APIEndpoint + 'GetLookups', getdata);
  }
}
