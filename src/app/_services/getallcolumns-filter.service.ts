import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetallcolumnsFilterService {

  constructor(private http: HttpClient) { }

  Getallcolumns(Title,SubTitle){
    var UserGuid=JSON.parse(localStorage.getItem('currentUser'))  
    if(SubTitle!==''){
      return this.http.get<any>(environment.APIEndpoint +'GetTableColumns?Page='+Title+'&List='+SubTitle+'&Format=JSON&UserGuid='+UserGuid.UserGuid+'&SessionToken='+localStorage.getItem('session_token'));
    }else{
      return this.http.get<any>(environment.APIEndpoint +'GetTableColumns?Page='+Title+'&Format=JSON&UserGuid='+UserGuid.UserGuid+'&SessionToken='+localStorage.getItem('session_token'));
    }
  }
}

