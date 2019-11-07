import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { url } from 'inspector';


@Injectable({ providedIn: 'root' })
export class MainAPiServiceService{

  constructor(private httpClient: HttpClient) { }
  getSetData(Data: any, url: any) {
    if (Data == null) {
      Data = {};
    }
    return this.httpClient.post<any>(environment.APIEndpoint + url, Data);
  }
  getSetForReport(ReportId){
    return this.httpClient.get<any>(environment.APIEndpoint + 'ReportRequestFilter?reportId='+ ReportId);
  }

 


}