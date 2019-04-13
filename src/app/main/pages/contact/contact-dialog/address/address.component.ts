import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  
  common:any;
  country:string;
  isChecked:boolean = false;
  constructor() { }
  @Input() loginForm: FormGroup;
  ngOnInit() {
 
    this.common = [

      { Id: 1, Name: "United States of America'" },
      { Id: 2, Name: "ComUnited Kingdompany" },
      { Id: 3, Name: "Russia" },
      { Id: 4, Name: "China" },
      { Id: 5, Name: "Japan" },
      { Id: 6, Name: "Turkey" },
     


    ];
  }

  triggerSomeEvent(f) {
   
    
   // console.log(f.value.SAMEASSTREET);
    //this.isDisabled = !this.isDisabled;
    if( f.value.SAMEASSTREET){
      
    this.loginForm.get('POSTALADDRESS1').disable();
    this.loginForm.get('POSTALADDRESS2').disable();
    this.loginForm.get('POSTALADDRESS3').disable();
    this.loginForm.get('POSTALSUBURB').disable();
    this.loginForm.get('POSTALSTATE').disable();
    this.loginForm.get('POSTALPOSTCODE').disable();
    this.loginForm.get('POSTALCOUNTRY').disable();
    }
    else{
    this.loginForm.get('POSTALADDRESS1').enable();
    this.loginForm.get('POSTALADDRESS2').enable();
    this.loginForm.get('POSTALADDRESS3').enable();
    this.loginForm.get('POSTALSUBURB').enable();
    this.loginForm.get('POSTALSTATE').enable();
    this.loginForm.get('POSTALPOSTCODE').enable();
    this.loginForm.get('POSTALCOUNTRY').enable();
    }
   
    
}

}
