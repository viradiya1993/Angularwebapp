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
    this.classtype = 'Trademark/IP';
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
    this.matterdetailForm.controls['ACTIVE'].setValue(true);
    if (this.action === 'edit') {
      const localMatterID = JSON.parse(localStorage.getItem('set_active_matters'));
      // this.isLoadingResults = true;
      let postData = { 'MatterGuid': localMatterID.MATTERGUID };
      this._mattersService.getMattersDetail(postData).subscribe(response => {
        if (response.CODE === 200 && response.STATUS === 'success') {
          // let currentMatter = response.DATA.MATTERS[0];
          // this.active = currentMatter.ACTIVE === 0 ? false : true;
          // this.matterdetailForm.controls['MatterNum'].setValue(currentMatter.SHORTNAME);
          // this.matterdetailForm.controls['Client'].setValue(currentMatter.CONTACTTYPE);
          // this.matterdetailForm.controls['MatterDescription'].setValue(currentMatter.MATTER);
          // this.matterdetailForm.controls['ClientReference'].setValue(currentMatter.REFERENCE);
          // this.matterdetailForm.controls['PerHours'].setValue(currentMatter.RATEPERHOUR);
          // this.matterdetailForm.controls['PerDay'].setValue(currentMatter.RATEPERDAY);
          // this.isLoadingResults = false;
        }
      }, error => {
        this.toastr.error(error);
      });
    }

  }
  matterFormBuild() {
    this.matterdetailForm = this._formBuilder.group({
      MATTERCLASS: [''],
      ACTIVE: [''],
      SHORTNAME: [''],

      MatterDescription: [''],
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

      CostsAgreementDate: [],
      EstimateMinimum: [''],
      Ex_GST: [''],

      // client
      Clientmatter: [''],
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

      ExpiryDate: [''],
      ExpiryDatetext: [''],
      CauseofInjury: [''],
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
      CourtMatter: [''],
      List: [''],

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
      ExpiryDate1: [''],
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
      Term: [''],
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
      CourtMatter1: [''],
      List1: [''],
      ClientType1: [''],
      CostEstimateSuccesful: [''],
      IncGST: [''],
      CostEstimateUnsuccesful: [''],
      IncGST2: [''],

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
      ExpirtyDate: [''],

      // Details ->property-purchase
      Status: [''],
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
      Status1: [''],
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
      ApplicationNumber: [''],

      //Details -> wills-estate
      DATEOFWILL: [''],
      DATEOFWILLTEXT: [''],
      ESTATEGROSSVALUE: [''],
      ESTATENETVALUE: [''],
      NAMEOFTRUST: [''],
      NAMEOFSUPERANNUATION: [''],
      NUMBEROFCODICILS: [''],
      DATEOFCODICILS: [''],
      DateGrantRepresentation: [''],
      DateGrantRepresentationtext: [''],

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
      FormAction: this.FormAction,
      MATTERCLASS: this.f.MATTERCLASS.value,
      ACTIVE: this.f.ACTIVE.value == true ? 1 : 0,
      SHORTNAME: this.f.SHORTNAME.value,
      MatterDescription: this.f.MatterDescription.value,

      // general
      NOTES: this.f.NOTES.value,
      COMMENCEMENTDATE: this.f.COMMENCEMENTDATE.value,
      REFERENCE: this.f.REFERENCE.value,
      OTHERREFERENCE: this.f.OTHERREFERENCE.value,
      COMPLETEDDATE: this.f.COMPLETEDDATE.value,
      PRIMARYFEEEARNERGUID: this.f.PRIMARYFEEEARNERGUID.value,
      OWNERGUID: this.f.OWNERGUID.value,

      CostsAgreementDate: this.f.CostsAgreementDate.value,
      EstimateMinimum: this.f.EstimateMinimum.value,
      Ex_GST: this.f.Ex_GST.value,

      // client
      Clientmatter: this.f.Clientmatter.value,
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
      details.ExpiryDate = this.f.ExpiryDate.value;
      details.CauseofInjury = this.f.CauseofInjury.value;
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
      details.CourtMatter = this.f.CourtMatter.value;
      details.List = this.f.List.value;
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
      details.CourtMatter = this.f.CourtMatter.value;
      details.ExpiryDate1 = this.f.ExpiryDate1.value;
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
      details.Term = this.f.Term.value;
      details.DISCLOSUREDATE = this.f.DISCLOSUREDATE.value;
      details.REGISTEREDINFILEMAN = this.f.REGISTEREDINFILEMAN.value;
    } else if (this.classtype == 2) {
      //Details -> litigation
      details.CourtMatter1 = this.f.CourtMatter1.value;
      details.COURT = this.f.COURT.value;
      details.DIVISION = this.f.DIVISION.value;
      details.List1 = this.f.List1.value;
      details.REGISTRY = this.f.REGISTRY.value;
      details.ClientType1 = this.f.ClientType1.value;
      details.MATTERTITLEBELOW = this.f.MATTERTITLEBELOW.value;
      details.COURTBELOW = this.f.COURTBELOW.value;
      details.CASENUMBERBELOW = this.f.CASENUMBERBELOW.value;
      details.DATEOFHEARINGS = this.f.DATEOFHEARINGS.value;
      details.MATERIALDATE = this.f.MATERIALDATE.value;
      details.DECISION = this.f.DECISION.value;
      details.CostEstimateSuccesful = this.f.CostEstimateSuccesful.value;
      details.IncGST = this.f.IncGST.value;
      details.CostEstimateUnsuccesful = this.f.CostEstimateUnsuccesful.value;
      details.IncGST2 = this.f.IncGST2.value;
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
      details.ExpirtyDate = this.f.ExpirtyDate.value;
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
      details.Status = this.f.Status.value;
    } else if (this.classtype == 'Property Sale') {
      //Details -> property-sale 
      details.Address4 = this.f.Address4.value;
      details.PURCHASEPRICE = this.f.PURCHASEPRICE.value;
      details.EXCHANGEDATE = this.f.EXCHANGEDATE.value;
      details.SETTLEMENTDATE = this.f.SETTLEMENTDATE.value;
      details.ADJUSTMENTDATE = this.f.ADJUSTMENTDATE.value;
      details.DATEPAID = this.f.DATEPAID.value;
      details.BANKREFERENCE = this.f.BANKREFERENCE.value;
      details.Status1 = this.f.Status1.value;
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
      details.ApplicationNumber = this.f.ApplicationNumber.value;
    } else if (this.classtype == 7) {
      //Details -> wills-estate
      details.DATEOFWILL = this.f.DATEOFWILL.value;
      details.ESTATEGROSSVALUE = this.f.ESTATEGROSSVALUE.value;
      details.ESTATENETVALUE = this.f.ESTATENETVALUE.value;
      details.NAMEOFTRUST = this.f.NAMEOFTRUST.value;
      details.NAMEOFSUPERANNUATION = this.f.NAMEOFSUPERANNUATION.value;
      details.NUMBEROFCODICILS = this.f.NUMBEROFCODICILS.value;
      details.DATEOFCODICILS = this.f.DATEOFCODICILS.value;
      details.DateGrantRepresentation = this.f.DateGrantRepresentation.value;
      details.CourtMatter = this.f.CourtMatter.value;
    }
    details.VALIDATEONLY = true;
    this._mattersService.AddNewMatter(details).subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, details);
      } else if (response.CODE == 451 && response.STATUS == "warning") {
        this.checkValidation(response.DATA.VALIDATIONS, details);
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
    console.log(data);
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
