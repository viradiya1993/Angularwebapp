import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorkInProgressService {
  
  constructor(private http: HttpClient) { }

  WorkInProgressData(){
    return this.http.get<any>(environment.APIEndpoint + 'GetWorkItems');
  }
}
