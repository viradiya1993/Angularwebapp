import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import {  MainAPiServiceService } from './../../../../_services';
import * as moment from 'moment';

@Component({
  selector: 'app-resume-timer',
  templateUrl: './resume-timer.component.html',
  styleUrls: ['./resume-timer.component.scss'],
  animations: fuseAnimations
})
export class ResumeTimerComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  timeStops:any=[]
  @Input() errorWarningData: any;
  constructor(private _mainAPiServiceService:MainAPiServiceService) { 
    this.timeStops = this.getTimeStops('01:00', '23:59');
  }

  ngOnInit() {
    //this.timeArray("7:30" , "10:00")
    
  }
  getTimeStops(start, end){
    const startTime = moment(start, 'HH:mm');
    const endTime = moment(end, 'HH:mm');
    if(endTime.isBefore(startTime) ){
       endTime.add(1, 'day');
    }
    const timeStops = [];
    while(startTime <= endTime){
      timeStops.push(moment(startTime).format('HH:mm A'));
      startTime.add(15, 'minutes');
    }
    return timeStops;
  }

  


}
