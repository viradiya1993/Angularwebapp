import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstimateService {

  constructor(private http: HttpClient) { }

  MatterEstimatesData(potData) {
    return this.http.post<any>(environment.APIEndpoint + 'GetMatterEstimates', potData);
  }
}
