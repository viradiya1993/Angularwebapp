import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { MainAPiServiceService, BehaviorService } from '../../../../_services';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
//https://apitest.silq.com.au/MobileService?SetAppointment
@Component({
  selector: 'app-dairy-dailog',
  templateUrl: './dairy-dailog.component.html',
  styleUrls: ['./dairy-dailog.component.scss']
})
export class DairyDailogComponent implements OnInit {
  timeStops: any = [];
  errorWarningData: any = { "Error": [], 'Warning': [] };
  DairyForm: FormGroup;
  isLoadingResults: boolean = false;
  action: string;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  dialogTitle: string;
  isspiner: boolean = false;
  CheckClick: any;
  FormAction: string;
  AppointmentGuid: any;
  App_StartTime: any;
  App_EndTime: any;
  control: any = [];
  matterguid: string;
  appoitmentID: any;
  DairyData: any;


  constructor(
    private _mainAPiServiceService: MainAPiServiceService,
    private toastr: ToastrService,
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<DairyDailogComponent>,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private dialog: MatDialog,
    public datepipe: DatePipe,
    private behaviorService: BehaviorService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.timeStops = this.getTimeStops('01:00', '23:59');
    this.action = data.action;
    if (this.action === 'new') {
      this.dialogTitle = 'New Appointment';
    } else if (this.action === 'edit') {
      this.dialogTitle = 'Update Appointment';
    } else {
      this.dialogTitle = 'Duplicate Appointment';
    }
    this.behaviorService.dialogClose$.subscribe(result => {
      if(result != null){
        if(result.MESSAGE == 'Not logged in'){
          this.dialogRef.close(false);
        }
      }
     });

    this.behaviorService.forDiaryRefersh$.subscribe(result => {
      this.DairyData=result;
          
          });
  }

