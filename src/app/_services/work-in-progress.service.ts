import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorkInProgressService {

  constructor(private http: HttpClient) { }

  WorkInProgressData(potData) {
    return this.http.post<any>(environment.APIEndpoint + 'GetWorkItems', potData);
  }
}
