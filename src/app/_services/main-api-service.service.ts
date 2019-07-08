import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MainAPiServiceService {

  constructor(
    private httpClient: HttpClient) { }
  getSetData(Data: any, url: any) {
    if (Data == null) {
      Data = {};
    }
    return this.httpClient.post<any>(environment.APIEndpoint + url, Data);
  }
}
