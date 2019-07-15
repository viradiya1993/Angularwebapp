import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA,MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-dairy-dailog',
  templateUrl: './dairy-dailog.component.html',
  styleUrls: ['./dairy-dailog.component.scss']
})
export class DairyDailogComponent implements OnInit {
  timeStops:any=[]
  DairyForm:FormGroup;
  isLoadingResults: boolean = false;
  action: string;
  dialogTitle: string;
  isspiner: boolean = false;
  CheckClick:any;
  size: number;
  
  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<DairyDailogComponent>,
    private router: Router,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    public _matDialog: MatDialog,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) 
  { 
    this.timeStops = this.getTimeStops('01:00', '23:59');
    this.action = data.action;
    if(this.action === 'new'){
      this.dialogTitle = 'New Appointment';
    }else if(this.action === 'edit'){
      this.dialogTitle = 'Edit Appointment';
    }else{
      this.dialogTitle = 'Duplicate Appointment';
    }
  }

  ngOnInit() {
    this.size=33;
    this.CheckClick="No";
    this.DairyForm = this._formBuilder.group({
      Subject:[],
      Location:[],
      allday:[],
      date:[],
      TimeSlot:[],
      TimeSlot2:[],
      start:[],
      Finish:[],

      //Details Tab

      type:[],
      Beforestart:[],
      Reminder:[],
      Category:[],
      Matter:[],
      COMMENT:[],

      //Recurrance-Pattern Tab

      Every:[],
      EveryWeekly:[],
      EveryMonthly:[],
      EveryDay:[],
      countvalue:[],
      DaySelect:[],
      Date:[],
      RedioChnage:[''],
      RedioChnageDay:[''],
      RedioDate:[''],
      
      
    });
  }
  get f() {
    return this.DairyForm.controls;
  }
  //DocumentSave
  SaveAppointment(){
    
  }
  //DateFrom
  DateFrom(){

  }
  //choosedDateFrom
  choosedDateFrom(){

  }
  //CheckAllDays
  CheckAllDays(value){
   
    if(value == true){
      this.CheckClick="Yes";
      this.size=100;
    }else{
      this.CheckClick="No";
      this.size=33;
    }
   
  }
  //ChanageTimeSlot
  ChanageTimeSlot(value){
    
  }
  //ChanageTimeSlot2
  ChanageTimeSlot2(value){
    
  }
  getTimeStops(start, end){
    var startTime = moment(start, 'HH:mm');
    var endTime = moment(end, 'HH:mm');
    if(endTime.isBefore(startTime) ){
       endTime.add(1, 'day');
    }
    var timeStops = [];
    while(startTime <= endTime){
      timeStops.push(moment(startTime).format('HH:mm A'));
      startTime.add(15, 'minutes');
    }
    return timeStops;
  }

 }
