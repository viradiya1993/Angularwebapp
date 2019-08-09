import { Component, OnInit } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MainAPiServiceService } from './../../../_services';
import {Location} from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-system-setting',
  templateUrl: './system-setting.component.html',
  styleUrls: ['./system-setting.component.scss'],
  animations: fuseAnimations
})
export class SystemSettingComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  errorWarningData: any = {};
  a: string;
  button:string;
  ForDataBind: any;
  SettingForm: FormGroup;
  view: any;
  texVal:any=[];
  clicked: any;
  isspiner: boolean = false;
  clickedBtn: string;

  constructor(private _mainAPiServiceService: MainAPiServiceService,public _matDialog: MatDialog,private toastr: ToastrService,private location: Location,
    public router: Router,  private route: ActivatedRoute,  private _formBuilder: FormBuilder,) { 
    // this.nameFunction();
    this.nameFunction();
  }
  
  ngOnInit() {
  
    // this.button='name';
    // this.ForDataBind="Name";
    // this.router.url === '/login'
    
    // this.router.navigate(['time-billing/work-in-progress/invoice']);
    this.SettingForm=this._formBuilder.group({
      SAMECOPYADDRESS:[''],
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
      DOCUMENTSAVESTRATEGY:[''],
      DIRECTORYSAVESTATEGY:[''],
      DEFAULTSUBFOLDERS:[''],
      TRACKDOCUMENTS:['']
     
    })
    this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
      this.getVal(response);
      })
  }
  getVal(data){
  // for trust  
   this.SettingForm.controls['DEFAULTTRUSTRECEIPTTYPE'].setValue(data.DATA.SYSTEM.TRUSTGROUP.DEFAULTTRUSTRECEIPTTYPE.toString()); 
   this.SettingForm.controls['DEFAULTTRUSTWITHDRAWALTYPE'].setValue(data.DATA.SYSTEM.TRUSTGROUP.DEFAULTTRUSTWITHDRAWALTYPE.toString()); 
   this.SettingForm.controls['EFTTRUSTACCOUNTNAME'].setValue(data.DATA.SYSTEM.TRUSTGROUP.EFTTRUSTACCOUNTNAME); 
   this.SettingForm.controls['EFTTRUSTACCOUNTNUMBER'].setValue(data.DATA.SYSTEM.TRUSTGROUP.EFTTRUSTACCOUNTNUMBER); 
   this.SettingForm.controls['EFTTRUSTBSB'].setValue(data.DATA.SYSTEM.TRUSTGROUP.EFTTRUSTBSB); 
   this.SettingForm.controls['TRUSTCHEQUEFORMAT'].setValue(data.DATA.SYSTEM.TRUSTGROUP.TRUSTCHEQUEFORMAT.toString()); 
   this.SettingForm.controls['TRUSTRECEIPTCOPIES'].setValue(data.DATA.SYSTEM.TRUSTGROUP.TRUSTRECEIPTCOPIES.toString()); 
   this.SettingForm.controls['TRUSTSTATE'].setValue(data.DATA.SYSTEM.TRUSTGROUP.TRUSTSTATE); 
   this.SettingForm.controls['FIRSTTRUSTMONTH'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.FIRSTTRUSTMONTH.toString()); 
   
   //for name 
   let name = JSON.parse(localStorage.getItem('currentUser'));
   name.UserName=data.DATA.SYSTEM.BARRISTERSNAME;

   this.SettingForm.controls['BARRISTERSNAME'].setValue(data.DATA.SYSTEM.BARRISTERSNAME); 
   
   this.SettingForm.controls['ADDRESS1'].setValue(data.DATA.SYSTEM.ADDRESSGROUP.STREETADDRESSGROUP.ADDRESS1); 
   this.SettingForm.controls['POSTCODE'].setValue(data.DATA.SYSTEM.ADDRESSGROUP.STREETADDRESSGROUP.POSTCODE); 
   this.SettingForm.controls['SUBURB'].setValue(data.DATA.SYSTEM.ADDRESSGROUP.STREETADDRESSGROUP.SUBURB); 
   this.SettingForm.controls['STATE'].setValue(data.DATA.SYSTEM.ADDRESSGROUP.STREETADDRESSGROUP.STATE_); 

   this.SettingForm.controls['POSTALADDRESS1'].setValue(data.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP.POSTALADDRESS1); 
   this.SettingForm.controls['POSTALPOSTCODE'].setValue(data.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP.POSTALPOSTCODE); 
   this.SettingForm.controls['POSTALSUBURB'].setValue(data.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP.POSTALSUBURB); 
   this.SettingForm.controls['POSTALSTATE'].setValue(data.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP.POSTALSTATE); 

   this.SettingForm.controls['DXNUMBER'].setValue(data.DATA.SYSTEM.ADDRESSGROUP.DXGROUP.DXNUMBER); 
   this.SettingForm.controls['DXSUBURB'].setValue(data.DATA.SYSTEM.ADDRESSGROUP.DXGROUP.DXSUBURB); 

   this.SettingForm.controls['FAX1'].setValue(data.DATA.SYSTEM.CONTACTGROUP.FAX1); 
   this.SettingForm.controls['FAX2'].setValue(data.DATA.SYSTEM.CONTACTGROUP.FAX2); 
   this.SettingForm.controls['PHONE1'].setValue(data.DATA.SYSTEM.CONTACTGROUP.PHONE1); 
   this.SettingForm.controls['PHONE2'].setValue(data.DATA.SYSTEM.CONTACTGROUP.PHONE2); 

   //for business

   this.SettingForm.controls['ABN'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.ABN); 
   this.SettingForm.controls['GSTTYPE'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.GSTTYPE.toString()); 
   this.SettingForm.controls['HOURLYBASERATE'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.HOURLYBASERATE); 
   this.SettingForm.controls['DAILYBASERATE'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.DAILYBASERATE); 

   this.SettingForm.controls['UNITSPERHOUR'].setValue(data.DATA.SYSTEM.FEEEARNERS.UNITSPERHOUR.toString()); 
   this.SettingForm.controls['DUEDATEOFFSET'].setValue(data.DATA.SYSTEM.INVOICEDEFAULTS.DUEDATEOFFSET); 
   this.SettingForm.controls['OFFICECHEQUEFORMAT'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.OFFICECHEQUEFORMAT.toString()); 
   this.SettingForm.controls['VENDORISLIABLEFORSETTLEMENTDATE'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.VENDORISLIABLEFORSETTLEMENTDATE); 
   this.SettingForm.controls['RATEOVERRIDESEQUENCE'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.RATEOVERRIDESEQUENCE.toString());
   
   //for defults
   this.SettingForm.controls['DEFAULTEXPENSETYPE'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.DEFAULTEXPENSETYPE);
   this.SettingForm.controls['DEFAULTPAIDTYPE'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.DEFAULTPAIDTYPE.toString());
   this.SettingForm.controls['DEFAULTINCOMETYPE'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.DEFAULTINCOMETYPE);
   this.SettingForm.controls['SHORTNAMESTRATEGY'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.SHORTNAMESTRATEGY.toString());
   this.SettingForm.controls['REQUIRECOSTAGREEMENT'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.REQUIRECOSTAGREEMENT.toString());
   this.SettingForm.controls['REQUIREMATTEROWNER'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.REQUIREMATTEROWNER.toString());
   this.SettingForm.controls['REQUIREFEEEARNER'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.REQUIREFEEEARNER.toString());
   this.SettingForm.controls['DEFAULTMATTERCLASS'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.DEFAULTMATTERCLASS.toString());

   this.SettingForm.controls['SUNDRYFEEEARNER'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.SUNDRYFEEEARNER.toString());
   this.SettingForm.controls['ALLOWMOBILEACCESS'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.ALLOWMOBILEACCESS);
   this.SettingForm.controls['SHOWCONFLICTCHECKFORNEWMATTER'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.SHOWCONFLICTCHECKFORNEWMATTER);
   this.SettingForm.controls['DONTALLOWTRUSTOVERDRAWS'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.DONTALLOWTRUSTOVERDRAWS);
    
   //for estimate
   this.SettingForm.controls['ALLOWESTIMATERANGE'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.ALLOWESTIMATERANGE);
   this.SettingForm.controls['ESTIMATEWARNINGPERCENT'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.ESTIMATEWARNINGPERCENT);
   this.SettingForm.controls['ESTIMATENEXTTHRESHOLD'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.ESTIMATENEXTTHRESHOLD);
   this.SettingForm.controls['ESTIMATENEXTWARNINGPERCENT'].setValue(data.DATA.SYSTEM.BUSINESSGROUP.ESTIMATENEXTWARNINGPERCENT);
  
   //reginoal setting
   this.SettingForm.controls['COUNTRY'].setValue(data.DATA.SYSTEM.REGIONALGROUP.COUNTRY);
   this.SettingForm.controls['CURRENCYSYMBOL'].setValue(data.DATA.SYSTEM.REGIONALGROUP.CURRENCYSYMBOL);
   this.SettingForm.controls['TAXRATE'].setValue(data.DATA.SYSTEM.REGIONALGROUP.TAXRATE);
   this.SettingForm.controls['TAXTYPE'].setValue(data.DATA.SYSTEM.REGIONALGROUP.TAXTYPE);
  
   //for Template
   this.SettingForm.controls['INVOICETEMPLATE'].setValue(data.DATA.SYSTEM.INVOICEDEFAULTS.INVOICETEMPLATE);
   this.SettingForm.controls['RECEIPTTEMPLATE'].setValue(data.DATA.SYSTEM.INVOICEDEFAULTS.RECEIPTTEMPLATE);
   this.SettingForm.controls['DONTGENERATERECEIPT'].setValue(data.DATA.SYSTEM.INVOICEDEFAULTS.DONTGENERATERECEIPT);
   this.SettingForm.controls['DEFAULTSUBFOLDERS'].setValue(data.DATA.SYSTEM.DOCUMENTGROUP.DEFAULTSUBFOLDERS);
   this.SettingForm.controls['DIRECTORYSAVESTRATEGY'].setValue(data.DATA.SYSTEM.DOCUMENTGROUP.DIRECTORYSAVESTRATEGY.toString());
   this.SettingForm.controls['SAVEDOCUMENTS'].setValue(data.DATA.SYSTEM.DOCUMENTGROUP.SAVEDOCUMENTS.toString());
   this.SettingForm.controls['DOCUMENTSAVESTRATEGY'].setValue(data.DATA.SYSTEM.DOCUMENTGROUP.DOCUMENTSAVESTRATEGY.toString());
   this.SettingForm.controls['TRACKDOCUMENTS'].setValue(data.DATA.SYSTEM.DOCUMENTGROUP.TRACKDOCUMENTS);

  }

  nameFunction(){
    if( this.router.url=="/system-setting/business"){
      this.ForDataBind="Business";
      this.clickedBtn="business";
    }else if(this.router.url=="/system-setting/name"){  
      this.ForDataBind="Name";
      this.clickedBtn="name";
  }
    else if(this.router.url=="/system-setting/defaults"){  
      this.ForDataBind="Defaults";
      this.clickedBtn="defaults";
    }
    else if(this.router.url=="/system-setting/estimates"){  
      this.ForDataBind="Estimates";
      this.clickedBtn="estimate";
    }
    else if(this.router.url=="/system-setting/reginoal"){  
      this.ForDataBind="Reginoal";
      this.clickedBtn="reginoal";
    }
    else if(this.router.url=="/system-setting/trust"){  
      this.ForDataBind="Trust";
      this.clickedBtn="trust";
    }
    else if(this.router.url=="/system-setting/templates"){  
      this.ForDataBind="Templates";
      this.clickedBtn="templates";
    } else if(this.router.url=="/system-setting/account"){  
      this.ForDataBind="Account";
      this.clickedBtn="account";
    }
  }
  nameClick(){
    this.location.replaceState("/system-setting/name");
    this.clickedBtn="name";
    this.ForDataBind="Name";
  }
  businessClick(){
    this.location.replaceState("/system-setting/business");
    this.clickedBtn="business";
    this.ForDataBind="Business";
    
  }
  accountClick(){
    this.location.replaceState("/system-setting/account");
    this.clickedBtn="account";
    this.ForDataBind="Account";
    
  }

  defaultsClick(){
    this.location.replaceState("/system-setting/defaults");
    this.clickedBtn="defaults";
    this.ForDataBind="Defaults";
  }
  estimateClick(){
    this.location.replaceState("/system-setting/estimates");
    this.clickedBtn="estimate";
    this.ForDataBind="Estimates";
  }
  reginoalClick(){
    this.location.replaceState("/system-setting/reginoal");
    this.clickedBtn="reginoal";
    this.ForDataBind="Reginoal";
  }
  templatesClick(){
    this.location.replaceState("/system-setting/templates");
    this.clickedBtn="templates";
    this.ForDataBind="Templates";
  }
  trustClick(){
    this.location.replaceState("/system-setting/trust");
    this.clickedBtn="trust";
    this.ForDataBind="Trust";
  }
  get f() {
    //console.log(this.contactForm);
    return this.SettingForm.controls;
  }
  save(){
    console.log(this.f);
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
      DOCUMENTSAVESTRATEGY:this.f.DOCUMENTSAVESTRATEGY.value,
      TRACKDOCUMENTS:this.f.TRACKDOCUMENTS.value,
      DEFAULTSUBFOLDERS:this.f.DEFAULTSUBFOLDERS.value,
      // DIRECTORYSAVESTATEGY:this.f.DIRECTORYSAVESTRATEGY.value,
    }
    let data1 = { FormAction: "insert", VALIDATEONLY: true, Data: data }
    this._mainAPiServiceService.getSetData(data1, 'SetSystem').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, data1);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.checkValidation(response.DATA.VALIDATIONS, data1);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.checkValidation(response.DATA.VALIDATIONS, data1);
      } else {
        this.isspiner = false;
      }   
    }), error => {
      this.isspiner = false;
      this.toastr.error(error);
    };
  }
  checkValidation(bodyData: any, data1: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    bodyData.forEach(function (value: { VALUEVALID: string; ERRORDESCRIPTION: any; FIELDNAME: any; }) {
      if (value.VALUEVALID == 'No') {
        errorData.push(value.ERRORDESCRIPTION);
        tempError[value.FIELDNAME] = value;
      } else if (value.VALUEVALID == 'Warning') {
        tempWarning[value.FIELDNAME] = value;
        warningData.push(value.ERRORDESCRIPTION);
      }
    });
    this.errorWarningData = { "Error": tempError, 'warning': tempWarning };
    if (Object.keys(errorData).length != 0)
      this.toastr.error(errorData);
    if (Object.keys(warningData).length != 0) {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.saveSettingData(data1);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.saveSettingData(data1);
      this.isspiner = false;
  }

  saveSettingData(data1: any) {
    data1.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data1, 'SetSystem').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.toastr.success('Update successfully');
        this.isspiner = false;
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.toastr.warning(response.MESSAGE);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.toastr.error(response.MESSAGE);
      } 
    }, error => {
      this.toastr.error(error);
    });
  }

}
