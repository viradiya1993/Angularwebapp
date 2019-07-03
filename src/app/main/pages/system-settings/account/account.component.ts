import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { SystemSetting } from './../../../../_services';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  animations: fuseAnimations
})
export class AccountComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  addData:any=[];
  constructor(private SystemSetting:SystemSetting) { }

  ngOnInit() {
    // this.SystemSetting.getSystemSetting({}).subscribe(response=>{
    //   console.log(response);
    //   this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
    //   })
    
  }
  
//   triggerSomeEvent(f) {
//     let ADDRESS1 = this.SettingForm.get('ADDRESS1').value;
//     let SUBURB = this.SettingForm.get('SUBURB').value;
//     let STATE = this.SettingForm.get('STATE').value;
 
//     let POSTCODE = this.SettingForm.get('POSTCODE').value;
 
//     if (f.value.SAMECOPYADDRESS == true) {
//       this.SettingForm.controls['POSTALADDRESS1'].setValue(ADDRESS1);
//       this.SettingForm.controls['POSTALSUBURB'].setValue(SUBURB);
//       this.SettingForm.controls['POSTALSTATE'].setValue(STATE);
//       this.SettingForm.controls['POSTALPOSTCODE'].setValue(POSTCODE);
//     } else {
//           this.SettingForm.controls['POSTALADDRESS1'].setValue(this.addData.POSTALADDRESS1); 
//           this.SettingForm.controls['POSTALPOSTCODE'].setValue(this.addData.POSTALPOSTCODE); 
//           this.SettingForm.controls['POSTALSUBURB'].setValue(this.addData.POSTALSUBURB); 
//           this.SettingForm.controls['POSTALSTATE'].setValue(this.addData.POSTALSTATE); 
        

//     }
//   }

}
