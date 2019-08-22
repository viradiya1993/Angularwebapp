import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService } from 'app/_services';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {
  @Input() accountMngForm: FormGroup;

  BasicDetail = {
    "REGISTRATIONNAME": ' ', "FIRSTNAME": ' ', "MIDDLENAME": '', "LASTNAME": '', "ADDRESS": '', "SUBURB": '', "ADDRESSSTATE": '', "POSTCODE": '',
    "PHONE": '', "MOBILE": '', "EMAIL": '', "ACCOUNTSEMAIL": '', "MANAGEREMAIL": '', "TECHNICALEMAIL": '', "REGISTEREDUNTIL": '', "INTROPRICEUNTIL": ''
  }
  isLoadingResults: boolean = false;
  constructor(private _mainAPiServiceService: MainAPiServiceService) { }

  ngOnInit() {
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({}, 'HOGetCustomerDetails').subscribe(response => {
      if (response.CODE == 200 && response.STATUS == "success") {
        this.BasicDetail.REGISTRATIONNAME = response.DATA.CUSTOMERDATA.REGISTRATIONGROUP.REGISTRATIONNAME;
        this.BasicDetail.FIRSTNAME = response.DATA.CUSTOMERDATA.NAMEGROUP.FIRSTNAME
        this.BasicDetail.MIDDLENAME = response.DATA.CUSTOMERDATA.NAMEGROUP.MIDDLENAME
        this.BasicDetail.LASTNAME = response.DATA.CUSTOMERDATA.NAMEGROUP.LASTNAME
        this.BasicDetail.ADDRESS = response.DATA.CUSTOMERDATA.ADDRESSGROUP.ADDRESS
        this.BasicDetail.SUBURB = response.DATA.CUSTOMERDATA.ADDRESSGROUP.SUBURB
        this.BasicDetail.ADDRESSSTATE = response.DATA.CUSTOMERDATA.ADDRESSGROUP.ADDRESSSTATE
        this.BasicDetail.POSTCODE = response.DATA.CUSTOMERDATA.ADDRESSGROUP.POSTCODE
        this.BasicDetail.PHONE = response.DATA.CUSTOMERDATA.PHONE
        this.BasicDetail.MOBILE = response.DATA.CUSTOMERDATA.MOBILE
        this.BasicDetail.EMAIL = response.DATA.CUSTOMERDATA.EMAILS.EMAIL
        this.BasicDetail.ACCOUNTSEMAIL = response.DATA.CUSTOMERDATA.EMAILS.ACCOUNTSEMAIL
        this.BasicDetail.MANAGEREMAIL = response.DATA.CUSTOMERDATA.EMAILS.MANAGEREMAIL
        this.BasicDetail.TECHNICALEMAIL = response.DATA.CUSTOMERDATA.EMAILS.TECHNICALEMAIL
        this.BasicDetail.REGISTEREDUNTIL = response.DATA.CUSTOMERDATA.REGISTRATIONGROUP.REGISTEREDUNTIL
        this.BasicDetail.INTROPRICEUNTIL = response.DATA.CUSTOMERDATA.INTROPRICEUNTIL
        this.isLoadingResults = false;
      } else {
        this.isLoadingResults = false;
      }
    });
  }

}
