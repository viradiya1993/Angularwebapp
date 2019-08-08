import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import {  MainAPiServiceService } from './../../../../_services';

@Component({
  selector: 'app-invoice-generate',
  templateUrl: './invoice-generate.component.html',
  styleUrls: ['./invoice-generate.component.scss'],
  animations: fuseAnimations
})
export class InvoiceGenerateComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  addData:any=[];
  constructor(private _mainAPiServiceService:MainAPiServiceService) { }

  ngOnInit() {
    // this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
    //  // console.log(response);
    //   this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
    // })
    
  }
  


}
