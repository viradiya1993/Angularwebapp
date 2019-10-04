import { Component, OnInit, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MainAPiServiceService, BehaviorService } from 'app/_services';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { MatterDialogComponent } from '../../time-entries/matter-dialog/matter-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DatePipe } from '@angular/common';
import { UserSelectPopupComponent } from '../../matters/user-select-popup/user-select-popup.component';
@Component({
  selector: 'app-task-dialoge',
  templateUrl: './task-dialoge.component.html',
  styleUrls: ['./task-dialoge.component.scss'],
  animations: fuseAnimations
})
export class TaskDialogeComponent implements OnInit {
  errorWarningData: any = { "Error": [], 'Warning': [] };
  addData: any = [];
  TemplateName: any;
  isLoadingResults: boolean = false;
  matterData: any = [];
  TaskData: any = [];
  isspiner: boolean = false;
  action: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  title: string;
  date = new Date();
  FormAction: string;
  MatterGuid: string;
  TaskGuid: any;
  reminderCheck: any;
  time: string;
  TaskForm: FormGroup;
  RimindereDate: any;
  RimindereTime: any;
  UserDropDownData: any;
  userGuid: string;
  constructor(private _mainAPiServiceService: MainAPiServiceService,
    public dialogRef: MatDialogRef<TaskDialogeComponent>, private toastr: ToastrService,
    private behaviorService: BehaviorService,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    public datepipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public _data: any,
    private dialog: MatDialog) {
    this.action = _data.action;
    if (this.action == 'edit' || this.action == 'edit legal') {
      this.title = "Update Task";
    } else if (this.action == 'copy' || this.action == 'copy legal') {
      this.title = "Duplicate Task";
    } else {
      this.title = "New Task";
    }
    this.behaviorService.MatterData$.subscribe(result => {
      if (result) {
        this.matterData = result;
      }
    });
    this.behaviorService.TaskData$.subscribe(result => {
      if (result) {
        this.TaskData = result;
      }
    });
    this.behaviorService.UserDropDownData$.subscribe(result => {
      if (result) {
        this.UserDropDownData = result;
      }
    });
  }
  ngOnInit() {
    this.TaskForm = this._formBuilder.group({
      REMINDERDATE: [''],
      USERGUID: [''],
      UserName: [''],
      REMINDER: [''],
      TASKGUID: [''],
      MATTERGUID: [''],
      STARTDATE: [''],
      DUEDATE: [''],
      PERCENTCOMPLETE: [''],
      SendREMINDERDATE: [''],
      SendSTARTDATE: [''],
      SendREMINDERTIME: [''],
      MatterName: [''],
      STATUS: [''],
      PRIORITY: [''],
      REMINDERTIME: [''],
      DESCRIPTION: [''],
      SendDUEDATE: ['']
    });
    this.TaskForm.controls['UserName' ].disable();
    this.TaskForm.controls['UserName'].setValue(this.UserDropDownData.USERNAME);
    this.TaskForm.controls['USERGUID'].setValue(this.UserDropDownData.USERGUID);

    if (this.action == 'edit' || this.action == 'edit legal' || this.action == 'copy' || this.action == 'copy legal') {
      this.EditPopUpOPen();
    } else if (this.action == 'new general') {
      this.ForCommonNewData();
      this.TaskForm.controls['MatterName'].disable();
      this.TaskForm.controls['MatterName'].setValue('');
      this.TaskForm.controls['MATTERGUID'].setValue('');
    }
    else {
      this.ForCommonNewData();
      this.TaskForm.controls['MatterName'].setValue(this.matterData.MATTER);
      this.TaskForm.controls['MATTERGUID'].setValue(this.matterData.MATTERGUID);
    }
  }
  ForCommonNewData() {
    let username = JSON.parse(localStorage.getItem("task_filter"));
    this.TaskForm.controls['UserName'].setValue(username.user);
    var event = new Date().toLocaleString("en-US", { timeZone: "Australia/sydney" });
    let time = event.toLocaleString();
    this.time = new Date(time).getHours() + 1 + ":" + new Date(time).getMinutes() + ":" + new Date(time).getSeconds();
    this.TaskForm.controls['REMINDERTIME'].setValue(this.time);
    let begin = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
    this.TaskForm.controls['SendREMINDERDATE'].setValue(begin);
    this.TaskForm.controls['REMINDERTIME'].disable();
    this.TaskForm.controls['REMINDERDATE'].disable();
    this.TaskForm.controls['REMINDERDATE'].setValue(new Date());
    this.TaskForm.controls['STARTDATE'].setValue(new Date());
    this.TaskForm.controls['STATUS'].setValue('Not Started');
    this.TaskForm.controls['PRIORITY'].setValue('0');
    
    this.TaskForm.controls['DUEDATE'].setValue(new Date());
    this.TaskForm.controls['SendDUEDATE'].setValue(begin);
    this.TaskForm.controls['SendSTARTDATE'].setValue(begin);
    this.TaskForm.controls['SendREMINDERTIME'].setValue(this.time);
  }
  EditPopUpOPen() {
    if(this.action != 'edit legal' && this.action != 'copy legal'){
      let username = JSON.parse(localStorage.getItem("task_filter"));
      this.TaskForm.controls['UserName'].setValue(username.user);
    } 
    this.isLoadingResults = true;
    this._mainAPiServiceService.getSetData({ TASKGUID: this.TaskData.TASKGUID }, 'GetTask').subscribe(res => {
        if (res.CODE == 200 && res.STATUS == "success") {
          let DueDate = res.DATA.TASKS[0].DUEDATE.split("/");
          let DUE = new Date(DueDate[1] + '/' + DueDate[0] + '/' + DueDate[2]);
          this.TaskForm.controls['DUEDATE'].setValue(DUE);
          this.TaskForm.controls['SendDUEDATE'].setValue(res.DATA.TASKS[0].DUEDATE);
          let StartDate = res.DATA.TASKS[0].STARTDATE.split("/");
          let Start = new Date(StartDate[1] + '/' + StartDate[0] + '/' + StartDate[2]);
          this.TaskForm.controls['STARTDATE'].setValue(Start);
          this.TaskForm.controls['SendSTARTDATE'].setValue(res.DATA.TASKS[0].STARTDATE);
          let ReminderDate = res.DATA.TASKS[0].REMINDERGROUP.REMINDERDATE.split("/");
          let Reminder = new Date(ReminderDate[1] + '/' + ReminderDate[0] + '/' + ReminderDate[2]);
          this.TaskForm.controls['REMINDERDATE'].setValue(Reminder);
          this.TaskForm.controls['SendREMINDERDATE'].setValue(res.DATA.TASKS[0].REMINDERGROUP.REMINDERDATE);
          this.TaskForm.controls['USERGUID'].setValue(res.DATA.TASKS[0].USERGUID);
          this.TaskForm.controls['MatterName'].setValue(res.DATA.TASKS[0].MATTER);
          this.TaskForm.controls['MATTERGUID'].setValue(res.DATA.TASKS[0].MATTERGUID);
          this.TaskForm.controls['STATUS'].setValue(res.DATA.TASKS[0].STATUS);
          this.TaskForm.controls['PRIORITY'].setValue(res.DATA.TASKS[0].PRIORITY.toString());
          this.TaskForm.controls['REMINDERTIME'].setValue(res.DATA.TASKS[0].REMINDERGROUP.REMINDERTIME);
          this.TaskForm.controls['SendREMINDERTIME'].setValue(res.DATA.TASKS[0].REMINDERGROUP.REMINDERTIME);
          this.TaskForm.controls['REMINDER'].setValue(res.DATA.TASKS[0].REMINDERGROUP.REMINDER);
          this.ChekBoxClick(res.DATA.TASKS[0].REMINDERGROUP.REMINDER)
          this.TaskForm.controls['STATUS'].setValue(res.DATA.TASKS[0].STATUS);
          this.TaskForm.controls['TASKGUID'].setValue(res.DATA.TASKS[0].TASKGUID);
          this.TaskForm.controls['PERCENTCOMPLETE'].setValue(res.DATA.TASKS[0].PERCENTCOMPLETE);
          this.TaskForm.controls['DESCRIPTION'].setValue(res.DATA.TASKS[0].DESCRIPTION);
        } else if (res.MESSAGE == 'Not logged in') {
          this.dialogRef.close(false);
        }
        this.isLoadingResults = false;
      }, err => {
        this.toastr.error(err);
        this.isLoadingResults = false;
      });
    }
  // closepopup() {
  //     this.dialogRef.close(false);
  // }
  choosedReminderDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.TaskForm.controls['SendREMINDERDATE'].setValue(begin);
  }
  choosedStartDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.TaskForm.controls['SendSTARTDATE'].setValue(begin);
  }
  choosedDueDate(type: string, event: MatDatepickerInputEvent<Date>) {
    let begin = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    this.TaskForm.controls['SendDUEDATE'].setValue(begin);
  }
  ChekBoxClick(val) {
    if (val.checked == true || val == 1) {
      this.TaskForm.controls['REMINDERTIME'].enable();
      this.TaskForm.controls['REMINDERDATE'].enable();
    } else {
      this.TaskForm.controls['REMINDERTIME'].disable();
      this.TaskForm.controls['REMINDERDATE'].disable();
    }
  }
  SelectMatter() {
    const dialogRef = this.dialog.open(MatterDialogComponent, { width: '100%', disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.TaskForm.controls['MatterName'].setValue(result.MATTER);
        this.TaskForm.controls['MATTERGUID'].setValue(result.MATTERGUID);
      }
    });
  }
  SelectContact() {
    const dialogRef = this.dialog.open(UserSelectPopupComponent, { width: '100%', disableClose: true, data: null });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.TaskForm.controls['UserName'].setValue(result.USERNAME);
        this.TaskForm.controls['USERGUID'].setValue(result.USERGUID);
        // this.TaskDialogeData.MatterName=result.MATTER
      }
    });
  }
  get f() {
    return this.TaskForm.controls;
  }
  forRimindCheck() {
    if (this.f.REMINDER.value == true || this.f.REMINDER.value == 1) {
      this.RimindereDate = this.f.SendREMINDERDATE.value
      this.RimindereTime = this.f.REMINDERTIME.value
    } else {
      this.RimindereDate = "";
      this.RimindereTime = "";
    }
  }
  TaskSave() {
    if (this.action == "edit" || this.action == "edit legal") {
      this.forRimindCheck();
      this.FormAction = 'update';
      this.TaskGuid = this.f.TASKGUID.value
      this.MatterGuid = this.f.MATTERGUID.value;
      this.userGuid=this.f.USERGUID.value;
    }else if(this.action == 'new legal'){
      this.forRimindCheck();
      this.FormAction='insert';
      this.TaskGuid="";
      this.MatterGuid=this.f.MATTERGUID.value;
      this.userGuid='';
    }else if (this.action == 'new matter') {
      this.forRimindCheck();
      this.FormAction = 'insert';
      this.TaskGuid = "";
      this.MatterGuid = this.f.MATTERGUID.value;
      this.userGuid=this.f.USERGUID.value;
    }else if (this.action == 'new general') {
      this.forRimindCheck();
      this.MatterGuid = '';
      this.FormAction = 'insert';
      this.TaskGuid = "";
      this.userGuid=this.f.USERGUID.value;
    }else if (this.action == 'copy' || this.action == 'copy legal') {
      this.forRimindCheck();
      this.FormAction = 'insert';
      this.TaskGuid = "";
      this.MatterGuid = this.f.MATTERGUID.value;
      this.userGuid=this.f.USERGUID.value;
    }else {
      this.forRimindCheck();
      this.FormAction = 'insert';
      this.TaskGuid = "";
      this.MatterGuid = this.f.MATTERGUID.value;
      this.userGuid=this.f.USERGUID.value;
    }
    let data = {
      TASKGUID: this.TaskGuid,
      MATTERGUID: this.MatterGuid,
      USERGUID: this.userGuid,
      DUEDATE: this.f.SendDUEDATE.value,
      STATUS: this.f.STATUS.value,
      STARTDATE: this.f.SendSTARTDATE.value,
      PRIORITY: this.f.PRIORITY.value,
      PERCENTCOMPLETE: this.f.PERCENTCOMPLETE.value,
      DESCRIPTION: this.f.DESCRIPTION.value,
      REMINDERGROUP: {
        REMINDER: this.f.REMINDER.value,
        REMINDERDATE: this.RimindereDate,
        REMINDERTIME: this.RimindereTime,
      }
    }
    this.isspiner = true;
    let finalData = { DATA: data, FormAction: this.FormAction, VALIDATEONLY: true }
    this._mainAPiServiceService.getSetData(finalData, 'SetTask').subscribe(response => {
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
          this.taskSaveData(details);
        }
        this.confirmDialogRef = null;
      });
    }
    if (Object.keys(warningData).length == 0 && Object.keys(errorData).length == 0)
      this.taskSaveData(details);
    this.isspiner = false;
  }
  taskSaveData(data: any) {
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
}
