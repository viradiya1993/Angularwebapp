import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TableColumnsService {

  constructor(private httpClient: HttpClient, private toastr: ToastrService) { }

  getTableFilter(table: any) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let Data = { "USERGUID": currentUser.UserGuid, "PAGE": table };
    return this.httpClient.post<any>(environment.APIEndpoint + 'GetTableColumns', Data);
  }
  filtertableColum() {

  }
}
