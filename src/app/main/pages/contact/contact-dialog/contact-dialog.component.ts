import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AddContactService } from './../../../../_services';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss']
})
export class ContactDialogComponent implements OnInit {

  action: string;
    //contact: string;
    dialogTitle: string;


  constructor(public dialogRef: MatDialogRef<ContactDialogComponent>,private _formBuilder: FormBuilder
    , private toastr: ToastrService,private addcontact: AddContactService) 
    
    {   // Set the defaults
      //this.action = _data.action;

      if ( this.action === 'new' )
      {
          this.dialogTitle = 'Edit Contact';
          //this.contact = _data.contact;
      }
      else
      {
          this.dialogTitle = 'New Contact';
          //this.contact = new Contact({});
      }

      //this.contactForm = this.createContactForm();
    
    }

  common: Common[];
  nameSelected: string;
  value: number;
  loginForm: FormGroup;
  ngOnInit() {

   
    this.loginForm = this._formBuilder.group({
     
      CONTACTNAME: ['', Validators.required],
      CONTACTTYPE: ['', Validators.required],
      isContactActive: ['', Validators.required],
      
      //person
      COMPANYNAME: ['', Validators.required],
      POSITION: ['', Validators.required],
      GIVENNAMES: ['', Validators.required],
      NAMETITLE: ['', Validators.required],
      MIDDLENAMES: ['', Validators.required],
      NAMELETTERS: ['', Validators.required],
      FAMILYNAME: ['', Validators.required],
      KNOWNBYOTHERNAME: ['', Validators.required],
      OTHERFAMILYNAME: ['', Validators.required],
      OTHERGIVENNAMES: ['', Validators.required],
      REASONFORCHANGE: ['', Validators.required],

      //Other
      GENDER: ['', Validators.required],
      DATEOFBIRTH: ['', Validators.required],
      MARITALSTATUS: ['', Validators.required],
      SPOUSE: ['', Validators.required],
      NUMBEROFDEPENDANTS: ['', Validators.required],
      BIRTHDAYREMINDER: ['', Validators.required],
      TOWNOFBIRTH: ['', Validators.required],
      COUNTRYOFBIRTH: ['', Validators.required],
      DATEOFDEATH: ['', Validators.required],
      CAUSEOFDEATH: ['', Validators.required],

      //address
      ADDRESS1: ['', Validators.required],
      ADDRESS2: ['', Validators.required],
      ADDRESS3: ['', Validators.required],
      SUBURB: ['', Validators.required],
      STATE: ['', Validators.required],
      POSTCODE: ['', Validators.required],
      COUNTRY: ['', Validators.required],
      SAMEASSTREET: ['', Validators.required],
      POSTALADDRESS1: ['', Validators.required],
      POSTALADDRESS2: ['', Validators.required],
      POSTALADDRESS3: ['', Validators.required],
      POSTALSUBURB: ['', Validators.required],
      POSTALSTATE: ['', Validators.required],
      POSTALPOSTCODE: ['', Validators.required],
      POSTALCOUNTRY: ['', Validators.required],
      DX: ['', Validators.required],
      DXSUBURB: ['', Validators.required],

      //ph/web
      PHONE: ['', Validators.required],
      PHONE2: ['', Validators.required],
      FAX: ['', Validators.required],
      FAX2: ['', Validators.required],
      MOBILE: ['', Validators.required],
      EMAIL: ['', Validators.required],
      EMAIL2: ['', Validators.required],
      ELECTRONICSERVICEEMAIL: ['', Validators.required],
      WEBADDRESS: ['', Validators.required],
      SKYPEUSERNAME: ['', Validators.required],

      //id
      PRACTICINGCERTIFICATENO: ['', Validators.required],
      ACN: ['', Validators.required],
      ABN: ['', Validators.required],
      TFN: ['', Validators.required],
      LICENCENO: ['', Validators.required],
      LICENCECOUNTRY: ['', Validators.required],
      NATIONALIDENTITYNO: ['', Validators.required],
      NATIONALIDENTITYCOUNTRY: ['', Validators.required],
      FAMILYCOURTLAWYERNO: ['', Validators.required],
      NOTES: ['', Validators.required],
      

    });
    this.common = [

      { Id: 1, Name: "Person" },
      { Id: 2, Name: "Company" },
      { Id: 3, Name: "Party" },
      { Id: 4, Name: "Payee/Payor" },

    ];

     this.nameSelected = "Person";

    //this.loginForm.valueChanges.subscribe(newVal => console.log(newVal))

  }

  ondialogcloseClick(): void {
    this.dialogRef.close(false);
  }

  onClick(value) {

    console.log(value);



  }

