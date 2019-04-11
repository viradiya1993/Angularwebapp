import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReceiptsCreditsService {

  constructor(private http: HttpClient) { }

  ReceiptsCreditsData(potData) {
    return this.http.post<any>(environment.APIEndpoint + 'GetMatterReceipts', potData);
  }
}
