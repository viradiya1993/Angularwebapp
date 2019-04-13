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
  @Input() contactForm: FormGroup;
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
      let add1 = this.contactForm.get('ADDRESS1').value;
      let add2 = this.contactForm.get('ADDRESS2').value;
      let add3 = this.contactForm.get('ADDRESS3').value;
      let suburb = this.contactForm.get('SUBURB').value;
      let state = this.contactForm.get('STATE').value;
      let postcode = this.contactForm.get('POSTCODE').value;
      let country = this.contactForm.get('COUNTRY').value;

      //FOR SET VALUE
      this.contactForm.controls['POSTALADDRESS1'].setValue(add1);
      this.contactForm.controls['POSTALADDRESS2'].setValue(add2);
      this.contactForm.controls['POSTALADDRESS3'].setValue(add3);
      this.contactForm.controls['POSTALSUBURB'].setValue(suburb);
      this.contactForm.controls['POSTALSTATE'].setValue(state);
      this.contactForm.controls['POSTALPOSTCODE'].setValue(postcode);
      this.contactForm.controls['POSTALCOUNTRY'].setValue(country);

      this.contactForm.get('POSTALADDRESS1').disable();
      this.contactForm.get('POSTALADDRESS2').disable();
      this.contactForm.get('POSTALADDRESS3').disable();
      this.contactForm.get('POSTALSUBURB').disable();
      this.contactForm.get('POSTALSTATE').disable();
      this.contactForm.get('POSTALPOSTCODE').disable();
      this.contactForm.get('POSTALCOUNTRY').disable();
    }
    else {

      this.contactForm.controls['POSTALADDRESS1'].setValue("");
      this.contactForm.controls['POSTALADDRESS2'].setValue("");
      this.contactForm.controls['POSTALADDRESS3'].setValue("");
      this.contactForm.controls['POSTALSUBURB'].setValue("");
      this.contactForm.controls['POSTALSTATE'].setValue("");
      this.contactForm.controls['POSTALPOSTCODE'].setValue("");
      this.contactForm.controls['POSTALCOUNTRY'].setValue("");



      this.contactForm.get('POSTALADDRESS1').enable();
      this.contactForm.get('POSTALADDRESS2').enable();
      this.contactForm.get('POSTALADDRESS3').enable();
      this.contactForm.get('POSTALSUBURB').enable();
      this.contactForm.get('POSTALSTATE').enable();
      this.contactForm.get('POSTALPOSTCODE').enable();
      this.contactForm.get('POSTALCOUNTRY').enable();
    }


  }

}
