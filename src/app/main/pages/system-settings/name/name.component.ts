import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import {  MainAPiServiceService } from './../../../../_services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss'],
  animations: fuseAnimations
})
export class NameComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  isLoadingResults: boolean = false;
  @Input() errorWarningData: any;
  addData:any=[];
  constructor(private _mainAPiServiceService:MainAPiServiceService,
    private toastr: ToastrService,) { }

  ngOnInit() {
    // this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
  
    //   this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
    // })
    
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") { 
        
        this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP

      }
      this.isLoadingResults = false;
    }, error => {
      this.toastr.error(error);
    });

  }
  
  triggerSomeEvent(f) {
    let ADDRESS1 = this.SettingForm.get('ADDRESS1').value;
    let SUBURB = this.SettingForm.get('SUBURB').value;
    let STATE = this.SettingForm.get('STATE').value;
    let POSTCODE = this.SettingForm.get('POSTCODE').value;
 
    if (f.value.SAMECOPYADDRESS == true) {
      this.SettingForm.controls['POSTALADDRESS1'].setValue(ADDRESS1);
      this.SettingForm.controls['POSTALSUBURB'].setValue(SUBURB);
      this.SettingForm.controls['POSTALSTATE'].setValue(STATE);
      this.SettingForm.controls['POSTALPOSTCODE'].setValue(POSTCODE);
    } else {
          this.SettingForm.controls['POSTALADDRESS1'].setValue(this.addData.POSTALADDRESS1); 
          this.SettingForm.controls['POSTALPOSTCODE'].setValue(this.addData.POSTALPOSTCODE); 
          this.SettingForm.controls['POSTALSUBURB'].setValue(this.addData.POSTALSUBURB); 
          this.SettingForm.controls['POSTALSTATE'].setValue(this.addData.POSTALSTATE); 
          
     
      // this.SettingForm.controls['POSTALADDRESS1'].setValue("");
      // this.SettingForm.controls['POSTALSUBURB'].setValue("");
      // this.SettingForm.controls['POSTALSTATE'].setValue("");
      // this.SettingForm.controls['POSTALPOSTCODE'].setValue("");

    }
  }

}
