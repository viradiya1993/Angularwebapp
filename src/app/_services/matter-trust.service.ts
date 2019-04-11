import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MatterTrustService {

  constructor(private http: HttpClient) { }

  MatterTrustData(potData) {
    return this.http.post<any>(environment.APIEndpoint + 'GetMatterTrustTransaction', potData);
  }
}
