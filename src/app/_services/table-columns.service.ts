import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Columns } from 'app/_tableColumns/Columns';

@Injectable({ providedIn: 'root' })
export class TableColumnsService {
  constructor(private httpClient: HttpClient, private toastr: ToastrService) { }

  getTableFilter(table: any, List: any) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let Data = { "USERGUID": currentUser.UserGuid, "PAGE": table, 'LIST': List };
    return this.httpClient.post<any>(environment.APIEndpoint + 'GetTableColumns', Data);
  }
  
  filtertableColum(response: any, type: any) {
    let tableData: any = Columns[type];
    let tempCol: any = [];
    let tempColobj: any = [];
    let showCol: any = [];
    let temshowCol: any = [];
    let finalList = response.sort(function (a, b) {
      return a.POSITION - b.POSITION;
    });
    finalList.forEach(itemsdata => {
      if ((itemsdata.HIDDEN == 1 || itemsdata.HIDDEN == 0) && tableData.includes(itemsdata.COLUMNID)) {
        if (!temshowCol.includes(itemsdata.COLUMNID)) {
          if (itemsdata.HIDDEN == 0 && !showCol.includes(itemsdata.COLUMNID)) {
            showCol.push(itemsdata.COLUMNID);
          }
          tempColobj[itemsdata.COLUMNID] = itemsdata;
          tempCol.push(itemsdata);
        }
        temshowCol.push(itemsdata.COLUMNID);
      }
    });
    return { 'colobj': tempCol, 'showcol': showCol, 'tempColobj': tempColobj };
  }
  setTableFilter(table: any, list: any, postData: any) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let Data = { 'USERGUID': currentUser.UserGuid, 'PAGE': table, 'LIST': list, 'COLUMNSETTINGS': postData };
    return this.httpClient.post<any>(environment.APIEndpoint + 'SetTableColumns', Data);
  }
  getColumename(data: any) {
    return data;
  }

}
