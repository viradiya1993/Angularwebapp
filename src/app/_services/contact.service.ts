import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IfStmt } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  getdata: any;

  constructor(private http: HttpClient, private toastr: ToastrService,) { }


  ContactData(d) {

    return this.http.post<any>(environment.APIEndpoint + 'GetContact', d);
  }

  //get data for popup
  getContact(val) {

    return this.http.post<any>(environment.APIEndpoint + 'GetContact', val);
  }

  //for delete contact

  deleteContact(getContactGuId) {
    console.log(getContactGuId);
    this.http.post<any>(environment.APIEndpoint + 'SetContact', getContactGuId)
      .subscribe(res =>
        {
         if(res.STATUS=="success"){
          this.toastr.success(res.STATUS);
         }else{
         this.toastr.error(res.STATUS);
         }
         console.log(res);
        });

      
  }

}