  ngOnInit() {
    this.CheckClick = "No";
    this.DairyForm = this._formBuilder.group({
      APPOINTMENTGUID:[''],
      SUBJECT: [''],
      LOCATION: [''],
      MATTERGUID: [''],
      SendMATTERGUID:[''],
      APPOINTMENTDATE: [''],
      sendAPPOINTMENTDATE:[''],
      APPOINTMENTENDDATE: [''],
      DateFrom: [''],
      ALLDAYEVENT: [false],

      APPOINTMENTTIME: [''],
      TimeSlot2: [''],
      start: [''],
      Finish: [''],
      //Details Tab
      type: [''],
      Beforestart: [''],
      SendBeforestart:[''],
      Reminder: [''],
      Category: [''],
      Matter: [''],
      COMMENT: [''],
      //Recurrance-Pattern Tab
      Every: [''],
      EveryWeekly: [''],
      Senddayweek:[''],
      EveryMonthly: [''],
      EveryDay: [''],
      SendEveryDay: [''],
      countvalue: [''],
      Sendcountvalue:[''],
      DaySelect: [''],
      SendDaySelect:[''],
      EndDate: [''],
      SendEndDate: [''],
      ToSendEndDate: [''],
      RedioChnage: [''],
      RedioChnageDay: [''],
      RedioDate: [''],
      dayweek: [''],
      MONTHOPTIONS:[''],
      orders: new FormArray([])
    });
    //this.addCheckboxes();
    if(this.action =='new'){
        this.DairyForm.controls['type'].setValue('Conference');
        this.DairyForm.controls['Reminder'].setValue(true); 
        this.DairyForm.controls['Beforestart'].setValue('15Minutes'); 
        this.DairyForm.controls['SendBeforestart'].setValue('15Minutes'); 
        
        this.DairyForm.controls['APPOINTMENTTIME'].setValue('09:00 AM');
        this.DairyForm.controls['TimeSlot2'].setValue('10:00 AM');

        this.DairyForm.controls['APPOINTMENTDATE'].setValue(new Date());
        this.DairyForm.controls['sendAPPOINTMENTDATE'].setValue(this.datepipe.transform(new Date(), 'dd/MM/yyyy'));
        this.CheckAllDays(false);
    }else{
      this.isLoadingResults = true;
      // this.DairyData.DairyRowClickData
      this._mainAPiServiceService.getSetData({ APPOINTMENTGUID: "" }, 'GetAppointment').subscribe(res => {
        console.log(res);
        if (res.CODE == 200 && res.STATUS == "success") {
          let Date1 =res.DATA.APPOINTMENTS[0].APPOINTMENTDATE.split("/");
          let DDate = new Date(Date1[1] + '/' + Date1[0] + '/' + Date1[2]);
          this.DairyForm.controls['APPOINTMENTDATE'].setValue(DDate);
          this.DairyForm.controls['sendAPPOINTMENTDATE'].setValue(res.DATA.APPOINTMENTS[0].APPOINTMENTDATE);

          this.DairyForm.controls['SUBJECT'].setValue(res.DATA.APPOINTMENTS[0].SUBJECT);
          this.DairyForm.controls['LOCATION'].setValue(res.DATA.APPOINTMENTS[0].LOCATION);
          this.DairyForm.controls['ALLDAYEVENT'].setValue(Number(res.DATA.APPOINTMENTS[0].ALLDAYEVENT));
          this.DairyForm.controls['APPOINTMENTTIME'].setValue(this.tConvert('09:00:00'));
          console.log(this.tConvert('9:00:00'))
        //  console.log((res.DATA.APPOINTMENTS[0].ALLDAYEVENT))
          this.DairyForm.controls['TimeSlot2'].setValue(res.DATA.APPOINTMENTS[0].ENDTIME);
          //End time not yet 
          //Details
          this.DairyForm.controls['type'].setValue(res.DATA.APPOINTMENTS[0].APPOINTMENTTYPE);
          this.DairyForm.controls['Reminder'].setValue(Number(res.DATA.APPOINTMENTS[0].REMINDER));
          this.DairyForm.controls['Beforestart'].setValue(res.DATA.APPOINTMENTS[0].REMINDERMINUTESBEFORE);
          this.DairyForm.controls['SendBeforestart'].setValue(res.DATA.APPOINTMENTS[0].REMINDERMINUTESBEFORE);
          this.DairyForm.controls['Category'].setValue(res.DATA.APPOINTMENTS[0].CATEGORY);
         
          this.DairyForm.controls['APPOINTMENTGUID'].setValue(res.DATA.APPOINTMENTS[0].APPOINTMENTGUID);
          this.DairyForm.controls['MATTERGUID'].setValue(res.DATA.APPOINTMENTS[0].MATTERGUID);
          this.DairyForm.controls['SendMATTERGUID'].setValue(res.DATA.APPOINTMENTS[0].MATTERGUID);
          this.DairyForm.controls['COMMENT'].setValue(res.DATA.APPOINTMENTS[0].NOTE);


          //Recusion Tab
          // FREQUENCY:this.f.RedioChnage.value,
          this.DairyForm.controls['RedioChnage'].setValue(res.DATA.APPOINTMENTS[0].FREQUENCY);
          this.DairyForm.controls['Every'].setValue(res.DATA.APPOINTMENTS[0].DAYFREQUENCY);
          this.DairyForm.controls['EveryWeekly'].setValue(res.DATA.APPOINTMENTS[0].WEEKFREQUENCY);
          this.DairyForm.controls['dayweek'].setValue(res.DATA.APPOINTMENTS[0].WEEKDAYMASK);

          this.DairyForm.controls['EveryMonthly'].setValue(res.DATA.APPOINTMENTS[0].MONTHFREQUENCY);
          this.DairyForm.controls['MONTHOPTIONS'].setValue(res.DATA.APPOINTMENTS[0].MONTHOPTIONS);
          if(res.DATA.APPOINTMENTS[0].MONTHOPTIONS !=''){
            this.DairyForm.controls['countvalue'].disable();
            this.DairyForm.controls['DaySelect'].disable();
            this.DairyForm.controls['EveryDay'].disable();
          }
          this.DairyForm.controls['EveryDay'].setValue(res.DATA.APPOINTMENTS[0].MONTHOPTIONDAY);
          this.DairyForm.controls['SendEveryDay'].setValue(res.DATA.APPOINTMENTS[0].MONTHOPTIONDAY);
          this.DairyForm.controls['countvalue'].setValue(res.DATA.APPOINTMENTS[0].MONTHWHICHWEEK);
          this.DairyForm.controls['Sendcountvalue'].setValue(res.DATA.APPOINTMENTS[0].MONTHWHICHWEEK);
          this.DairyForm.controls['DaySelect'].setValue(res.DATA.APPOINTMENTS[0].MONTHWHICHDAY);
          this.DairyForm.controls['SendDaySelect'].setValue(res.DATA.APPOINTMENTS[0].MONTHWHICHDAY);

          if(res.DATA.APPOINTMENTS[0].RECURRINGUNTILDATE != ''){
            this.DairyForm.controls['EndDate'].disable();
            let Date2 =res.DATA.APPOINTMENTS[0].RECURRINGUNTILDATE.split("/");
            let DDate1 = new Date(Date2[1] + '/' + Date2[0] + '/' + Date2[2]);
            this.DairyForm.controls['EndDate'].setValue(DDate1);
            this.DairyForm.controls['ToSendEndDate'].setValue(DDate1);
          }
        } else if (res.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
        this.isLoadingResults = false;
      }, err => {
        this.toastr.error(err);
        this.isLoadingResults = false;
      });
    }
  }
  tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    console.log(time);
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      console.log(time);
      time.splice(3);
      console.log(time);
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      // time[0] = +time[0] % 12 || 12; // Adjust hours
     
    }
    return time.join (''); // return adjusted time or original string
  }
  get f() {
    return this.DairyForm.controls;
  }
  //DocumentSave
  SaveAppointment() {
    let userData = JSON.parse(localStorage.getItem('currentUser'));
    if (this.action === 'edit') {
      this.appoitmentID=this.f.APPOINTMENTGUID.value;
      this.FormAction = 'update';
    } else if (this.action === 'duplicate' || this.action === "new") {
      this.FormAction = 'insert';
      this.appoitmentID='';
    }
  
    let data = {
      APPOINTMENTGUID:this.appoitmentID,
      SUBJECT: this.f.SUBJECT.value,
      LOCATION: this.f.LOCATION.value,
      ALLDAYEVENT: this.f.ALLDAYEVENT.value,
      APPOINTMENTDATE: this.f.sendAPPOINTMENTDATE.value,
      APPOINTMENTENDDATE: "",
      APPOINTMENTTIME: this.App_StartTime,
      ENDTIME:this.App_EndTime,
   
    
      APPOINTMENTTYPE: this.f.type.value,
      REMINDER: this.f.Reminder.value,
      REMINDERMINUTESBEFORE: this.f.SendBeforestart.value,
      CATEGORY: this.f.Category.value,
      MATTERGUID: this.f.SendMATTERGUID.value,
      USERGUID:userData.UserGuid,

     
        FREQUENCY:this.f.RedioChnage.value,
        DAYFREQUENCY: this.f.Every.value,

        WEEKFREQUENCY: this.f.EveryWeekly.value,
        WEEKDAYMASK: this.f.Senddayweek.value,

        MONTHFREQUENCY: this.f.EveryMonthly.value,
        // MONTHOPTIONS: this.f.EveryDay.value,
        MONTHOPTIONS: this.f.MONTHOPTIONS.value,
        MONTHOPTIONDAY: this.f.SendEveryDay.value,
        MONTHWHICHWEEK: this.f.Sendcountvalue.value,
        MONTHWHICHDAY: this.f.SendDaySelect.value,

        RECURRINGUNTIL: this.f.ToSendEndDate.value,
        RECURRINGUNTILDATE:''
  
      // SYNCHRONISINGINFO:{
      //   DATECREATED:"",
      //   TIMECREATED:"",
      //   DATEMODIFIED:"",
      //   TIMEMODIFIED:""
      // }
    }
    console.log(data);
    let finalData = { DATA: data, FormAction: this.FormAction, VALIDATEONLY: true }
    this._mainAPiServiceService.getSetData(finalData, 'SetAppointment').subscribe(response => {
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
          this.appotmentSaveData(details);
        }
        this.confirmDialogRef = null;
      });
    } else if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0) {
      this.appotmentSaveData(details);
      this.isspiner = false;
    }
  }
  appotmentSaveData(data: any) {
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetAppointment').subscribe(response => {
      if (response.CODE == 200 && (response.STATUS == "OK" || response.STATUS == "success")) {
        if (this.action !== 'edit') {
          this.toastr.success(' save successfully');
        } else {
          this.toastr.success(' update successfully');
        }
        this.behaviorService.forDiaryRefersh2("call");
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
  //DateFrom
  DateFrom(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.DairyForm.controls['sendAPPOINTMENTDATE'].setValue(begin);

  }

  //CheckAllDays
  CheckAllDays(val) {
    if (val == true) {
      console.log("true");
      this.CheckClick = "Yes";
      this.App_StartTime = "";
      this.App_EndTime = "";
    } else {
      console.log("false");
      this.CheckClick = "No";
      this.App_StartTime = this.f.APPOINTMENTTIME.value;
      this.App_EndTime = this.f.TimeSlot2.value;
    }
  }
  StartTime() {
    this.App_StartTime = this.f.APPOINTMENTTIME.value; 
  }
  EndTime() {
    this.App_EndTime = this.f.TimeSlot2.value;
  }
  getTimeStops(start, end) {
    var startTime = moment(start, 'HH:mm');
    var endTime = moment(end, 'HH:mm');
    if (endTime.isBefore(startTime)) {
      endTime.add(1, 'day');
    }
    var timeStops = [];
    while (startTime <= endTime) {
      timeStops.push(moment(startTime).format('HH:mm A'));
      startTime.add(15, 'minutes');
    }
    return timeStops;
  }

}
