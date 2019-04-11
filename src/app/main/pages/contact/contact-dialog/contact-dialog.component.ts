import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AddContactService, ContactService } from './../../../../_services';
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
  FormAction: string;
  abc: string;
  contactguid: string;
  check: any;
  active: boolean;
  knowbyothername: boolean;
  birthdayreminder: boolean;
  samesstreet: boolean;
  postknowbyothername: any;
  postbirthdayreminder: string;
  postsameasstreet: string;


  constructor(public dialogRef: MatDialogRef<ContactDialogComponent>, private _formBuilder: FormBuilder
    , private toastr: ToastrService, private Contact: ContactService, private addcontact: AddContactService, @Inject(MAT_DIALOG_DATA) public _data: any) {   // Set the defaults
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
     
      //CONTACTGUID: ['', Validators.required],
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

        if(this._data.contact.ACTIVE == 0 )
        {
        this.active=false;
         }
        else{
        this.active=true;
        }

        if(this._data.contact.KNOWNBYOTHERNAME == 0 )
        {
        this.knowbyothername=false;
         }
        else{
        this.knowbyothername=true;
        }
        if(this._data.contact.BIRTHDAYREMINDER == 0 )
        {
        this.birthdayreminder=false;
         }
        else{
        this.birthdayreminder=true;
        }
        if(this._data.contact.SAMEASSTREET == 0 )
        {
          this.loginForm.get('POSTALADDRESS1').disable();
          this.loginForm.get('POSTALADDRESS2').disable();
          this.loginForm.get('POSTALADDRESS3').disable();
          this.loginForm.get('POSTALSUBURB').disable();
          this.loginForm.get('POSTALSTATE').disable();
          this.loginForm.get('POSTALPOSTCODE').disable();
          this.loginForm.get('POSTALCOUNTRY').disable();
        this.samesstreet=false;
         }
        else{
          this.loginForm.get('POSTALADDRESS1').enable();
          this.loginForm.get('POSTALADDRESS2').enable();
          this.loginForm.get('POSTALADDRESS3').enable();
          this.loginForm.get('POSTALSUBURB').enable();
          this.loginForm.get('POSTALSTATE').enable();
          this.loginForm.get('POSTALPOSTCODE').enable();
          this.loginForm.get('POSTALCOUNTRY').enable();
        this.samesstreet=true;
        }


     //this.loginForm.controls['CONTACTGUID'].setValue(this._data.contact.CONTACTGUID);
     this.loginForm.controls['ContactName'].setValue(this._data.contact.CONTACTNAME);
     this.loginForm.controls['CONTACTTYPE'].setValue(this._data.contact.CONTACTTYPE);
     this.loginForm.controls['COMPANYNAME'].setValue(this._data.contact.COMPANYNAME);
     this.loginForm.controls['POSITION'].setValue(this._data.contact.POSITION);

     //this.loginForm.controls['ACTIVE'].setValue(this._data.contact.ACTIVE);
    this.loginForm.controls['ACTIVE'].setValue(this.active);

     this.loginForm.controls['GIVENNAMES'].setValue(this._data.contact.GIVENNAMES);
     this.loginForm.controls['NAMETITLE'].setValue(this._data.contact.NAMETITLE);
     this.loginForm.controls['MIDDLENAMES'].setValue(this._data.contact.MIDDLENAMES);
     this.loginForm.controls['NAMELETTERS'].setValue(this._data.contact.NAMELETTERS);
     this.loginForm.controls['FAMILYNAME'].setValue(this._data.contact.FAMILYNAME);
     this.loginForm.controls['KNOWNBYOTHERNAME'].setValue( this.knowbyothername);
     this.loginForm.controls['OTHERFAMILYNAME'].setValue(this._data.contact.OTHERFAMILYNAME);
     this.loginForm.controls['OTHERGIVENNAMES'].setValue(this._data.contact.OTHERGIVENNAMES);
     this.loginForm.controls['REASONFORCHANGE'].setValue(this._data.contact.REASONFORCHANGE);
    

     //other
     this.loginForm.controls['GENDER'].setValue(this._data.contact.GENDER);
     this.loginForm.controls['DATEOFBIRTH'].setValue(this._data.contact.DATEOFBIRTH);

     this.loginForm.controls['MARITALSTATUS'].setValue(this._data.contact.MARITALSTATUS);
     this.loginForm.controls['SPOUSE'].setValue(this._data.contact.SPOUSE);
     this.loginForm.controls['NUMBEROFDEPENDANTS'].setValue(this._data.contact.NUMBEROFDEPENDANTS);
     this.loginForm.controls['BIRTHDAYREMINDER'].setValue(this.birthdayreminder );
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
     this.loginForm.controls['SAMEASSTREET'].setValue(this.samesstreet); 
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
    if (this.f.ContactName.value == "") {
      this.toastr.error("please enter Contact Name");
    }
    else{
    if (this.action !== 'edit') {
      this.FormAction= "insert";
    } else {
      this.FormAction= "update";
    }

    //for edit contactGuid

    if (this.action !== 'edit') {
      this.contactguid= " ";
    } else {
      this.contactguid=this._data.contact.CONTACTGUID ;
    }

    //for checkbox
    if(this.f.ACTIVE.value == true ){
      this.check="1";
    }else{
      this.check="0";
    }
    if(this.f.KNOWNBYOTHERNAME.value == true){
      this.postknowbyothername="1"
    }
    else{
      this.postknowbyothername="0"
    }
    if(this.f.BIRTHDAYREMINDER.value == true){
      this.postbirthdayreminder="1"
    }
    else{
      this.postbirthdayreminder="0"
    }
    if(this.f.SAMEASSTREET.value == true){
      this.postsameasstreet="1"
    }
    else{
      this.postsameasstreet="0"
    }
    //let abc ={ FormAction: "insert"}
    let details={

      CONTACTGUID:this.contactguid,
      FormAction: this.FormAction,
      //CONTACTGUID:this.f.CONTACTGUID.value,
      ContactName:this.f.ContactName.value,
      CONTACTTYPE:this.f.CONTACTTYPE.value,
      ACTIVE:this.check,
      //person
      COMPANYNAME: this.f.COMPANYNAME.value,
      POSITION: this.f.POSITION.value,
      GIVENNAMES: this.f.GIVENNAMES.value,
      NAMETITLE: this.f.NAMETITLE.value,
      MIDDLENAMES: this.f.MIDDLENAMES.value,
      NAMELETTERS: this.f.NAMELETTERS.value,
      FAMILYNAME: this.f.FAMILYNAME.value,
      KNOWNBYOTHERNAME: this.postknowbyothername,
      OTHERFAMILYNAME: this.f.OTHERFAMILYNAME.value,
      OTHERGIVENNAMES: this.f.OTHERGIVENNAMES.value,
      REASONFORCHANGE: this.f.REASONFORCHANGE.value,

      //others
      GENDER: this.f.GENDER.value,
      DATEOFBIRTH:localStorage.getItem('DATEOFBIRTH'),
      MARITALSTATUS: this.f.MARITALSTATUS.value,
      SPOUSE: this.f.SPOUSE.value,
      NUMBEROFDEPENDANTS: this.f.NUMBEROFDEPENDANTS.value,
      BIRTHDAYREMINDER: this.postbirthdayreminder,
      TOWNOFBIRTH: this.f.TOWNOFBIRTH.value,
      COUNTRYOFBIRTH: this.f.COUNTRYOFBIRTH.value,
      DATEOFDEATH: localStorage.getItem('DATEOFDEATH'),
      CAUSEOFDEATH: this.f.CAUSEOFDEATH.value,

      //address
      ADDRESS1: this.f.ADDRESS1.value,
      ADDRESS2: this.f.ADDRESS2.value,
      ADDRESS3: this.f.ADDRESS3.value,
      SUBURB: this.f.SUBURB.value,
      STATE: this.f.STATE.value,
      POSTCODE: this.f.POSTCODE.value,
      COUNTRY: this.f.COUNTRY.value,
      SAMEASSTREET: this.postsameasstreet,
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
    this.addcontact.AddContactData(details);
    console.log(details);
    
    }
    else{
      //let getContactGuId = localStorage.getItem('contactGuid');
      this.Contact.UpdateContact(details);
      console.log(details);
    }
    this.dialogRef.close(details);

    localStorage.removeItem('DATEOFBIRTH');
    localStorage.removeItem('DATEOFDEATH');

    //for refresh
    //this.Contact.ContactData();

  }
  }
  
}
export class Common {
  public Id: Number;
  public Name: string;
}