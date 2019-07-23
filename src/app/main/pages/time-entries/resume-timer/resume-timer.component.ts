import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import {  MainAPiServiceService } from './../../../../_services';

@Component({
  selector: 'app-resume-timer',
  templateUrl: './resume-timer.component.html',
  styleUrls: ['./resume-timer.component.scss'],
  animations: fuseAnimations
})
export class ResumeTimerComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  constructor(private _mainAPiServiceService:MainAPiServiceService) { }

  ngOnInit() {
   
    
  }
  
  


}
