import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { FormGroup, FormBuilder,FormArray, FormControl } from '@angular/forms';
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
  AppointmentGuid:any;
  App_StartTime:any;
  App_EndTime:any;
  control:any=[];
  

  constructor(
    private _mainAPiServiceService: MainAPiServiceService,
    private toastr: ToastrService,
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<DairyDailogComponent>,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private dialog: MatDialog,
    public datepipe: DatePipe,
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
  }

  ngOnInit() {
    this.CheckClick = "No";
    this.DairyForm = this._formBuilder.group({
      SUBJECT: [],
      LOCATION: [],
      MATTERGUID: [],
      APPOINTMENTDATE: [],
      APPOINTMENTENDDATE: [],
      DateFrom:[],
      ALLDAYEVENT: [],

      APPOINTMENTTIME: [],
      TimeSlot2: [],
      start: [],
      Finish: [],

      //Details Tab

      type: [],
      Beforestart: [],
      Reminder: [],
      Category: [],
      Matter: [],
      COMMENT: [],

      //Recurrance-Pattern Tab

      Every: [],
      EveryWeekly: [],
      EveryMonthly: [],
      EveryDay: [],
      countvalue: [],
      DaySelect: [],
      EndDate: [],
      SendEndDate:[],
      RedioChnage: [],
      RedioChnageDay: [],
      RedioDate: [],
      dayweek:[],
      orders: new FormArray([])
    });
    //this.addCheckboxes();
  }
  get f() {
    return this.DairyForm.controls;
  }

  //DocumentSave
  SaveAppointment() {
    if(this.action === 'edit'){
      // this.appoitmentID=
      this.FormAction = 'update';
    }else if(this.action === 'duplicate' || this.action ==="new"){
      this.FormAction = 'insert';
    }
    let data= {
      APPOINTMENTGUID:"",
      SUBJECT:this.f.SUBJECT.value,
      LOCATION:this.f.LOCATION.value,
      ALLDAYEVENT:this.f.ALLDAYEVENT.value,
      APPOINTMENTDATE:this.f.DateFrom.value,
      APPOINTMENTENDDATE:this.f.DateFrom.value,
      APPOINTMENTTIME:this.App_StartTime,
      APPOINTMENTTYPE:this.f.type.value,
      REMINDER:this.f.Reminder.value,
      REMINDERMINUTESBEFORE:this.f.Beforestart.value,
      CATEGORY:this.f.Category.value,
      MATTERGUID:"",
     
      RECURRING: {
        DAYFREQUENCY:this.f.Every.value,
        WEEKFREQUENCY:this.f.EveryWeekly.value,
        WEEKDAYMASK: this.f.dayweek.value,
        MONTHFREQUENCY:this.f.EveryMonthly.value,
        MONTHOPTIONS:this.f.EveryDay.value,
        MONTHOPTIONDAY:this.f.RedioChnageDay.value,
        MONTHWHICHWEEK:this.f.countvalue.value,
        MONTHWHICHDAY:this.f.DaySelect.value,
        RECURRINGUNTIL:this.f.SendEndDate.value
      },
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
          this.appotmentSaveData(details);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.appotmentSaveData(details);
    this.isspiner = false;
  }
  appotmentSaveData(data: any) {
    data.VALIDATEONLY = false;
    this._mainAPiServiceService.getSetData(data, 'SetTask').subscribe(response => {
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
  //DateFrom
  DateFrom(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.DairyForm.controls['DateFrom'].setValue(begin);
  }
  
  //CheckAllDays
  CheckAllDays(val) {
    if (val == true) {
      this.CheckClick = "Yes";
    } else {
      this.CheckClick = "No";
      this.App_StartTime = "";
      this.App_EndTime = "";
    }
  }
  StartTime(){
    this.App_StartTime =  this.f.APPOINTMENTTIME.value;
  // console.log(this.App_StartTime);  
  }
  EndTime(){
    this.App_EndTime = this.f.TimeSlot2.value;
    //console.log(this.App_EndTime);
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
