import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportlistService {

  constructor(private http: HttpClient) { }

  allreportlist() {
    return this.http.get<any>(environment.APIEndpoint + 'ReportList');
  }
}
