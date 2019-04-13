import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AddContactService, ContactService } from './../../../../_services';
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
  isLoadingResults: boolean = false;
  isspiner: boolean = false;

  constructor(public dialogRef: MatDialogRef<ContactDialogComponent>, private _formBuilder: FormBuilder
    , private toastr: ToastrService, private Contact: ContactService, private addcontact: AddContactService,
    @Inject(MAT_DIALOG_DATA) public _data: any) {
    this.action = _data.action;
    this.dialogTitle = this.action === 'edit' ? 'Edit Contact' : 'New Contact';
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

    this.nameSelected = "Person";
    if (this.action === 'edit') {
      this.isLoadingResults = true;
      let contactguidforbody = { CONTACTGUID: localStorage.getItem('contactGuid') }
      this.Contact.getContact(contactguidforbody).subscribe(res => {
        let getContactData = res.DATA.CONTACTS[0];
        localStorage.setItem('getContact_edit', getContactData.CONTACTGUID);
        this.nameSelected = getContactData.CONTACTTYPE;
        this.active = getContactData.ACTIVE == 0 ? false : true;
        this.knowbyothername = getContactData.KNOWNBYOTHERNAME == 0 ? false : true;
        this.birthdayreminder = getContactData.BIRTHDAYREMINDER == 0 ? false : true;

        if (getContactData.SAMEASSTREET == 1) {
          this.loginForm.get('POSTALADDRESS1').disable();
          this.loginForm.get('POSTALADDRESS2').disable();
          this.loginForm.get('POSTALADDRESS3').disable();
          this.loginForm.get('POSTALSUBURB').disable();
          this.loginForm.get('POSTALSTATE').disable();
          this.loginForm.get('POSTALPOSTCODE').disable();
          this.loginForm.get('POSTALCOUNTRY').disable();
          this.samesstreet = true;
        } else {
          this.loginForm.get('POSTALADDRESS1').enable();
          this.loginForm.get('POSTALADDRESS2').enable();
          this.loginForm.get('POSTALADDRESS3').enable();
          this.loginForm.get('POSTALSUBURB').enable();
          this.loginForm.get('POSTALSTATE').enable();
          this.loginForm.get('POSTALPOSTCODE').enable();
          this.loginForm.get('POSTALCOUNTRY').enable();
          this.samesstreet = false;
        }


        //this.loginForm.controls['CONTACTGUID'].setValue(getContactData.CONTACTGUID);
        this.loginForm.controls['ContactName'].setValue(getContactData.CONTACTNAME);
        this.loginForm.controls['CONTACTTYPE'].setValue(getContactData.CONTACTTYPE);
        this.loginForm.controls['COMPANYNAME'].setValue(getContactData.COMPANYNAME);
        this.loginForm.controls['POSITION'].setValue(getContactData.POSITION);

        //this.loginForm.controls['ACTIVE'].setValue(getContactData.ACTIVE);
        this.loginForm.controls['ACTIVE'].setValue(this.active);

        this.loginForm.controls['GIVENNAMES'].setValue(getContactData.GIVENNAMES);
        this.loginForm.controls['NAMETITLE'].setValue(getContactData.NAMETITLE);
        this.loginForm.controls['MIDDLENAMES'].setValue(getContactData.MIDDLENAMES);
        this.loginForm.controls['NAMELETTERS'].setValue(getContactData.NAMELETTERS);
        this.loginForm.controls['FAMILYNAME'].setValue(getContactData.FAMILYNAME);
        this.loginForm.controls['KNOWNBYOTHERNAME'].setValue(this.knowbyothername);
        this.loginForm.controls['OTHERFAMILYNAME'].setValue(getContactData.OTHERFAMILYNAME);
        this.loginForm.controls['OTHERGIVENNAMES'].setValue(getContactData.OTHERGIVENNAMES);
        this.loginForm.controls['REASONFORCHANGE'].setValue(getContactData.REASONFORCHANGE);


        //other
        this.loginForm.controls['GENDER'].setValue(getContactData.GENDER);
        this.loginForm.controls['DATEOFBIRTH'].setValue(getContactData.DATEOFBIRTH);

        this.loginForm.controls['MARITALSTATUS'].setValue(getContactData.MARITALSTATUS);
        this.loginForm.controls['SPOUSE'].setValue(getContactData.SPOUSE);
        this.loginForm.controls['NUMBEROFDEPENDANTS'].setValue(getContactData.NUMBEROFDEPENDANTS);
        this.loginForm.controls['BIRTHDAYREMINDER'].setValue(this.birthdayreminder);
        this.loginForm.controls['TOWNOFBIRTH'].setValue(getContactData.TOWNOFBIRTH);
        this.loginForm.controls['COUNTRYOFBIRTH'].setValue(getContactData.COUNTRYOFBIRTH);
        this.loginForm.controls['DATEOFDEATH'].setValue(getContactData.DATEOFDEATH);
        this.loginForm.controls['CAUSEOFDEATH'].setValue(getContactData.CAUSEOFDEATH);
        //this.loginForm.valueChanges.subscribe(newVal => console.log(newVal))

        //address
        this.loginForm.controls['ADDRESS1'].setValue(getContactData.ADDRESS1);
        this.loginForm.controls['ADDRESS2'].setValue(getContactData.ADDRESS2);
        this.loginForm.controls['ADDRESS3'].setValue(getContactData.ADDRESS3);
        this.loginForm.controls['SUBURB'].setValue(getContactData.SUBURB);
        this.loginForm.controls['STATE'].setValue(getContactData.STATE);
        this.loginForm.controls['POSTCODE'].setValue(getContactData.POSTCODE);
        this.loginForm.controls['COUNTRY'].setValue(getContactData.COUNTRY);
        this.loginForm.controls['SAMEASSTREET'].setValue(this.samesstreet);
        this.loginForm.controls['POSTALADDRESS1'].setValue(getContactData.POSTALADDRESS1);
        this.loginForm.controls['POSTALADDRESS2'].setValue(getContactData.POSTALADDRESS2);
        this.loginForm.controls['POSTALADDRESS3'].setValue(getContactData.POSTALADDRESS3);
        this.loginForm.controls['POSTALSUBURB'].setValue(getContactData.POSTALSUBURB);
        this.loginForm.controls['POSTALSTATE'].setValue(getContactData.POSTALSTATE);
        this.loginForm.controls['POSTALPOSTCODE'].setValue(getContactData.POSTALPOSTCODE);
        this.loginForm.controls['POSTALCOUNTRY'].setValue(getContactData.POSTALCOUNTRY);
        this.loginForm.controls['DX'].setValue(getContactData.DX);
        this.loginForm.controls['DXSUBURB'].setValue(getContactData.DXSUBURB);

        //ph/web
        this.loginForm.controls['PHONE'].setValue(getContactData.PHONE);
        this.loginForm.controls['PHONE2'].setValue(getContactData.PHONE2);
        this.loginForm.controls['FAX'].setValue(getContactData.FAX);
        this.loginForm.controls['FAX2'].setValue(getContactData.FAX2);
        this.loginForm.controls['MOBILE'].setValue(getContactData.MOBILE);
        this.loginForm.controls['EMAIL'].setValue(getContactData.EMAIL);
        this.loginForm.controls['EMAIL2'].setValue(getContactData.EMAIL2);
        this.loginForm.controls['ELECTRONICSERVICEEMAIL'].setValue(getContactData.ELECTRONICSERVICEEMAIL);
        this.loginForm.controls['WEBADDRESS'].setValue(getContactData.WEBADDRESS);
        this.loginForm.controls['SKYPEUSERNAME'].setValue(getContactData.SKYPEUSERNAME);

        //id

        this.loginForm.controls['PRACTICINGCERTIFICATENO'].setValue(getContactData.PRACTICINGCERTIFICATENO);
        this.loginForm.controls['ACN'].setValue(getContactData.ACN);
        this.loginForm.controls['ABN'].setValue(getContactData.ABN);
        this.loginForm.controls['TFN'].setValue(getContactData.TFN);
        this.loginForm.controls['LICENCENO'].setValue(getContactData.LICENCENO);
        this.loginForm.controls['LICENCECOUNTRY'].setValue(getContactData.LICENCECOUNTRY);
        this.loginForm.controls['NATIONALIDENTITYNO'].setValue(getContactData.NATIONALIDENTITYNO);
        this.loginForm.controls['NATIONALIDENTITYCOUNTRY'].setValue(getContactData.NATIONALIDENTITYCOUNTRY);
        this.loginForm.controls['FAMILYCOURTLAWYERNO'].setValue(getContactData.FAMILYCOURTLAWYERNO);
        this.loginForm.controls['NOTES'].setValue(getContactData.NOTES);
        this.isLoadingResults = false;
      });

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
    this.isspiner = true;
    if (this.f.ContactName.value == "") {
      this.toastr.error("please enter Contact Name");
    } else {
      this.FormAction = this.action !== 'edit' ? 'insert' : 'update';
      //for edit contactGuid
      if (this.action !== 'edit') {
        this.contactguid = " ";
      } else {
        this.contactguid = localStorage.getItem('getContact_edit');
      }
      //for checkbox
      if (this.f.ACTIVE.value == true) {
        this.check = "1";
      } else {
        this.check = "0";
      }
      if (this.f.KNOWNBYOTHERNAME.value == true) {
        this.postknowbyothername = "1"
      }
      else {
        this.postknowbyothername = "0"
      }
      if (this.f.BIRTHDAYREMINDER.value == true) {
        this.postbirthdayreminder = "1"
      }
      else {
        this.postbirthdayreminder = "0"
      }
      if (this.f.SAMEASSTREET.value == true) {
        this.postsameasstreet = "1"
      }
      else {
        this.postsameasstreet = "0"
      }
      //let abc ={ FormAction: "insert"}
      let details = {

        CONTACTGUID: this.contactguid,
        FormAction: this.FormAction,
        //CONTACTGUID:this.f.CONTACTGUID.value,
        ContactName: this.f.ContactName.value,
        CONTACTTYPE: this.f.CONTACTTYPE.value,
        ACTIVE: this.check,
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
        DATEOFBIRTH: localStorage.getItem('DATEOFBIRTH'),
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
      if (this.action !== 'edit') {
        this.addcontact.AddContactData(details);
      } else {
        this.Contact.UpdateContact(details);
      }
    }
    this.isspiner = false;
  }

}
export class Common {
  public Id: Number;
  public Name: string;
}