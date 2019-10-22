import { Component, OnInit, Input, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MainAPiServiceService,BehaviorService, TimersService } from 'app/_services';
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl,FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-safe-custody-dialog',
  templateUrl: './safe-custody-dialog.component.html',
  styleUrls: ['./safe-custody-dialog.component.scss'],
  animations: fuseAnimations
})
export class SafeCustodyDialogeComponent implements OnInit {
  SafeCustody: FormGroup;
  highlightedRows: any;
  isLoadingResults: boolean = false;
  theme_type = localStorage.getItem('theme_type');
  selectedColore: string = this.theme_type == "theme-default" ? 'rebeccapurple' : '#43a047';
    errorWarningData: any = { "Error": [], 'Warning': [] };
    isspiner: boolean = false;
    action: any;
    contact:any;
    dialogTitle: string;
    ReviewDate:any;
    CheckIndate:any;
    matterno:any;
    mattername:any;
    FormAction:any;
    ConatctGuid:any;
    MetterGuid:any;
    SafecustodyGuid:any;
    safecustodydata:any=[];
    cuurentmatter = JSON.parse(localStorage.getItem('set_active_matters'));
    documnettype:any=[];
    packetcustody:any=[];
    checkboxvalue:any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
   
  constructor(private _mainAPiServiceService:MainAPiServiceService, 
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private behaviorService: BehaviorService,
    //private Timersservice: TimersService,
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<SafeCustodyDialogeComponent>,
    public _matDialog: MatDialog,
    private Timersservice: TimersService,
    @Inject(MAT_DIALOG_DATA) public data: any) {  
        this.action = data.type.action;
        this.contact = data.type.result;
        this.matterno = data.type.result;
        if(this.action === 'new client' || this.action === 'new matter' || this.action === 'newlegal'){
          this.dialogTitle = 'New Safe Custody';
        }else if(this.action === 'edit' || this.action === 'editlegal'){
          this.dialogTitle = 'Update Safe Custody';
        }else if(this.action === 'copy'){
          this.dialogTitle = 'Duplicate Safe Custody';
        }
        this.behaviorService.SafeCustody$.subscribe(result => {
          if (result) {
            this.safecustodydata = result;
          }
        });
    }

