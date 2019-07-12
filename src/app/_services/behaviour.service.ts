import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BehaviorService {
  public user$: BehaviorSubject<any> = new BehaviorSubject(false);

  constructor(private http: HttpClient) { }

//   setBihaviour(d){
//       console.log(d);
//      this.user$.next(d);
//   }
//   ContactData(d) {
//     return this.http.post<any>(environment.APIEndpoint + 'GetContact', d);
//   }

}