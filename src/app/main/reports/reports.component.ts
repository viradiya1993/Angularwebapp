import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { ReportfilterService } from '../../_services';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit { 
  ReportForm: FormGroup;
  title:string;
  responseData:string;
  abc: any;
  
  constructor(public dialogRef: MatDialogRef<ReportsComponent>,private _formBuilder: FormBuilder,public datepipe: DatePipe,private Reportfilter: ReportfilterService,private toastr: ToastrService,@Inject(MAT_DIALOG_DATA) public data: any){
   // this.title =data.REPORTNAME;

    //API Call
    this.Reportfilter.ReportfilterData(this.data.REPORTID).subscribe(response => {
     
      if(response.Report_List_response.Response =='OK'){
        this.responseData=response.Report_List_response; 
        this.title=columnsnamereplace(this.responseData);
      }else{
        this.toastr.error(response.Report_List_response.Response);
      }
    },
    error => {
      this.toastr.error(error);
    })
  }
  
  ngOnInit() {
    this.ReportForm = this._formBuilder.group({
      DATERANGE: ['', [Validators.required]],
      FEEEARNERNAME: ['', [Validators.required]],
      LIST1TEXT: ['', [Validators.required]],
      LIST2TEXT: ['', [Validators.required]],
      DATE: ['', []], 
      OPTIONTEXT1: ['', [Validators.required]], 
      OPTIONTEXT2: ['', [Validators.required]], 
      OPTIONTEXT3: ['', [Validators.required]],     
    });
  }

  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    var  begin = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
    var end = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');      
    let filterVal = { 'ReportDateStart': begin, 'DateEnd': end };
    localStorage.setItem('ReportDaterange',JSON.stringify(filterVal));
  }
  get f() {
    return this.ReportForm.controls;
  }
  ReportSubmit(){
    let date=JSON.parse(localStorage.getItem("ReportDaterange"));
    let filterVal = { 'ReportDateStart': '', 'DateEnd': '' };  
    localStorage.setItem('ReportDaterange',JSON.stringify(filterVal));
    
    var ReportData={
      ReportId:this.data.REPORTID,
      dateRangeList:this.f.DATERANGE.value,
      DateFrom:date.ReportDateStart,
      DateTo:date.DateEnd,
      FeeEarnerGuid:this.f.FEEEARNERNAME.value,
      List1Selection:this.f.LIST1TEXT.value,
      List2Selection:this.f.LIST2TEXT.value,
     
      OptionValue1:valuechange(this.f.OPTIONTEXT1.value),
      OptionValue2:valuechange(this.f.OPTIONTEXT2.value),
      OptionValue3:valuechange(this.f.OPTIONTEXT3.value),
   }

   this.Reportfilter.ReportgenerateData(ReportData).subscribe(reportData => {
    console.log(reportData);
   })
  }
  //dialog Close
  ondialogcloseClick(): void {    
    this.dialogRef.close(true);
  }
}
function columnsnamereplace(responseData){
  let str=JSON.stringify(responseData);
      str = str.replace(/\"loc:ReportTitle\":/g, "\"ReportTitle\":");
  let StringData=JSON.parse(str);
  return StringData.ReportTitle;
}
//checkbox value 0 & 1 set
function valuechange(check){
  
  if(check){
    if(check==true){
      return '0';
    }
  }else{
    return '1';
  }
    
}