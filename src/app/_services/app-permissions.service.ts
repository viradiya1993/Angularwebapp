import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class AppPermissionsService {

  constructor() { }
  PermissionsCons = {
    'Permissions - Matter Details': '1',
    'Permissions - Day Book / Time Entries': '2',
    'Permissions - Contacts': '3',
    'Permissions - Estimates': '4',
    'Permissions - Document/Email Generation': '5',
    'Permissions - Document Register': '6',
    'Permissions - Invoicing': '7',
    'Permissions - Receive Money': '8',
    'Permissions - Spend Money': '9',
    'Permissions - Chronology': '10',
    'Permissions - Topics': '11',
    'Permissions - Authorities': '12',
    'Permissions - File Notes': '13',
    'Permissions - Safe Custody': '14',
    'Permissions - Safe Custody Packet': '15',
    'Permissions - Searching': '16',
    'Permissions - Diary': '17',
    'Permissions - Tasks': '18',
    'Permissions - Chart of Accounts': '19',
    'Permissions - General Journal': '20',
    'Permissions - Other Accounting': '21',
    'Permissions - Trust Money': '22',
    'Permissions - Trust Chart of Accounts': '23',
    'Permissions - Trust General Journal': '24',
    'Permissions - Trust Reports': '25',
    'Permissions - Accounting Reports': '26',
    'Permissions - Management Reports': '27',
    'Permissions - System': '28',
    'Permissions - Users': '29',
    'Permissions - Activities/Sundries': '30',
  };

  Permissions = [];
  applictionSetting(data: any) {
    if (data.DATA) {
      console.log(data.DATA);
      let loginResponse = data.DATA;
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
      // let theme_name = loginResponse.PRODUCTTYPE == "Barrister" ? "theme-yellow-light" : "theme-default";
      let theme_name = loginResponse.PRODUCTTYPE == "Barrister" ? "theme-default" : "theme-yellow-light";
      localStorage.setItem('theme_type', theme_name);
      // this.appPermissions(loginResponse);
      localStorage.removeItem('Login_response');
    }
  }
  appPermissions(setting: any) {
    if (setting) {
      this.setObj(setting['Permissions - Matter Details'], 'Permissions - Matter Details');
      this.setObj(setting['Permissions - Day Book / Time Entries'], 'Permissions - Day Book / Time Entries');
      this.setObj(setting['Permissions - Contacts'], 'Permissions - Contacts');
      this.setObj(setting['Permissions - Estimates'], 'Permissions - Estimates');
      this.setObj(setting['Permissions - Document/Email Generation'], 'Permissions - Document/Email Generation');
      this.setObj(setting['Permissions - Document Register'], 'Permissions - Document Register');
      this.setObj(setting['Permissions - Invoicing'], 'Permissions - Invoicing');
      this.setObj(setting['Permissions - Receive Money'], 'Permissions - Receive Money');
      this.setObj(setting['Permissions - Spend Money'], 'Permissions - Spend Money');
      this.setObj(setting['Permissions - Chronology'], 'Permissions - Chronology');
      this.setObj(setting['Permissions - Topics'], 'Permissions - Topics');
      this.setObj(setting['Permissions - Authorities'], 'Permissions - Authorities');
      this.setObj(setting['Permissions - File Notes'], 'Permissions - File Notes');
      this.setObj(setting['Permissions - Safe Custody'], 'Permissions - Safe Custody');
      this.setObj(setting['Permissions - Safe Custody Packet'], 'Permissions - Safe Custody Packet');
      this.setObj(setting['Permissions - Searching'], 'Permissions - Searching');
      this.setObj(setting['Permissions - Diary'], 'Permissions - Diary');
      this.setObj(setting['Permissions - Tasks'], 'Permissions - Tasks');
      this.setObj(setting['Permissions - Chart of Accounts'], 'Permissions - Chart of Accounts');
      this.setObj(setting['Permissions - General Journal'], 'Permissions - General Journal');
      this.setObj(setting['Permissions - Other Accounting'], 'Permissions - Other Accounting');
      this.setObj(setting['Permissions - Trust Money'], 'Permissions - Trust Money');
      this.setObj(setting['Permissions - Trust Chart of Accounts'], 'Permissions - Trust Chart of Accounts');
      this.setObj(setting['Permissions - Trust General Journal'], 'Permissions - Trust General Journal');
      this.setObj(setting['Permissions - Trust Reports'], 'Permissions - Trust Reports');
      this.setObj(setting['Permissions - Accounting Reports'], 'Permissions - Accounting Reports');
      this.setObj(setting['Permissions - Management Reports'], 'Permissions - Management Reports');
      this.setObj(setting['Permissions - System'], 'Permissions - System');
      this.setObj(setting['Permissions - Users'], 'Permissions - Users');
      this.setObj(setting['Permissions - Activities/Sundries'], 'Permissions - Activities/Sundries');
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
