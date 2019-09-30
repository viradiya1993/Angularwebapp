import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { FormGroup, FormBuilder,FormArray, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { MainAPiServiceService, BehaviorService } from '../../../../_services';
//https://apitest.silq.com.au/MobileService?SetAppointment
@Component({
  selector: 'app-dairy-dailog',
  templateUrl: './dairy-dailog.component.html',
  styleUrls: ['./dairy-dailog.component.scss']
})
export class DairyDailogComponent implements OnInit {
  timeStops: any = []
  DairyForm: FormGroup;
  isLoadingResults: boolean = false;
  action: string;
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
  // WeekDay =[
  //   { day: "Monday" },
  //   { day: "Tuesday" },
  //   { day: "Wednesday" },
  //   { day: 'Thursday' },
  //   { day: 'Friday' },
  //   { day: 'Saturday' },
  //   { day: 'Sunday' }
  // ]
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
  // private addCheckboxes(){
  //   this.WeekDay.forEach((o, i) => {
  //     this.control = new FormControl(i === 0); // if first item set to true, else false
  //     (this.DairyForm.controls.orders as FormArray).push(this.control);
  //   });
  //   console.log(this.control);
  // }
  //DocumentSave
  SaveAppointment() {
    console.log(this.f.dayweek);
    console.log("==Amit==");
    console.log(this.f.dayweek.value);
    return;
    if(this.action === 'edit'){
      // this.appoitmentID=
      //console.log(1);
      this.FormAction = 'update';
    }else if(this.action === 'duplicate' || this.action ==="new"){
      this.FormAction = 'insert';
      //console.log(2);
    }
    let data= {
      APPOINTMENTGUID:" ",
      SUBJECT:this.f.SUBJECT.value,
      LOCATION:this.f.LOCATION.value,
      ALLDAYEVENT:this.f.ALLDAYEVENT.value,
      APPOINTMENTDATE:this.f.DateFrom.value,
      APPOINTMENTENDDATE:this.f.DateFrom.value,
      APPOINTMENTTIME:this.App_StartTime,
      APPOINTMENTTYPE:this.f.type.value,
      CATEGORY:this.f.Category.value,
      REMINDER:this.f.Reminder.value,
      REMINDERMINUTESBEFORE:this.f.Beforestart.value,
      RECURRING: {
        DAYFREQUENCY:this.f.Every.value,
        WEEKFREQUENCY:this.f.EveryWeekly.value,
        WEEKDAYMASK: this.f.mon.value,
        MONTHFREQUENCY:this.f.EveryMonthly.value,
        MONTHOPTIONS:this.f.EveryDay.value,
        MONTHOPTIONDAY:this.f.RedioChnageDay.value,
        MONTHWHICHWEEK:this.f.countvalue.value,
        MONTHWHICHDAY:this.f.DaySelect.value,
        RECURRINGUNTIL:this.f.SendEndDate.value
      }
    }
    console.log(data);
    return;
    let finalData = { DATA: data, FormAction: this.FormAction, VALIDATEONLY: true }
    this._mainAPiServiceService.getSetData({}, 'SetAppointment').subscribe(response => {
      console.log(response);
    }, err => {
      this.toastr.error(err);
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
