import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DiaryDataService {

  constructor(private http: HttpClient) { }

  DiaryData() {
    return this.http.get<any>(environment.APIEndpoint + 'GetAppointment');
  }
}
