import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService } from 'app/_services';
import * as $ from 'jquery';


@Component({
  selector: 'app-end-month-histroy',
  templateUrl: './end-month-histroy.component.html',
  styleUrls: ['./end-month-histroy.component.scss'],
  animations: fuseAnimations
})
export class EndOfMonthHistroyComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  addData:any=[];
  isDisplay: boolean = false;
  constructor(private _mainAPiServiceService:MainAPiServiceService) { }

  ngOnInit() {
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 130)) + 'px');
    // this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
    //  // console.log(response);
    //   this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
    // })
    
  }
  
 

}
