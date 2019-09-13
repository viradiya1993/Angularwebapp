import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TimersService {
  prevMatterArray: any[] = [];
  constructor(private httpClient: HttpClient, private toastr: ToastrService) { }
  getTimeEnrtyData(Data: any) {
    if (Data == null) {
      Data = {};
    }
    return this.httpClient.post<any>(environment.APIEndpoint + 'GetWorkItems', Data);
  }
  GetUsers(Data: any) {
    if (Data == null) {
      Data = {};
    }
    return this.httpClient.post<any>(environment.APIEndpoint + 'GetUsers', Data);
  }
  GetActivity(Data: any) {
    if (Data == null) {
      Data = {};
    }
    return this.httpClient.post<any>(environment.APIEndpoint + 'GetActivity', Data);
  }
  matterListFetch(Data: any) {
    if (Data == null) {
      Data = {};
    }
    return this.httpClient.post<any>(environment.APIEndpoint + 'GetWorkItems', Data);
  }
  //time entry popup data
  GetLookupsData(Data: any) {
    if (Data == null) {
      Data = {};
    }
    return this.httpClient.post<any>(environment.APIEndpoint + 'GetLookups', Data);
  }
  calculateWorkItems(Data: any) {
    if (Data == null) {
      Data = {};
    }
    return this.httpClient.post<any>(environment.APIEndpoint + 'CalcWorkItemCharge ', Data);
  }
  SetWorkItems(Data: any) {
    if (Data == null) {
      Data = {};
    }
    return this.httpClient.post<any>(environment.APIEndpoint + 'SetWorkItems ', Data);
  }
  //time entry popup data end 
  addTimeEnrtS(eTimer: any) {
    let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    let timerId: any = 'timer_' + currentUser.UserGuid;
    let activeMatters: any;
    let isRT: boolean;
    if (eTimer == '' && !eTimer) {
      isRT = false;
      activeMatters = JSON.parse(localStorage.getItem('set_active_matters'));
      if (activeMatters.ACTIVE == 0) {
        this.toastr.error("You cannot start timer for Inactive matter. Please select active matter and try again.");
        return false;
      }
    } else {
      activeMatters = eTimer;
      isRT = true;
    }
    this.prevMatterArray = JSON.parse(localStorage.getItem(timerId));
    if (this.prevMatterArray) {
      if (this.containsObject(activeMatters.SHORTNAME)) {
        this.addNewTimer(this.prevMatterArray, isRT, eTimer);
        $('#sidebar_open_button').click();
      } else {
        this.toastr.error("Matter is already added in timer list");
      }
    } else {
      this.addNewTimer(this.prevMatterArray, isRT, eTimer);
      $('#sidebar_open_button').click();
    }
  }
  addNewTimer(prevMatterArray, isRT: any, data: any) {
    let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    let timerId: any = 'timer_' + currentUser.UserGuid;
    let activeMatters: any = isRT ? data : JSON.parse(localStorage.getItem('set_active_matters'));
    /*When add first matter in local storage. Matter array null for first time*/
    if (!localStorage.getItem(timerId)) {
      let matterArry = [];
      let temObj = { 'WORKITEMGUID': '', 'matter_id': activeMatters.SHORTNAME, 'matterguid': activeMatters.MATTERGUID, 'time': 0, 'isStart': true };
      if (isRT) {
        temObj.time = activeMatters.secound;
        temObj.WORKITEMGUID = activeMatters.WORKITEMGUID;
      }
      matterArry.push(temObj);
      localStorage.setItem(timerId, JSON.stringify(matterArry));
      this.toastr.success("Timer is added for selected matter");
    } else {
      let demoTimer: any[] = [];
      prevMatterArray.forEach(items => {
        let startTimer: any = localStorage.getItem('start_' + items.matter_id);
        if (startTimer) {
          let tempData = { 'WORKITEMGUID': items.WORKITEMGUID, 'matter_id': items.matter_id, 'matterguid': items.matterguid, 'time': startTimer, 'isStart': false };
          demoTimer.push(tempData);
          localStorage.removeItem('start_' + items.matter_id);
        } else {
          let tempData2 = { 'WORKITEMGUID': items.WORKITEMGUID, 'matter_id': items.matter_id, 'matterguid': items.matterguid, 'time': items.time, 'isStart': false };
          demoTimer.push(tempData2);
        }
      });
      let tempData3 = { 'WORKITEMGUID': '', 'matter_id': activeMatters.SHORTNAME, 'matterguid': activeMatters.MATTERGUID, 'time': 0, 'isStart': true };
      if (isRT) {
        tempData3.time = activeMatters.secound;
        tempData3.WORKITEMGUID = activeMatters.WORKITEMGUID;
      }
      demoTimer.push(tempData3);
      localStorage.setItem(timerId, JSON.stringify(demoTimer));
    }
    let timeD: any = 0;
    if (isRT)
      timeD = activeMatters.secound;
    localStorage.setItem('start_' + activeMatters.SHORTNAME, timeD);
  }
  containsObject(obj) {
    let isValid = true;
    this.prevMatterArray.forEach(items => {
      if (items.matter_id === obj)
        isValid = false;
    });
    return isValid;
  }
}
