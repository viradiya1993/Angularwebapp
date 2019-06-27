import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UsersService {

  constructor(
    private httpClient: HttpClient, private toastr: ToastrService
  ) { }
  getUserData(Data: any) {
    if (Data == null) {
      Data = {};
    }
    return this.httpClient.post<any>(environment.APIEndpoint + 'GetUsers', Data);
  }
  SetUserData(Data: any) {
    if (Data == null) {
      Data = {};
    }
    return this.httpClient.post<any>(environment.APIEndpoint + 'SetUser ', Data);
  }
  SetUserBudgetData(Data: any) {
    if (Data == null) {
      Data = {};
    }
    return this.httpClient.post<any>(environment.APIEndpoint + 'SetUserBudget ', Data);
  }
  SetUserRateData(Data: any) {
    if (Data == null) {
      Data = {};
    }
    return this.httpClient.post<any>(environment.APIEndpoint + 'SetUserRate ', Data);
  }
  GetActivityData(Data: any) {
    if (Data == null) {
      Data = {};
    }
    return this.httpClient.post<any>(environment.APIEndpoint + 'GetActivity', Data);
  }
}
