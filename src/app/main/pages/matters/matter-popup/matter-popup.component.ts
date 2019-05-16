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
  CommencementDate: string;
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
      REFERENCE: [''],
      OTHERREFERENCE: [''],
      COMPLETEDDATE: [],
      PRIMARYFEEEARNERGUID: [''],
      OWNERGUID: [''],

      CostsAgreementDate: [],
      EstimateMinimum: [''],
      Ex_GST: [''],

      // client
      Clientmatter: [''],
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
      PLACEOFINJURY: [''],
      INJURYDESCRIPTION: [''],
      LITIGATIONFUNDER: [''],
      TRANSFERREDFROMOTHERSOLICITOR: [''],
      CLIENTNAME: [''],
      ESTIMATEDAWARD: [''],
      CLAIMNUMBER: [''],
      INVESTIGATIONDATE: [''],
      SETTLEMENTDATE: [''],
      EXPERTHEARINGDATE: [''],
      DATEOFNOTICEOFINJURY: [''],

      ExpiryDate: [''],
      CauseofInjury: [''],
      // Details ->compulsory-acquisition
      Address: [''],
      CLIENTVALUATION: [''],
      AUTHORITYVALUATION: [''],
      //Details -> criminal
      BRIEFSERVICEDATE: [''],
      COMMITTALDATE: [''],
      REPLYDATE: [''],
      JUVENILE: [''],
      WAIVEROFCOMMITTAL: [''],
      BAILDATE: [''],
      BAILRESTRICTIONS: [''],
      OUTCOME: [''],
      SENTENCINGDATE: [''],
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
      MARRIAGEDATE: [''],
      MARRIAGEPLACE: [''],
      MARRIAGECOUNTRY: [''],
      SEPARATIONDATE: [''],
      DATEFILEDFORDIVORCE: [''],
      DIVORCEDATE: [''],
      DIVORCEPLACE: [''],
      DIVORCECOUNTRY: [''],
      NUMDEPENDANTS: [''],
      FAMILYCOURTCLIENTID: [''],
      ExpiryDate1: [''],

      //Details -> immigration
      VISATYPE: [''],
      VALUEOFASSETS: [''],
      VISASTATUS: [''],
      ANTICIPATEDDATEOFENTRY: [''],
      LODGEMENTDATE: [''],
      VISAEXPIRYDATE: [''],
      DECISIONDUEDATE: [''],

      //Details -> leasing
      Address2: [''],
      LEASERECEIVED: [''],
      DATEEXECUTED: [''],
      VALIDUNTIL: [''],
      OPTIONDATE: [''],
      Term: [''],
      DISCLOSUREDATE: [''],
      REGISTEREDINFILEMAN: [''],

      //Details -> litigation
      MATTERTITLEBELOW: [''],
      COURTBELOW: [''],
      CASENUMBERBELOW: [''],
      DATEOFHEARINGS: [''],
      MATERIALDATE: [''],
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
      EXCHANGEDATE: [''],
      CourtMatter2: [''],

      //Details -> mortgage-finance
      PRINCIPALADVANCED: [''],
      INTERESTRATE: [''],
      FOLIOIDENTIFIER: [''],
      DISCHARGEDATE: [''],
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
      BANKREFERENCE: [''],
      INITIALDEPOSIT: [''],
      BALANCEDEPOSIT: [''],
      BALANCEDEPOSITDATE: [''],
      BUILDINGREPORTCOMPLETED: [''],
      PESTREPORTCOMPLETED: [''],
      SPECIALCONDITIONS: [''],

      //Details -> property-sale 
      Address4: [''],
      ADJUSTMENTDATE: [''],
      Status1: [''],

      //Details -> strata
      STRATAPLANNUMBER: [''],
      EXPIRATIONDATE: [''],
      LOTNUMBER: [''],
      BYLAWTYPE: [''],
      BYLAWNO: [''],
      SPECIALRESOLUTIONDATE: [''],
      AGGREGATIONOFENTITLEMENT: [''],
      TOTALUNITS: [''],

      //Details -> trademark-ip
      ApplicationNumber: [''],

      //Details -> wills-estate
      DATEOFWILL: [''],
      ESTATEGROSSVALUE: [''],
      ESTATENETVALUE: [''],
      NAMEOFTRUST: [''],
      NAMEOFSUPERANNUATION: [''],
      NUMBEROFCODICILS: [''],
      DATEOFCODICILS: [''],
      DateGrantRepresentation: [''],

      // others
      MATTERTYPE: [''],
      CLIENTSOURCE: [''],
      FIELDOFLAW: [''],
      INDUSTRY: [''],
      REFERRERGUID: [''],
      REFERRERGUIDTEXT: [''],
      ARCHIVENO: [''],
      ARCHIVEDATE: ['']
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
      // // general
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
      ONCHARGEDISBURSEMENTGST: this.f.ONCHARGEDISBURSEMENTGST.value,
      GSTTYPE: this.f.GSTTYPE.value,
      RATEPERHOUR: this.f.RATEPERHOUR.value,
      RATEPERDAY: this.f.RATEPERDAY.value,
      FIXEDRATEEXGST: this.f.FIXEDRATEEXGST.value,
      FIXEDRATEINCGST: this.f.FIXEDRATEINCGST.value,
      // Details -> commercial
      CLASSOFSHARES: this.f.CLASSOFSHARES.value,
      NUMBEROFSHARES: this.f.NUMBEROFSHARES.value,
      CONSIDERATION: this.f.CONSIDERATION.value,
      //Details -> compensation
      ACCIDENTDATE: this.f.ACCIDENTDATE.value,
      PLACEOFINJURY: this.f.PLACEOFINJURY.value,
      INJURYDESCRIPTION: this.f.INJURYDESCRIPTION.value,
      LITIGATIONFUNDER: this.f.LITIGATIONFUNDER.value,
      TRANSFERREDFROMOTHERSOLICITOR: this.f.TRANSFERREDFROMOTHERSOLICITOR.value,
      CLIENTNAME: this.f.CLIENTNAME.value,
      ESTIMATEDAWARD: this.f.ESTIMATEDAWARD.value,
      CLAIMNUMBER: this.f.CLAIMNUMBER.value,
      INVESTIGATIONDATE: this.f.INVESTIGATIONDATE.value,
      SETTLEMENTDATE: this.f.SETTLEMENTDATE.value,
      EXPERTHEARINGDATE: this.f.EXPERTHEARINGDATE.value,
      DATEOFNOTICEOFINJURY: this.f.DATEOFNOTICEOFINJURY.value,

      ExpiryDate: this.f.ExpiryDate.value,
      CauseofInjury: this.f.CauseofInjury.value,
      // Details ->compulsory-acquisition
      Address: this.f.Address.value,
      CLIENTVALUATION: this.f.CLIENTVALUATION.value,
      AUTHORITYVALUATION: this.f.AUTHORITYVALUATION.value,
      //Details -> criminal
      BRIEFSERVICEDATE: this.f.BRIEFSERVICEDATE.value,
      COMMITTALDATE: this.f.COMMITTALDATE.value,
      REPLYDATE: this.f.REPLYDATE.value,
      JUVENILE: this.f.JUVENILE.value,
      WAIVEROFCOMMITTAL: this.f.WAIVEROFCOMMITTAL.value,
      BAILDATE: this.f.BAILDATE.value,
      BAILRESTRICTIONS: this.f.BAILRESTRICTIONS.value,
      OUTCOME: this.f.OUTCOME.value,
      SENTENCINGDATE: this.f.SENTENCINGDATE.value,
      SENTENCE: this.f.SENTENCE.value,
      S91APPLICATION: this.f.S91APPLICATION.value,
      S93APPLICATION: this.f.S93APPLICATION.value,
      COURT: this.f.COURT.value,
      DIVISION: this.f.DIVISION.value,
      REGISTRY: this.f.REGISTRY.value,
      CourtMatter: this.f.CourtMatter.value,
      List: this.f.List.value,

      // Details ->family
      COHABITATIONDATE: this.f.COHABITATIONDATE.value,
      MARRIAGEDATE: this.f.MARRIAGEDATE.value,
      MARRIAGEPLACE: this.f.MARRIAGEPLACE.value,
      MARRIAGECOUNTRY: this.f.MARRIAGECOUNTRY.value,
      SEPARATIONDATE: this.f.SEPARATIONDATE.value,
      DATEFILEDFORDIVORCE: this.f.DATEFILEDFORDIVORCE.value,
      DIVORCEDATE: this.f.DIVORCEDATE.value,
      DIVORCEPLACE: this.f.DIVORCEPLACE.value,
      DIVORCECOUNTRY: this.f.DIVORCECOUNTRY.value,
      NUMDEPENDANTS: this.f.NUMDEPENDANTS.value,
      FAMILYCOURTCLIENTID: this.f.FAMILYCOURTCLIENTID.value,
      ExpiryDate1: this.f.ExpiryDate1.value,

      //Details -> immigration
      VISATYPE: this.f.VISATYPE.value,
      VALUEOFASSETS: this.f.VALUEOFASSETS.value,
      VISASTATUS: this.f.VISASTATUS.value,
      ANTICIPATEDDATEOFENTRY: this.f.ANTICIPATEDDATEOFENTRY.value,
      LODGEMENTDATE: this.f.LODGEMENTDATE.value,
      VISAEXPIRYDATE: this.f.VISAEXPIRYDATE.value,
      DECISIONDUEDATE: this.f.DECISIONDUEDATE.value,

      //Details -> leasing
      Address2: this.f.Address2.value,
      LEASERECEIVED: this.f.LEASERECEIVED.value,
      DATEEXECUTED: this.f.DATEEXECUTED.value,
      VALIDUNTIL: this.f.VALIDUNTIL.value,
      OPTIONDATE: this.f.OPTIONDATE.value,
      Term: this.f.Term.value,
      DISCLOSUREDATE: this.f.DISCLOSUREDATE.value,
      REGISTEREDINFILEMAN: this.f.REGISTEREDINFILEMAN.value,

      //Details -> litigation
      MATTERTITLEBELOW: this.f.MATTERTITLEBELOW.value,
      COURTBELOW: this.f.COURTBELOW.value,
      CASENUMBERBELOW: this.f.CASENUMBERBELOW.value,
      DATEOFHEARINGS: this.f.DATEOFHEARINGS.value,
      MATERIALDATE: this.f.MATERIALDATE.value,
      DECISION: this.f.DECISION.value,
      CourtMatter1: this.f.CourtMatter1.value,
      List1: this.f.List1.value,
      ClientType1: this.f.ClientType1.value,
      CostEstimateSuccesful: this.f.CostEstimateSuccesful.value,
      IncGST: this.f.IncGST.value,
      CostEstimateUnsuccesful: this.f.CostEstimateUnsuccesful.value,
      IncGST2: this.f.IncGST2.value,

      //Details -> maritime
      VESSELNAME: this.f.VESSELNAME.value,
      VESSELFLAG: this.f.VESSELFLAG.value,
      VESSELTYPE: this.f.VESSELTYPE.value,
      TONNAGE: this.f.TONNAGE.value,
      VESSELMASTER: this.f.VESSELMASTER.value,
      VESSELLOCATION: this.f.VESSELLOCATION.value,
      INCIDENTDATE: this.f.INCIDENTDATE.value,
      EXCHANGEDATE: this.f.EXCHANGEDATE.value,
      CourtMatter2: this.f.CourtMatter2.value,

      //Details -> mortgage-finance
      PRINCIPALADVANCED: this.f.PRINCIPALADVANCED.value,
      INTERESTRATE: this.f.INTERESTRATE.value,
      FOLIOIDENTIFIER: this.f.FOLIOIDENTIFIER.value,
      DISCHARGEDATE: this.f.DISCHARGEDATE.value,
      SECURITYPROPERTY: this.f.SECURITYPROPERTY.value,
      ExpirtyDate: this.f.ExpirtyDate.value,

      // Details ->property-purchase
      Status: this.f.Status.value,
      Address3: this.f.Address3.value,
      PURCHASEPRICE: this.f.PURCHASEPRICE.value,
      DEPOSITAMOUNT: this.f.DEPOSITAMOUNT.value,
      STAMPDUTYDATE: this.f.STAMPDUTYDATE.value,
      DEPOSITBONDAMOUNT: this.f.DEPOSITBONDAMOUNT.value,
      STAMPDUTYAMOUNT: this.f.STAMPDUTYAMOUNT.value,
      DATEPAID: this.f.DATEPAID.value,
      BANKREFERENCE: this.f.BANKREFERENCE.value,
      INITIALDEPOSIT: this.f.INITIALDEPOSIT.value,
      BALANCEDEPOSIT: this.f.BALANCEDEPOSIT.value,
      BALANCEDEPOSITDATE: this.f.BALANCEDEPOSITDATE.value,
      BUILDINGREPORTCOMPLETED: this.f.BUILDINGREPORTCOMPLETED.value,
      PESTREPORTCOMPLETED: this.f.PESTREPORTCOMPLETED.value,
      SPECIALCONDITIONS: this.f.SPECIALCONDITIONS.value,

      //Details -> property-sale 
      Address4: this.f.Address4.value,
      ADJUSTMENTDATE: this.f.ADJUSTMENTDATE.value,
      Status1: this.f.Status1.value,

      //Details -> strata
      STRATAPLANNUMBER: this.f.STRATAPLANNUMBER.value,
      EXPIRATIONDATE: this.f.EXPIRATIONDATE.value,
      LOTNUMBER: this.f.LOTNUMBER.value,
      BYLAWTYPE: this.f.BYLAWTYPE.value,
      BYLAWNO: this.f.BYLAWNO.value,
      SPECIALRESOLUTIONDATE: this.f.SPECIALRESOLUTIONDATE.value,
      AGGREGATIONOFENTITLEMENT: this.f.AGGREGATIONOFENTITLEMENT.value,
      TOTALUNITS: this.f.TOTALUNITS.value,

      //Details -> trademark-ip
      ApplicationNumber: this.f.ApplicationNumber.value,

      //Details -> wills-estate
      DATEOFWILL: this.f.DATEOFWILL.value,
      ESTATEGROSSVALUE: this.f.ESTATEGROSSVALUE.value,
      ESTATENETVALUE: this.f.ESTATENETVALUE.value,
      NAMEOFTRUST: this.f.NAMEOFTRUST.value,
      NAMEOFSUPERANNUATION: this.f.NAMEOFSUPERANNUATION.value,
      NUMBEROFCODICILS: this.f.NUMBEROFCODICILS.value,
      DATEOFCODICILS: this.f.DATEOFCODICILS.value,
      DateGrantRepresentation: this.f.DateGrantRepresentation.value,

      // others
      MATTERTYPE: this.f.MATTERTYPE.value,
      CLIENTSOURCE: this.f.CLIENTSOURCE.value,
      FIELDOFLAW: this.f.FIELDOFLAW.value,
      INDUSTRY: this.f.INDUSTRY.value,
      REFERRERGUID: this.f.REFERRERGUID.value,
      REFERRERGUIDTEXT: this.f.REFERRERGUIDTEXT.value,
      ARCHIVENO: this.f.ARCHIVENO.value,
      ARCHIVEDATE: this.f.ARCHIVEDATE.value
    };
    this.isspiner = false;
    console.log(details);
    // details.VALIDATEONLY = true;
    // this.addcontact.AddContactData(details).subscribe(response => {
    //   if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
    //     this.checkValidation(response.DATA.VALIDATIONS, details);
    //   } else if (response.CODE == 451 && response.STATUS == "warning") {
    //     this.checkValidation(response.DATA.VALIDATIONS, details);
    //   } else {
    //     if (response.CODE == 402 && response.STATUS == "error" && response.MESSAGE == "Not logged in")
    //       this.dialogRef.close(false);
    //     this.isspiner = false;
    //   }
    // }, error => {
    //   this.toastr.error(error);
    // });
    // this._mattersService.AddNewMatter(details).subscribe(response => {
    //   if (response.CODE === 200 && (response.STATUS === "OK" || response.STATUS === "success")) {
    //     if (this.action !== 'edit') {
    //       this.toastr.success('Matter save successfully');
    //     } else {
    //       this.toastr.success('Matter update successfully');
    //     }
    //     this.isspiner = false;
    //     this.dialogRef.close(true);
    //   } else {
    //     this.isspiner = false;
    //   }
    // }, error => {
    //   this.toastr.error(error);
    // });
    // localStorage.removeItem('CostsAgreementDate');
    // localStorage.removeItem('CommencementDate');
    // localStorage.removeItem('CompletedDate');
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
    //   this.addcontact.AddContactData(data).subscribe(response => {
    //     if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
    //       if (this.action !== 'edit') {
    //         this.toastr.success('Contact save successfully');
    //       } else {
    //         this.toastr.success('Contact update successfully');
    //       }
    //       this.isspiner = false;
    //       this.dialogRef.close(true);
    //     } else {
    //       this.isspiner = false;
    //     }
    //   }, error => {
    //     this.toastr.error(error);
    //   });
    //   localStorage.removeItem('DATEOFBIRTH');
    //   localStorage.removeItem('DATEOFDEATH');
  }
}