  // convenience getter for easy access to form fields
  get f() {
    //console.log(this.loginForm);
    return this.loginForm.controls;
  }
  ondialogSaveClick(): void {
    //call insert api 
    
        
      
    



    if(this.f.DATEOFBIRTH.value==null){
    this.toastr.error("please enter date using calender");
    }
    if(this.f.DATEOFDEATH.value==null){
      this.toastr.error("please enter date using calender");
    }

    let details={
      CONTACTNAME:this.f.CONTACTNAME.value,
      CONTACTTYPE:this.f.CONTACTTYPE.value,
      isContactActive:this.f.isContactActive.value,
      //person
      COMPANYNAME:this.f.COMPANYNAME.value,
      POSITION:this.f.POSITION.value,
      GIVENNAMES:this.f.GIVENNAMES.value,
      NAMETITLE:this.f.NAMETITLE.value,
      MIDDLENAMES:this.f.MIDDLENAMES.value,
      NAMELETTERS:this.f.NAMELETTERS.value,
      FAMILYNAME:this.f.FAMILYNAME.value,
      KNOWNBYOTHERNAME:this.f.KNOWNBYOTHERNAME.value,
      OTHERFAMILYNAME:this.f.OTHERFAMILYNAME.value,
      OTHERGIVENNAMES:this.f.OTHERGIVENNAMES.value,
      REASONFORCHANGE:this.f.REASONFORCHANGE.value,

      //others
      GENDER:this.f.GENDER.value,
      DATEOFBIRTH:this.f.DATEOFBIRTH.value._i,
      MARITALSTATUS:this.f.MARITALSTATUS.value,
      SPOUSE:this.f.SPOUSE.value,
      NUMBEROFDEPENDANTS:this.f.NUMBEROFDEPENDANTS.value,
      BIRTHDAYREMINDER:this.f.BIRTHDAYREMINDER.value,
      TOWNOFBIRTH:this.f.TOWNOFBIRTH.value,
      COUNTRYOFBIRTH:this.f.COUNTRYOFBIRTH.value,
      DATEOFDEATH:this.f.DATEOFDEATH.value._i,
      CAUSEOFDEATH:this.f.CAUSEOFDEATH.value,

      //address
      ADDRESS1:this.f.ADDRESS1.value,
      ADDRESS2:this.f.ADDRESS2.value,
      ADDRESS3:this.f.ADDRESS3.value,
      SUBURB:this.f.SUBURB.value,
      STATE:this.f.STATE.value,
      POSTCODE:this.f.POSTCODE.value,
      COUNTRY:this.f.COUNTRY.value,
      SAMEASSTREET:this.f.SAMEASSTREET.value,
      POSTALADDRESS1:this.f.POSTALADDRESS1.value,
      POSTALADDRESS2:this.f.POSTALADDRESS2.value,
      POSTALADDRESS3:this.f.POSTALADDRESS3.value,
      POSTALSUBURB:this.f.POSTALSUBURB.value,
      POSTALSTATE:this.f.POSTALSTATE.value,
      POSTALPOSTCODE:this.f.POSTALPOSTCODE.value,
      POSTALCOUNTRY:this.f.POSTALCOUNTRY.value,
      DX:this.f.DX.value,
      DXSUBURB:this.f.DXSUBURB.value,
      
      //ph/web
      PHONE:this.f.PHONE.value,
      PHONE2:this.f.PHONE2.value,
      FAX:this.f.FAX.value,
      FAX2:this.f.FAX2.value,
      MOBILE:this.f.MOBILE.value,
      EMAIL:this.f.EMAIL.value,
      EMAIL2:this.f.EMAIL2.value,
      ELECTRONICSERVICEEMAIL:this.f.ELECTRONICSERVICEEMAIL.value,
      WEBADDRESS:this.f.WEBADDRESS.value,
      SKYPEUSERNAME:this.f.SKYPEUSERNAME.value,

      //id
      PRACTICINGCERTIFICATENO:this.f.PRACTICINGCERTIFICATENO.value,
      ACN:this.f.ACN.value,
      ABN:this.f.ABN.value,
      TFN:this.f.TFN.value,
      LICENCENO:this.f.LICENCENO.value,
      LICENCECOUNTRY:this.f.LICENCECOUNTRY.value,
      NATIONALIDENTITYNO:this.f.NATIONALIDENTITYNO.value,
      NATIONALIDENTITYCOUNTRY:this.f.NATIONALIDENTITYCOUNTRY.value,
      FAMILYCOURTLAWYERNO:this.f.FAMILYCOURTLAWYERNO.value,
      NOTES:this.f.NOTES.value,
      

    }
    console.log(details);
    //this.dialogRef.close(details);

    this.addcontact.AddContactData(details);
  }

}
export class Common {
  public Id: Number;
  public Name: string;
}