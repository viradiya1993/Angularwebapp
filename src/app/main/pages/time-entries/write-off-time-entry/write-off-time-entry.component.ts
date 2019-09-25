import { Component, OnInit, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BehaviorService, TimersService } from './../../../../_services';
import * as moment from 'moment';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-write-off-time-entry',
  templateUrl: './write-off-time-entry.component.html',
  styleUrls: ['./write-off-time-entry.component.scss'],
  animations: fuseAnimations
})
export class WriteOffTimeEntryComponent implements OnInit {
  isspiner: boolean = false;
  isLoadingResults: boolean = false;
  errorWarningData: any = {};
  timeEntryData:any=[];
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  writeOffTimerForm: FormGroup;
  successMsg = 'Update success';
  matterShortName: any;
  firstTime: number;
  AmmountRemaing: any;
  AmmountWirteOff: any;
  typeInput: string;
  constructor(public dialogRef: MatDialogRef<WriteOffTimeEntryComponent>,
    public MatDialog: MatDialog,
    private behaviorService: BehaviorService,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService, public datepipe: DatePipe,
    private Timersservice: TimersService,
    @Inject(MAT_DIALOG_DATA) public writeTimerData: any
  ) { }

  ngOnInit() {
    this.writeOffTimerForm = this._formBuilder.group({
      MATTERGUID: ['', Validators.required],
      matterautoVal: [''],
      ITEMTYPE: [''],
      QUANTITYTYPE: ['Hours'],
      ITEMDATE: ['', Validators.required],
      ITEMDATETEXT: [''],
      FEEEARNER: [''],
      QUANTITY: [''],
      PRICE: [''],
      PRICEINCGST: [''],
      ITEMTIME: [''],
      ADDITIONALTEXTSELECT: [''],
      ADDITIONALTEXT: ['', Validators.required],
      COMMENT: [''],
      AmmountRemaing:[''],
      AmmountWirteOff:['']

    });
    this.isLoadingResults = true;
    let workerGuid;
    this.behaviorService.workInProgress$.subscribe(workInProgressData => {
      if (workInProgressData) {
        workerGuid = workInProgressData.WORKITEMGUID;
      } else {
        workerGuid = localStorage.getItem('edit_WORKITEMGUID');
      }
    });
    this.isLoadingResults = true;
    this.Timersservice.getTimeEnrtyData({'WorkItemGuid': workerGuid }).subscribe(response => {
      console.log(response);
      if (response.CODE == 200 && response.STATUS == "success") {
        this.timeEntryData=response.DATA.WORKITEMS[0];
        let timeEntryData = response.DATA.WORKITEMS[0];
        this.matterShortName = response.DATA.WORKITEMS[0].SHORTNAME;
        localStorage.setItem('edit_WORKITEMGUID', timeEntryData.WORKITEMGUID);
        if (timeEntryData.ITEMTYPE == "2" || timeEntryData.ITEMTYPE == "3") {
          this.writeOffTimerForm.controls['QUANTITYTYPE'].setValue(timeEntryData.FEETYPE);
        } else {
          this.writeOffTimerForm.controls['QUANTITYTYPE'].setValue(timeEntryData.QUANTITYTYPE);
        }
        this.writeOffTimerForm.controls['matterautoVal'].setValue(timeEntryData.SHORTNAME + ' : ');
        this.writeOffTimerForm.controls['QUANTITY'].setValue(timeEntryData.QUANTITY);
        this.writeOffTimerForm.controls['MATTERGUID'].setValue(timeEntryData.MATTERGUID);
        this.writeOffTimerForm.controls['ITEMTYPE'].setValue(timeEntryData.ITEMTYPE);
        if (timeEntryData.ITEMTIME) {
          let ttyData = moment(timeEntryData.ITEMTIME, 'hh:mm');
          this.writeOffTimerForm.controls['ITEMTIME'].setValue(moment(ttyData).format('hh:mm A'));
        }
        this.writeOffTimerForm.controls['FEEEARNER'].setValue(timeEntryData.FEEEARNER);
        let tempDate = timeEntryData.ITEMDATE.split("/");
        this.writeOffTimerForm.controls['ITEMDATE'].setValue(timeEntryData.ITEMDATE);
        this.writeOffTimerForm.controls['ITEMDATETEXT'].setValue(new Date(tempDate[1] + '/' + tempDate[0] + '/' + tempDate[2]));
        this.writeOffTimerForm.controls['PRICEINCGST'].setValue(timeEntryData.PRICEINCGST);
        this.writeOffTimerForm.controls['PRICE'].setValue(timeEntryData.PRICE);
        this.writeOffTimerForm.controls['ADDITIONALTEXT'].setValue(timeEntryData.ADDITIONALTEXT);
        this.writeOffTimerForm.controls['ADDITIONALTEXTSELECT'].setValue(timeEntryData.ADDITIONALTEXT);
        this.writeOffTimerForm.controls['COMMENT'].setValue(timeEntryData.COMMENT);
       
        if(timeEntryData.QUANTITYTYPE == "hh:mm"){
          var hms = timeEntryData.QUANTITY;   // your input string
          console.log(hms);
          var a = hms.split(':'); // split it at the colons
          console.log(a);
          var seconds = (+Number(a[0])) * 60 * 60 + Number((+a[1])) * 60; 
          console.log(seconds);
          this.firstTime=seconds;
          // console.log(seconds);
          this.typeInput='time';
        }else if(timeEntryData.QUANTITYTYPE != 'hh:mm'){
          this.typeInput='number';
          this.AmmountWirteOff=timeEntryData.QUANTITY;
          this.AmmountRemaing=0.00;
          this.firstTime=timeEntryData.QUANTITY;
        }
      } else if (response.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isLoadingResults = false;
    }, err => {
      this.isLoadingResults = false;
      this.toastr.error(err);
    });
  }
  calcWriteOff(){
    if(this.timeEntryData.QUANTITYTYPE == 'hh:mm'){
        var hms = this.AmmountWirteOff;   // your input string
          var a = hms.split(':'); // split it at the colons
          var seconds = (+Number(a[0])) * 60 * 60 + Number((+a[1])) * 60; 
          // this.firstTime=seconds;
          if(this.firstTime < seconds){
            this.AmmountWirteOff=0;
            this.AmmountRemaing=0;
          }else{
            this.AmmountRemaing=this.secondsToHms(this.firstTime - seconds);
          }
    }
    else{
      if(this.firstTime < this.AmmountWirteOff){
           this.AmmountWirteOff=0;
           this.AmmountRemaing=0;
      }else{
        this.AmmountRemaing=this.firstTime-this.AmmountWirteOff;
      }

    }
   
  }
  calcReamingOff(){
  }
  secondsToHms(d: any) {
    d = Number(d);
    var hours = Math.floor(d / 3600) < 10 ? ("00" + Math.floor(d / 3600)).slice(-2) : Math.floor(d / 3600);
    var minutes = ("00" + Math.floor((d % 3600) / 60)).slice(-2);
    var seconds = ("00" + (d % 3600) % 60).slice(-2);
    return hours + ":" + minutes + ":" + seconds;
  }
  get f() {
    return this.writeOffTimerForm.controls;
  }
  SaveClickTimeEntry() {
    this.isspiner = true;
    let PostData: any = {
      ADDITIONALTEXT: this.f.ADDITIONALTEXT.value,
      COMMENT: this.f.COMMENT.value,
      FEEEARNER: this.f.FEEEARNER.value,
      ITEMTYPE: this.f.ITEMTYPE.value,
      ITEMDATE: this.f.ITEMDATE.value,
      ITEMTIME: this.f.ITEMTIME.value,
      MATTERGUID: this.f.MATTERGUID.value,
      PRICE: this.f.PRICE.value,
      PRICEINCGST: this.f.PRICEINCGST.value,
      QUANTITY: this.f.QUANTITY.value,
      WRITEOFFQUANTITY:this.AmmountWirteOff,
      REMAININGQUANTITY:this.AmmountRemaing,
      WorkItemGuid: localStorage.getItem('edit_WORKITEMGUID')
    }
    if (this.f.ITEMTYPE.value == "2" || this.f.ITEMTYPE.value == "3") {
      PostData.FEETYPE = this.f.QUANTITYTYPE.value;
      PostData.QUANTITYTYPE = '';
    } else {
      PostData.QUANTITYTYPE = this.f.QUANTITYTYPE.value;
    }
    let PostTimeEntryData: any = { FormAction: 'write off', VALIDATEONLY: true, Data: PostData };
    this.Timersservice.SetWorkItems(PostTimeEntryData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.checkValidation(res.DATA.VALIDATIONS, PostTimeEntryData);
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.checkValidation(res.DATA.VALIDATIONS, PostTimeEntryData);
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.checkValidation(res.DATA.VALIDATIONS, PostTimeEntryData);
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
  checkValidation(bodyData: any, PostTimeEntryData: any) {
    let errorData: any = [];
    let warningData: any = [];
    let tempError: any = [];
    let tempWarning: any = [];
    // errorData
    bodyData.forEach(function (value) {
      if (value.VALUEVALID == 'NO') {
        errorData.push(value.ERRORDESCRIPTION);
        tempError[value.FIELDNAME] = value;
      } else if (value.VALUEVALID == 'WARNING') {
        tempWarning[value.FIELDNAME] = value;
        warningData.push(value.ERRORDESCRIPTION);
      }
    });
    this.errorWarningData = { "Error": tempError, 'warning': tempWarning };
    if (Object.keys(errorData).length != 0)
      this.toastr.error(errorData);
    if (Object.keys(warningData).length != 0) {
      // this.toastr.warning(warningData);
      this.confirmDialogRef = this.MatDialog.open(FuseConfirmDialogComponent, {
        disableClose: true,
        width: '100%',
        data: warningData
      });
      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to Save?';
      this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.isspiner = true;
          this.saveTimeEntry(PostTimeEntryData);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.saveTimeEntry(PostTimeEntryData);
    this.isspiner = false;
  }
  saveTimeEntry(PostTimeEntryData: any) {
    PostTimeEntryData.VALIDATEONLY = false;
    this.Timersservice.SetWorkItems(PostTimeEntryData).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.toastr.success(this.successMsg);
        this.dialogRef.close(true);
      } else if (res.CODE == 451 && res.STATUS == 'warning') {
        this.toastr.warning(res.MESSAGE);
      } else if (res.CODE == 450 && res.STATUS == 'error') {
        this.toastr.warning(res.MESSAGE);
      } else if (res.MESSAGE == 'Not logged in') {
        this.dialogRef.close(false);
      }
      this.isspiner = false;
    }, err => {
      this.isspiner = false;
      this.toastr.error(err);
    });
  }
}
