import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Columns } from 'app/_tableColumns/Columns';

@Injectable({
    providedIn: 'root'
  })
  export class GetReceptData {
    getdata: any;
  
    constructor(private http: HttpClient, private toastr: ToastrService, ) { }
  
  
    getRecept(d) {
      return this.http.post<any>(environment.APIEndpoint + 'GetReceiptAllocation', d);
    }
  
  }