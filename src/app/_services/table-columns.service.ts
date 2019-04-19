import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Columns } from 'app/_tableColumns/Columns';

@Injectable({ providedIn: 'root' })
export class TableColumnsService {
  constructor(private httpClient: HttpClient, private toastr: ToastrService) { }

  getTableFilter(table: any) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let Data = { "USERGUID": currentUser.UserGuid, "PAGE": table };
    return this.httpClient.post<any>(environment.APIEndpoint + 'GetTableColumns', Data);

  }
  filtertableColum(response: any, type: any) {
    let tableData: any = Columns[type];
    let tempCol: any = [];
    let showCol: any = [];
    response.forEach(itemsdata => {
      if ((itemsdata.HIDDEN == 1 || itemsdata.HIDDEN == 0) && tableData.includes(itemsdata.COLUMNNAME)) {
        tempCol.push(itemsdata);
        if (itemsdata.HIDDEN == 1)
          showCol.push(itemsdata.COLUMNNAME);
      }
    });
    return { 'colobj': tempCol, 'showcol': showCol };
  }
  //   let roles = [{ roleId: "69801", role: "ADMIN" }, { roleId: "69806", role: "SUPER_ADMIN" }, { roleId: "69805", role: "RB" }, { roleId: "69804", role: "PILOTE" }, { roleId: "69808", role: "VENDEUR" }, { roleId: "69807", role: "SUPER_RB" }]

  // const checkRoleExistence = roleParam => roles.some(({ role }) => role == roleParam)

  // console.log(checkRoleExistence("ADMIN"));
  // console.log(checkRoleExistence("RA"));
  // console.log(checkRoleExistence("RB"));
}
