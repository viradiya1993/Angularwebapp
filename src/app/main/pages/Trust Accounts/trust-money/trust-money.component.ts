import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService } from 'app/_services';
import * as $ from 'jquery';


@Component({
  selector: 'app-trust-money',
  templateUrl: './trust-money.component.html',
  styleUrls: ['./trust-money.component.scss'],
  animations: fuseAnimations
})
export class TrustMoneyComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  isLoadingResults: boolean = false;
  pageSize: any;
  addData: any = [];
  constructor(private _mainAPiServiceService: MainAPiServiceService) { }

  ngOnInit() {
    $('.example-containerdata').css('height', ($(window).height() - ($('#tool_baar_main').height() + $('.sticky_search_div').height() + 130)) + 'px');
    // this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
    //   this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
    // })

  }
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    localStorage.setItem('lastPageSize', event.pageSize);
  }

  selectDayRange(val) {

  }


}
