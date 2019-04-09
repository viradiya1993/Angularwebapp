import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TimersService {

  constructor(
    private httpClient: HttpClient
  ) { }
  getTimeEnrtyData(Data) {
    if (Data == null) {
      Data = {};
    }
    return this.httpClient.post<any>(environment.APIEndpoint + 'GetWorkItems', Data);
  }
  GetUsers(Data) {
    return this.httpClient.post<any>(environment.APIEndpoint + 'GetUsers', Data);
  }

}
