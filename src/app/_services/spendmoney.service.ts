import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpendmoneyService {

  constructor(private http: HttpClient) { }

//  SpendmoneyListData(potData) {
//     return this.http.post<any>(environment.APIEndpoint + 'GetInvoice', potData);
//   }
  SpendmoneyListData(potData) {
    return this.http.post<any>(environment.APIEndpoint + 'GetExpenses', potData);
  }
}