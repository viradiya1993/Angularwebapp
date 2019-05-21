import { Component, OnInit, Inject } from '@angular/core';
import { MattersService, TimersService } from '../../../../_services';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-matter-popup',
  templateUrl: './matter-popup.component.html',
  styleUrls: ['./matter-popup.component.scss']
})
export class MatterPopupComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  Classdata: any[];
  active: any;
  isLoadingResults: boolean = false;
  action: any;
  dialogTitle: string;
  isspiner: boolean = false;
  FormAction: string;
  classtype: any;
  BILLINGMETHODVAL: any = '';
  GSTTYPEVAL: any = '';

  constructor(
    private _mattersService: MattersService,
    private toastr: ToastrService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MatterPopupComponent>,
    public datepipe: DatePipe,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.action = _data.action;
    this.dialogTitle = this.action === 'edit' ? 'Edit Matter' : 'New Matter';
    this.classtype;
  }


  matterdetailForm: FormGroup;
  ngOnInit() {
    this.isLoadingResults = true;
    this.matterFormBuild();
    this._mattersService.getMattersClasstype({ 'LookupType': 'Matter Class' }).subscribe(responses => {
      if (responses.CODE === 200 && responses.STATUS === 'success') {
        this.Classdata = responses.DATA.LOOKUPS;
      }
      this.isLoadingResults = false;
    });
    if (this.action === 'edit') {
      this.isLoadingResults = true;
      this._mattersService.getMattersDetail({ 'MatterGuid': this._data.matterGuid, 'GETALLFIELDS': true }).subscribe(response => {
        if (response.CODE === 200 && response.STATUS === 'success') {
          let matterData = response.DATA.MATTERS[0];
          console.log(matterData);
          this.classtype = matterData.MATTERCLASS;
          this.matterdetailForm.controls['MATTERGUID'].setValue(matterData.MATTERGUID);
          this.matterdetailForm.controls['ACTIVE'].setValue(matterData.ACTIVE_ == 1 ? true : false);
          this.matterdetailForm.controls['MATTERCLASS'].setValue(matterData.MATTERCLASS);
          this.matterdetailForm.controls['SHORTNAME'].setValue(matterData.SHORTNAME);
          this.matterdetailForm.controls['MATTER'].setValue(matterData.MATTER);
          // General
          this.matterdetailForm.controls['REFERENCE'].setValue(matterData.REFERENCE);
          this.matterdetailForm.controls['OTHERREFERENCE'].setValue(matterData.OTHERREFERENCE);
          this.matterdetailForm.controls['COMMENCEMENTDATETEXT'].setValue(matterData.COMMENCEMENTDATE);
          this.matterdetailForm.controls['FeeAgreementDateText'].setValue(matterData.FeeAgreementDate);
          this.matterdetailForm.controls['COMPLETEDDATETEXT'].setValue(matterData.COMPLETEDDATE);
          this.matterdetailForm.controls['OWNERGUID'].setValue(matterData.OWNERGUID);
          this.matterdetailForm.controls['PRIMARYFEEEARNERGUID'].setValue(matterData.PRIMARYFEEEARNERGUID);
          this.matterdetailForm.controls['EstimateFromTotalExGST'].setValue(matterData.EstimateFromTotalExGST);
          this.matterdetailForm.controls['EstimateFromTotalIncGST'].setValue(matterData.EstimateFromTotalIncGST);
          this.matterdetailForm.controls['NOTES'].setValue(matterData.NOTES);
          //Rates
          this.matterdetailForm.controls['GSTTYPE'].setValue(matterData.BILLINGGROUP.GSTTYPE);
          this.GSTTYPEVAL = matterData.BILLINGGROUP.GSTTYPE;
          this.BILLINGMETHODVAL = matterData.BILLINGGROUP.BILLINGMETHOD;
          this.matterdetailForm.controls['ONCHARGEDISBURSEMENTGST'].setValue(matterData.BILLINGGROUP.ONCHARGEDISBURSEMENTGST == 1 ? true : false);
          this.matterdetailForm.controls['BILLINGMETHOD'].setValue(matterData.BILLINGGROUP.BILLINGMETHOD);
          this.matterdetailForm.controls['RATEPERHOUR'].setValue(matterData.BILLINGGROUP.RATEPERHOUR);
          this.matterdetailForm.controls['RATEPERDAY'].setValue(matterData.BILLINGGROUP.RATEPERDAY);
          this.matterdetailForm.controls['FIXEDRATEEXGST'].setValue(matterData.BILLINGGROUP.FIXEDRATEEXGST);
          this.matterdetailForm.controls['FIXEDRATEINCGST'].setValue(matterData.BILLINGGROUP.FIXEDRATEINCGST);
          //other
          this.matterdetailForm.controls['MATTERTYPE'].setValue(matterData.LEGALDETAILS.MATTERTYPE);
          this.matterdetailForm.controls['CLIENTSOURCE'].setValue(matterData.MARKETINGGROUP.CLIENTSOURCE);
          this.matterdetailForm.controls['FIELDOFLAW'].setValue(matterData.MARKETINGGROUP.FIELDOFLAW);
          this.matterdetailForm.controls['INDUSTRY'].setValue(matterData.MARKETINGGROUP.INDUSTRY);
          this.matterdetailForm.controls['REFERRERGUIDTEXT'].setValue(matterData.MARKETINGGROUP.REFERRERGUID);
          this.matterdetailForm.controls['ARCHIVENO'].setValue(matterData.ARCHIVENO);
          this.matterdetailForm.controls['ARCHIVEDATETEXT'].setValue(matterData.ARCHIVEDATE);

          if (matterData.MATTERCLASS == 'Commercial') {            // Details -> commercial
            this.matterdetailForm.controls['CLASSOFSHARES'].setValue(matterData.COMMERCIALGROUP.CLASSOFSHARES);
            this.matterdetailForm.controls['NUMBEROFSHARES'].setValue(matterData.COMMERCIALGROUP.NUMBEROFSHARES);
            this.matterdetailForm.controls['CONSIDERATION'].setValue(matterData.COMMERCIALGROUP.CONSIDERATION);
          } else if (matterData.MATTERCLASS == 'Compensation') {            //Details -> compensation
            this.matterdetailForm.controls['ACCIDENTDATETEXT'].setValue(matterData.COMPENSATIONGROUP.ACCIDENTDATE);
            this.matterdetailForm.controls['ExpirationDatetext'].setValue(matterData.STRATAGROUP.EXPIRATIONDATE);
            this.matterdetailForm.controls['DATEOFNOTICEOFINJURYTEXT'].setValue(matterData.COMPENSATIONGROUP.DATEOFNOTICEOFINJURY);
            this.matterdetailForm.controls['PLACEOFINJURY'].setValue(matterData.COMPENSATIONGROUP.PLACEOFINJURY);
            this.matterdetailForm.controls['INJURYDESCRIPTION'].setValue(matterData.COMPENSATIONGROUP.INJURYDESCRIPTION);
            this.matterdetailForm.controls['HowDidInjuryOccur'].setValue(matterData.COMPENSATIONGROUP.HOWDIDINJURYOCCUR);
            this.matterdetailForm.controls['LITIGATIONFUNDER'].setValue(matterData.COMPENSATIONGROUP.LITIGATIONFUNDER);
            this.matterdetailForm.controls['CLIENTNAME'].setValue(matterData.LEGALDETAILS.CLIENTNAME);
            this.matterdetailForm.controls['ESTIMATEDAWARD'].setValue(matterData.COMPENSATIONGROUP.ESTIMATEDAWARD);
            this.matterdetailForm.controls['CLAIMNUMBER'].setValue(matterData.COMPENSATIONGROUP.CLAIMNUMBER);
            this.matterdetailForm.controls['INVESTIGATIONDATETEXT'].setValue(matterData.COMPENSATIONGROUP.INVESTIGATIONDATE);
            this.matterdetailForm.controls['SETTLEMENTDATETEXT'].setValue(matterData.CONVEYANCINGGROUP.SETTLEMENTDATE);
            this.matterdetailForm.controls['EXPERTHEARINGDATE'].setValue(matterData.EXPERTPROCESSGROUP.EXPERTHEARINGDATE);
          } else if (matterData.MATTERCLASS == 'Compulsory Acquisition') {   // Details ->compulsory-acquisition
            this.matterdetailForm.controls['CLIENTVALUATION'].setValue(matterData.COMPULSORYACQUISITIONGROUP.CLIENTVALUATION);
            this.matterdetailForm.controls['AUTHORITYVALUATION'].setValue(matterData.COMPULSORYACQUISITIONGROUP.AUTHORITYVALUATION);
          } else if (matterData.MATTERCLASS == 18) {            //Details -> criminal
            this.matterdetailForm.controls['BRIEFSERVICEDATE'].setValue(matterData.CRIMINALGROUP.BRIEFSERVICEDATE);
            this.matterdetailForm.controls['COMMITTALDATE'].setValue(matterData.CRIMINALGROUP.COMMITTALDATE);
            this.matterdetailForm.controls['REPLYDATE'].setValue(matterData.CRIMINALGROUP.REPLYDATE);
            this.matterdetailForm.controls['JUVENILE'].setValue(matterData.CRIMINALGROUP.JUVENILE ? true : false);
            this.matterdetailForm.controls['WAIVEROFCOMMITTAL'].setValue(matterData.CRIMINALGROUP.WAIVEROFCOMMITTAL ? true : false);
            this.matterdetailForm.controls['BAILDATE'].setValue(matterData.CRIMINALGROUP.BAILDATE);
            this.matterdetailForm.controls['BAILRESTRICTIONS'].setValue(matterData.CRIMINALGROUP.BAILRESTRICTIONS);
            this.matterdetailForm.controls['OUTCOME'].setValue(matterData.CRIMINALGROUP.OUTCOME);
            this.matterdetailForm.controls['SENTENCINGDATE'].setValue(matterData.CRIMINALGROUP.SENTENCINGDATE);
            this.matterdetailForm.controls['SENTENCE'].setValue(matterData.CRIMINALGROUP.SENTENCE);
            this.matterdetailForm.controls['S91APPLICATION'].setValue(matterData.CRIMINALGROUP.S91APPLICATION ? true : false);
            this.matterdetailForm.controls['S93APPLICATION'].setValue(matterData.CRIMINALGROUP.S93APPLICATION ? true : false);
            this.matterdetailForm.controls['COURT'].setValue(matterData.LEGALDETAILS.COURT);
            this.matterdetailForm.controls['DIVISION'].setValue(matterData.LEGALDETAILS.DIVISION);
            this.matterdetailForm.controls['REGISTRY'].setValue(matterData.LEGALDETAILS.REGISTRY);
            this.matterdetailForm.controls['MatterNo'].setValue(matterData.COMPULSORYACQUISITIONGROUP.MATTERNO);
            this.matterdetailForm.controls['CourtList'].setValue(matterData.COMPULSORYACQUISITIONGROUP.COURTLIST);
          } else if (matterData.MATTERCLASS == 10) {            // Details ->family
            this.matterdetailForm.controls['COHABITATIONDATE'].setValue(matterData.FAMILYLAWGROUP.COHABITATIONDATE);
            this.matterdetailForm.controls['MARRIAGEDATE'].setValue(matterData.FAMILYLAWGROUP.MARRIAGEDATE);
            this.matterdetailForm.controls['MARRIAGEPLACE'].setValue(matterData.FAMILYLAWGROUP.MARRIAGEPLACE);
            this.matterdetailForm.controls['MARRIAGECOUNTRY'].setValue(matterData.FAMILYLAWGROUP.MARRIAGECOUNTRY);
            this.matterdetailForm.controls['SEPARATIONDATE'].setValue(matterData.FAMILYLAWGROUP.SEPARATIONDATE);
            this.matterdetailForm.controls['DATEFILEDFORDIVORCE'].setValue(matterData.FAMILYLAWGROUP.DATEFILEDFORDIVORCE);
            this.matterdetailForm.controls['DIVORCEDATE'].setValue(matterData.FAMILYLAWGROUP.DIVORCEDATE);
            this.matterdetailForm.controls['DIVORCEPLACE'].setValue(matterData.FAMILYLAWGROUP.DIVORCEPLACE);
            this.matterdetailForm.controls['DIVORCECOUNTRY'].setValue(matterData.FAMILYLAWGROUP.DIVORCECOUNTRY);
            this.matterdetailForm.controls['NUMDEPENDANTS'].setValue(matterData.FAMILYLAWGROUP.NUMDEPENDANTS);
            this.matterdetailForm.controls['FAMILYCOURTCLIENTID'].setValue(matterData.FAMILYLAWGROUP.FAMILYCOURTCLIENTID);
            this.matterdetailForm.controls['EXPERTHEARINGDATE'].setValue(matterData.EXPERTPROCESSGROUP.EXPERTHEARINGDATE);
            this.matterdetailForm.controls['MatterNo'].setValue(matterData.COMPULSORYACQUISITIONGROUP.MATTERNO);
            this.matterdetailForm.controls['ExpirationDate'].setValue(matterData.STRATAGROUP.ExpirationDate);
          } else if (matterData.MATTERCLASS == 'Immigration') {             //Details -> immigration
            this.matterdetailForm.controls['VISATYPE'].setValue(matterData.VISAGROUP.VISATYPE);
            this.matterdetailForm.controls['VALUEOFASSETS'].setValue(matterData.VISAGROUP.VALUEOFASSETS);
            this.matterdetailForm.controls['VISASTATUS'].setValue(matterData.VISAGROUP.VISASTATUS);
            this.matterdetailForm.controls['ANTICIPATEDDATEOFENTRY'].setValue(matterData.VISAGROUP.ANTICIPATEDDATEOFENTRY);
            this.matterdetailForm.controls['LODGEMENTDATE'].setValue(matterData.VISAGROUP.LODGEMENTDATE);
            this.matterdetailForm.controls['VISAEXPIRYDATE'].setValue(matterData.VISAGROUP.VISAEXPIRYDATE);
            this.matterdetailForm.controls['DECISIONDUEDATE'].setValue(matterData.VISAGROUP.DECISIONDUEDATE);
          } else if (matterData.MATTERCLASS == 'Leasing') { //Details -> leasing
            // this.matterdetailForm.controls['Address2'].setValue(matterData..Address2);
            this.matterdetailForm.controls['LEASERECEIVED'].setValue(matterData.LEASINGGROUP.LEASERECEIVED);
            this.matterdetailForm.controls['DATEEXECUTED'].setValue(matterData.LEASINGGROUP.DATEEXECUTED);
            this.matterdetailForm.controls['VALIDUNTIL'].setValue(matterData.LEASINGGROUP.VALIDUNTIL);
            this.matterdetailForm.controls['OPTIONDATE'].setValue(matterData.LEASINGGROUP.OPTIONDATE);
            this.matterdetailForm.controls['OptionDescription'].setValue(matterData.LEASINGGROUP.OptionDescription);
            this.matterdetailForm.controls['DISCLOSUREDATE'].setValue(matterData.LEASINGGROUP.DISCLOSUREDATE);
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
            this.matterdetailForm.controls['DATEOFHEARINGS'].setValue(matterData.LEGALDETAILS.DATEOFHEARINGS);
            this.matterdetailForm.controls['MATERIALDATE'].setValue(matterData.LEGALDETAILS.MATERIALDATE);
            this.matterdetailForm.controls['DECISION'].setValue(matterData.VISAGROUP.DECISION);
            this.matterdetailForm.controls['COSTESTIMATEIFWINEXGST'].setValue(matterData.SUMMARYTOTALS.COSTESTIMATEIFWINEXGST);
            this.matterdetailForm.controls['CostEstimateIfWinIncGST'].setValue(matterData.SUMMARYTOTALS.COSTESTIMATEIFWININCGST);
            this.matterdetailForm.controls['CostEstimateIfFailExGST'].setValue(matterData.SUMMARYTOTALS.COSTESTIMATEIFFAILEXGST);
            this.matterdetailForm.controls['CostEstimateIfFailIncGST'].setValue(matterData.SUMMARYTOTALS.COSTESTIMATEIFFAILINCGST);
          } else if (matterData.MATTERCLASS == 'Maritime') {            //Details -> maritime
            this.matterdetailForm.controls['VESSELNAME'].setValue(matterData.VESSELGROUP.VESSELNAME);
            this.matterdetailForm.controls['VESSELFLAG'].setValue(matterData.VESSELGROUP.VESSELFLAG);
            this.matterdetailForm.controls['VESSELTYPE'].setValue(matterData.VESSELGROUP.VESSELTYPE);
            this.matterdetailForm.controls['TONNAGE'].setValue(matterData.VESSELGROUP.TONNAGE);
            this.matterdetailForm.controls['VESSELMASTER'].setValue(matterData.VESSELGROUP.VESSELMASTER);
            this.matterdetailForm.controls['VESSELLOCATION'].setValue(matterData.VESSELGROUP.VESSELLOCATION);
            this.matterdetailForm.controls['PURCHASEPRICE'].setValue(matterData.CONVEYANCINGGROUP.PURCHASEPRICE);
            this.matterdetailForm.controls['INCIDENTDATE'].setValue(matterData.VESSELGROUP.INCIDENTDATE);
            this.matterdetailForm.controls['EXCHANGEDATE'].setValue(matterData.CONVEYANCINGGROUP.EXCHANGEDATE);
            this.matterdetailForm.controls['SETTLEMENTDATE'].setValue(matterData.CONVEYANCINGGROUP.SETTLEMENTDATE);
          } else if (matterData.MATTERCLASS == 'Mortgage Finance') {            //Details -> mortgage-finance
            this.matterdetailForm.controls['PRINCIPALADVANCED'].setValue(matterData.MORTGAGEGROUP.PRINCIPALADVANCED);
            this.matterdetailForm.controls['INTERESTRATE'].setValue(matterData.MORTGAGEGROUP.INTERESTRATE);
            this.matterdetailForm.controls['FOLIOIDENTIFIER'].setValue(matterData.STRATAGROUP.FOLIOIDENTIFIER);
            this.matterdetailForm.controls['DISCHARGEDATE'].setValue(matterData.MORTGAGEGROUP.DISCHARGEDATE);
            this.matterdetailForm.controls['SECURITYPROPERTY'].setValue(matterData.MORTGAGEGROUP.SECURITYPROPERTY);
            this.matterdetailForm.controls['COMMENCEMENTDATE'].setValue(matterData.LEASINGGROUP.COMMENCEMENTDATE);
            this.matterdetailForm.controls['ExpirationDate'].setValue(matterData.STRATAGROUP.EXPIRATIONDATE);
          } else if (matterData.MATTERCLASS == 'Property Purchase') {          // Details ->property-purchase
            this.matterdetailForm.controls['PURCHASEPRICE'].setValue(matterData.CONVEYANCINGGROUP.PURCHASEPRICE);
            this.matterdetailForm.controls['DEPOSITAMOUNT'].setValue(matterData.CONVEYANCINGGROUP.DEPOSITAMOUNT);
            this.matterdetailForm.controls['STAMPDUTYDATE'].setValue(matterData.CONVEYANCINGGROUP.STAMPDUTYDATE);
            this.matterdetailForm.controls['SETTLEMENTDATE'].setValue(matterData.CONVEYANCINGGROUP.SETTLEMENTDATE);
            this.matterdetailForm.controls['EXCHANGEDATE'].setValue(matterData.CONVEYANCINGGROUP.EXCHANGEDATE);
            this.matterdetailForm.controls['DEPOSITBONDAMOUNT'].setValue(matterData.CONVEYANCINGGROUP.DEPOSITBONDAMOUNT);
            this.matterdetailForm.controls['STAMPDUTYAMOUNT'].setValue(matterData.CONVEYANCINGGROUP.STAMPDUTYAMOUNT);
            this.matterdetailForm.controls['DATEPAID'].setValue(matterData.CONVEYANCINGGROUP.DATEPAID);
            this.matterdetailForm.controls['BANKREFERENCE'].setValue(matterData.CONVEYANCINGGROUP.BANKREFERENCE);
            this.matterdetailForm.controls['INITIALDEPOSIT'].setValue(matterData.CONVEYANCINGGROUP.INITIALDEPOSIT);
            this.matterdetailForm.controls['BALANCEDEPOSIT'].setValue(matterData.CONVEYANCINGGROUP.BALANCEDEPOSIT);
            this.matterdetailForm.controls['BALANCEDEPOSITDATE'].setValue(matterData.CONVEYANCINGGROUP.BALANCEDEPOSITDATE);
            this.matterdetailForm.controls['SPECIALCONDITIONS'].setValue(matterData.CONVEYANCINGGROUP.SPECIALCONDITIONS);
            this.matterdetailForm.controls['BUILDINGREPORTCOMPLETED'].setValue(matterData.CONVEYANCINGGROUP.BUILDINGREPORTCOMPLETED);
            this.matterdetailForm.controls['PESTREPORTCOMPLETED'].setValue(matterData.CONVEYANCINGGROUP.PESTREPORTCOMPLETED);
            this.matterdetailForm.controls['ClientStatus'].setValue(matterData.LEGALDETAILS.CLIENTSTATUS);
            // Address3 = Address3;
          } else if (matterData.MATTERCLASS == 'Property Sale') {   //Details -> property-sale 
            this.matterdetailForm.controls['PURCHASEPRICE'].setValue(matterData.CONVEYANCINGGROUP.CLIENTSTATUS);
            this.matterdetailForm.controls['EXCHANGEDATE'].setValue(matterData.CONVEYANCINGGROUP.EXCHANGEDATE);
            this.matterdetailForm.controls['SETTLEMENTDATE'].setValue(matterData.CONVEYANCINGGROUP.SETTLEMENTDATE);
            this.matterdetailForm.controls['ADJUSTMENTDATE'].setValue(matterData.CONVEYANCINGGROUP.ADJUSTMENTDATE);
            this.matterdetailForm.controls['DATEPAID'].setValue(matterData.CONVEYANCINGGROUP.DATEPAID);
            this.matterdetailForm.controls['BANKREFERENCE'].setValue(matterData.CONVEYANCINGGROUP.BANKREFERENCE);
            this.matterdetailForm.controls['ClientStatus'].setValue(matterData.LEGALDETAILS.CLIENTSTATUS);
            // details.Address4 = this.f.Address4.value;
          } else if (matterData.MATTERCLASS == 'Strata') {//Details -> strata
            this.matterdetailForm.controls['STRATAPLANNUMBER'].setValue(matterData.STRATAGROUP.STRATAPLANNUMBER);
            this.matterdetailForm.controls['EXPIRATIONDATE'].setValue(matterData.STRATAGROUP.EXPIRATIONDATE);
            this.matterdetailForm.controls['LOTNUMBER'].setValue(matterData.STRATAGROUP.LOTNUMBER);
            this.matterdetailForm.controls['BYLAWTYPE'].setValue(matterData.STRATAGROUP.BYLAWTYPE);
            this.matterdetailForm.controls['BYLAWNO'].setValue(matterData.STRATAGROUP.BYLAWNO);
            this.matterdetailForm.controls['SPECIALRESOLUTIONDATE'].setValue(matterData.STRATAGROUP.SPECIALRESOLUTIONDATE);
            this.matterdetailForm.controls['FOLIOIDENTIFIER'].setValue(matterData.STRATAGROUP.FOLIOIDENTIFIER);
            this.matterdetailForm.controls['AGGREGATIONOFENTITLEMENT'].setValue(matterData.STRATAGROUP.AGGREGATIONOFENTITLEMENT);
            this.matterdetailForm.controls['TOTALUNITS'].setValue(matterData.STRATAGROUP.TOTALUNITS);
          }
          else if (this.classtype == 'Trademark/IP') { //Details -> trademark-ip
            this.matterdetailForm.controls['FolioIdentifier'].setValue(matterData.STRATAGROUP.FOLIOIDENTIFIER);
          } else if (matterData.MATTERCLASS == 7) {
            this.matterdetailForm.controls['DATEOFWILL'].setValue(matterData.ESTATEGROUP.DATEOFWILL);
            this.matterdetailForm.controls['ESTATEGROSSVALUE'].setValue(matterData.ESTATEGROUP.ESTATEGROSSVALUE);
            this.matterdetailForm.controls['ESTATENETVALUE'].setValue(matterData.ESTATEGROUP.ESTATENETVALUE);
            this.matterdetailForm.controls['NAMEOFTRUST'].setValue(matterData.ESTATEGROUP.NAMEOFTRUST);
            this.matterdetailForm.controls['NAMEOFSUPERANNUATION'].setValue(matterData.ESTATEGROUP.NAMEOFSUPERANNUATION);
            this.matterdetailForm.controls['NUMBEROFCODICILS'].setValue(matterData.ESTATEGROUP.NUMBEROFCODICILS);
            this.matterdetailForm.controls['DATEOFCODICILS'].setValue(matterData.ESTATEGROUP.DATEOFCODICILS);
            this.matterdetailForm.controls['DateOfGrantOfRep'].setValue(matterData.ESTATEGROUP.DATEOFGRANTOFREP);
            this.matterdetailForm.controls['MatterNo'].setValue(matterData.LEGALDETAILS.MATTERNO);
          }
          this.isLoadingResults = false;
        }
      }, error => {
        this.toastr.error(error);
      });
    } else {
      this.matterdetailForm.controls['ACTIVE'].setValue(true);
    }
  }
  matterFormBuild() {
    this.matterdetailForm = this._formBuilder.group({
      MATTERGUID: [''],
      MATTERCLASS: [''],
      ACTIVE: [''],
      SHORTNAME: [''],
      MATTER: [''],
      // general
      NOTES: [''],
      COMMENCEMENTDATE: [''],
      COMMENCEMENTDATETEXT: [''],
      REFERENCE: [''],
      OTHERREFERENCE: [''],
      COMPLETEDDATE: [''],
      COMPLETEDDATETEXT: [''],
      PRIMARYFEEEARNERGUID: [''],
      OWNERGUID: [''],
      FeeAgreementDate: [],
      FeeAgreementDateText: [],
      EstimateFromTotalExGST: [''],
      EstimateFromTotalIncGST: [''],

      // client
      FirmGuid: [''],
      Clientmattertext: [''],

      // rates
      BILLINGMETHOD: [''],
      ONCHARGEDISBURSEMENTGST: [''],
      GSTTYPE: [''],
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
      ClientStatus: [''],
      Address3: [''],
      PURCHASEPRICE: [''],
      DEPOSITAMOUNT: [''],
      STAMPDUTYDATE: [''],
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
    //console.log(this.contactForm);
    return this.matterdetailForm.controls;
  }
  Classtype(value) {
    this.classtype = value;
  }
  ondialogSaveClick(): void {
    this.FormAction = this.action !== 'edit' ? 'insert' : 'update';
    this.isspiner = true;
    let details: any = {
      MatterGuid: this.f.MATTERGUID.value,
      MATTERCLASS: this.f.MATTERCLASS.value,
      ACTIVE: this.f.ACTIVE.value == true ? 1 : 0,
      SHORTNAME: this.f.SHORTNAME.value,
      MATTER: this.f.MATTER.value,

      // general
      NOTES: this.f.NOTES.value,
      COMMENCEMENTDATE: this.f.COMMENCEMENTDATE.value,
      REFERENCE: this.f.REFERENCE.value,
      OTHERREFERENCE: this.f.OTHERREFERENCE.value,
      COMPLETEDDATE: this.f.COMPLETEDDATE.value,
      PRIMARYFEEEARNERGUID: this.f.PRIMARYFEEEARNERGUID.value,
      OWNERGUID: this.f.OWNERGUID.value,
      FeeAgreementDate: this.f.FeeAgreementDate.value,
      EstimateFromTotalExGST: this.f.EstimateFromTotalExGST.value,
      EstimateFromTotalIncGST: this.f.EstimateFromTotalIncGST.value,

      // client
      FirmGuid: this.f.FirmGuid.value,
      // rates
      BILLINGMETHOD: this.f.BILLINGMETHOD.value,
      ONCHARGEDISBURSEMENTGST: this.f.ONCHARGEDISBURSEMENTGST.value == true ? 1 : 0,
      GSTTYPE: this.f.GSTTYPE.value,
      RATEPERHOUR: this.f.RATEPERHOUR.value,
      RATEPERDAY: this.f.RATEPERDAY.value,
      FIXEDRATEEXGST: this.f.FIXEDRATEEXGST.value,
      FIXEDRATEINCGST: this.f.FIXEDRATEINCGST.value,
      // others
      MATTERTYPE: this.f.MATTERTYPE.value,
      CLIENTSOURCE: this.f.CLIENTSOURCE.value,
      FIELDOFLAW: this.f.FIELDOFLAW.value,
      INDUSTRY: this.f.INDUSTRY.value,
      REFERRERGUID: this.f.REFERRERGUID.value,
      ARCHIVENO: this.f.ARCHIVENO.value,
      ARCHIVEDATE: this.f.ARCHIVEDATE.value,

    };
    if (this.classtype == 'Commercial') {
      // Details -> commercial
      details.CLASSOFSHARES = this.f.CLASSOFSHARES.value;
      details.NUMBEROFSHARES = this.f.NUMBEROFSHARES.value;
      details.CONSIDERATION = this.f.CONSIDERATION.value;
    } else if (this.classtype == 'Compensation') {
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
      details.ExpirationDate = this.f.ExpirationDate.value;
      details.HowDidInjuryOccur = this.f.HowDidInjuryOccur.value;
    } else if (this.classtype == 'Compulsory Acquisition') {
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
      details.MatterNo = this.f.MatterNo.value;
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
      details.MatterNo = this.f.MatterNo.value;
      details.ExpirationDate = this.f.ExpirationDate.value;
    } else if (this.classtype == 'Immigration') {
      //Details -> immigration
      details.VISATYPE = this.f.VISATYPE.value;
      details.VALUEOFASSETS = this.f.VALUEOFASSETS.value;
      details.VISASTATUS = this.f.VISASTATUS.value;
      details.ANTICIPATEDDATEOFENTRY = this.f.ANTICIPATEDDATEOFENTRY.value;
      details.LODGEMENTDATE = this.f.LODGEMENTDATE.value;
      details.VISAEXPIRYDATE = this.f.VISAEXPIRYDATE.value;
      details.DECISIONDUEDATE = this.f.DECISIONDUEDATE.value;
    } else if (this.classtype == 'Leasing') {
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
      details.MatterNo = this.f.MatterNo.value;
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
    } else if (this.classtype == 'Maritime') {
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
    } else if (this.classtype == 'Mortgage Finance') {
      //Details -> mortgage-finance
      details.PRINCIPALADVANCED = this.f.PRINCIPALADVANCED.value;
      details.INTERESTRATE = this.f.INTERESTRATE.value;
      details.FOLIOIDENTIFIER = this.f.FOLIOIDENTIFIER.value;
      details.DISCHARGEDATE = this.f.DISCHARGEDATE.value;
      details.SECURITYPROPERTY = this.f.SECURITYPROPERTY.value;
      details.COMMENCEMENTDATE = this.f.COMMENCEMENTDATE.value;
      details.ExpirationDate = this.f.ExpirationDate.value;
    }
    else if (this.classtype == 'Property Purchase') {
      // Details ->property-purchase
      details.Address3 = this.f.Address3.value;
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
      details.ClientStatus = this.f.ClientStatus.value;
    } else if (this.classtype == 'Property Sale') {
      //Details -> property-sale 
      details.Address4 = this.f.Address4.value;
      details.PURCHASEPRICE = this.f.PURCHASEPRICE.value;
      details.EXCHANGEDATE = this.f.EXCHANGEDATE.value;
      details.SETTLEMENTDATE = this.f.SETTLEMENTDATE.value;
      details.ADJUSTMENTDATE = this.f.ADJUSTMENTDATE.value;
      details.DATEPAID = this.f.DATEPAID.value;
      details.BANKREFERENCE = this.f.BANKREFERENCE.value;
      details.ClientStatus = this.f.ClientStatus.value;
    } else if (this.classtype == 'Strata') {
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
    } else if (this.classtype == 'Trademark/IP') {
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
      details.MatterNo = this.f.MatterNo.value;
    }
    let matterPostData: any = { FormAction: this.FormAction, VALIDATEONLY: true, Data: details };
    this._mattersService.AddNewMatter(matterPostData).subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, matterPostData);
      } else if (response.CODE == 451 && response.STATUS == "warning") {
        this.checkValidation(response.DATA.VALIDATIONS, matterPostData);
      } else {
        if (response.CODE == 402 && response.STATUS == "error" && response.MESSAGE == "Not logged in")
          this.dialogRef.close(false);
        this.isspiner = false;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
  checkValidation(bodyData: any, details: any) {
    let errorData: any = [];
    let warningData: any = [];
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'NO')
        errorData.push(value.ERRORDESCRIPTION);
      else if (value.VALUEVALID == 'WARNING')
        warningData.push(value.ERRORDESCRIPTION);
    });
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
          this.saveMatterData(details);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.saveMatterData(details);
    this.isspiner = false;
  }
  saveMatterData(data: any) {
    data.VALIDATEONLY = false;
    this._mattersService.AddNewMatter(data).subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        if (this.action !== 'edit') {
          this.toastr.success('Matter save successfully');
        } else {
          this.toastr.success('Matter update successfully');
        }
        this.isspiner = false;
        this.dialogRef.close(true);
      } else {
        this.isspiner = false;
      }
    }, error => {
      this.toastr.error(error);
    });
  }
}
