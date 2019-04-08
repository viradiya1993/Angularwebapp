import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MatterTrustService {

  constructor(private http: HttpClient) { }

  MatterTrustData(){
    return this.http.get<any>(environment.APIEndpoint + 'GetMatterTrustTransaction?MatterGuid=MATAAAAAAAAAAA18');
  }
}
