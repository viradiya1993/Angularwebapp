import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FileNotesService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-newfilenote',
  templateUrl: './newfilenote.component.html',
  styleUrls: ['./newfilenote.component.scss']
})
export class NewfilenoteComponent implements OnInit {
  NewFileNote:FormGroup;
  isLoadingResults: boolean = false;
  d: Date;
  time: string;
  beginDate: string;
  selectDate: any;
  selectTime: string;
  DateHandel: string;
  constructor(
    public MatDialog: MatDialog,
    public dialogRef: MatDialogRef<NewfilenoteComponent>,
    private _formBuilder: FormBuilder,
    public datepipe: DatePipe,
    public setfilenote:FileNotesService,
    private toastr: ToastrService,)
   { 
  
   }

  ngOnInit() {
    this.DateHandel="FirstTime";
    this.NewFileNote = this._formBuilder.group({
      newfiledate:[new Date()],
      User:[''],
      newfiledate2:[this.datepipe.transform(new Date(), 'dd/MM/yyyy')],
      time:[new Date().getHours()],
      comment:['']
    });
    var today = new Date();
    this.time = today.getHours() + ":" + today.getMinutes()+ ":" + today.getSeconds();
    console.log(this.time);
    this.NewFileNote.controls['time'].setValue(this.time);
 
    // this.NewFileNote.controls['time'].setValue(this.time);
     // => 51
     let matterGuid=JSON.parse(localStorage.getItem('set_active_matters'));
     this.NewFileNote.controls['User'].setValue(matterGuid.CONTACTNAME);
  }
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.DateHandel="SecondTime";
    this.beginDate = this.datepipe.transform(event.value, 'dd/MM/yyyy');
    // localStorage.setItem('DATEOFBIRTH', begin);
  }
  get f() {
    //console.log(this.contactForm);
    return this.NewFileNote.controls;
  }
 
  //Save File Note
  SaveFileNote(){
    if(this.DateHandel="FirstTime"){
      // this.NewFileNote.controls['newfiledate'].setValue(this.datepipe.transform(this.datepipe.transform(new Date(), 'dd/MM/yyyy')))
    console.log("first date");
    
      this.selectDate=this.f.newfiledate2.value;
  }else{
    console.log("second date");
    this.selectDate= this.beginDate;   
    }
    if(this.f.time.value == null || this.f.time.value == undefined || this.f.time.value == ''){
      console.log("first time");
      this.selectTime= this.time;
    }else{
      console.log("second time time");
      this.selectTime= this.f.time.value;
    }
    console.log(this.f);
  let matterGuid=JSON.parse(localStorage.getItem('set_active_matters'));
  let passdata={
  FILENOTEGUID:"",
  MATTERGUID:matterGuid.MATTERGUID,
  USERNAME:this.f.User.value,
  DATE:this.selectDate,
  TIME:this.selectTime,
  NOTE:this.f.comment.value,
 }
  this.setValue(passdata);

    
  }

  setValue(passdata){
    this.isLoadingResults=true;
    console.log({'FormAction':'insert',DATA:passdata});
    this.setfilenote.setFileNote({'FormAction':'insert',DATA:passdata}).subscribe(res => {
      if (res.CODE == 200 && res.STATUS == "success") {
        this.toastr.success('Save Success');
        this.isLoadingResults=false;
        this.dialogRef.close(true);

      } else if (res.CODE == 402  && res.MESSAGE == "Not logged in"){
        this.toastr.error(res.MESSAGE);
        this.isLoadingResults=false;
          this.dialogRef.close(false);
      } else if(res.STATUS == "error"){
        this.toastr.error(res.MESSAGE);
        this.isLoadingResults=false;
   
      }
     
    }, err => {
      
      this.toastr.error(err);
    });
   
  }
  //Close File Note
  CloseFileNote(){
    this.dialogRef.close(false);
  }
  //New Date 
  NewNoteDate(value){
   console.log(value);
  }
  //User DropDown
  UserChange(value){
    console.log(value);
  }

}
