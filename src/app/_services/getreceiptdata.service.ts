import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
  export class GetReceptData {
    getdata: any;
  
    constructor(private http: HttpClient, private toastr: ToastrService, ) { }
  
  
    getRecept(d) {
      return this.http.post<any>(environment.APIEndpoint + 'GetReceiptAllocation', d);
    }

    setReceipt(d){
      return this.http.post<any>(environment.APIEndpoint + 'SetIncome', d);
    }
    getIncome(d){
      return this.http.post<any>(environment.APIEndpoint + 'GetIncome', d);
    }
  
  }