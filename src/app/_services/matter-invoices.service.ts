import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MatterInvoicesService {

  constructor(private http: HttpClient) { }

  MatterInvoicesData(potData) {
    return this.http.post<any>(environment.APIEndpoint + 'GetInvoice', potData);
  }
  SetInvoiceData(potData) {
    return this.http.post<any>(environment.APIEndpoint + 'SetInvoice', potData);
  }
}
