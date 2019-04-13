import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent, MatDialogConfig,MatDialog } from '@angular/material';
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
  PDF_Generation:string;
  isLoadingResults: boolean = true;

  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<ReportsComponent>,private _formBuilder: FormBuilder,public datepipe: DatePipe,private Reportfilter: ReportfilterService,private toastr: ToastrService,@Inject(MAT_DIALOG_DATA) public data: any){
      // this.title =data.REPORTNAME;  
      //API Call
      if(data.ReportGenerateData){   
        this.PDF_Generation=data.ReportGenerateData;
        this.title=data.ReportGenerateData.title;
      }else{        
        this.Reportfilter.ReportfilterData(this.data.REPORTID).subscribe(response => {        
          if(response.Report_List_response.Response =='OK'){
            this.responseData=response.Report_List_response;           
            //option1
            if(response.Report_List_response.OptionText1){
              if(response.Report_List_response.OptionValue1==0){
                this.ReportForm.controls['OPTIONTEXT1'].setValue(false);
              }else if(response.Report_List_response.OptionValue1==1){
                this.ReportForm.controls['OPTIONTEXT1'].setValue(true);
              }
            }
            //option2
            if(response.Report_List_response.OptionText2){
              if(response.Report_List_response.OptionValue2==0){
                this.ReportForm.controls['OPTIONTEXT2'].setValue(false);
              }else if(response.Report_List_response.OptionValue2==1){
                this.ReportForm.controls['OPTIONTEXT2'].setValue(true);
              }
            }
  
            //option3
            if(response.Report_List_response.OptionText3){
              if(response.Report_List_response.OptionValue3==0){
                this.ReportForm.controls['OPTIONTEXT3'].setValue(false);
              }else if(response.Report_List_response.OptionValue3==1){
                this.ReportForm.controls['OPTIONTEXT3'].setValue(true);
              }
            }
            //option4
            if(response.Report_List_response.OptionText4){
              if(response.Report_List_response.OptionValue4==0){
                this.ReportForm.controls['OPTIONTEXT4'].setValue(false);
              }else if(response.Report_List_response.OptionValue4==1){
                this.ReportForm.controls['OPTIONTEXT4'].setValue(true);
              }
            }
            //option5        
            if(response.Report_List_response.OptionText5){
              if(response.Report_List_response.OptionValue5==0){
                this.ReportForm.controls['OPTIONTEXT5'].setValue(false);
              }else if(response.Report_List_response.OptionValue5==1){
                this.ReportForm.controls['OPTIONTEXT5'].setValue(true);
              }
            }
            //option7
            if(response.Report_List_response.OptionText7){
              if(response.Report_List_response.OptionValue7==0){
                this.ReportForm.controls['OPTIONTEXT7'].setValue(false);
              }else if(response.Report_List_response.OptionValue7==1){
                this.ReportForm.controls['OPTIONTEXT7'].setValue(true);
              }
            }
            this.title=columnsnamereplace(this.responseData);
          }else{
            this.toastr.error(response.Report_List_response.Response);
          }
        },
        error => {
          this.toastr.error(error);
        })   
      }     
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
      OPTIONTEXT4: ['', [Validators.required]],  
      OPTIONTEXT5: ['', [Validators.required]],  
      OPTIONTEXT7: ['', [Validators.required]],     
    });
    this.ReportForm.get('DATE').disable();
  }
  //Datepicker hide show
  hideshowdatepicker(event){
     if(event=='Date Range'){
      this.ReportForm.get('DATE').enable();
     }else{
      this.ReportForm.get('DATE').disable();
     }
 }
 //DateFormat Change
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {
    var begin = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
    var end = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');      
    let filterVal = { 'ReportDateStart': begin, 'DateEnd': end };
    localStorage.setItem('ReportDaterange',JSON.stringify(filterVal));
  }
  get f() {
    return this.ReportForm.controls;
  }
  ReportSubmit(){  
    this.isLoadingResults = true; 
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
          OptionValue4:valuechange(this.f.OPTIONTEXT4.value),
          OptionValue5:valuechange(this.f.OPTIONTEXT5.value),
          OptionValue7:valuechange(this.f.OPTIONTEXT7.value),
       }
       this.Reportfilter.ReportgenerateData(ReportData).subscribe(reportgenerateData => {
        if(reportgenerateData.PDF_Generation.Response=="error - report not generated"){ 
          this.isLoadingResults = false;
          this.toastr.success('Report generated successfully')
            let Data={"ReportGenerateData":{
                title:this.title,
                SessionToken:reportgenerateData.PDF_Generation.SessionToken,
                Response:reportgenerateData.PDF_Generation.Response,
                PdfFileName:reportgenerateData.PDF_Generation.PdfFileName
              }}
            this.dialog.open(ReportsComponent,{width:'40%', data:Data});
        }else{
          this.toastr.error(reportgenerateData.PDF_Generation.Response)
        }
     })   
  }  
  //dialog Close
  ondialogcloseClick(): void {    
    this.dialogRef.close(true);
  }
}
//Columns name replace
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
      return '1';
    }else if(check==false){
      return '0';
    }
  } else{
    return '';
  }      
}
