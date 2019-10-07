import { Component, OnInit, Inject } from '@angular/core';
import { MainAPiServiceService, BehaviorService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-matter-popup',
  templateUrl: './matter-popup.component.html',
  styleUrls: ['./matter-popup.component.scss']
})
export class MatterPopupComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  errorWarningData: any = {};
  Classdata: any[];
  active: any;
  isLoadingResults: boolean = false;
  action: any;
  isEditMatter: any = "";
  dialogTitle: string;
  isspiner: boolean = false;
  isDefultMatter: boolean = true;
  FormAction: string;
  classtype: any;
  BILLINGMETHODVAL: any = '';
  GSTTYPEVAL: any = '';
  userType: any = '';
  CorrespondDetail: any = [];

  constructor(
    private _mainAPiServiceService: MainAPiServiceService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MatterPopupComponent>,
    public datepipe: DatePipe,
    public _matDialog: MatDialog,
    public behaviorService: BehaviorService,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.action = _data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Update Matter';
    } else if (this.action == 'new') {
      this.dialogTitle = 'New Matter'
      this.isLoadingResults = true;
      this._mainAPiServiceService.getSetData({ FormAction: 'default', VALIDATEONLY: true, DATA: {} }, 'SetMatter').subscribe(res => {
        if (res.CODE == 200 && res.STATUS == "success") {
          if (res.DATA.DEFAULTVALUES['SHORTNAME'] == "") {
            this.isDefultMatter = false;
          }
          this.matterdetailForm.controls['SHORTNAME'].setValue(res.DATA.DEFAULTVALUES['SHORTNAME']);
        } else if (res.MESSAGE === 'Not logged in') {
          this.dialogRef.close(false);
        } else {
          this.matterdetailForm.controls['SHORTNAME'].setValue(res.DATA.DEFAULTVALUES['SHORTNAME']);
        }
      }, error => { this.toastr.error(error); });
      setTimeout(() => { this.isLoadingResults = false; }, 2000);
    } else {
      this.dialogTitle = 'Duplicate Matter';
    }
    this.isEditMatter = this._data.matterGuid;
    this.classtype;
  }
  matterdetailForm: FormGroup;
  ngOnDestroy() {
    this.behaviorService.setMatterEditData(null);
  }
  ngOnInit() {
    this.isLoadingResults = true;
    let UserData = JSON.parse(localStorage.getItem('currentUser')).ProductType;
    this.userType = UserData == 'Barrister' ? 0 : 1;
    this.matterFormBuild();

    this._mainAPiServiceService.getSetData({ 'LookupType': 'Matter Class' }, 'GetLookups').subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.Classdata = responses.DATA.LOOKUPS;
      } else if (responses.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isLoadingResults = false;
    });
    if (this.action === 'edit' || this.action === 'duplicate') {
      this.isLoadingResults = true;
      this._mainAPiServiceService.getSetData({ MATTERGUID: this._data.matterGuid, 'GETALLFIELDS': true }, 'GetMatter').subscribe(response => {
        if (response.CODE === 200 && response.STATUS === 'success') {
          let matterData = response.DATA.MATTERS[0];
          this.classtype = matterData.MATTERCLASS;
          this.behaviorService.setMatterEditData(matterData);
          this.matterdetailForm.controls['MATTERGUID'].setValue(matterData.MATTERGUID);
          this.matterdetailForm.controls['ACTIVE'].setValue(matterData.ACTIVE == 1 ? true : false);
          this.matterdetailForm.controls['MATTERCLASS'].setValue(matterData.MATTERCLASS.toString());
          this.matterdetailForm.controls['SHORTNAME'].setValue(matterData.SHORTNAME);
          this.matterdetailForm.controls['MATTER'].setValue(matterData.MATTER);
          //client
          this.matterdetailForm.controls['Clientmattertext'].setValue(matterData.CONTACTNAME);
          this.matterdetailForm.controls['FIRMGUID'].setValue(matterData.FIRMGUID);
          //Rates
          this.matterdetailForm.controls['GSTTYPE'].setValue(matterData.BILLINGGROUP.GSTTYPEDESC);
          this.matterdetailForm.controls['ONCHARGEDISBURSEMENTGST'].setValue(matterData.BILLINGGROUP.ONCHARGEDISBURSEMENTGST == 1 ? true : false);
          this.matterdetailForm.controls['BILLINGMETHOD'].setValue(matterData.BILLINGGROUP.BILLINGMETHODDESC);
          this.matterdetailForm.controls['RATEPERHOUR'].setValue(matterData.BILLINGGROUP.RATEPERHOUR);
          this.matterdetailForm.controls['RATEPERDAY'].setValue(matterData.BILLINGGROUP.RATEPERDAY);
          this.matterdetailForm.controls['FIXEDRATEEXGST'].setValue(matterData.BILLINGGROUP.FIXEDRATEINCGST);
          this.matterdetailForm.controls['FIXEDRATEINCGST'].setValue(matterData.BILLINGGROUP.FIXEDRATEEXGST);
          //other
          this.matterdetailForm.controls['MATTERTYPE'].setValue(matterData.LEGALDETAILS.MATTERTYPE);
          this.matterdetailForm.controls['CLIENTSOURCE'].setValue(matterData.MARKETINGGROUP.CLIENTSOURCE);
          this.matterdetailForm.controls['FIELDOFLAW'].setValue(matterData.MARKETINGGROUP.FIELDOFLAW);
          this.matterdetailForm.controls['INDUSTRY'].setValue(matterData.MARKETINGGROUP.INDUSTRY);
          this.matterdetailForm.controls['REFERRERGUID'].setValue(matterData.MARKETINGGROUP.REFERRERGUID);
          this.matterdetailForm.controls['REFERRERGUIDTEXT'].setValue(matterData.MARKETINGGROUP.REFERRERNAME);
          this.matterdetailForm.controls['ARCHIVENO'].setValue(matterData.ARCHIVENO);
          let archivedate = matterData.ARCHIVEDATE.split("/");
          this.matterdetailForm.controls['ARCHIVEDATETEXT'].setValue(new Date(archivedate[1] + '/' + archivedate[0] + '/' + archivedate[2]));
          this.matterdetailForm.controls['ARCHIVEDATE'].setValue(matterData.ARCHIVEDATE);
          // General
          if (matterData.DATEGROUP.COMPLETEDDATE) {
            let COMPLETEDDATE1 = matterData.DATEGROUP.COMPLETEDDATE.split("/");
            this.matterdetailForm.controls['COMPLETEDDATETEXT'].setValue(new Date(COMPLETEDDATE1[1] + '/' + COMPLETEDDATE1[0] + '/' + COMPLETEDDATE1[2]));
            this.matterdetailForm.controls['COMPLETEDDATE'].setValue(matterData.DATEGROUP.COMPLETEDDATE);
          }
          if (matterData.LEASINGGROUP.COMMENCEMENTDATE) {
            let COMMENCEMENTDATE1 = matterData.LEASINGGROUP.COMMENCEMENTDATE.split("/");
            this.matterdetailForm.controls['COMMENCEMENTDATETEXT'].setValue(new Date(COMMENCEMENTDATE1[1] + '/' + COMMENCEMENTDATE1[0] + '/' + COMMENCEMENTDATE1[2]));
            this.matterdetailForm.controls['COMMENCEMENTDATE'].setValue(matterData.LEASINGGROUP.COMMENCEMENTDATE);
          }
          if (matterData.DATEGROUP.FEEAGREEMENTDATE) {
            let FeeAgreementDate1 = matterData.DATEGROUP.FEEAGREEMENTDATE.split("/");
            this.matterdetailForm.controls['FeeAgreementDateText'].setValue(new Date(FeeAgreementDate1[1] + '/' + FeeAgreementDate1[0] + '/' + FeeAgreementDate1[2]));
            this.matterdetailForm.controls['FEEAGREEMENTDATE'].setValue(matterData.DATEGROUP.FEEAGREEMENTDATE);
          }
          this.matterdetailForm.controls['REFERENCE'].setValue(matterData.REFERENCE);
          this.matterdetailForm.controls['OTHERREFERENCE'].setValue(matterData.OTHERREFERENCE);
          this.matterdetailForm.controls['ESTIMATEFROMTOTALEXGST'].setValue(matterData.SUMMARYTOTALS.ESTIMATEFROMTOTALEXGST);
          this.matterdetailForm.controls['ESTIMATEFROMTOTALINCGST'].setValue(matterData.SUMMARYTOTALS.ESTIMATEFROMTOTALINCGST);
          this.matterdetailForm.controls['NOTES'].setValue(matterData.NOTES);
          if (this.userType) {
            this.matterdetailForm.controls['OWNERGUID'].setValue(matterData.OWNERGUID);
            this.matterdetailForm.controls['OWNERNAME'].setValue(matterData.OWNERNAME);
            this.matterdetailForm.controls['PRIMARYFEEEARNERGUID'].setValue(matterData.PRIMARYFEEEARNERGUID);
            this.matterdetailForm.controls['PRIMARYFEEEARNERNAME'].setValue(matterData.PRIMARYFEEEARNERNAME);
          }
          if (matterData.MATTERCLASS == 19) {            // Details -> commercial
            this.matterdetailForm.controls['CLASSOFSHARES'].setValue(matterData.COMMERCIALGROUP.CLASSOFSHARES);
            this.matterdetailForm.controls['NUMBEROFSHARES'].setValue(matterData.COMMERCIALGROUP.NUMBEROFSHARES);
            this.matterdetailForm.controls['CONSIDERATION'].setValue(matterData.COMMERCIALGROUP.CONSIDERATION);
          } else if (matterData.MATTERCLASS == 8 || matterData.MATTERCLASS == 26 || matterData.MATTERCLASS == 21 || matterData.MATTERCLASS == 22 || matterData.MATTERCLASS == 25 || matterData.MATTERCLASS == 23 || matterData.MATTERCLASS == 23) {            //Details -> compensation
            this.matterdetailForm.controls['PLACEOFINJURY'].setValue(matterData.COMPENSATIONGROUP.PLACEOFINJURY);
            this.matterdetailForm.controls['INJURYDESCRIPTION'].setValue(matterData.COMPENSATIONGROUP.INJURYDESCRIPTION);
            this.matterdetailForm.controls['HowDidInjuryOccur'].setValue(matterData.COMPENSATIONGROUP.HOWDIDINJURYOCCUR);
            this.matterdetailForm.controls['LITIGATIONFUNDER'].setValue(matterData.COMPENSATIONGROUP.LITIGATIONFUNDER);
            this.matterdetailForm.controls['CLIENTNAME'].setValue(matterData.LEGALDETAILS.CLIENTNAME);

            this.matterdetailForm.controls['TRANSFERREDFROMOTHERSOLICITOR'].setValue(matterData.COMPENSATIONGROUP.TRANSFERREDFROMOTHERSOLICITOR);
            this.matterdetailForm.controls['ESTIMATEDAWARD'].setValue(matterData.COMPENSATIONGROUP.ESTIMATEDAWARD);
            this.matterdetailForm.controls['CLAIMNUMBER'].setValue(matterData.COMPENSATIONGROUP.CLAIMNUMBER);
            this.matterdetailForm.controls['EXPERTHEARINGDATE'].setValue(matterData.EXPERTPROCESSGROUP.EXPERTHEARINGDATE);
            if (matterData.COMPENSATIONGROUP.ACCIDENTDATE) {
              let ACCIDENTDATE1 = matterData.COMPENSATIONGROUP.ACCIDENTDATE.split("/");
              this.matterdetailForm.controls['ACCIDENTDATETEXT'].setValue(new Date(ACCIDENTDATE1[1] + '/' + ACCIDENTDATE1[0] + '/' + ACCIDENTDATE1[2]));
              this.matterdetailForm.controls['ACCIDENTDATE'].setValue(matterData.COMPENSATIONGROUP.ACCIDENTDATE);
            }
            if (matterData.STRATAGROUP.EXPIRATIONDATE) {
              let ExpirationDate1 = matterData.STRATAGROUP.EXPIRATIONDATE.split("/");
              this.matterdetailForm.controls['ExpirationDatetext'].setValue(new Date(ExpirationDate1[1] + '/' + ExpirationDate1[0] + '/' + ExpirationDate1[2]));
              this.matterdetailForm.controls['ExpirationDate'].setValue(matterData.STRATAGROUP.EXPIRATIONDATE);
            }
            if (matterData.COMPENSATIONGROUP.DATEOFNOTICEOFINJURY) {
              let DATEOFNOTICEOFINJURY1 = matterData.COMPENSATIONGROUP.DATEOFNOTICEOFINJURY.split("/");
              this.matterdetailForm.controls['DATEOFNOTICEOFINJURYTEXT'].setValue(new Date(DATEOFNOTICEOFINJURY1[1] + '/' + DATEOFNOTICEOFINJURY1[0] + '/' + DATEOFNOTICEOFINJURY1[2]));
              this.matterdetailForm.controls['DATEOFNOTICEOFINJURY'].setValue(matterData.COMPENSATIONGROUP.DATEOFNOTICEOFINJURY);
            }
            if (matterData.COMPENSATIONGROUP.INVESTIGATIONDATE) {
              let INVESTIGATIONDATE1 = matterData.COMPENSATIONGROUP.INVESTIGATIONDATE.split("/");
              this.matterdetailForm.controls['INVESTIGATIONDATETEXT'].setValue(new Date(INVESTIGATIONDATE1[1] + '/' + INVESTIGATIONDATE1[0] + '/' + INVESTIGATIONDATE1[2]));
              this.matterdetailForm.controls['INVESTIGATIONDATE'].setValue(matterData.COMPENSATIONGROUP.INVESTIGATIONDATE);
            }
            if (matterData.CONVEYANCINGGROUP.SETTLEMENTDATE) {
              let SETTLEMENTDATE1 = matterData.CONVEYANCINGGROUP.SETTLEMENTDATE.split("/");
              this.matterdetailForm.controls['SETTLEMENTDATETEXT'].setValue(new Date(SETTLEMENTDATE1[1] + '/' + SETTLEMENTDATE1[0] + '/' + SETTLEMENTDATE1[2]));
              this.matterdetailForm.controls['SETTLEMENTDATE'].setValue(matterData.CONVEYANCINGGROUP.SETTLEMENTDATE);
            }

          } else if (matterData.MATTERCLASS == 9) {   // Details ->compulsory-acquisition
            this.matterdetailForm.controls['CLIENTVALUATION'].setValue(matterData.COMPULSORYACQUISITIONGROUP.CLIENTVALUATION);
            this.matterdetailForm.controls['AUTHORITYVALUATION'].setValue(matterData.COMPULSORYACQUISITIONGROUP.AUTHORITYVALUATION);
          } else if (matterData.MATTERCLASS == 18) {            //Details -> criminal
            if (matterData.CRIMINALGROUP.BRIEFSERVICEDATE) {
              let BRIEFSERVICEDATE1 = matterData.CRIMINALGROUP.BRIEFSERVICEDATE.split("/");
              this.matterdetailForm.controls['BRIEFSERVICEDATETEXT'].setValue(new Date(BRIEFSERVICEDATE1[1] + '/' + BRIEFSERVICEDATE1[0] + '/' + BRIEFSERVICEDATE1[2]));
              this.matterdetailForm.controls['BRIEFSERVICEDATE'].setValue(matterData.CRIMINALGROUP.BRIEFSERVICEDATE);
            }
            if (matterData.CRIMINALGROUP.COMMITTALDATE) {
              let COMMITTALDATE1 = matterData.CRIMINALGROUP.COMMITTALDATE.split("/");
              this.matterdetailForm.controls['COMMITTALDATETEXT'].setValue(new Date(COMMITTALDATE1[1] + '/' + COMMITTALDATE1[0] + '/' + COMMITTALDATE1[2]));
              this.matterdetailForm.controls['COMMITTALDATE'].setValue(matterData.CRIMINALGROUP.COMMITTALDATE);
            }
            if (matterData.CRIMINALGROUP.BAILDATE) {
              let BAILDATE1 = matterData.CRIMINALGROUP.BAILDATE.split("/");
              this.matterdetailForm.controls['BAILDATETEXT'].setValue(new Date(BAILDATE1[1] + '/' + BAILDATE1[0] + '/' + BAILDATE1[2]));
              this.matterdetailForm.controls['BAILDATE'].setValue(matterData.CRIMINALGROUP.BAILDATE);
            }
            if (matterData.CRIMINALGROUP.REPLYDATE) {
              let REPLYDATE1 = matterData.CRIMINALGROUP.REPLYDATE.split("/");
              this.matterdetailForm.controls['REPLYDATETEXT'].setValue(new Date(REPLYDATE1[1] + '/' + REPLYDATE1[0] + '/' + REPLYDATE1[2]));
              this.matterdetailForm.controls['REPLYDATE'].setValue(matterData.CRIMINALGROUP.REPLYDATE);
            }
            if (matterData.CRIMINALGROUP.SENTENCINGDATE) {
              let SENTENCINGDATE1 = matterData.CRIMINALGROUP.SENTENCINGDATE.split("/");
              this.matterdetailForm.controls['SENTENCINGDATETEXT'].setValue(new Date(SENTENCINGDATE1[1] + '/' + SENTENCINGDATE1[0] + '/' + SENTENCINGDATE1[2]));
              this.matterdetailForm.controls['SENTENCINGDATE'].setValue(matterData.CRIMINALGROUP.SENTENCINGDATE);
            }
            this.matterdetailForm.controls['JUVENILE'].setValue(matterData.CRIMINALGROUP.JUVENILE ? true : false);
            this.matterdetailForm.controls['WAIVEROFCOMMITTAL'].setValue(matterData.CRIMINALGROUP.WAIVEROFCOMMITTAL ? true : false);
            this.matterdetailForm.controls['BAILRESTRICTIONS'].setValue(matterData.CRIMINALGROUP.BAILRESTRICTIONS);
            this.matterdetailForm.controls['OUTCOME'].setValue(matterData.CRIMINALGROUP.OUTCOME);
            this.matterdetailForm.controls['SENTENCE'].setValue(matterData.CRIMINALGROUP.SENTENCE);
            this.matterdetailForm.controls['S91APPLICATION'].setValue(matterData.CRIMINALGROUP.S91APPLICATION ? true : false);
            this.matterdetailForm.controls['S93APPLICATION'].setValue(matterData.CRIMINALGROUP.S93APPLICATION ? true : false);
            this.matterdetailForm.controls['COURT'].setValue(matterData.LEGALDETAILS.COURT);
            this.matterdetailForm.controls['DIVISION'].setValue(matterData.LEGALDETAILS.DIVISION);
            this.matterdetailForm.controls['REGISTRY'].setValue(matterData.LEGALDETAILS.REGISTRY);
            this.matterdetailForm.controls['MatterNo'].setValue(matterData.COMPULSORYACQUISITIONGROUP.MATTERNO);
            this.matterdetailForm.controls['CourtList'].setValue(matterData.COMPULSORYACQUISITIONGROUP.COURTLIST);
          } else if (matterData.MATTERCLASS == 10) {            // Details ->family
            this.matterdetailForm.controls['MARRIAGEPLACE'].setValue(matterData.FAMILYLAWGROUP.MARRIAGEPLACE);
            this.matterdetailForm.controls['MARRIAGECOUNTRY'].setValue(matterData.FAMILYLAWGROUP.MARRIAGECOUNTRY);
            // this.matterdetailForm.controls['DATEFILEDFORDIVORCE'].setValue(matterData.FAMILYLAWGROUP.DATEFILEDFORDIVORCE);
            this.matterdetailForm.controls['DIVORCEPLACE'].setValue(matterData.FAMILYLAWGROUP.DIVORCEPLACE);
            this.matterdetailForm.controls['DIVORCECOUNTRY'].setValue(matterData.FAMILYLAWGROUP.DIVORCECOUNTRY);
            this.matterdetailForm.controls['NUMDEPENDANTS'].setValue(matterData.FAMILYLAWGROUP.NUMDEPENDANTS);
            this.matterdetailForm.controls['FAMILYCOURTCLIENTID'].setValue(matterData.FAMILYLAWGROUP.FAMILYCOURTCLIENTID);
            this.matterdetailForm.controls['MatterNo'].setValue(matterData.COMPULSORYACQUISITIONGROUP.MATTERNO);
            // 
            if (matterData.FAMILYLAWGROUP.DATEFILEDFORDIVORCE) {
              let DATEFILEDFORDIVORCE = matterData.FAMILYLAWGROUP.DATEFILEDFORDIVORCE.split("/");
              this.matterdetailForm.controls['DATEFILEDFORDIVORCETEXT'].setValue(new Date(DATEFILEDFORDIVORCE[1] + '/' + DATEFILEDFORDIVORCE[0] + '/' + DATEFILEDFORDIVORCE[2]));
              this.matterdetailForm.controls['DATEFILEDFORDIVORCE'].setValue(matterData.FAMILYLAWGROUP.DATEFILEDFORDIVORCE);
            }
            if (matterData.FAMILYLAWGROUP.COHABITATIONDATE) {
              let COHABITATIONDATE1 = matterData.FAMILYLAWGROUP.COHABITATIONDATE.split("/");
              this.matterdetailForm.controls['COHABITATIONDATETEXT'].setValue(new Date(COHABITATIONDATE1[1] + '/' + COHABITATIONDATE1[0] + '/' + COHABITATIONDATE1[2]));
              this.matterdetailForm.controls['COHABITATIONDATE'].setValue(matterData.FAMILYLAWGROUP.COHABITATIONDATE);
            }
            if (matterData.FAMILYLAWGROUP.MARRIAGEDATE) {
              let MARRIAGEDATE1 = matterData.FAMILYLAWGROUP.MARRIAGEDATE.split("/");
              this.matterdetailForm.controls['MARRIAGEDATETEXT'].setValue(new Date(MARRIAGEDATE1[1] + '/' + MARRIAGEDATE1[0] + '/' + MARRIAGEDATE1[2]));
              this.matterdetailForm.controls['MARRIAGEDATE'].setValue(matterData.FAMILYLAWGROUP.MARRIAGEDATE);
            }
            if (matterData.FAMILYLAWGROUP.SEPARATIONDATE) {
              let SEPARATIONDATE1 = matterData.FAMILYLAWGROUP.SEPARATIONDATE.split("/");
              this.matterdetailForm.controls['SEPARATIONDATETEXT'].setValue(new Date(SEPARATIONDATE1[1] + '/' + SEPARATIONDATE1[0] + '/' + SEPARATIONDATE1[2]));
              // this.matterdetailForm.controls['SEPARATIONDATE'].setValue(matterData.FAMILYLAWGROUP.SEPARATIONDATE);
              this.matterdetailForm.controls['SEPARATIONDATE'].setValue(new Date(SEPARATIONDATE1[1] + '/' + SEPARATIONDATE1[0] + '/' + SEPARATIONDATE1[2]));
            }
            if (matterData.FAMILYLAWGROUP.DIVORCEDATE) {
              let DIVORCEDATE1 = matterData.FAMILYLAWGROUP.DIVORCEDATE.split("/");
              this.matterdetailForm.controls['DIVORCEDATETEXT'].setValue(new Date(DIVORCEDATE1[1] + '/' + DIVORCEDATE1[0] + '/' + DIVORCEDATE1[2]));
              this.matterdetailForm.controls['DIVORCEDATE'].setValue(matterData.FAMILYLAWGROUP.DIVORCEDATE);
            }
            if (matterData.EXPERTPROCESSGROUP.EXPERTHEARINGDATE) {
              let EXPERTHEARINGDATE1 = matterData.EXPERTPROCESSGROUP.EXPERTHEARINGDATE.split("/");
              this.matterdetailForm.controls['EXPERTHEARINGDATETEXTF'].setValue(new Date(EXPERTHEARINGDATE1[1] + '/' + EXPERTHEARINGDATE1[0] + '/' + EXPERTHEARINGDATE1[2]));
              this.matterdetailForm.controls['EXPERTHEARINGDATE'].setValue(matterData.EXPERTPROCESSGROUP.EXPERTHEARINGDATE);
            }
            if (matterData.STRATAGROUP.EXPIRATIONDATE) {
              let ExpirationDate1 = matterData.STRATAGROUP.EXPIRATIONDATE.split("/");
              this.matterdetailForm.controls['ExpirationDatetextF'].setValue(new Date(ExpirationDate1[1] + '/' + ExpirationDate1[0] + '/' + ExpirationDate1[2]));
              this.matterdetailForm.controls['ExpirationDate'].setValue(matterData.STRATAGROUP.EXPIRATIONDATE);
            }

          } else if (matterData.MATTERCLASS == 6) {             //Details -> immigration
            this.matterdetailForm.controls['VISATYPE'].setValue(matterData.VISAGROUP.VISATYPE);
            this.matterdetailForm.controls['VALUEOFASSETS'].setValue(matterData.VISAGROUP.VALUEOFASSETS);
            this.matterdetailForm.controls['VISASTATUS'].setValue(matterData.VISAGROUP.VISASTATUS);
            if (matterData.VISAGROUP.ANTICIPATEDDATEOFENTRY) {
              let ANTICIPATEDDATEOFENTRY1 = matterData.VISAGROUP.ANTICIPATEDDATEOFENTRY.split("/");
              this.matterdetailForm.controls['ANTICIPATEDDATEOFENTRYTEXT'].setValue(new Date(ANTICIPATEDDATEOFENTRY1[1] + '/' + ANTICIPATEDDATEOFENTRY1[0] + '/' + ANTICIPATEDDATEOFENTRY1[2]));
              this.matterdetailForm.controls['ANTICIPATEDDATEOFENTRY'].setValue(matterData.VISAGROUP.ANTICIPATEDDATEOFENTRY);
            }
            if (matterData.VISAGROUP.LODGEMENTDATE) {
              let LODGEMENTDATE1 = matterData.VISAGROUP.LODGEMENTDATE.split("/");
              this.matterdetailForm.controls['LODGEMENTDATETEXT'].setValue(new Date(LODGEMENTDATE1[1] + '/' + LODGEMENTDATE1[0] + '/' + LODGEMENTDATE1[2]));
              this.matterdetailForm.controls['LODGEMENTDATE'].setValue(matterData.VISAGROUP.LODGEMENTDATE);
            }
            if (matterData.VISAGROUP.VISAEXPIRYDATE) {
              let VISAEXPIRYDATE1 = matterData.VISAGROUP.VISAEXPIRYDATE.split("/");
              this.matterdetailForm.controls['VISAEXPIRYDATETEXT'].setValue(new Date(VISAEXPIRYDATE1[1] + '/' + VISAEXPIRYDATE1[0] + '/' + VISAEXPIRYDATE1[2]));
              this.matterdetailForm.controls['VISAEXPIRYDATE'].setValue(matterData.VISAGROUP.VISAEXPIRYDATE);
            }
            if (matterData.VISAGROUP.DECISIONDUEDATE) {
              let DECISIONDUEDATE1 = matterData.VISAGROUP.DECISIONDUEDATE.split("/");
              this.matterdetailForm.controls['DECISIONDUEDATETEXT'].setValue(new Date(DECISIONDUEDATE1[1] + '/' + DECISIONDUEDATE1[0] + '/' + DECISIONDUEDATE1[2]));
              this.matterdetailForm.controls['DECISIONDUEDATE'].setValue(matterData.VISAGROUP.DECISIONDUEDATE);
            }
          } else if (matterData.MATTERCLASS == 11) { //Details -> leasing
            // this.matterdetailForm.controls['Address2'].setValue(matterData..Address2);
            this.matterdetailForm.controls['LEASERECEIVED'].setValue(matterData.LEASINGGROUP.LEASERECEIVED);
            this.matterdetailForm.controls['OptionDescription'].setValue(matterData.LEASINGGROUP.OptionDescription);
            if (matterData.LEASINGGROUP.DATEEXECUTED) {
              let DATEEXECUTED1 = matterData.LEASINGGROUP.DATEEXECUTED.split("/");
              this.matterdetailForm.controls['DATEEXECUTEDTEXT'].setValue(new Date(DATEEXECUTED1[1] + '/' + DATEEXECUTED1[0] + '/' + DATEEXECUTED1[2]));
              this.matterdetailForm.controls['DATEEXECUTED'].setValue(matterData.LEASINGGROUP.DATEEXECUTED);
            }
            if (matterData.LEASINGGROUP.VALIDUNTIL) {
              let VALIDUNTIL1 = matterData.LEASINGGROUP.VALIDUNTIL.split("/");
              this.matterdetailForm.controls['VALIDUNTILTEXT'].setValue(new Date(VALIDUNTIL1[1] + '/' + VALIDUNTIL1[0] + '/' + VALIDUNTIL1[2]));
              this.matterdetailForm.controls['VALIDUNTIL'].setValue(matterData.LEASINGGROUP.VALIDUNTIL);
            }
            if (matterData.LEASINGGROUP.OPTIONDATE) {
              let OPTIONDATE1 = matterData.LEASINGGROUP.OPTIONDATE.split("/");
              this.matterdetailForm.controls['OPTIONDATETEXT'].setValue(new Date(OPTIONDATE1[1] + '/' + OPTIONDATE1[0] + '/' + OPTIONDATE1[2]));
              this.matterdetailForm.controls['OPTIONDATE'].setValue(matterData.LEASINGGROUP.OPTIONDATE);
            }
            if (matterData.LEASINGGROUP.DISCLOSUREDATE) {
              let DISCLOSUREDATE1 = matterData.LEASINGGROUP.DISCLOSUREDATE.split("/");
              this.matterdetailForm.controls['DISCLOSUREDATETEXT'].setValue(new Date(DISCLOSUREDATE1[1] + '/' + DISCLOSUREDATE1[0] + '/' + DISCLOSUREDATE1[2]));
              this.matterdetailForm.controls['DISCLOSUREDATE'].setValue(matterData.LEASINGGROUP.DISCLOSUREDATE);
            }
            // this.matterdetailForm.controls['REGISTEREDINFILEMAN'].setValue(matterData.LEASINGGROUP.REGISTEREDINFILEMAN);
          } else if (matterData.MATTERCLASS == 2) {              // Details -> litigation
            this.matterdetailForm.controls['MatterNo'].setValue(matterData.LEGALDETAILS.MatterNo);
            this.matterdetailForm.controls['COURT'].setValue(matterData.LEGALDETAILS.COURT);
            this.matterdetailForm.controls['DIVISION'].setValue(matterData.LEGALDETAILS.DIVISION);
            this.matterdetailForm.controls['CourtList'].setValue(matterData.LEGALDETAILS.COURTLIST);
            this.matterdetailForm.controls['REGISTRY'].setValue(matterData.LEGALDETAILS.REGISTRY);
            // this.matterdetailForm.controls['ClientType'].setValue(matterData..ClientType);
            this.matterdetailForm.controls['MATTERTITLEBELOW'].setValue(matterData.LEGALDETAILS.MATTERTITLEBELOW);
            this.matterdetailForm.controls['COURTBELOW'].setValue(matterData.LEGALDETAILS.COURTBELOW);
            this.matterdetailForm.controls['CASENUMBERBELOW'].setValue(matterData.LEGALDETAILS.CASENUMBERBELOW);
            this.matterdetailForm.controls['DECISION'].setValue(matterData.LEGALDETAILS.DECISION);
            this.matterdetailForm.controls['COSTESTIMATEIFWINEXGST'].setValue(matterData.SUMMARYTOTALS.COSTESTIMATEIFWINEXGST);
            this.matterdetailForm.controls['CostEstimateIfWinIncGST'].setValue(matterData.SUMMARYTOTALS.COSTESTIMATEIFWININCGST);
            this.matterdetailForm.controls['CostEstimateIfFailExGST'].setValue(matterData.SUMMARYTOTALS.COSTESTIMATEIFFAILEXGST);
            this.matterdetailForm.controls['CostEstimateIfFailIncGST'].setValue(matterData.SUMMARYTOTALS.COSTESTIMATEIFFAILINCGST);
            if (matterData.LEGALDETAILS.DATEOFHEARINGS) {
              let DATEOFHEARINGS1 = matterData.LEGALDETAILS.DATEOFHEARINGS.split("/");
              this.matterdetailForm.controls['DATEOFHEARINGSTEXT'].setValue(new Date(DATEOFHEARINGS1[1] + '/' + DATEOFHEARINGS1[0] + '/' + DATEOFHEARINGS1[2]));
              this.matterdetailForm.controls['DATEOFHEARINGS'].setValue(matterData.LEGALDETAILS.DATEOFHEARINGS);
            }
            if (matterData.LEGALDETAILS.MATERIALDATE) {
              let MATERIALDATE1 = matterData.LEGALDETAILS.MATERIALDATE.split("/");
              this.matterdetailForm.controls['MATERIALDATETEXT'].setValue(new Date(MATERIALDATE1[1] + '/' + MATERIALDATE1[0] + '/' + MATERIALDATE1[2]));
              this.matterdetailForm.controls['MATERIALDATE'].setValue(matterData.LEGALDETAILS.MATERIALDATE);
            }
          } else if (matterData.MATTERCLASS == 20) {            //Details -> maritime
            this.matterdetailForm.controls['VESSELNAME'].setValue(matterData.VESSELGROUP.VESSELNAME);
            this.matterdetailForm.controls['VESSELFLAG'].setValue(matterData.VESSELGROUP.VESSELFLAG);
            this.matterdetailForm.controls['VESSELTYPE'].setValue(matterData.VESSELGROUP.VESSELTYPE);
            this.matterdetailForm.controls['TONNAGE'].setValue(matterData.VESSELGROUP.TONNAGE);
            this.matterdetailForm.controls['VESSELMASTER'].setValue(matterData.VESSELGROUP.VESSELMASTER);
            this.matterdetailForm.controls['VESSELLOCATION'].setValue(matterData.VESSELGROUP.VESSELLOCATION);
            this.matterdetailForm.controls['PURCHASEPRICE'].setValue(matterData.CONVEYANCINGGROUP.PURCHASEPRICE);
            if (matterData.VESSELGROUP.INCIDENTDATE) {
              let INCIDENTDATE1 = matterData.VESSELGROUP.INCIDENTDATE.split("/");
              this.matterdetailForm.controls['INCIDENTDATETEXTM'].setValue(new Date(INCIDENTDATE1[1] + '/' + INCIDENTDATE1[0] + '/' + INCIDENTDATE1[2]));
              this.matterdetailForm.controls['INCIDENTDATE'].setValue(matterData.VESSELGROUP.INCIDENTDATE);
            }
            if (matterData.CONVEYANCINGGROUP.EXCHANGEDATE) {
              let EXCHANGEDATE1 = matterData.CONVEYANCINGGROUP.EXCHANGEDATE.split("/");
              this.matterdetailForm.controls['EXCHANGEDATETEXTM'].setValue(new Date(EXCHANGEDATE1[1] + '/' + EXCHANGEDATE1[0] + '/' + EXCHANGEDATE1[2]));
              this.matterdetailForm.controls['EXCHANGEDATE'].setValue(matterData.CONVEYANCINGGROUP.EXCHANGEDATE);
            }
            if (matterData.CONVEYANCINGGROUP.SETTLEMENTDATE) {
              let SETTLEMENTDATE1 = matterData.CONVEYANCINGGROUP.SETTLEMENTDATE.split("/");
              this.matterdetailForm.controls['SETTLEMENTDATETEXTM'].setValue(new Date(SETTLEMENTDATE1[1] + '/' + SETTLEMENTDATE1[0] + '/' + SETTLEMENTDATE1[2]));
              this.matterdetailForm.controls['SETTLEMENTDATE'].setValue(matterData.CONVEYANCINGGROUP.SETTLEMENTDATE);
            }
          } else if (matterData.MATTERCLASS == 12) {            //Details -> mortgage-finance
            this.matterdetailForm.controls['PRINCIPALADVANCED'].setValue(matterData.MORTGAGEGROUP.PRINCIPALADVANCED);
            this.matterdetailForm.controls['INTERESTRATE'].setValue(matterData.MORTGAGEGROUP.INTERESTRATE);
            this.matterdetailForm.controls['FOLIOIDENTIFIER'].setValue(matterData.STRATAGROUP.FOLIOIDENTIFIER);
            this.matterdetailForm.controls['SECURITYPROPERTY'].setValue(matterData.MORTGAGEGROUP.SECURITYPROPERTY);
            if (matterData.MORTGAGEGROUP.DISCHARGEDATE) {
              let dcd1 = matterData.MORTGAGEGROUP.DISCHARGEDATE.split("/");
              this.matterdetailForm.controls['DISCHARGEDATETEXTM'].setValue(new Date(dcd1[1] + '/' + dcd1[0] + '/' + dcd1[2]));
              this.matterdetailForm.controls['DISCHARGEDATE'].setValue(matterData.MORTGAGEGROUP.DISCHARGEDATE);
            }
            if (matterData.MORTGAGEGROUP.COMMENCEMENTDATE) {
              let cd1 = matterData.MORTGAGEGROUP.COMMENCEMENTDATE.split("/");
              this.matterdetailForm.controls['COMMENCEMENTDATETEXTM'].setValue(new Date(cd1[1] + '/' + cd1[0] + '/' + cd1[2]));
              this.matterdetailForm.controls['COMMENCEMENTDATE'].setValue(matterData.MORTGAGEGROUP.COMMENCEMENTDATE);
            }
            if (matterData.STRATAGROUP.EXPIRATIONDATE) {
              let ed2 = matterData.STRATAGROUP.EXPIRATIONDATE.split("/");
              this.matterdetailForm.controls['ExpirationDateTxtM'].setValue(new Date(ed2[1] + '/' + ed2[0] + '/' + ed2[2]));
              this.matterdetailForm.controls['ExpirationDate'].setValue(matterData.STRATAGROUP.EXPIRATIONDATE);
            }
          } else if (matterData.MATTERCLASS == 4) {          // Details ->property-purchase
            if (matterData.CONVEYANCINGGROUP.SETTLEMENTDATE) {
              let std1 = matterData.CONVEYANCINGGROUP.SETTLEMENTDATE.split("/");
              this.matterdetailForm.controls['SETTLEMENTDATETEXTPP'].setValue(new Date(std1[1] + '/' + std1[0] + '/' + std1[2]));
              this.matterdetailForm.controls['SETTLEMENTDATE'].setValue(matterData.CONVEYANCINGGROUP.SETTLEMENTDATE);
            }
            if (matterData.CONVEYANCINGGROUP.DATEPAID) {
              let pd1 = matterData.CONVEYANCINGGROUP.DATEPAID.split("/");
              this.matterdetailForm.controls['DATEPAIDTEXTPP'].setValue(new Date(pd1[1] + '/' + pd1[0] + '/' + pd1[2]));
              this.matterdetailForm.controls['DATEPAID'].setValue(matterData.CONVEYANCINGGROUP.DATEPAID);
            }
            if (matterData.CONVEYANCINGGROUP.BALANCEDEPOSITDATE) {
              let btd1 = matterData.CONVEYANCINGGROUP.BALANCEDEPOSITDATE.split("/");
              this.matterdetailForm.controls['BALANCEDEPOSITDATETEXTPP'].setValue(new Date(btd1[1] + '/' + btd1[0] + '/' + btd1[2]));
              this.matterdetailForm.controls['BALANCEDEPOSITDATE'].setValue(matterData.CONVEYANCINGGROUP.BALANCEDEPOSITDATE);
            }
            if (matterData.CONVEYANCINGGROUP.EXCHANGEDATE) {
              let ed1 = matterData.CONVEYANCINGGROUP.EXCHANGEDATE.split("/");
              this.matterdetailForm.controls['EXCHANGEDATETEXTPP'].setValue(new Date(ed1[1] + '/' + ed1[0] + '/' + ed1[2]));
              this.matterdetailForm.controls['EXCHANGEDATE'].setValue(matterData.CONVEYANCINGGROUP.EXCHANGEDATE);
            }
            if (matterData.CONVEYANCINGGROUP.STAMPDUTYDATE) {
              let ed5 = matterData.CONVEYANCINGGROUP.STAMPDUTYDATE.split("/");
              this.matterdetailForm.controls['STAMPDUTYDATETEXT'].setValue(new Date(ed5[1] + '/' + ed5[0] + '/' + ed5[2]));
              this.matterdetailForm.controls['STAMPDUTYDATE'].setValue(matterData.CONVEYANCINGGROUP.STAMPDUTYDATE);
            }
            this.matterdetailForm.controls['PURCHASEPRICE'].setValue(matterData.CONVEYANCINGGROUP.PURCHASEPRICE);
            this.matterdetailForm.controls['DEPOSITAMOUNT'].setValue(matterData.CONVEYANCINGGROUP.DEPOSITAMOUNT);
            this.matterdetailForm.controls['DEPOSITBONDAMOUNT'].setValue(matterData.CONVEYANCINGGROUP.DEPOSITBONDAMOUNT);
            this.matterdetailForm.controls['STAMPDUTYAMOUNT'].setValue(matterData.CONVEYANCINGGROUP.STAMPDUTYAMOUNT);
            this.matterdetailForm.controls['BANKREFERENCE'].setValue(matterData.CONVEYANCINGGROUP.BANKREFERENCE);
            this.matterdetailForm.controls['INITIALDEPOSIT'].setValue(matterData.CONVEYANCINGGROUP.INITIALDEPOSIT);
            this.matterdetailForm.controls['BALANCEDEPOSIT'].setValue(matterData.CONVEYANCINGGROUP.BALANCEDEPOSIT);
            this.matterdetailForm.controls['SPECIALCONDITIONS'].setValue(matterData.CONVEYANCINGGROUP.SPECIALCONDITIONS);
            this.matterdetailForm.controls['BUILDINGREPORTCOMPLETED'].setValue(matterData.CONVEYANCINGGROUP.BUILDINGREPORTCOMPLETED);
            this.matterdetailForm.controls['PESTREPORTCOMPLETED'].setValue(matterData.CONVEYANCINGGROUP.PESTREPORTCOMPLETED);
            this.matterdetailForm.controls['CLIENTSTATUS'].setValue(matterData.LEGALDETAILS.CLIENTSTATUS);
            // Address3 = Address3;
          } else if (matterData.MATTERCLASS == 3) {   //Details -> property-sale 
            this.matterdetailForm.controls['PURCHASEPRICE'].setValue(matterData.CONVEYANCINGGROUP.PURCHASEPRICE);
            if (matterData.CONVEYANCINGGROUP.EXCHANGEDATE) {
              let tempdps1 = matterData.CONVEYANCINGGROUP.EXCHANGEDATE.split("/");
              this.matterdetailForm.controls['EXCHANGEDATETEXTPS'].setValue(new Date(tempdps1[1] + '/' + tempdps1[0] + '/' + tempdps1[2]));
              this.matterdetailForm.controls['EXCHANGEDATE'].setValue(matterData.CONVEYANCINGGROUP.EXCHANGEDATE);
            }
            if (matterData.CONVEYANCINGGROUP.SETTLEMENTDATE) {
              let tempdps2 = matterData.CONVEYANCINGGROUP.SETTLEMENTDATE.split("/");
              this.matterdetailForm.controls['SETTLEMENTDATETEXTPS'].setValue(new Date(tempdps2[1] + '/' + tempdps2[0] + '/' + tempdps2[2]));
              this.matterdetailForm.controls['SETTLEMENTDATE'].setValue(matterData.CONVEYANCINGGROUP.SETTLEMENTDATE);
            }
            if (matterData.CONVEYANCINGGROUP.ADJUSTMENTDATE) {
              let tempdps3 = matterData.CONVEYANCINGGROUP.ADJUSTMENTDATE.split("/");
              this.matterdetailForm.controls['ADJUSTMENTDATETEXTPS'].setValue(new Date(tempdps3[1] + '/' + tempdps3[0] + '/' + tempdps3[2]));
              this.matterdetailForm.controls['ADJUSTMENTDATE'].setValue(matterData.CONVEYANCINGGROUP.ADJUSTMENTDATE);
            }
            if (matterData.CONVEYANCINGGROUP.DATEPAID) {
              let tempdps = matterData.CONVEYANCINGGROUP.DATEPAID.split("/");
              this.matterdetailForm.controls['DATEPAIDTEXTPS'].setValue(new Date(tempdps[1] + '/' + tempdps[0] + '/' + tempdps[2]));
              this.matterdetailForm.controls['DATEPAID'].setValue(matterData.CONVEYANCINGGROUP.DATEPAID);
            }

            this.matterdetailForm.controls['BANKREFERENCE'].setValue(matterData.CONVEYANCINGGROUP.BANKREFERENCE);
            this.matterdetailForm.controls['CLIENTSTATUS'].setValue(matterData.LEGALDETAILS.CLIENTSTATUS);
            // details.Address4 = this.f.Address4.value;
          } else if (matterData.MATTERCLASS == 5) {//Details -> strata
            this.matterdetailForm.controls['STRATAPLANNUMBER'].setValue(matterData.STRATAGROUP.STRATAPLANNUMBER);
            if (matterData.STRATAGROUP.EXPIRATIONDATE) {
              let tempexd = matterData.STRATAGROUP.EXPIRATIONDATE.split("/");
              this.matterdetailForm.controls['EXPIRATIONDATE'].setValue(matterData.STRATAGROUP.EXPIRATIONDATE);
              this.matterdetailForm.controls['EXPIRATIONDATETEXT'].setValue(new Date(tempexd[1] + '/' + tempexd[0] + '/' + tempexd[2]));
            }
            this.matterdetailForm.controls['LOTNUMBER'].setValue(matterData.STRATAGROUP.LOTNUMBER);
            this.matterdetailForm.controls['BYLAWTYPE'].setValue(matterData.STRATAGROUP.BYLAWTYPE);
            this.matterdetailForm.controls['BYLAWNO'].setValue(matterData.STRATAGROUP.BYLAWNO);
            if (matterData.STRATAGROUP.SPECIALRESOLUTIONDATE) {
              this.matterdetailForm.controls['SPECIALRESOLUTIONDATE'].setValue(matterData.STRATAGROUP.SPECIALRESOLUTIONDATE);
              let tempsd = matterData.STRATAGROUP.SPECIALRESOLUTIONDATE.split("/");
              this.matterdetailForm.controls['SPECIALRESOLUTIONDATETEXT'].setValue(new Date(tempsd[1] + '/' + tempsd[0] + '/' + tempsd[2]));
            }
            this.matterdetailForm.controls['FOLIOIDENTIFIER'].setValue(matterData.STRATAGROUP.FOLIOIDENTIFIER);
            this.matterdetailForm.controls['AGGREGATIONOFENTITLEMENT'].setValue(matterData.STRATAGROUP.AGGREGATIONOFENTITLEMENT);
            this.matterdetailForm.controls['TOTALUNITS'].setValue(matterData.STRATAGROUP.TOTALUNITS);
          }
          else if (this.classtype == 14) { //Details -> trademark-ip
            this.matterdetailForm.controls['FolioIdentifier'].setValue(matterData.STRATAGROUP.FOLIOIDENTIFIER);
          } else if (matterData.MATTERCLASS == 7) {//Details -> wills-estate
            if (matterData.ESTATEGROUP.DATEOFWILL) {
              let dateofwill = matterData.ESTATEGROUP.DATEOFWILL.split("/");
              this.matterdetailForm.controls['DATEOFWILLTEXT'].setValue(new Date(dateofwill[1] + '/' + dateofwill[0] + '/' + dateofwill[2]));
              this.matterdetailForm.controls['DATEOFWILL'].setValue(matterData.ESTATEGROUP.DATEOFWILL);
            }
            this.matterdetailForm.controls['ESTATEGROSSVALUE'].setValue(matterData.ESTATEGROUP.ESTATEGROSSVALUE);
            this.matterdetailForm.controls['ESTATENETVALUE'].setValue(matterData.ESTATEGROUP.ESTATENETVALUE);
            this.matterdetailForm.controls['NAMEOFTRUST'].setValue(matterData.ESTATEGROUP.NAMEOFTRUST);
            this.matterdetailForm.controls['NAMEOFSUPERANNUATION'].setValue(matterData.ESTATEGROUP.NAMEOFSUPERANNUATION);
            this.matterdetailForm.controls['NUMBEROFCODICILS'].setValue(matterData.ESTATEGROUP.NUMBEROFCODICILS);
            if (matterData.ESTATEGROUP.DATEOFCODICILS) {
              let DATEOFCODICILSTEXTDATA = matterData.ESTATEGROUP.DATEOFCODICILS.split("/");
              this.matterdetailForm.controls['DATEOFCODICILSTEXT'].setValue(new Date(DATEOFCODICILSTEXTDATA[1] + '/' + DATEOFCODICILSTEXTDATA[0] + '/' + DATEOFCODICILSTEXTDATA[2]));
              this.matterdetailForm.controls['DATEOFCODICILS'].setValue(matterData.ESTATEGROUP.DATEOFCODICILS);
            }
            if (matterData.ESTATEGROUP.DATEOFGRANTOFREP) {
              let DateOfGrantOfReptexttem = matterData.ESTATEGROUP.DATEOFGRANTOFREP.split("/");
              this.matterdetailForm.controls['DateOfGrantOfReptext'].setValue(new Date(DateOfGrantOfReptexttem[1] + '/' + DateOfGrantOfReptexttem[0] + '/' + DateOfGrantOfReptexttem[2]));
              this.matterdetailForm.controls['DateOfGrantOfRep'].setValue(matterData.ESTATEGROUP.DATEOFGRANTOFREP);
            }
            this.matterdetailForm.controls['MatterNo'].setValue(matterData.LEGALDETAILS.MATTERNO);
          }
          this.isLoadingResults = false;
        } else if (response.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
      }, error => {
        this.toastr.error(error);
      });
    } else {
      this.matterdetailForm.controls['ACTIVE'].setValue(true);
    }
  }
  // isDisabled
  matterFormBuild() {
    this.matterdetailForm = this._formBuilder.group({
      MATTERGUID: [''],
      MATTERCLASS: ['0'],
      ACTIVE: [''],
      SHORTNAME: [''],
      MATTER: [''],
      // general
      NOTES: [''],
      COMMENCEMENTDATE: [''],
      COMMENCEMENTDATETEXT: [new Date()],
      REFERENCE: [''],
      OTHERREFERENCE: [''],
      COMPLETEDDATE: [''],
      COMPLETEDDATETEXT: [''],
      PRIMARYFEEEARNERGUID: [''],
      PRIMARYFEEEARNERNAME: [''],
      OWNERGUID: [''],
      OWNERNAME: [''],
      FEEAGREEMENTDATE: [],
      FeeAgreementDateText: [],
      ESTIMATEFROMTOTALEXGST: [''],
      ESTIMATEFROMTOTALINCGST: [''],

      // client
      FIRMGUID: [''],
      Clientmattertext: [''],

      // rates
      BILLINGMETHOD: ['Time Costed'],
      ONCHARGEDISBURSEMENTGST: [''],
      GSTTYPE: ['GST Exclusive'],
      RATEPERHOUR: [''],
      RATEPERDAY: [''],
      FIXEDRATEEXGST: [''],
      FIXEDRATEINCGST: [''],
      // Details -> commercial
      CLASSOFSHARES: [''],
      NUMBEROFSHARES: [''],
      CONSIDERATION: [''],
      //Details -> compensation
      ACCIDENTDATE: [''],
      ACCIDENTDATETEXT: [''],
      PLACEOFINJURY: [''],
      INJURYDESCRIPTION: [''],
      LITIGATIONFUNDER: [''],
      TRANSFERREDFROMOTHERSOLICITOR: [''],
      CLIENTNAME: [''],
      ESTIMATEDAWARD: [''],
      CLAIMNUMBER: [''],
      INVESTIGATIONDATE: [''],
      INVESTIGATIONDATETEXT: [''],
      SETTLEMENTDATE: [''],
      SETTLEMENTDATETEXT: [''],
      EXPERTHEARINGDATE: [''],
      DATEOFNOTICEOFINJURY: [''],
      DATEOFNOTICEOFINJURYTEXT: [''],
      ExpirationDate: [''],
      ExpirationDatetext: [''],
      HowDidInjuryOccur: [''],
      // Details ->compulsory-acquisition
      Address: [''],
      CLIENTVALUATION: [''],
      AUTHORITYVALUATION: [''],
      //Details -> criminal
      BRIEFSERVICEDATE: [''],
      BRIEFSERVICEDATETEXT: [''],
      COMMITTALDATE: [''],
      COMMITTALDATETEXT: [''],
      REPLYDATE: [''],
      REPLYDATETEXT: [''],
      JUVENILE: [''],
      WAIVEROFCOMMITTAL: [''],
      BAILDATE: [''],
      BAILDATETEXT: [''],
      BAILRESTRICTIONS: [''],
      OUTCOME: [''],
      SENTENCINGDATE: [''],
      SENTENCINGDATETEXT: [''],
      SENTENCE: [''],
      S91APPLICATION: [''],
      S93APPLICATION: [''],
      COURT: [''],
      DIVISION: [''],
      REGISTRY: [''],
      MatterNo: [''],
      CourtList: [''],

      // Details ->family
      COHABITATIONDATE: [''],
      COHABITATIONDATETEXT: [''],
      MARRIAGEDATE: [''],
      MARRIAGEDATETEXT: [''],
      MARRIAGEPLACE: [''],
      MARRIAGECOUNTRY: [''],
      SEPARATIONDATE: [''],
      SEPARATIONDATETEXT: [''],
      DATEFILEDFORDIVORCE: [''],
      DATEFILEDFORDIVORCETEXT: [''],
      DIVORCEDATE: [''],
      DIVORCEDATETEXT: [''],
      DIVORCEPLACE: [''],
      DIVORCECOUNTRY: [''],
      NUMDEPENDANTS: [''],
      FAMILYCOURTCLIENTID: [''],
      ExpirationDatetextF: [''],
      EXPERTHEARINGDATETEXTF: [''],

      //Details -> immigration
      VISATYPE: [''],
      VALUEOFASSETS: [''],
      VISASTATUS: [''],
      ANTICIPATEDDATEOFENTRY: [''],
      ANTICIPATEDDATEOFENTRYTEXT: [''],
      LODGEMENTDATE: [''],
      LODGEMENTDATETEXT: [''],
      VISAEXPIRYDATE: [''],
      VISAEXPIRYDATETEXT: [''],
      DECISIONDUEDATE: [''],
      DECISIONDUEDATETEXT: [''],

      //Details -> leasing
      Address2: [''],
      LEASERECEIVED: [''],
      DATEEXECUTED: [''],
      DATEEXECUTEDTEXT: [''],
      VALIDUNTIL: [''],
      VALIDUNTILTEXT: [''],
      OPTIONDATE: [''],
      OPTIONDATETEXT: [''],
      OptionDescription: [''],
      DISCLOSUREDATE: [''],
      DISCLOSUREDATETEXT: [''],
      REGISTEREDINFILEMAN: [''],

      //Details -> litigation
      MATTERTITLEBELOW: [''],
      COURTBELOW: [''],
      CASENUMBERBELOW: [''],
      DATEOFHEARINGS: [''],
      DATEOFHEARINGSTEXT: [''],
      MATERIALDATE: [''],
      MATERIALDATETEXT: [''],
      DECISION: [''],
      ClientType: [''],
      COSTESTIMATEIFWINEXGST: [''],
      CostEstimateIfWinIncGST: [''],
      CostEstimateIfFailExGST: [''],
      CostEstimateIfFailIncGST: [''],

      //Details -> maritime
      VESSELNAME: [''],
      VESSELFLAG: [''],
      VESSELTYPE: [''],
      TONNAGE: [''],
      VESSELMASTER: [''],
      VESSELLOCATION: [''],
      INCIDENTDATE: [''],
      INCIDENTDATETEXTM: [''],
      SETTLEMENTDATETEXTM: [],
      EXCHANGEDATETEXTM: [],
      EXCHANGEDATE: [''],
      CourtMatter2: [''],

      //Details -> mortgage-finance
      PRINCIPALADVANCED: [''],
      COMMENCEMENTDATETEXTM: [''],
      ExpirtyDatetextm: [''],
      INTERESTRATE: [''],
      FOLIOIDENTIFIER: [''],
      DISCHARGEDATE: [''],
      DISCHARGEDATETEXTM: [''],
      SECURITYPROPERTY: [''],
      ExpirationDateTxtM: [''],

      // Details ->property-purchase
      CLIENTSTATUS: [''],
      Address3: [''],
      PURCHASEPRICE: [''],
      DEPOSITAMOUNT: [''],
      STAMPDUTYDATE: [''],
      STAMPDUTYDATETEXT: [''],
      DEPOSITBONDAMOUNT: [''],
      STAMPDUTYAMOUNT: [''],
      DATEPAID: [''],
      DATEPAIDTEXTPP: [''],
      BANKREFERENCE: [''],
      INITIALDEPOSIT: [''],
      BALANCEDEPOSIT: [''],
      BALANCEDEPOSITDATE: [''],
      BALANCEDEPOSITDATETEXTPP: [''],
      BUILDINGREPORTCOMPLETED: [''],
      PESTREPORTCOMPLETED: [''],
      SPECIALCONDITIONS: [''],
      EXCHANGEDATETEXTPP: [''],
      SETTLEMENTDATETEXTPP: [''],

      //Details -> property-sale 
      Address4: [''],
      ADJUSTMENTDATE: [''],
      ADJUSTMENTDATETEXTPS: [''],
      DATEPAIDTEXTPS: [''],
      EXCHANGEDATETEXTPS: [''],
      SETTLEMENTDATETEXTPS: [''],

      //Details -> strata
      STRATAPLANNUMBER: [''],
      EXPIRATIONDATE: [''],
      EXPIRATIONDATETEXT: [''],
      LOTNUMBER: [''],
      BYLAWTYPE: [''],
      BYLAWNO: [''],
      SPECIALRESOLUTIONDATE: [''],
      SPECIALRESOLUTIONDATETEXT: [''],
      AGGREGATIONOFENTITLEMENT: [''],
      TOTALUNITS: [''],

      //Details -> trademark-ip
      FolioIdentifier: [''],

      //Details -> wills-estate
      DATEOFWILL: [''],
      DATEOFWILLTEXT: [''],
      ESTATEGROSSVALUE: [''],
      ESTATENETVALUE: [''],
      NAMEOFTRUST: [''],
      NAMEOFSUPERANNUATION: [''],
      NUMBEROFCODICILS: [''],
      DATEOFCODICILS: [''],
      DATEOFCODICILSTEXT: [''],
      DateOfGrantOfRep: [''],
      DateOfGrantOfReptext: [''],

      // others
      MATTERTYPE: [''],
      CLIENTSOURCE: [''],
      FIELDOFLAW: [''],
      INDUSTRY: [''],
      REFERRERGUID: [''],
      REFERRERGUIDTEXT: [''],
      ARCHIVENO: [''],
      ARCHIVEDATE: [''],
      ARCHIVEDATETEXT: ['']
    });
  }
  get f() {
    return this.matterdetailForm.controls;
  }
  Classtype(value: any) {
    this.classtype = value;
    let val = this.Classdata.find(c => c['LOOKUPGUID'] == value);
    this.behaviorService.matterClassData(val);
  }
  ondialogSaveClick(): void {
    this.FormAction = this.action !== 'edit' ? 'insert' : 'update';
    this.isspiner = true;
    let details: any = {
      MATTERCLASS: this.f.MATTERCLASS.value,
      ACTIVE: this.f.ACTIVE.value == true ? 1 : 0,
      SHORTNAME: this.f.SHORTNAME.value,
      MATTER: this.f.MATTER.value,
      // client
      FIRMGUID: this.f.FIRMGUID.value,
      // rates
      BILLINGMETHOD: this.f.BILLINGMETHOD.value,
      ONCHARGEDISBURSEMENTGST: this.f.ONCHARGEDISBURSEMENTGST.value == true ? 1 : 0,
      GSTTYPE: this.f.GSTTYPE.value,
      RATEPERHOUR: this.f.RATEPERHOUR.value,
      RATEPERDAY: this.f.RATEPERDAY.value,
      FIXEDRATEEXGST: this.f.FIXEDRATEINCGST.value,
      FIXEDRATEINCGST: this.f.FIXEDRATEEXGST.value,
      // others
      MATTERTYPE: this.f.MATTERTYPE.value,
      CLIENTSOURCE: this.f.CLIENTSOURCE.value,
      FIELDOFLAW: this.f.FIELDOFLAW.value,
      INDUSTRY: this.f.INDUSTRY.value,
      REFERRERGUID: this.f.REFERRERGUID.value,
      ARCHIVENO: this.f.ARCHIVENO.value,
      ARCHIVEDATE: this.f.ARCHIVEDATE.value,
    };
    if (this.action === 'edit') {
      details.MATTERGUID = this.f.MATTERGUID.value;
    }
    // general
    details.NOTES = this.f.NOTES.value;
    details.COMMENCEMENTDATE = this.f.COMMENCEMENTDATE.value;
    details.REFERENCE = this.f.REFERENCE.value;
    details.OTHERREFERENCE = this.f.OTHERREFERENCE.value;
    details.COMPLETEDDATE = this.f.COMPLETEDDATE.value;
    details.FEEAGREEMENTDATE = this.f.FEEAGREEMENTDATE.value;
    details.ESTIMATEFROMTOTALEXGST = this.f.ESTIMATEFROMTOTALEXGST.value;
    details.ESTIMATEFROMTOTALINCGST = this.f.ESTIMATEFROMTOTALINCGST.value;
    if (this.userType) {
      details.PRIMARYFEEEARNERGUID = this.f.PRIMARYFEEEARNERGUID.value;
      details.OWNERGUID = this.f.OWNERGUID.value;
    }
    if (this.classtype == 19) {
      // Details -> commercial
      details.CLASSOFSHARES = this.f.CLASSOFSHARES.value;
      details.NUMBEROFSHARES = this.f.NUMBEROFSHARES.value;
      details.CONSIDERATION = this.f.CONSIDERATION.value;
    } else if (this.classtype == 8 || this.classtype == 26 || this.classtype == 21 || this.classtype == 22 || this.classtype == 23 || this.classtype == 24 || this.classtype == 25) {
      //Details -> compensation
      details.ACCIDENTDATE = this.f.ACCIDENTDATE.value;
      details.INVESTIGATIONDATE = this.f.INVESTIGATIONDATE.value;
      details.SETTLEMENTDATE = this.f.SETTLEMENTDATE.value;
      details.DATEOFNOTICEOFINJURY = this.f.DATEOFNOTICEOFINJURY.value;
      details.PLACEOFINJURY = this.f.PLACEOFINJURY.value;
      details.INJURYDESCRIPTION = this.f.INJURYDESCRIPTION.value;
      details.LITIGATIONFUNDER = this.f.LITIGATIONFUNDER.value;
      details.EXPERTHEARINGDATE = this.f.EXPERTHEARINGDATE.value;
      details.TRANSFERREDFROMOTHERSOLICITOR = this.f.TRANSFERREDFROMOTHERSOLICITOR.value == true ? 1 : 0;
      details.CLIENTNAME = this.f.CLIENTNAME.value;
      details.ESTIMATEDAWARD = this.f.ESTIMATEDAWARD.value;
      details.CLAIMNUMBER = this.f.CLAIMNUMBER.value;
      details.EXPIRATIONDATE = this.f.ExpirationDate.value;
      details.HowDidInjuryOccur = this.f.HowDidInjuryOccur.value;
    } else if (this.classtype == 9) {
      // Details ->compulsory-acquisition
      details.Address = this.f.Address.value;
      details.CLIENTVALUATION = this.f.CLIENTVALUATION.value;
      details.AUTHORITYVALUATION = this.f.AUTHORITYVALUATION.value;
    } else if (this.classtype == 18) {
      //Details -> criminal
      details.BRIEFSERVICEDATE = this.f.BRIEFSERVICEDATE.value;
      details.COMMITTALDATE = this.f.COMMITTALDATE.value;
      details.REPLYDATE = this.f.REPLYDATE.value;
      details.JUVENILE = this.f.JUVENILE.value == true ? 1 : 0;
      details.WAIVEROFCOMMITTAL = this.f.WAIVEROFCOMMITTAL.value == true ? 1 : 0;
      details.BAILDATE = this.f.BAILDATE.value;
      details.BAILRESTRICTIONS = this.f.BAILRESTRICTIONS.value;
      details.OUTCOME = this.f.OUTCOME.value;
      details.SENTENCINGDATE = this.f.SENTENCINGDATE.value;
      details.SENTENCE = this.f.SENTENCE.value;
      details.S91APPLICATION = this.f.S91APPLICATION.value == true ? 1 : 0;
      details.S93APPLICATION = this.f.S93APPLICATION.value == true ? 1 : 0;
      details.COURT = this.f.COURT.value;
      details.DIVISION = this.f.DIVISION.value;
      details.REGISTRY = this.f.REGISTRY.value;
      details.MATTERNO = this.f.MatterNo.value;
      details.CourtList = this.f.CourtList.value;
    } else if (this.classtype == 10) {
      // Details ->family
      details.COHABITATIONDATE = this.f.COHABITATIONDATE.value;
      details.MARRIAGEDATE = this.f.MARRIAGEDATE.value;
      details.MARRIAGEPLACE = this.f.MARRIAGEPLACE.value;
      details.MARRIAGECOUNTRY = this.f.MARRIAGECOUNTRY.value;
      details.SEPARATIONDATE = this.f.SEPARATIONDATE.value;
      details.DATEFILEDFORDIVORCE = this.f.DATEFILEDFORDIVORCE.value;
      details.DIVORCEDATE = this.f.DIVORCEDATE.value;
      details.DIVORCEPLACE = this.f.DIVORCEPLACE.value;
      details.DIVORCECOUNTRY = this.f.DIVORCECOUNTRY.value;
      details.NUMDEPENDANTS = this.f.NUMDEPENDANTS.value;
      details.FAMILYCOURTCLIENTID = this.f.FAMILYCOURTCLIENTID.value;
      details.EXPERTHEARINGDATE = this.f.EXPERTHEARINGDATE.value;
      details.MATTERNO = this.f.MatterNo.value;
      details.EXPIRATIONDATE = this.f.ExpirationDate.value;
    } else if (this.classtype == 6) {
      //Details -> immigration
      details.VISATYPE = this.f.VISATYPE.value;
      details.VALUEOFASSETS = this.f.VALUEOFASSETS.value;
      details.VISASTATUS = this.f.VISASTATUS.value;
      details.ANTICIPATEDDATEOFENTRY = this.f.ANTICIPATEDDATEOFENTRY.value;
      details.LODGEMENTDATE = this.f.LODGEMENTDATE.value;
      details.VISAEXPIRYDATE = this.f.VISAEXPIRYDATE.value;
      details.DECISIONDUEDATE = this.f.DECISIONDUEDATE.value;
    } else if (this.classtype == 11) {
      //Details -> leasing
      details.Address2 = this.f.Address2.value;
      details.LEASERECEIVED = this.f.LEASERECEIVED.value == true ? 1 : 0;
      details.DATEEXECUTED = this.f.DATEEXECUTED.value;
      details.VALIDUNTIL = this.f.VALIDUNTIL.value;
      details.OPTIONDATE = this.f.OPTIONDATE.value;
      details.OptionDescription = this.f.OptionDescription.value;
      details.DISCLOSUREDATE = this.f.DISCLOSUREDATE.value;
      details.REGISTEREDINFILEMAN = this.f.REGISTEREDINFILEMAN.value;
    } else if (this.classtype == 2) {
      //Details -> litigation
      details.MATTERNO = this.f.MatterNo.value;
      details.COURT = this.f.COURT.value;
      details.DIVISION = this.f.DIVISION.value;
      details.CourtList = this.f.CourtList.value;
      details.REGISTRY = this.f.REGISTRY.value;
      details.ClientType = this.f.ClientType.value;
      details.MATTERTITLEBELOW = this.f.MATTERTITLEBELOW.value;
      details.COURTBELOW = this.f.COURTBELOW.value;
      details.CASENUMBERBELOW = this.f.CASENUMBERBELOW.value;
      details.DATEOFHEARINGS = this.f.DATEOFHEARINGS.value;
      details.MATERIALDATE = this.f.MATERIALDATE.value;
      details.DECISION = this.f.DECISION.value;
      details.COSTESTIMATEIFWINEXGST = this.f.COSTESTIMATEIFWINEXGST.value;
      details.CostEstimateIfWinIncGST = this.f.CostEstimateIfWinIncGST.value;
      details.CostEstimateIfFailExGST = this.f.CostEstimateIfFailExGST.value;
      details.CostEstimateIfFailIncGST = this.f.CostEstimateIfFailIncGST.value;
    } else if (this.classtype == 20) {
      //Details -> maritime
      details.VESSELNAME = this.f.VESSELNAME.value;
      details.VESSELFLAG = this.f.VESSELFLAG.value;
      details.VESSELTYPE = this.f.VESSELTYPE.value;
      details.TONNAGE = this.f.TONNAGE.value;
      details.VESSELMASTER = this.f.VESSELMASTER.value;
      details.VESSELLOCATION = this.f.VESSELLOCATION.value;
      details.PURCHASEPRICE = this.f.PURCHASEPRICE.value;

      details.INCIDENTDATE = this.f.INCIDENTDATE.value;
      details.EXCHANGEDATE = this.f.EXCHANGEDATE.value;
      details.SETTLEMENTDATE = this.f.SETTLEMENTDATE.value;
    } else if (this.classtype == 12) {
      //Details -> mortgage-finance
      details.PRINCIPALADVANCED = this.f.PRINCIPALADVANCED.value;
      details.INTERESTRATE = this.f.INTERESTRATE.value;
      details.FOLIOIDENTIFIER = this.f.FOLIOIDENTIFIER.value;
      details.DISCHARGEDATE = this.f.DISCHARGEDATE.value;
      details.SECURITYPROPERTY = this.f.SECURITYPROPERTY.value;
      details.COMMENCEMENTDATE = this.f.COMMENCEMENTDATE.value;
      details.EXPIRATIONDATE = this.f.ExpirationDate.value;
    }
    else if (this.classtype == 4) {
      // Details ->property-purchase
      // details.Address3 = this.f.Address3.value;
      details.PURCHASEPRICE = this.f.PURCHASEPRICE.value;
      details.DEPOSITAMOUNT = this.f.DEPOSITAMOUNT.value;

      details.STAMPDUTYDATE = this.f.STAMPDUTYDATE.value;
      details.SETTLEMENTDATE = this.f.SETTLEMENTDATE.value;
      details.EXCHANGEDATE = this.f.EXCHANGEDATE.value;
      details.DEPOSITBONDAMOUNT = this.f.DEPOSITBONDAMOUNT.value;
      details.STAMPDUTYAMOUNT = this.f.STAMPDUTYAMOUNT.value;
      details.DATEPAID = this.f.DATEPAID.value;
      details.BANKREFERENCE = this.f.BANKREFERENCE.value;
      details.INITIALDEPOSIT = this.f.INITIALDEPOSIT.value;
      details.BALANCEDEPOSIT = this.f.BALANCEDEPOSIT.value;
      details.BALANCEDEPOSITDATE = this.f.BALANCEDEPOSITDATE.value;
      details.SPECIALCONDITIONS = this.f.SPECIALCONDITIONS.value;
      details.BUILDINGREPORTCOMPLETED = this.f.BUILDINGREPORTCOMPLETED.value == true ? 1 : 0;
      details.PESTREPORTCOMPLETED = this.f.PESTREPORTCOMPLETED.value == true ? 1 : 0;
      details.CLIENTSTATUS = this.f.CLIENTSTATUS.value;
    } else if (this.classtype == 3) {
      //Details -> property-sale 
      // details.Address4 = this.f.Address4.value;
      details.PURCHASEPRICE = this.f.PURCHASEPRICE.value;
      details.EXCHANGEDATE = this.f.EXCHANGEDATE.value;
      details.SETTLEMENTDATE = this.f.SETTLEMENTDATE.value;
      details.ADJUSTMENTDATE = this.f.ADJUSTMENTDATE.value;
      details.DATEPAID = this.f.DATEPAID.value;
      details.BANKREFERENCE = this.f.BANKREFERENCE.value;
      details.CLIENTSTATUS = this.f.CLIENTSTATUS.value;
    } else if (this.classtype == 5) {
      //Details -> strata
      details.STRATAPLANNUMBER = this.f.STRATAPLANNUMBER.value;
      details.EXPIRATIONDATE = this.f.EXPIRATIONDATE.value;
      details.LOTNUMBER = this.f.LOTNUMBER.value;
      details.BYLAWTYPE = this.f.BYLAWTYPE.value;
      details.BYLAWNO = this.f.BYLAWNO.value;
      details.SPECIALRESOLUTIONDATE = this.f.SPECIALRESOLUTIONDATE.value;
      details.FOLIOIDENTIFIER = this.f.FOLIOIDENTIFIER.value;
      details.AGGREGATIONOFENTITLEMENT = this.f.AGGREGATIONOFENTITLEMENT.value;
      details.TOTALUNITS = this.f.TOTALUNITS.value;
    } else if (this.classtype == 14) {
      //Details -> trademark-ip
      details.FolioIdentifier = this.f.FolioIdentifier.value;
    } else if (this.classtype == 7) {
      //Details -> wills-estate
      details.DATEOFWILL = this.f.DATEOFWILL.value;
      details.ESTATEGROSSVALUE = this.f.ESTATEGROSSVALUE.value;
      details.ESTATENETVALUE = this.f.ESTATENETVALUE.value;
      details.NAMEOFTRUST = this.f.NAMEOFTRUST.value;
      details.NAMEOFSUPERANNUATION = this.f.NAMEOFSUPERANNUATION.value;
      details.NUMBEROFCODICILS = this.f.NUMBEROFCODICILS.value;
      details.DATEOFCODICILS = this.f.DATEOFCODICILS.value;
      details.DateOfGrantOfRep = this.f.DateOfGrantOfRep.value;
      details.MATTERNO = this.f.MatterNo.value;
    }
    let matterPostData: any = { FormAction: this.FormAction, VALIDATEONLY: true, Data: details };

    this._mainAPiServiceService.getSetData(matterPostData, 'SetMatter').subscribe(response => {
      matterPostData = { FormAction: this.FormAction, VALIDATEONLY: true, Data: details };
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, matterPostData);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.checkValidation(response.DATA.VALIDATIONS, matterPostData);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.checkValidation(response.DATA.VALIDATIONS, matterPostData);
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
          this.saveMatterData(details);
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.saveMatterData(details);
      this.isspiner = false;
    }
  }
  saveMatterData(data: any) {
    data.VALIDATEONLY = false;

    this._mainAPiServiceService.getSetData(data, 'SetMatter').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        if (this.action !== 'edit') {
          this.toastr.success('Matter save successfully');
        } else {
          this.toastr.success('Matter update successfully');
        }
        this.saveCorDetail(response.DATA.MATTERGUID);
        this.isspiner = false;
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.toastr.warning(response.MESSAGE);
        this.isspiner = false;
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.toastr.error(response.MESSAGE);
        this.isspiner = false;
      } else if (response.MESSAGE == 'Not logged in') {
        this.isspiner = false;
        this.dialogRef.close(false);

      }
    }, error => {
      this.toastr.error(error);
    });
  }
  saveCorDetail(MatterId: any) {
    let matterService = this._mainAPiServiceService;
    this.CorrespondDetail.forEach(function (value: { MATTERGUID: any; }) {
      value.MATTERGUID = MatterId;
      matterService.getSetData({ FORMACTION: 'insert', VALIDATEONLY: false, DATA: value }, 'SetMatterContact').subscribe((response: { CODE: number; STATUS: string; }) => {
        if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        }
      }, (error: any) => { console.log(error); });
    });
    $('#refreshMatterTab').click();
    this.dialogRef.close(true);
  }
  corDetailBack(event: any) {
    this.CorrespondDetail.push(event);
  }
}
