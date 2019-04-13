import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  common: any;
  country: string;
  isChecked: boolean = false;
  constructor() { }
  @Input() loginForm: FormGroup;
  ngOnInit() {

    // this.common = [

    //   { Id: 1, Name: "United States of America'" },
    //   { Id: 2, Name: "ComUnited Kingdompany" },
    //   { Id: 3, Name: "Russia" },
    //   { Id: 4, Name: "China" },
    //   { Id: 5, Name: "Japan" },
    //   { Id: 6, Name: "Turkey" },



    // ];
  }

  triggerSomeEvent(f) {


    // console.log(f.value.SAMEASSTREET);
    //this.isDisabled = !this.isDisabled;
    if (f.value.SAMEASSTREET == true) {
      let add1 = this.loginForm.get('ADDRESS1').value;
      let add2 = this.loginForm.get('ADDRESS2').value;
      let add3 = this.loginForm.get('ADDRESS3').value;
      let suburb = this.loginForm.get('SUBURB').value;
      let state = this.loginForm.get('STATE').value;
      let postcode = this.loginForm.get('POSTCODE').value;
      let country = this.loginForm.get('COUNTRY').value;

      //FOR SET VALUE
      this.loginForm.controls['POSTALADDRESS1'].setValue(add1);
      this.loginForm.controls['POSTALADDRESS2'].setValue(add2);
      this.loginForm.controls['POSTALADDRESS3'].setValue(add3);
      this.loginForm.controls['POSTALSUBURB'].setValue(suburb);
      this.loginForm.controls['POSTALSTATE'].setValue(state);
      this.loginForm.controls['POSTALPOSTCODE'].setValue(postcode);
      this.loginForm.controls['POSTALCOUNTRY'].setValue(country);

      this.loginForm.get('POSTALADDRESS1').disable();
      this.loginForm.get('POSTALADDRESS2').disable();
      this.loginForm.get('POSTALADDRESS3').disable();
      this.loginForm.get('POSTALSUBURB').disable();
      this.loginForm.get('POSTALSTATE').disable();
      this.loginForm.get('POSTALPOSTCODE').disable();
      this.loginForm.get('POSTALCOUNTRY').disable();
    }
    else {

      this.loginForm.controls['POSTALADDRESS1'].setValue("");
      this.loginForm.controls['POSTALADDRESS2'].setValue("");
      this.loginForm.controls['POSTALADDRESS3'].setValue("");
      this.loginForm.controls['POSTALSUBURB'].setValue("");
      this.loginForm.controls['POSTALSTATE'].setValue("");
      this.loginForm.controls['POSTALPOSTCODE'].setValue("");
      this.loginForm.controls['POSTALCOUNTRY'].setValue("");



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
