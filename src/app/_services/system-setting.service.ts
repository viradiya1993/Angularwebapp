import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
  export class SystemSetting {
    getdata: any;
  
    constructor(private http: HttpClient, private toastr: ToastrService, ) { }
  
  
    getSystemSetting(d) {
      return this.http.post<any>(environment.APIEndpoint + 'GetSystem', d);
    }
setSystemSetting(d){
  return this.http.post<any>(environment.APIEndpoint + 'SetSystem', d);
}
  
  }