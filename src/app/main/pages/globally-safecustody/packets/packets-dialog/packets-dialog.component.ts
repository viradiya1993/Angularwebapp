import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { MainAPiServiceService, BehaviorService, TimersService } from 'app/_services';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ContactDialogComponent } from 'app/main/pages/contact/contact-dialog/contact-dialog.component';
import { ContactSelectDialogComponent } from 'app/main/pages/contact/contact-select-dialog/contact-select-dialog.component';



@Component({
  selector: 'app-packets-dialog',
  templateUrl: './packets-dialog.component.html',
  styleUrls: ['./packets-dialog.component.scss']
})
export class PacketsDialogComponent implements OnInit {
  isLoadingResults: boolean = false;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;
  packetsform: FormGroup;
  active: boolean;
  errorWarningData: any = {};
  successMsg:any;
  PacketsData:any=[];
  FormAction:any;
  PacketsGuid:any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  constructor( public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<PacketsDialogComponent>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    public behaviorService: BehaviorService,
    private _mainAPiServiceService: MainAPiServiceService,
    private Timersservice: TimersService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      console.log(data);
      this.action = data.action;
      if (this.action === 'new') {
        this.dialogTitle = 'New Packets';
      } else if (this.action === 'edit') {
        this.dialogTitle = 'Update Packets';
      } else {
        this.dialogTitle = 'Duplicate Packets';
      }
      this.behaviorService.Packets$.subscribe(result => {
        if (result) {
          this.PacketsData = result;
        }
      });
    }

  ngOnInit() {
    this.packetsform = this._formBuilder.group({
      PACKETNUMBER:[''],
      CONTACT:[''],
      LOCATION:[''],
      PACKETDESCRIPTION:[''],
      ISACTIVE:[''],
      CONTACTGUID:['']
    });
    this.packetsform.controls['ISACTIVE'].setValue(true);
  }
  get f() {
    return this.packetsform.controls;
  }
  //PacketsSave
  PacketsSave(){
    if (this.action === 'new' || this.action === 'duplicate') {
      this.FormAction = 'insert';
      this.PacketsGuid = "";
      this.successMsg = 'Save successfully';
    } else {
      this.FormAction = 'update';
      this.PacketsGuid = this.PacketsData.SAFECUSTODYPACKETGUID
      this.successMsg = 'Update successfully';
    }
    let PostData = {
      SAFECUSTODYPACKETGUID:this.PacketsGuid,
      CONTACTGUID:this.f.CONTACTGUID.value,
      PACKETNUMBER:this.f.PACKETNUMBER.value,
      PACKETDESCRIPTION:this.f.PACKETDESCRIPTION.value,
      LOCATION:this.f.LOCATION.value,
      ISACTIVE: this.f.ISACTIVE.value == true ? "1" : "0",
    }
    console.log(PostData);
    
    this.isspiner = true;
    let finalData = { DATA: PostData, FormAction: this.FormAction, VALIDATEONLY: true }
    this._mainAPiServiceService.getSetData(finalData, 'SetSafeCustodyPacket').subscribe(response => {
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
  checkValidation(bodyData: any, PostActivityData: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    bodyData.forEach(function (value) {
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
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef = this.MatDialog.open(FuseConfirmDialogComponent, {
        disableClose: true, width: '100%', data: warningData
      });
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.savePacketsData(PostActivityData);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.savePacketsData(PostActivityData);
    this.isspiner = false;
  }
  savePacketsData(PostActivityData: any) {
    PostActivityData.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(PostActivityData, 'SetSafeCustodyPacket').subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.toastr.success(this.successMsg);
        this.dialogRef.close(true);
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.toastr.warning(this.successMsg);
        this.isspiner = false;
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.toastr.error(res.STATUS);
        this.isspiner = false;
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
  //SelectContact
  SelectContact(){
    let ContactSelectData = { action: 'new' };
    const dialogRef = this._matDialog.open(ContactSelectDialogComponent, {
      width: '100%', disableClose: true,
      data: {
          type: ''
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.packetsform.controls['CONTACT'].setValue(result.CONTACTNAME);
      this.packetsform.controls['CONTACTGUID'].setValue(result.CONTACTGUID);
    });
   
  }
}
// ACTIVE: this.f.ACTIVE.value == true ? "1" : "0",
//this.packetsform.controls['ACTIVE'].setValue(true);
//Edittime
//this.active = getContactData.ACTIVE == 0 ? false : true;
