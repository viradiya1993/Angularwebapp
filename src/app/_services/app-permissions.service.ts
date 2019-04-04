import { Injectable } from '@angular/core';
import { isNull } from '@angular/compiler/src/output/output_ast';
import * as $ from 'jquery';

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
    if (data.login_response) {
      let loginResponse = data.login_response;
      let LoginData = {
        SessionToken: loginResponse.SessionToken,
        TimeStampUTC: loginResponse.TimeStampUTC,
        TimeStamp: loginResponse.TimeStamp,
        LoggedInStatus: loginResponse.LoggedInStatus,
        LicenceNumber: loginResponse.LicenceNumber,
        AllowMobileAccess: loginResponse.AllowMobileAccess,
        UserGuid: loginResponse.UserGuid,
        UserId: loginResponse.UserId,
        UserName: loginResponse.UserName,
        ProductType: loginResponse.ProductType,
        DefaultQuantityType: loginResponse.DefaultQuantityType,
        InitialWindow: loginResponse.InitialWindow,
        ShowOutstanding: loginResponse.ShowOutstanding,
        ShowWIPGraph: loginResponse.ShowWIPGraph,
      };
      localStorage.setItem('currentUser', JSON.stringify(LoginData));
      this.appPermissions(loginResponse);
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
