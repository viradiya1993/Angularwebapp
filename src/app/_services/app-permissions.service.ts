import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class AppPermissionsService {

  constructor() { }
  PermissionsCons = {
    'MATTER DETAILS': '1', 'DAY BOOK / TIME ENTRIES': '2', 'CONTACTS': '3', 'ESTIMATES': '4', 'DOCUMENT/EMAIL GENERATION': '5', 'DOCUMENT REGISTER': '6', 'INVOICING': '7',
    'RECEIVE MONEY': '8', 'SPEND MONEY': '9', 'CHRONOLOGY': '10', 'TOPICS': '11', 'AUTHORITIES': '12', 'FILE NOTES': '13', 'SAFE CUSTODY': '14', 'SAFE CUSTODY PACKET': '15',
    'SEARCHING': '16', 'DIARY': '17', 'TASKS': '18', 'CHART OF ACCOUNTS': '19', 'GENERAL JOURNAL': '20', 'OTHER ACCOUNTING': '21', 'TRUST MONEY': '22', 'TRUST CHART OF ACCOUNTS': '23',
    'TRUST GENERAL JOURNAL': '24', 'TRUST REPORTS': '25', 'ACCOUNTING REPORTS': '26', 'MANAGEMENT REPORTS': '27', 'SYSTEM': '28', 'USERS': '29', 'ACTIVITIES/SUNDRIES': '30',
  };

  Permissions = [];
  applictionSetting(loginResponse: any) {
    if (loginResponse) {
      let LoginData = {
        SessionToken: loginResponse.SESSIONTOKEN,
        TimeStampUTC: loginResponse.TIMESTAMPUTC,
        TimeStamp: loginResponse.TIMESTAMP,
        LoggedInStatus: loginResponse.LOGGEDINSTATUS,
        LicenceNumber: loginResponse.LICENCENUMBER,
        AllowMobileAccess: loginResponse.ALLOWMOBILEACCESS,
        UserGuid: loginResponse.USERGUID,
        UserId: loginResponse.USERID,
        UserName: loginResponse.USERNAME,
        ProductType: loginResponse.PRODUCTTYPE,
        DefaultQuantityType: loginResponse.DEFAULTQUANTITYTYPE,
        InitialWindow: loginResponse.INITIALWINDOW,
        ShowOutstanding: loginResponse.SHOWOUTSTANDING,
        ShowWIPGraph: loginResponse.SHOWWIPGRAPH,
      };
      localStorage.setItem('currentUser', JSON.stringify(LoginData));
      localStorage.setItem('session_token', loginResponse.SESSIONTOKEN);
      let theme_name = loginResponse.PRODUCTTYPE == "Barrister" ? "theme-default" : "theme-yellow-light";
      localStorage.setItem('theme_type', theme_name);
      this.appPermissions(loginResponse.PERMISSIONS);
      localStorage.removeItem('Login_response');
    }
  }
  appPermissions(setting: any) {
    if (setting) {
      for (let i in setting) {
        this.setObj(setting[i], i);
      }
      localStorage.setItem('app_permissions', JSON.stringify(this.Permissions));
    }
  }
  setObj(Obj: any, type: any) {
    let subPermissions = {};
    Obj.forEach(function (value) {
      subPermissions[value.NAME] = value.VALUE;
    });
    if (Object.keys(subPermissions).length != 0) {
      this.Permissions[this.PermissionsCons[type]] = subPermissions;
    }
  }
}
