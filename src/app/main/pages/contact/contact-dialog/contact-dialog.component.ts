import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AddContactService } from './../../../../_services';
import { ToolbarComponent } from 'app/layout/components/toolbar/toolbar.component';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss']
})
export class ContactDialogComponent implements OnInit {

  action: string;
  //contact: string;
  dialogTitle: string;


  constructor(public dialogRef: MatDialogRef<ContactDialogComponent>, private _formBuilder: FormBuilder
    , private toastr: ToastrService, private addcontact: AddContactService, @Inject(MAT_DIALOG_DATA) public _data: any) {   // Set the defaults
    //this.action = _data.action;
    this.action = _data.action;
    //  console.log(_data.contact.DATEOFBIRTH);

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Contact';

    }
    else {
      this.dialogTitle = 'New Contact';
      //this.contact = new Contact({});
    }


  }

  common: Common[];
  nameSelected: string;
  value: number;
  loginForm: FormGroup;
  ngOnInit() {


    this.loginForm = this._formBuilder.group({
     
      CONTACTGUID: ['', Validators.required],
      ContactName: ['', Validators.required],
      CONTACTTYPE: ['', Validators.required],
      ACTIVE: ['', Validators.required],
      
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

    if (this.action !== 'edit') {
      this.nameSelected = "Person";
    } else {
      this.nameSelected = this._data.contact.CONTACTTYPE;
    }

      if ( this.action === 'edit' )
      {

     this.loginForm.controls['CONTACTGUID'].setValue(this._data.contact.CONTACTGUID);
     this.loginForm.controls['ContactName'].setValue(this._data.contact.CONTACTNAME);
     this.loginForm.controls['CONTACTTYPE'].setValue(this._data.contact.CONTACTTYPE);
     this.loginForm.controls['COMPANYNAME'].setValue(this._data.contact.COMPANYNAME);
     this.loginForm.controls['POSITION'].setValue(this._data.contact.POSITION);

     this.loginForm.controls['ACTIVE'].setValue(this._data.contact.POSITION);

     this.loginForm.controls['GIVENNAMES'].setValue(this._data.contact.GIVENNAMES);
     this.loginForm.controls['NAMETITLE'].setValue(this._data.contact.NAMETITLE);
     this.loginForm.controls['MIDDLENAMES'].setValue(this._data.contact.MIDDLENAMES);
     this.loginForm.controls['NAMELETTERS'].setValue(this._data.contact.NAMELETTERS);
     this.loginForm.controls['FAMILYNAME'].setValue(this._data.contact.FAMILYNAME);
     this.loginForm.controls['KNOWNBYOTHERNAME'].setValue(this._data.contact.KNOWNBYOTHERNAME);
     this.loginForm.controls['OTHERFAMILYNAME'].setValue(this._data.contact.OTHERFAMILYNAME);
     this.loginForm.controls['OTHERGIVENNAMES'].setValue(this._data.contact.OTHERGIVENNAMES);
     this.loginForm.controls['REASONFORCHANGE'].setValue(this._data.contact.REASONFORCHANGE);
    

     //other
     this.loginForm.controls['GENDER'].setValue(this._data.contact.GENDER);
     this.loginForm.controls['DATEOFBIRTH'].setValue(this._data.contact.DATEOFBIRTH);

     this.loginForm.controls['MARITALSTATUS'].setValue(this._data.contact.MARITALSTATUS);
     this.loginForm.controls['SPOUSE'].setValue(this._data.contact.SPOUSE);
     this.loginForm.controls['NUMBEROFDEPENDANTS'].setValue(this._data.contact.NUMBEROFDEPENDANTS);
     this.loginForm.controls['BIRTHDAYREMINDER'].setValue(this._data.contact.BIRTHDAYREMINDER);
     this.loginForm.controls['TOWNOFBIRTH'].setValue(this._data.contact.TOWNOFBIRTH);
     this.loginForm.controls['COUNTRYOFBIRTH'].setValue(this._data.contact.COUNTRYOFBIRTH);
     this.loginForm.controls['DATEOFDEATH'].setValue(this._data.contact.DATEOFDEATH);
     this.loginForm.controls['CAUSEOFDEATH'].setValue(this._data.contact.CAUSEOFDEATH); 
     //this.loginForm.valueChanges.subscribe(newVal => console.log(newVal))

     //address
     this.loginForm.controls['ADDRESS1'].setValue(this._data.contact.ADDRESS1); 
     this.loginForm.controls['ADDRESS2'].setValue(this._data.contact.ADDRESS2); 
     this.loginForm.controls['ADDRESS3'].setValue(this._data.contact.ADDRESS3); 
     this.loginForm.controls['SUBURB'].setValue(this._data.contact.SUBURB); 
     this.loginForm.controls['STATE'].setValue(this._data.contact.STATE); 
     this.loginForm.controls['POSTCODE'].setValue(this._data.contact.POSTCODE); 
     this.loginForm.controls['COUNTRY'].setValue(this._data.contact.COUNTRY); 
     this.loginForm.controls['SAMEASSTREET'].setValue(this._data.contact.SAMEASSTREET); 
     this.loginForm.controls['POSTALADDRESS1'].setValue(this._data.contact.POSTALADDRESS1); 
     this.loginForm.controls['POSTALADDRESS2'].setValue(this._data.contact.POSTALADDRESS2); 
     this.loginForm.controls['POSTALADDRESS3'].setValue(this._data.contact.POSTALADDRESS3); 
     this.loginForm.controls['POSTALSUBURB'].setValue(this._data.contact.POSTALSUBURB); 
     this.loginForm.controls['POSTALSTATE'].setValue(this._data.contact.POSTALSTATE); 
     this.loginForm.controls['POSTALPOSTCODE'].setValue(this._data.contact.POSTALPOSTCODE); 
     this.loginForm.controls['POSTALCOUNTRY'].setValue(this._data.contact.POSTALCOUNTRY); 
     this.loginForm.controls['DX'].setValue(this._data.contact.DX); 
     this.loginForm.controls['DXSUBURB'].setValue(this._data.contact.DXSUBURB);

      //ph/web
      this.loginForm.controls['PHONE'].setValue(this._data.contact.PHONE);
      this.loginForm.controls['PHONE2'].setValue(this._data.contact.PHONE2);
      this.loginForm.controls['FAX'].setValue(this._data.contact.FAX);
      this.loginForm.controls['FAX2'].setValue(this._data.contact.FAX2);
      this.loginForm.controls['MOBILE'].setValue(this._data.contact.MOBILE);
      this.loginForm.controls['EMAIL'].setValue(this._data.contact.EMAIL);
      this.loginForm.controls['EMAIL2'].setValue(this._data.contact.EMAIL2);
      this.loginForm.controls['ELECTRONICSERVICEEMAIL'].setValue(this._data.contact.ELECTRONICSERVICEEMAIL);
      this.loginForm.controls['WEBADDRESS'].setValue(this._data.contact.WEBADDRESS);
      this.loginForm.controls['SKYPEUSERNAME'].setValue(this._data.contact.SKYPEUSERNAME);

      //id

      this.loginForm.controls['PRACTICINGCERTIFICATENO'].setValue(this._data.contact.PRACTICINGCERTIFICATENO);
      this.loginForm.controls['ACN'].setValue(this._data.contact.ACN);
      this.loginForm.controls['ABN'].setValue(this._data.contact.ABN);
      this.loginForm.controls['TFN'].setValue(this._data.contact.TFN);
      this.loginForm.controls['LICENCENO'].setValue(this._data.contact.LICENCENO);
      this.loginForm.controls['LICENCECOUNTRY'].setValue(this._data.contact.LICENCECOUNTRY);
      this.loginForm.controls['NATIONALIDENTITYNO'].setValue(this._data.contact.NATIONALIDENTITYNO);
      this.loginForm.controls['NATIONALIDENTITYCOUNTRY'].setValue(this._data.contact.NATIONALIDENTITYCOUNTRY);
      this.loginForm.controls['FAMILYCOURTLAWYERNO'].setValue(this._data.contact.FAMILYCOURTLAWYERNO);
      this.loginForm.controls['NOTES'].setValue(this._data.contact.NOTES);

    }

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
    // console.log(this.f.DATEOFBIRTH.value);
    
    // if(this.f.DATEOFBIRTH.value==null){
    // this.toastr.error("please enter date using calender");
    // }
    // if(this.f.DATEOFDEATH.value==null){
    //   this.toastr.error("please enter date using calender");
    // }
    if (this.f.ContactName.value == "") {
      this.toastr.error("please enter Contact Name");
    }


    let details={
      CONTACTGUID:this.f.CONTACTGUID.value,
      ContactName:this.f.ContactName.value,
      CONTACTTYPE:this.f.CONTACTTYPE.value,
      ACTIVE:this.f.ACTIVE.value,
      //person
      COMPANYNAME: this.f.COMPANYNAME.value,
      POSITION: this.f.POSITION.value,
      GIVENNAMES: this.f.GIVENNAMES.value,
      NAMETITLE: this.f.NAMETITLE.value,
      MIDDLENAMES: this.f.MIDDLENAMES.value,
      NAMELETTERS: this.f.NAMELETTERS.value,
      FAMILYNAME: this.f.FAMILYNAME.value,
      KNOWNBYOTHERNAME: this.f.KNOWNBYOTHERNAME.value,
      OTHERFAMILYNAME: this.f.OTHERFAMILYNAME.value,
      OTHERGIVENNAMES: this.f.OTHERGIVENNAMES.value,
      REASONFORCHANGE: this.f.REASONFORCHANGE.value,

      //others
      GENDER: this.f.GENDER.value,
      DATEOFBIRTH: this.f.DATEOFBIRTH.value._i,
      MARITALSTATUS: this.f.MARITALSTATUS.value,
      SPOUSE: this.f.SPOUSE.value,
      NUMBEROFDEPENDANTS: this.f.NUMBEROFDEPENDANTS.value,
      BIRTHDAYREMINDER: this.f.BIRTHDAYREMINDER.value,
      TOWNOFBIRTH: this.f.TOWNOFBIRTH.value,
      COUNTRYOFBIRTH: this.f.COUNTRYOFBIRTH.value,
      DATEOFDEATH: this.f.DATEOFDEATH.value._i,
      CAUSEOFDEATH: this.f.CAUSEOFDEATH.value,

      //address
      ADDRESS1: this.f.ADDRESS1.value,
      ADDRESS2: this.f.ADDRESS2.value,
      ADDRESS3: this.f.ADDRESS3.value,
      SUBURB: this.f.SUBURB.value,
      STATE: this.f.STATE.value,
      POSTCODE: this.f.POSTCODE.value,
      COUNTRY: this.f.COUNTRY.value,
      SAMEASSTREET: this.f.SAMEASSTREET.value,
      POSTALADDRESS1: this.f.POSTALADDRESS1.value,
      POSTALADDRESS2: this.f.POSTALADDRESS2.value,
      POSTALADDRESS3: this.f.POSTALADDRESS3.value,
      POSTALSUBURB: this.f.POSTALSUBURB.value,
      POSTALSTATE: this.f.POSTALSTATE.value,
      POSTALPOSTCODE: this.f.POSTALPOSTCODE.value,
      POSTALCOUNTRY: this.f.POSTALCOUNTRY.value,
      DX: this.f.DX.value,
      DXSUBURB: this.f.DXSUBURB.value,

      //ph/web
      PHONE: this.f.PHONE.value,
      PHONE2: this.f.PHONE2.value,
      FAX: this.f.FAX.value,
      FAX2: this.f.FAX2.value,
      MOBILE: this.f.MOBILE.value,
      EMAIL: this.f.EMAIL.value,
      EMAIL2: this.f.EMAIL2.value,
      ELECTRONICSERVICEEMAIL: this.f.ELECTRONICSERVICEEMAIL.value,
      WEBADDRESS: this.f.WEBADDRESS.value,
      SKYPEUSERNAME: this.f.SKYPEUSERNAME.value,

      //id
      PRACTICINGCERTIFICATENO: this.f.PRACTICINGCERTIFICATENO.value,
      ACN: this.f.ACN.value,
      ABN: this.f.ABN.value,
      TFN: this.f.TFN.value,
      LICENCENO: this.f.LICENCENO.value,
      LICENCECOUNTRY: this.f.LICENCECOUNTRY.value,
      NATIONALIDENTITYNO: this.f.NATIONALIDENTITYNO.value,
      NATIONALIDENTITYCOUNTRY: this.f.NATIONALIDENTITYCOUNTRY.value,
      FAMILYCOURTLAWYERNO: this.f.FAMILYCOURTLAWYERNO.value,
      NOTES: this.f.NOTES.value,


    }

    if(this.action !== 'edit'){
      console.log("fjsdlfldsljfj");
    this.addcontact.AddContactData(details);
    console.log(details);
    }
    else{
      console.log("22222222222fjsdlfldsljfj");
      //let getContactGuId = localStorage.getItem('contactGuid');
      this.addcontact.UpdateContact(details);
    }
    //this.dialogRef.close(details);


  }

}
export class Common {
  public Id: Number;
  public Name: string;
}