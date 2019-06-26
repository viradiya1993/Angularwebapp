import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileNotesService {

  constructor(private http: HttpClient) { }

  getData(potData) {
    return this.http.post<any>(environment.APIEndpoint + 'GetMatterFileNote', potData);
  }
  setFileNote(potData) {
    return this.http.post<any>(environment.APIEndpoint + 'SetFileNote', potData);
  }
}
