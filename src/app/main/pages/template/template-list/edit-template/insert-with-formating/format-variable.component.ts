import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';
import { MainAPiServiceService } from 'app/_services';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-format-variable',
  templateUrl: './format-variable.component.html',
  styleUrls: ['./format-variable.component.scss'],
  animations: fuseAnimations
})
export class FormatVariableComponent implements OnInit {
  @Input() SettingForm: FormGroup;
  @Input() errorWarningData: any;
  addData:any=[];
  dateForEx: any;
  dateForEx2: string;
  FormateType:any
  seperator: string;
  MatTabName: string;
  FormatVarData={
    "Type":'Date',"FormateTime":"1","Seperator":'Standard',"LeadingChar":'Zero',"BlankWhenZero":false,
    "FormateForDate":"1",
  }
  FormateForTime: any;
  constructor(public datepipe: DatePipe,private _mainAPiServiceService:MainAPiServiceService
    ,  public dialogRef: MatDialogRef<FormatVariableComponent>) { }

  ngOnInit() {
    // this.seperator='/';
    // this.dateForEx2='12/15/19';
    // this.dateForEx='12/15/19';

    this.onChangeType('Date');
    // this._mainAPiServiceService.getSetData({}, 'GetSystem').subscribe(response=>{
    //  // console.log(response);
    //   this.addData=response.DATA.SYSTEM.ADDRESSGROUP.POSTALADDRESSGROUP
    // })
    
  }

  onChangeType(val){
    if(val=='Date'){
      this.MatTabName='Date';
       this.dateForEx2='12/15/19';
       this.dateForEx='12/15/19';
      this.onChangeFormate(this.FormatVarData.Type);
      this.onChangeSeperator('Standard');
      this.onChangeLeadingChar('Zero')
    }else if(val=='Time'){
      this.MatTabName='Time';
      this.onChangeFormateForTime('1');
      this.onChangeSeperator('Standard');
      this.onChangeLeadingChar('Zero')
     

    }else if(val=='Number'){
      this.MatTabName='Number';
      this.dateForEx=123155;
      this.onChangeNavSign('Brackets');
    }
  }

  onChangeFormateForTime(val){
    this.FormateForTime=val;
    var today = new Date();
    if(val=='1'){
      this.dateForEx=moment(today).format('hh'+this.seperator+'mm');
    }else if(val=='2'){
      this.dateForEx=moment(today).format('hhmm');
    }else if(val=='3'){
      this.dateForEx=moment(today).format('hh'+this.seperator+'mmA');
    }else if(val=='4'){
      this.dateForEx=moment(today).format('hh'+this.seperator+'mm'+this.seperator+'ss');
    }else if(val=='5'){
      this.dateForEx=moment(today).format('hhmmss');
    }else if(val=='6'){
      this.dateForEx=moment(today).format('hh'+this.seperator+'mm'+this.seperator+'ssA');
    }else if(val=='7'){
      this.dateForEx=moment(today).format('hh'+this.seperator+'mm A');
    }else if(val=='8'){
      this.dateForEx=moment(today).format('hh'+this.seperator+'mm'+this.seperator+'ss A');
    }
  }
  onChangeFormate(val){
   
    // let INCURREDSTARTDATE = this.dateForEx2.split("/");
    // let sendINCURREDSTARTDATE = new Date(INCURREDSTARTDATE[1] + '/' + INCURREDSTARTDATE[0] + '/' + INCURREDSTARTDATE[2]);
  
    // if(sendINCURREDSTARTDATE[0].length())
    // if(new String(INCURREDSTARTDATE[0]).length == 1)
  this.FormateType=val;
  var today = new Date(); // for now
  let getDatew= today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let date=new Date(this.dateForEx2+ ' ' + getDatew);
  if(val=='1'){
    this.dateForEx = this.datepipe.transform(date, 'MM'+this.seperator+'dd'+this.seperator+'yy');
  }else if(val=='2'){
    this.dateForEx = this.datepipe.transform(date, 'MM'+this.seperator+'dd'+this.seperator+'yyyy');
  }else if(val=='3'){
    this.dateForEx = this.datepipe.transform(date, 'MMM dd'+this.seperator+'yyyy');
  }else if(val=='4'){
    this.dateForEx = this.datepipe.transform(date, 'MMMM'+' '+'dd'+this.seperator+'yyyy');
  }else if(val=='5'){
    this.dateForEx = this.datepipe.transform(date, 'dd'+this.seperator+'MM'+this.seperator+'yy');
  }else if(val=='6'){
    this.dateForEx = this.datepipe.transform(date, 'dd'+this.seperator+'MM'+this.seperator+'yyyy');
  }
  else if(val=='7'){
    this.dateForEx = this.datepipe.transform(date, 'dd'+this.seperator+ 'MMM'+this.seperator+ 'yy');
  }else if(val=='8'){
    this.dateForEx = this.datepipe.transform(date, 'dd'+this.seperator+ 'MMM'+this.seperator+ 'yyyy');
  }else if(val=='9'){
    this.dateForEx = this.datepipe.transform(date, 'yy'+this.seperator+'MM'+this.seperator+'dd');
  }else if(val=='10'){
    this.dateForEx = this.datepipe.transform(date, 'yyyy'+this.seperator+'MM'+this.seperator+'dd');
  }else if(val=='11'){
    this.dateForEx = this.datepipe.transform(date, 'yyMMdd');
  }else if(val=='12'){
    this.dateForEx = this.datepipe.transform(date, 'MM'+this.seperator+'yy');
  }else if(val=='13'){
    this.dateForEx = this.datepipe.transform(date, 'MM'+this.seperator+'yyyy');
  }else if(val=='14'){
    this.dateForEx = this.datepipe.transform(date, 'yy'+this.seperator+'MM');
  }else if(val=='15'){
    this.dateForEx = this.datepipe.transform(date, 'yyyy'+this.seperator+'MM');
  }else if(val=='16'){
    this.dateForEx = this.datepipe.transform(date, 'MM'+this.seperator+'dd'+this.seperator+'yyyy');
  }else if(val=='17'){
    this.dateForEx = this.datepipe.transform(date, 'MMMM'+''+ 'dd'+this.seperator+'yyyy');
  }

  }
  onChangeSeperator(val){
    if(val=="Standard"){

      if(this.MatTabName == "Date"){
        this.seperator='/';
      }else if(this.MatTabName =="Time"){
        this.seperator=':';
      }
     
    }else if(val=="Period"){
      this.seperator='.';
    }else if(val=="Dash"){
      this.seperator='-';
    }else if(val=="Space"){
      this.seperator=' ';
    }else if(val=="Comma"){
      this.seperator=',';
    }
    if(this.MatTabName == "Date"){
      this.onChangeFormate(this.FormateType);
    }else if(this.MatTabName =="Time"){
      this.onChangeFormateForTime(this.FormateForTime);
    }
    
   
  }
  onChangeLeadingChar(val){
  if(val=='Zero'){
    // this.LeadingChar='0'
  }else if(val=='Blank'){

  }else if(val=='Asterisk'){

  }
  
}
onChangeNavSign(val){

}
closepopup(){
  this.dialogRef.close(false);
}

}
