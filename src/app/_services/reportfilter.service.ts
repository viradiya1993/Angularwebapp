import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportfilterService {
  
  constructor(private http: HttpClient) { }

  //filter API
  ReportfilterData(ReportId){
    return this.http.get<any>(environment.APIEndpoint + 'ReportRequestFilter?reportId='+ ReportId);
  }
  //Generate Report

  ReportgenerateData(Reportdata){
   return this.http.post<any>(environment.APIEndpoint + 'ReportGenerate',Reportdata);
  }
}


