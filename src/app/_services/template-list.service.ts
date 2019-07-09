import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
  export class TemplateListDetails {
    getdata: any;
  
    constructor(private http: HttpClient, private toastr: ToastrService, ) { }
  
  
    getTemplateList(d) {
      return this.http.post<any>(environment.APIEndpoint + 'TemplateList', d);
    }

    getGenerateTemplate(d){
        return this.http.post<any>(environment.APIEndpoint + 'TemplateGenerate', d);
    }
    getData(d){
      return d;
    }

    getEmailList(d){
      return this.http.post<any>(environment.APIEndpoint + 'GetEmail', d);
    }

    getTemplateDropDown(d){
      return this.http.post<any>(environment.APIEndpoint + 'TemplateFieldList', d);
    }
  
    setEmail(d){
      return this.http.post<any>(environment.APIEndpoint + 'SetEmail', d);
    }
  
  }