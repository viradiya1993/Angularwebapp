import { Component, OnInit } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-system-setting',
  templateUrl: './system-setting.component.html',
  styleUrls: ['./system-setting.component.scss'],
  animations: fuseAnimations
})
export class SystemSettingComponent implements OnInit {
  a: string;
  button:string;
  ForDataBind: any;
  SettingForm: FormGroup;
  view: any;

  constructor(public router: Router,  private route: ActivatedRoute,  private _formBuilder: FormBuilder,) { 
    this.nameFunction();
  }

  ngOnInit() {
    // this.button='name';
    // this.ForDataBind="Name";
    // this.router.url === '/login'
    
    // this.router.navigate(['time-billing/work-in-progress/invoice']);
    this.SettingForm=this._formBuilder.group({
      
      // for name
      BARRISTERSNAME:[''],
      ADDRESS1:[''],
      SUBURB:[''],
      STATE:[''],
      POSTCODE:[''],
      POSTALADDRESS1:[''],
      POSTALSUBURB:[''],
      POSTALSTATE:[''],
      POSTALPOSTCODE:[''],
      DXNUMBER:[''],
      DXSUBURB:[''],
      PHONE1:[''],
      PHONE2:[''],
      FAX1:[''],
      FAX2:[''],
      //for busniness
      ABN:[''],
      GSTTYPE:[''],
      HOURLYBASERATE:[''],
      DAILYBASERATE:[''],
      UNITSPERHOUR:[''],
      DUEDATEOFFSET:[''],
      OFFICECHEQUEFORMAT:[''],
      VENDORISLIABLEFORSETTLEMENTDATE:[''],
      USESINGLELINEEXPENSE:[''],
      RATEOVERRIDESEQUENCE:[''],



      // for defults
      DEFAULTEXPENSETYPE:[''],
      DEFAULTPAIDTYPE:[''],
      DEFAULTINCOMETYPE:[''],
      SHORTNAMESTRATEGY:[''],
      REQUIRECOSTAGREEMENT:[''],
      DEFAULTMATTERCLASS:[''],
      REQUIREMATTEROWNER:[''],
      REQUIREFEEEARNER:[''],
      SUNDRYFEEEARNER:[''],
      SHOWCONFLICTCHECKFORNEWMATTER:[''],
      ALLOWMOBILEACCESS:[''],
      DONTALLOWTRUSTOVERDRAWS:[''],

      //for estimate 
      ESTIMATEWARNINGPERCENT:[''],
      ESTIMATENEXTTHRESHOLD:[''],
      ESTIMATENEXTWARNINGPERCENT:[''],
      ALLOWESTIMATERANGE:[''],

      //for reginoal
      COUNTRY:[''],
      TAXTYPE:[''],
      TAXRATE:[''],
      CURRENCYSYMBOL:[''],

      //for trust 
      FIRSTTRUSTMONTH:[''],
      TRUSTSTATE:[''],
      TRUSTCHEQUEFORMAT:[''],
      TRUSTRECEIPTCOPIES:[''],
      EFTTRUSTACCOUNTNAME:[''],
      EFTTRUSTBSB:[''],
      EFTTRUSTACCOUNTNUMBER:[''],
      DEFAULTTRUSTRECEIPTTYPE:[''],
      DEFAULTTRUSTWITHDRAWALTYPE:[''],

      //for trmplate
      INVOICETEMPLATE:[''],
      RECEIPTTEMPLATE:[''],
      DONTGENERATERECEIPT:[''],
      SAVEDOCUMENTS:[''],
      DIRECTORYSAVESTRATEGY:[''],
     
    })
  }