  ngOnInit() {  
    this.SafeCustody = this._formBuilder.group({
      Matternum: [''],
      Owener:[''],
      Packet:[''],
      DOCUMENTTYPE:[''],
      SAFECUSTODYDESCRIPTION:[''],
      DOCUMENTNAME:[''],
      DateSafecustody:[''],
      ADDITIONALTEXT:[''],
      Dateperson:[''],
      CHECKINCONTACTNAME:[''],
      MetterGuid:[''],
      ConatctGuid:[''],
      SAFECUSTODYGUID:[''],
      PACKETGUID:[''],
      SendRevieDate:[this.datepipe.transform(new Date(), 'dd/MM/yyyy')],
      SendCheckinDate:[this.datepipe.transform(new Date(), 'dd/MM/yyyy')]
    });
    if (this.action == 'edit' || this.action === 'copy' || this.action === 'editlegal'){
        this.EditSafeCustody();
    }
    if(this.action === 'new client'){     
      this.SafeCustody.controls['Matternum'].setValue('No Matter');
      this.SafeCustody.controls['Owener'].setValue(this.contact.CONTACTNAME);
      this.SafeCustody.controls['ConatctGuid'].setValue(this.contact.CONTACTGUID);
    }else if(this.action === 'new matter'){
      this.SafeCustody.controls['Matternum'].setValue(this.matterno.SHORTNAME);
      this.SafeCustody.controls['Owener'].setValue(this.matterno.CONTACTNAME);
      this.SafeCustody.controls['MetterGuid'].setValue(this.matterno.MATTERGUID);
      this.SafeCustody.controls['ConatctGuid'].setValue(this.contact.CONTACTGUID);
    }else if(this.action === 'newlegal'){
      this.SafeCustody.controls['Matternum'].setValue(this.cuurentmatter.SHORTNAME);
      this.SafeCustody.controls['Owener'].setValue(this.cuurentmatter.CONTACTNAME);
      this.SafeCustody.controls['MetterGuid'].setValue(this.cuurentmatter.MATTERGUID);
      this.SafeCustody.controls['ConatctGuid'].setValue(this.cuurentmatter.CONTACTGUID);
    }
    this.DocumentType();
    this.PacketCustody();
  }
  get f() {
    return this.SafeCustody.controls;
  }
  closepopup() {
    this.dialogRef.close(false);
  }
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>){
    this.ReviewDate = this.datepipe.transform(event.value, 'dd/MM/yyyy');
  }
  PersonDate(type: string, event: MatDatepickerInputEvent<Date>){
    this.CheckIndate = this.datepipe.transform(event.value, 'dd/MM/yyyy');
  }
  EditSafeCustody(){
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({ SAFECUSTODYGUID: this.safecustodydata.SAFECUSTODYGUID }, 'GetSafeCustody').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
          this.SafeCustody.controls['SAFECUSTODYGUID'].setValue(res.DATA.SAFECUSTODIES[0].SAFECUSTODYGUID);
          this.SafeCustody.controls['MetterGuid'].setValue(res.DATA.SAFECUSTODIES[0].MATTERGUID);
          this.SafeCustody.controls['ConatctGuid'].setValue(res.DATA.SAFECUSTODIES[0].CONTACTGUID);
          this.SafeCustody.controls['Matternum'].setValue('No Matter');
          this.SafeCustody.controls['Owener'].setValue(res.DATA.SAFECUSTODIES[0].CONTACTNAME);
          this.SafeCustody.controls['Packet'].setValue(res.DATA.SAFECUSTODIES[0].PACKETNUMBER);
          this.SafeCustody.controls['DocumentType'].setValue(res.DATA.SAFECUSTODIES[0].DOCUMENTTYPE);
          this.SafeCustody.controls['Dscription'].setValue(res.DATA.SAFECUSTODIES[0].SAFECUSTODYDESCRIPTION);
          this.SafeCustody.controls['DateSafecustody'].setValue(res.DATA.SAFECUSTODIES[0].REMINDERDATE);        
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
      this.isLoadingResults = false;
    });
  }
  SaveSafeCustody(){
    if (this.ReviewDate == "" || this.ReviewDate == null || this.ReviewDate == undefined) {
        this.ReviewDate = this.f.SendRevieDate.value;
    }else if(this.CheckIndate == "" || this.CheckIndate == null || this.CheckIndate == undefined){
        this.CheckIndate = this.f.SendCheckinDate.value;
    }
    if(this.action === 'edit'){      
      this.FormAction = 'update'
      this.SafecustodyGuid = this.f.SAFECUSTODYGUID.value;
      this.ConatctGuid = this.f.ConatctGuid.value;
      this.MetterGuid = this.f.MetterGuid.value;  
    }else if(this.action === 'new client' || this.action === 'newlegal'){
      this.SafecustodyGuid = ""
      this.ConatctGuid = this.f.ConatctGuid.value;
      this.MetterGuid = "";
      this.FormAction = 'insert'      
    }else if(this.action === 'new matter'){
      this.SafecustodyGuid = ""
      this.ConatctGuid = this.f.ConatctGuid.value;
      this.MetterGuid = this.f.MetterGuid.value;
      this.FormAction = 'insert'
    }else if(this.action === 'copy'){
      this.SafecustodyGuid = ""
      this.ConatctGuid = this.f.ConatctGuid.value;
      this.MetterGuid = this.f.MetterGuid.value;
      this.FormAction = 'insert'
    }
    //return;
    let data = {
      SAFECUSTODYGUID: this.SafecustodyGuid,
      SAFECUSTODYPACKETGUID:this.f.PACKETGUID.value,
      MATTERGUID: this.MetterGuid,
      CONTACTGUID:  this.ConatctGuid,
      DOCUMENTTYPE: this.f.DOCUMENTTYPE.value,
      SAFECUSTODYDESCRIPTION: this.f.SAFECUSTODYDESCRIPTION.value,
      DOCUMENTNAME: this.f.DOCUMENTNAME.value,
      ADDITIONALTEXT:this.f.ADDITIONALTEXT.value, 
      STATUS: "",       
      CHECKINDATE:this.CheckIndate,
      CHECKINCONTACTNAME:this.f.CHECKINCONTACTNAME.value,
      REMINDERGROUP: {
        REMINDER: "",
        REMINDERDATE: this.ReviewDate,
        REMINDERTIME: "",
      }
    }
    this.isspiner = true;
    let finalData = { DATA: data, FormAction: this.FormAction, VALIDATEONLY: true }
    this._mainAPiServiceService.getSetData(finalData, 'SetSafeCustody').subscribe(response => {     
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        this.checkValidation(response.DATA.VALIDATIONS, finalData);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.checkValidation(response.DATA.VALIDATIONS, finalData);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.checkValidation(response.DATA.VALIDATIONS, finalData);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      } else {
        this.isspiner = false;
      }
    }, err => {
       this.toastr.error(err);
    });
  }
  checkValidation(bodyData: any, details: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'No') {
          errorData.push(value.ERRORDESCRIPTION);
          tempError[value.FIELDNAME] = value;
      }
      else if (value.VALUEVALID == 'Warning') {
          tempWarning[value.FIELDNAME] = value;
          warningData.push(value.ERRORDESCRIPTION);
      }

    });
    this.errorWarningData = { "Error": tempError, 'Warning': tempWarning };
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
          this.SafeCusodySave(details);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
    this.SafeCusodySave(details);
    this.isspiner = false;
  }

  SafeCusodySave(data: any){
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetSafeCustody').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        if (this.action !== 'edit') {
          this.toastr.success(' save successfully');
        } else {
          this.toastr.success(' update successfully');
        }
        this.isspiner = false;
        this.dialogRef.close(true);
      } else if (response.CODE == 451 && response.STATUS == 'warning') {
        this.toastr.warning(response.MESSAGE);
      } else if (response.CODE == 450 && response.STATUS == 'error') {
        this.toastr.error(response.MESSAGE);
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, error => {
      this.toastr.error(error);
    });
  }
  
  DocumentType(){
    this.Timersservice.GetLookupsData({LookupType:'Document Type'}).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.documnettype = res.DATA.LOOKUPS;
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      } else {
        this.documnettype = [];
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
    });
  }
  
  PacketCustody(){
    this._mainAPiServiceService.getSetData({}, 'GetSafeCustodyPacket').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        //console.log(res);
        this.packetcustody = res.DATA.SAFECUSTODYPACKETS;
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }else{
        this.packetcustody = [];
      }
      this.isLoadingResults = false;
    }, err => {
      this.toastr.error(err);
      this.isLoadingResults = false;
    });
  }
  selectPacket(value){
    let packetid = this.packetcustody.find(c => c['PACKETNUMBER'] == value)
    this.SafeCustody.controls['PACKETGUID'].setValue(packetid.SAFECUSTODYPACKETGUID);
  }
 
}
