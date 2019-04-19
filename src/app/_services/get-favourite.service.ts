import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetFavouriteService {

  constructor(private http: HttpClient) { }

  GetFavourite(postdata) {
    return this.http.post<any>(environment.APIEndpoint + 'GetFavourites', postdata);
  }
  setFavourite(pagefavourite){
    return this.http.post<any>(environment.APIEndpoint + 'SetFavourites', pagefavourite);
  }
}