  nameFunction(){
    if( this.router.url=="/system-setting/business"){
      this.ForDataBind="Business";
    }else if(this.router.url=="/system-setting/name"){  
      this.ForDataBind="Name";
  }
    else if(this.router.url=="/system-setting/defaults"){  
      this.ForDataBind="Defaults";
    }
    else if(this.router.url=="/system-setting/estimates"){  
      this.ForDataBind="Estimates";
    }
    else if(this.router.url=="/system-setting/reginoal"){  
      this.ForDataBind="Reginoal";
    }
    else if(this.router.url=="/system-setting/trust"){  
      this.ForDataBind="Trust";
    }
    else if(this.router.url=="/system-setting/templates"){  
      this.ForDataBind="Templates";
    }
  }
  get f() {
    //console.log(this.contactForm);
    return this.SettingForm.controls;
  }
  save(){
    let data={
      //for name 
      BARRISTERSNAME:this.f.BARRISTERSNAME.value,
      ADDRESS1:this.f.ADDRESS1.value,
      SUBURB:this.f.SUBURB.value,
      STATE:this.f.STATE.value,
      POSTCODE:this.f.POSTCODE.value,
      POSTALADDRESS1:this.f.POSTALADDRESS1.value,
      POSTALSUBURB:this.f.POSTALSUBURB.value,
      POSTALSTATE:this.f.POSTALSTATE.value,
      POSTALPOSTCODE:this.f.POSTALPOSTCODE.value,
      DXNUMBER:this.f.DXNUMBER.value,
      DXSUBURB:this.f.DXSUBURB.value,
      PHONE1:this.f.PHONE1.value,
      PHONE2:this.f.PHONE2.value,
      FAX1:this.f.FAX1.value,
      FAX2:this.f.FAX2.value,
      //for business
      ABN:this.f.ABN.value,
      GSTTYPE:this.f.GSTTYPE.value,
      HOURLYBASERATE:this.f.HOURLYBASERATE.value,
      DAILYBASERATE:this.f.DAILYBASERATE.value,
      UNITSPERHOUR:this.f.UNITSPERHOUR.value,
      DUEDATEOFFSET:this.f.DUEDATEOFFSET.value,
      OFFICECHEQUEFORMAT:this.f.OFFICECHEQUEFORMAT.value,
      VENDORISLIABLEFORSETTLEMENTDATE:this.f.VENDORISLIABLEFORSETTLEMENTDATE.value,
      USESINGLELINEEXPENSE:this.f.USESINGLELINEEXPENSE.value,
      RATEOVERRIDESEQUENCE:this.f.RATEOVERRIDESEQUENCE.value,
      // foe defaults
      DEFAULTEXPENSETYPE:this.f.DEFAULTEXPENSETYPE.value,
      DEFAULTPAIDTYPE:this.f.DEFAULTPAIDTYPE.value,
      DEFAULTINCOMETYPE:this.f.DEFAULTINCOMETYPE.value,
      SHORTNAMESTRATEGY:this.f.SHORTNAMESTRATEGY.value,
      REQUIRECOSTAGREEMENT:this.f.REQUIRECOSTAGREEMENT.value,
      DEFAULTMATTERCLASS:this.f.DEFAULTMATTERCLASS.value,
      REQUIREMATTEROWNER:this.f.REQUIREMATTEROWNER.value,
      REQUIREFEEEARNER:this.f.REQUIREFEEEARNER.value,
      SUNDRYFEEEARNER:this.f.SUNDRYFEEEARNER.value,
      SHOWCONFLICTCHECKFORNEWMATTER:this.f.SHOWCONFLICTCHECKFORNEWMATTER.value,
      ALLOWMOBILEACCESS:this.f.ALLOWMOBILEACCESS.value,
      DONTALLOWTRUSTOVERDRAWS:this.f.DONTALLOWTRUSTOVERDRAWS.value,
      
      // system-setting
      ESTIMATEWARNINGPERCENT:this.f.ESTIMATEWARNINGPERCENT.value,
      ESTIMATENEXTTHRESHOLD:this.f.ESTIMATENEXTTHRESHOLD.value,
      ESTIMATENEXTWARNINGPERCENT:this.f.ESTIMATENEXTWARNINGPERCENT.value,
      ALLOWESTIMATERANGE:this.f.ALLOWESTIMATERANGE.value,
      
      // for reginoal
      COUNTRY:this.f.COUNTRY.value,
      TAXTYPE:this.f.TAXTYPE.value,
      TAXRATE:this.f.TAXRATE.value,
      CURRENCYSYMBOL:this.f.CURRENCYSYMBOL.value,

       //for trust 
       FIRSTTRUSTMONTH:this.f.FIRSTTRUSTMONTH.value,
       TRUSTSTATE:this.f.TRUSTSTATE.value,
       TRUSTCHEQUEFORMAT:this.f.TRUSTCHEQUEFORMAT.value,
       TRUSTRECEIPTCOPIES:this.f.TRUSTRECEIPTCOPIES.value,
       EFTTRUSTACCOUNTNAME:this.f.EFTTRUSTACCOUNTNAME.value,
       EFTTRUSTBSB:this.f.EFTTRUSTBSB.value,
       EFTTRUSTACCOUNTNUMBER:this.f.EFTTRUSTACCOUNTNUMBER.value,
       DEFAULTTRUSTRECEIPTTYPE:this.f.DEFAULTTRUSTRECEIPTTYPE.value,
       DEFAULTTRUSTWITHDRAWALTYPE:this.f.DEFAULTTRUSTWITHDRAWALTYPE.value,

      //for trmplate
      INVOICETEMPLATE:this.f.INVOICETEMPLATE.value,
      RECEIPTTEMPLATE:this.f.RECEIPTTEMPLATE.value,
      DONTGENERATERECEIPT:this.f.DONTGENERATERECEIPT.value,
      SAVEDOCUMENTS:this.f.SAVEDOCUMENTS.value,
      DIRECTORYSAVESTRATEGY:this.f.DIRECTORYSAVESTRATEGY.value,
    }
    console.log(data);
  }

}
