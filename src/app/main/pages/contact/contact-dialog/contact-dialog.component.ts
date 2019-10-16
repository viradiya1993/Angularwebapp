import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MainAPiServiceService } from './../../../../_services';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { fuseAnimations } from '@fuse/animations';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ContactDialogComponent implements OnInit {
  subscription: Subscription;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  errorWarningData: any = {};
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
  postsameasstreet: string;
  isLoadingResults: boolean = false;
  isspiner: boolean = false;
  dateofbirth: any;
  dateofdeath: string;
  editDataCompny: boolean = true;
  namepusharray: any = [];

  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<ContactDialogComponent>,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    private _mainAPiServiceService: MainAPiServiceService,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.action = _data.action;
    if (this.action === 'edit')
      this.dialogTitle = 'Update Contact';
    else if (this.action == 'duplicate')
      this.dialogTitle = 'Duplicate Contact'
    else
      this.dialogTitle = 'New Contact';
  }
  common: Common[];
  nameSelected: string;
  value: number;
  contactForm: FormGroup;
  ngOnInit() {
    this.contactForm = this._formBuilder.group({
      PreferedName: [''],
      //CONTACTGUID: ['', Validators.required],
      CONTACTNAME: ['', Validators.required],
      CONTACTTYPE: ['', Validators.required],
      ACTIVE: [''],
      //Company
      POSITION: [],
      //person
      COMPANYCONTACTGUID: [''],
      SALUTATION: [''],
      COMPANYCONTACTGUIDTEXT: [''],
      TITLE: [''],
      GIVENNAMES: [''],
      NAMETITLE: [''],
      MIDDLENAMES: [''],
      NAMELETTERS: [''],
      FAMILYNAME: [''],
      KNOWNBYOTHERNAME: [''],
      OTHERFAMILYNAME: [''],
      OTHERGIVENNAMES: [''],
      REASONFORCHANGE: [''],
      USEPARENTADDRESS: [''],
      //Other
      GENDER: [''],
      DATEOFBIRTH: [''],
      MARITALSTATUS: [''],
      SPOUSE: [''],
      NUMBEROFDEPENDANTS: [''],
      BIRTHDAYREMINDER: [''],
      TOWNOFBIRTH: [''],
      COUNTRYOFBIRTH: [''],
      DATEOFDEATH: [''],
      CAUSEOFDEATH: [''],
      //address
      ADDRESS1: [''],
      ADDRESS2: [''],
      ADDRESS3: [''],
      SUBURB: [''],
      STATE: [''],
      POSTCODE: [''],
      COUNTRY: [''],
      SAMEASSTREET: [''],
      POSTALADDRESS1: [''],
      POSTALADDRESS2: [''],
      POSTALADDRESS3: [''],
      POSTALSUBURB: [''],
      POSTALSTATE: [''],
      POSTALPOSTCODE: [''],
      POSTALCOUNTRY: [''],
      DX: [''],
      DXSUBURB: [''],
      //ph/web
      PHONE: [''],
      PHONE2: [''],
      FAX: [''],
      FAX2: [''],
      MOBILE: [''],
      EMAIL: [''],
      EMAIL2: [''],
      ELECTRONICSERVICEEMAIL: [''],
      WEBADDRESS: [''],
      SKYPEUSERNAME: [''],
      //id
      PRACTICINGCERTIFICATENO: [''],
      ACN: [''],
      ABN: [''],
      TFN: [''],
      LICENCENO: [''],
      LICENCECOUNTRY: [''],
      NATIONALIDENTITYNO: [''],
      NATIONALIDENTITYCOUNTRY: [''],
      FAMILYCOURTLAWYERNO: [''],
      NOTES: [''],
    });
    this.common = [
      { Id: 1, Name: "Person" },
      { Id: 2, Name: "Company" },
      { Id: 3, Name: "Party" },
      { Id: 4, Name: "Payee/Payor" },
    ];

    this.nameSelected = "Person";
    if (this.action === 'edit' || this.action === 'duplicate') {
      this.isLoadingResults = true;
      let contactguidforbody = { CONTACTGUID: localStorage.getItem('contactGuid') }
      this._mainAPiServiceService.getSetData(contactguidforbody, 'GetContact').subscribe(res => {
        if (res.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        } else {
          if (res.DATA.CONTACTS[0]) {
            let getContactData = res.DATA.CONTACTS[0];
            this.editDataCompny = (getContactData.COMPANYCONTACTGUID != '' && getContactData.COMPANYNAME != '') ? false : true;
            localStorage.setItem('getContact_edit', getContactData.CONTACTGUID);
            this.nameSelected = getContactData.CONTACTTYPE;
            this.active = getContactData.ACTIVE == 0 ? false : true;
            // this.knowbyothername = getContactData.KNOWNBYOTHERNAME == 0 ? true : false;
            this.birthdayreminder = getContactData.BIRTHDAYREMINDER == 0 ? false : true;
            if (getContactData.KNOWNBYOTHERNAME == 0) {
              this.knowbyothername = false;
              this.contactForm.get('OTHERGIVENNAMES').disable();
              this.contactForm.get('OTHERFAMILYNAME').disable();
              this.contactForm.get('REASONFORCHANGE').disable();
            } else {
              this.knowbyothername = true;
              this.contactForm.get('OTHERGIVENNAMES').enable();
              this.contactForm.get('OTHERFAMILYNAME').enable();
              this.contactForm.get('REASONFORCHANGE').enable();
            }
            if (getContactData.SAMEASSTREET == 1) {
              this.contactForm.get('POSTALADDRESS1').disable();
              this.contactForm.get('POSTALADDRESS2').disable();
              this.contactForm.get('POSTALADDRESS3').disable();
              this.contactForm.get('POSTALSUBURB').disable();
              this.contactForm.get('POSTALSTATE').disable();
              this.contactForm.get('POSTALPOSTCODE').disable();
              this.contactForm.get('POSTALCOUNTRY').disable();
              this.samesstreet = true;
            } else {
              this.contactForm.get('POSTALADDRESS1').enable();
              this.contactForm.get('POSTALADDRESS2').enable();
              this.contactForm.get('POSTALADDRESS3').enable();
              this.contactForm.get('POSTALSUBURB').enable();
              this.contactForm.get('POSTALSTATE').enable();
              this.contactForm.get('POSTALPOSTCODE').enable();
              this.contactForm.get('POSTALCOUNTRY').enable();
              this.samesstreet = false;
            }
            // this.contactForm.controls['CONTACTGUID'].setValue(getContactData.CONTACTGUID);
            this.contactForm.controls['CONTACTNAME'].setValue(getContactData.CONTACTNAME);
            this.contactForm.controls['CONTACTTYPE'].setValue(getContactData.CONTACTTYPE);
            this.contactForm.controls['COMPANYCONTACTGUID'].setValue(getContactData.COMPANYCONTACTGUID);
            this.contactForm.controls['COMPANYCONTACTGUIDTEXT'].setValue(getContactData.COMPANYNAME);
            this.contactForm.controls['TITLE'].setValue(getContactData.TITLE);
            this.contactForm.controls['SALUTATION'].setValue(getContactData.SALUTATION);
            // this.contactForm.controls['ACTIVE'].setValue(getContactData.ACTIVE);
            this.contactForm.controls['ACTIVE'].setValue(this.active);
            this.contactForm.controls['USEPARENTADDRESS'].setValue(getContactData.USEPARENTADDRESS == 0 ? false : true);
            this.contactForm.controls['GIVENNAMES'].setValue(getContactData.GIVENNAMES);
            this.contactForm.controls['NAMETITLE'].setValue(getContactData.NAMETITLE);
            this.contactForm.controls['MIDDLENAMES'].setValue(getContactData.MIDDLENAMES);
            this.contactForm.controls['NAMELETTERS'].setValue(getContactData.NAMELETTERS);
            this.contactForm.controls['FAMILYNAME'].setValue(getContactData.FAMILYNAME);
            this.contactForm.controls['KNOWNBYOTHERNAME'].setValue(this.knowbyothername);
            this.contactForm.controls['OTHERFAMILYNAME'].setValue(getContactData.OTHERFAMILYNAME);
            this.contactForm.controls['OTHERGIVENNAMES'].setValue(getContactData.OTHERGIVENNAMES);
            this.contactForm.controls['REASONFORCHANGE'].setValue(getContactData.REASONFORCHANGE);
            //Company
            this.contactForm.controls['POSITION'].setValue(getContactData.POSITION);
            //Other
            this.contactForm.controls['GENDER'].setValue(getContactData.GENDER);
            let DATEOFBIRTH = getContactData.DATEOFBIRTH.split("/");
            this.contactForm.controls['DATEOFBIRTH'].setValue(new Date(DATEOFBIRTH[1] + '/' + DATEOFBIRTH[0] + '/' + DATEOFBIRTH[2]));
            let DATEOFDEATH = getContactData.DATEOFDEATH.split("/");
            this.contactForm.controls['DATEOFDEATH'].setValue(new Date(DATEOFDEATH[1] + '/' + DATEOFDEATH[0] + '/' + DATEOFDEATH[2]));

            this.contactForm.controls['MARITALSTATUS'].setValue(getContactData.MARITALSTATUS);
            this.contactForm.controls['SPOUSE'].setValue(getContactData.SPOUSE);
            this.contactForm.controls['NUMBEROFDEPENDANTS'].setValue(getContactData.NUMBEROFDEPENDANTS);
            this.contactForm.controls['BIRTHDAYREMINDER'].setValue(this.birthdayreminder);
            this.contactForm.controls['TOWNOFBIRTH'].setValue(getContactData.TOWNOFBIRTH);
            this.contactForm.controls['COUNTRYOFBIRTH'].setValue(getContactData.COUNTRYOFBIRTH);
            // this.contactForm.controls['DATEOFBIRTH'].setValue(getContactData.DATEOFBIRTH);
            // this.contactForm.controls['DATEOFDEATH'].setValue(getContactData.DATEOFDEATH);
            this.contactForm.controls['CAUSEOFDEATH'].setValue(getContactData.CAUSEOFDEATH);
            //this.contactForm.valueChanges.subscribe(newVal => console.log(newVal))
            //address
            this.contactForm.controls['ADDRESS1'].setValue(getContactData.ADDRESS1);
            this.contactForm.controls['ADDRESS2'].setValue(getContactData.ADDRESS2);
            this.contactForm.controls['ADDRESS3'].setValue(getContactData.ADDRESS3);
            this.contactForm.controls['SUBURB'].setValue(getContactData.SUBURB);
            this.contactForm.controls['STATE'].setValue(getContactData.STATE);
            this.contactForm.controls['POSTCODE'].setValue(getContactData.POSTCODE);
            this.contactForm.controls['COUNTRY'].setValue(getContactData.COUNTRY);
            this.contactForm.controls['SAMEASSTREET'].setValue(this.samesstreet);
            this.contactForm.controls['POSTALADDRESS1'].setValue(getContactData.POSTALADDRESS1);
            this.contactForm.controls['POSTALADDRESS2'].setValue(getContactData.POSTALADDRESS2);
            this.contactForm.controls['POSTALADDRESS3'].setValue(getContactData.POSTALADDRESS3);
            this.contactForm.controls['POSTALSUBURB'].setValue(getContactData.POSTALSUBURB);
            this.contactForm.controls['POSTALSTATE'].setValue(getContactData.POSTALSTATE);
            this.contactForm.controls['POSTALPOSTCODE'].setValue(getContactData.POSTALPOSTCODE);
            this.contactForm.controls['POSTALCOUNTRY'].setValue(getContactData.POSTALCOUNTRY);
            this.contactForm.controls['DX'].setValue(getContactData.DX);
            this.contactForm.controls['DXSUBURB'].setValue(getContactData.DXSUBURB);

            //ph/web
            this.contactForm.controls['PHONE'].setValue(getContactData.PHONE);
            this.contactForm.controls['PHONE2'].setValue(getContactData.PHONE2);
            this.contactForm.controls['FAX'].setValue(getContactData.FAX);
            this.contactForm.controls['FAX2'].setValue(getContactData.FAX2);
            this.contactForm.controls['MOBILE'].setValue(getContactData.MOBILE);
            this.contactForm.controls['EMAIL'].setValue(getContactData.EMAIL);
            this.contactForm.controls['EMAIL2'].setValue(getContactData.EMAIL2);
            this.contactForm.controls['ELECTRONICSERVICEEMAIL'].setValue(getContactData.ELECTRONICSERVICEEMAIL);
            this.contactForm.controls['WEBADDRESS'].setValue(getContactData.WEBADDRESS);
            this.contactForm.controls['SKYPEUSERNAME'].setValue(getContactData.SKYPEUSERNAME);

            //id
            this.contactForm.controls['PRACTICINGCERTIFICATENO'].setValue(getContactData.PRACTICINGCERTIFICATENO);
            this.contactForm.controls['ACN'].setValue(getContactData.ACN);
            this.contactForm.controls['ABN'].setValue(getContactData.ABN);
            this.contactForm.controls['TFN'].setValue(getContactData.TFN);
            this.contactForm.controls['LICENCENO'].setValue(getContactData.LICENCENO);
            this.contactForm.controls['LICENCECOUNTRY'].setValue(getContactData.LICENCECOUNTRY);
            this.contactForm.controls['NATIONALIDENTITYNO'].setValue(getContactData.NATIONALIDENTITYNO);
            this.contactForm.controls['NATIONALIDENTITYCOUNTRY'].setValue(getContactData.NATIONALIDENTITYCOUNTRY);
            this.contactForm.controls['FAMILYCOURTLAWYERNO'].setValue(getContactData.FAMILYCOURTLAWYERNO);
            this.contactForm.controls['NOTES'].setValue(getContactData.NOTES);
            this.isLoadingResults = false;
          } else {
            this.toastr.error("Can't Find Contact Details");
            this.dialogRef.close(false);
          }
        }
      });
    } else {
      this.contactForm.controls['ACTIVE'].setValue(true);
    }
  }
  splitname() {
    this.namepusharray = [];
    let val: any = (this.f.CONTACTNAME.value).split(' ');
    let val1 = val[0];
    let val2 = val.length - 1;
    let val3 = val[val2];
    val.forEach(element => {
      if (element != val1) {
        if (element != val3) {
          this.namepusharray.push(element);
        }
      }
    });
    this.contactForm.controls['SALUTATION'].setValue(val1);
    this.contactForm.controls['GIVENNAMES'].setValue(val1);
    this.contactForm.controls['FAMILYNAME'].setValue(val3);
    this.contactForm.controls['MIDDLENAMES'].setValue(this.namepusharray.join(' '));
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.contactForm.controls;
  }
  ondialogSaveClick(): void {
    //for date handaling 
    this.dateofbirth = this.f.DATEOFBIRTH.touched == false ? "" : localStorage.getItem('DATEOFBIRTH');
    this.dateofdeath = this.f.DATEOFDEATH.touched == false ? "" : localStorage.getItem('DATEOFDEATH');

    this.isspiner = true;
    this.FormAction = this.action !== 'edit' ? 'insert' : 'update';
    // for edit contactGuid
    this.contactguid = this.action !== 'edit' ? "" : localStorage.getItem('getContact_edit');
    //for checkbox
    this.postsameasstreet = this.f.SAMEASSTREET.value == true ? "1" : "0";
    let detailsdata = {
      CONTACTGUID: this.contactguid,
      //CONTACTGUID:this.f.CONTACTGUID.value,
      CONTACTNAME: this.f.CONTACTNAME.value,
      CONTACTTYPE: this.f.CONTACTTYPE.value,
      ACTIVE: this.f.ACTIVE.value == true ? "1" : "0",
      //person
      USEPARENTADDRESS: this.f.USEPARENTADDRESS.value == true ? "1" : "0",
      COMPANYCONTACTGUID: this.f.COMPANYCONTACTGUID.value,
      TITLE: this.f.TITLE.value,
      SALUTATION: this.f.SALUTATION.value,
      GIVENNAMES: this.f.GIVENNAMES.value,
      NAMETITLE: this.f.NAMETITLE.value,
      MIDDLENAMES: this.f.MIDDLENAMES.value,
      NAMELETTERS: this.f.NAMELETTERS.value,
      FAMILYNAME: this.f.FAMILYNAME.value,
      KNOWNBYOTHERNAME: this.f.KNOWNBYOTHERNAME.value == true ? "1" : "0",
      OTHERFAMILYNAME: this.f.OTHERFAMILYNAME.value,
      OTHERGIVENNAMES: this.f.OTHERGIVENNAMES.value,
      REASONFORCHANGE: this.f.REASONFORCHANGE.value,
      COMPANYNAME: this.f.COMPANYCONTACTGUIDTEXT.value,

      //Company
      POSITION: this.f.POSITION.value,
      //others
      GENDER: this.f.GENDER.value,
      DATEOFBIRTH: this.dateofbirth,
      MARITALSTATUS: this.f.MARITALSTATUS.value,
      SPOUSE: this.f.SPOUSE.value,
      NUMBEROFDEPENDANTS: this.f.NUMBEROFDEPENDANTS.value,
      BIRTHDAYREMINDER: this.f.BIRTHDAYREMINDER.value == true ? "1" : "0",
      TOWNOFBIRTH: this.f.TOWNOFBIRTH.value,
      COUNTRYOFBIRTH: this.f.COUNTRYOFBIRTH.value,
      DATEOFDEATH: this.dateofdeath,
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
      NOTES: this.f.NOTES.value
    }
    let details = { FormAction: this.FormAction, VALIDATEONLY: true, Data: detailsdata };
    this.subscription = this._mainAPiServiceService.getSetData(details, 'SetContact').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, details);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.checkValidation(response.DATA.VALIDATIONS, details);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.checkValidation(response.DATA.VALIDATIONS, details);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      } else {
        this.isspiner = false;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  checkValidation(bodyData: any, details: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'NO') {
        errorData.push(value.ERRORDESCRIPTION);
        tempError[value.FIELDNAME] = value;
      } else if (value.VALUEVALID == 'WARNING') {
        warningData.push(value.ERRORDESCRIPTION);
        tempWarning[value.FIELDNAME] = value;
      }
    });
    this.errorWarningData = { "Error": tempError, 'warning': tempWarning };
    if (Object.keys(errorData).length != 0) {
      this.toastr.error(errorData);
      this.isspiner = false;
    } else if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.saveContectData(details);
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.saveContectData(details);
      this.isspiner = false;
    }
  }
  saveContectData(data: any) {
    data.VALIDATEONLY = false;
    this.subscription = this._mainAPiServiceService.getSetData(data, 'SetContact').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        if (this.action !== 'edit') {
          this.toastr.success('Contact save successfully');
        } else {
          this.toastr.success('Contact update successfully');
        }
        this.isspiner = false;
        this.dialogRef.close(true);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.toastr.warning(response.MESSAGE);
        this.isspiner = false;
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.toastr.error(response.MESSAGE);
        this.isspiner = false;
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
    }, error => {
      this.toastr.error(error);
    });
    localStorage.removeItem('DATEOFBIRTH');
    localStorage.removeItem('DATEOFDEATH');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

export class Common {
  public Id: Number;
  public Name: string;
}