import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';

@Injectable({ providedIn: 'root' })
export class TimersService {
  prevMatterArray: any[] = [];
  constructor(
    private httpClient: HttpClient, private toastr: ToastrService
  ) { }
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
  SetWorkItems(Data: any) {
    if (Data == null) {
      Data = {};
    }
    return this.httpClient.post<any>(environment.APIEndpoint + 'SetWorkItems ', Data);
  }
  //time entry popup data end 
  addTimeEnrtS() {
    let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    let timerId: any = 'timer_' + currentUser.UserGuid;
    let activeMatters = JSON.parse(localStorage.getItem('set_active_matters'));
    if (activeMatters.ACTIVE == 0) {
      this.toastr.error("You cannot start timer for Inactive matter. Please select active matter and try again.");
      return false;
    }
    this.prevMatterArray = JSON.parse(localStorage.getItem(timerId));
    if (this.prevMatterArray) {
      if (this.containsObject(activeMatters.SHORTNAME)) {
        this.addNewTimer(this.prevMatterArray);
        $('#sidebar_open_button').click();
      } else {
        this.toastr.error("Matter is already added in timer list");
      }
    } else {
      this.addNewTimer(this.prevMatterArray);
      $('#sidebar_open_button').click();
    }
  }
  addNewTimer(prevMatterArray) {
    let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    let timerId: any = 'timer_' + currentUser.UserGuid;
    let activeMatters = JSON.parse(localStorage.getItem('set_active_matters'));
    /*When add first matter in local storage. Matter array null for first time*/
    if (!localStorage.getItem(timerId)) {
      let matterArry = [];
      matterArry.push({ 'matter_id': activeMatters.SHORTNAME, 'time': 0, 'isStart': true });
      localStorage.setItem(timerId, JSON.stringify(matterArry));
      this.toastr.success("Timer is added for selected matter");
    } else {
      let demoTimer: any[] = [];
      prevMatterArray.forEach(items => {
        let startTimer: any = localStorage.getItem('start_' + items.matter_id);
        if (startTimer) {
          demoTimer.push({ 'matter_id': items.matter_id, 'time': startTimer, 'isStart': false });
          localStorage.removeItem('start_' + items.matter_id);
        } else {
          demoTimer.push({ 'matter_id': items.matter_id, 'time': items.time, 'isStart': false });
        }
      });
      demoTimer.push({ 'matter_id': activeMatters.SHORTNAME, 'time': 0, 'isStart': true });
      localStorage.setItem(timerId, JSON.stringify(demoTimer));
    }
    let timeD: any = 0;
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
