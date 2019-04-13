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
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<ReportsComponent>,private _formBuilder: FormBuilder,public datepipe: DatePipe,private Reportfilter: ReportfilterService,private toastr: ToastrService,@Inject(MAT_DIALOG_DATA) public data: any){
      //API Call      
      if(data.ReportGenerateData){   
        this.PDF_Generation=data.ReportGenerateData;
        this.title=data.ReportGenerateData.title;
      }else{ 
        this.Reportfilter.ReportfilterData(this.data.REPORTID).subscribe(response => {
           if(response.CODE==200 && response.STATUS=='success'){
             this.responseData=response.DATA; 
             this.title=response.DATA.REPORTTITLE;          
            //option1
            if(response.DATA.OPTIONTEXT1!=""){
              if(response.DATA.OPTIONVALUE1==0){
                this.ReportForm.controls['OPTIONTEXT1'].setValue(false);
              }else if(response.DATA.OPTIONVALUE1==1){
                this.ReportForm.controls['OPTIONTEXT1'].setValue(true);
              }
            }
            //option2
            if(response.DATA.OPTIONTEXT2!=""){
              if(response.DATA.OPTIONVALUE2==0){
                this.ReportForm.controls['OPTIONTEXT2'].setValue(false);
              }else if(response.DATA.OPTIONVALUE2==1){
                this.ReportForm.controls['OPTIONTEXT2'].setValue(true);
              }
            } 
            //option3
            if(response.DATA.OPTIONTEXT3!=""){
              if(response.DATA.OPTIONVALUE3==0){
                this.ReportForm.controls['OPTIONTEXT3'].setValue(false);
              }else if(response.DATA.OPTIONVALUE3==1){
                this.ReportForm.controls['OPTIONTEXT3'].setValue(true);
              }
            }
            //option4
            if(response.DATA.OPTIONTEXT4!=""){
              if(response.DATA.OPTIONVALUE4==0){
                this.ReportForm.controls['OPTIONTEXT4'].setValue(false);
              }else if(response.DATA.OPTIONVALUE4==1){
                this.ReportForm.controls['OPTIONTEXT4'].setValue(true);
              }
            }
            //option5        
            if(response.DATA.OPTIONTEXT5!=""){
              if(response.DATA.OPTIONVALUE5==0){
                this.ReportForm.controls['OPTIONTEXT5'].setValue(false);
              }else if(response.DATA.OPTIONVALUE5==1){
                this.ReportForm.controls['OPTIONTEXT5'].setValue(true);
              }
            }
            //option6        
            if(response.DATA.OPTIONTEXT6!=""){
              if(response.DATA.OPTIONVALUE6==0){
                this.ReportForm.controls['OPTIONTEXT6'].setValue(false);
              }else if(response.DATA.OPTIONVALUE6==1){
                this.ReportForm.controls['OPTIONTEXT6'].setValue(true);
              }
            }
            //option7
            if(response.DATA.OPTIONTEXT7!=""){
              if(response.DATA.OPTIONVALUE7==0){
                this.ReportForm.controls['OPTIONTEXT7'].setValue(false);
              }else if(response.DATA.OPTIONVALUE7==1){
                this.ReportForm.controls['OPTIONTEXT7'].setValue(true);
              }
            }
             //option8
             if(response.DATA.OPTIONTEXT8!=""){
              if(response.DATA.OPTIONVALUE8==0){
                this.ReportForm.controls['OPTIONTEXT8'].setValue(false);
              }else if(response.DATA.OPTIONVALUE8==1){
                this.ReportForm.controls['OPTIONTEXT8'].setValue(true);
              }
            }
             //option9
             if(response.DATA.OPTIONTEXT9!=""){
              if(response.DATA.OPTIONVALUE9==0){
                this.ReportForm.controls['OPTIONTEXT9'].setValue(false);
              }else if(response.DATA.OPTIONVALUE9==1){
                this.ReportForm.controls['OPTIONTEXT9'].setValue(true);
              }
            }
             //option10
             if(response.DATA.OPTIONTEXT10!=""){
              if(response.DATA.OPTIONVALUE10==0){
                this.ReportForm.controls['OPTIONTEXT10'].setValue(false);
              }else if(response.DATA.OPTIONVALUE10==1){
                this.ReportForm.controls['OPTIONTEXT10'].setValue(true);
              }
            }           
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
      DATE: [{begin: new Date(), end: new Date()}],
      FEEEARNERNAME: ['', [Validators.required]],
      LIST1TEXT: ['', [Validators.required]],
      LIST2TEXT: ['', [Validators.required]],
      OPTIONTEXT1: ['', [Validators.required]], 
      OPTIONTEXT2: ['', [Validators.required]], 
      OPTIONTEXT3: ['', [Validators.required]],  
      OPTIONTEXT4: ['', [Validators.required]],  
      OPTIONTEXT5: ['', [Validators.required]], 
      OPTIONTEXT6: ['', [Validators.required]],  
      OPTIONTEXT7: ['', [Validators.required]],
      OPTIONTEXT8: ['', [Validators.required]],
      OPTIONTEXT9: ['', [Validators.required]],
      OPTIONTEXT10: ['', [Validators.required]],     
    });
    this.ReportForm.get('DATE').disable();
    localStorage.removeItem('ReportDaterange');   
  }  
  //Datepicker hide show
  hideshowdatepicker(event){
     if(event=='Date Range'){      
      var begin = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
      var end = this.datepipe.transform(new Date(), 'dd/MM/yyyy');      
      datesave(begin,end)  
      this.ReportForm.get('DATE').enable();
     }else{
      this.ReportForm.get('DATE').disable();
      localStorage.removeItem('ReportDaterange');    
     }
 }
 //DateFormat Change
  choosedDate(type: string, event: MatDatepickerInputEvent<Date>) {    
    var begin = this.datepipe.transform(event.value['begin'], 'dd/MM/yyyy');
    var end = this.datepipe.transform(event.value['end'], 'dd/MM/yyyy');      
    datesave(begin,end)
  }
  get f() {
    return this.ReportForm.controls;
  }
  ReportSubmit(){ 
    let date=JSON.parse(localStorage.getItem("ReportDaterange"));   
    let StartDate; if(date!=null){ StartDate=date.ReportDateStart;}else{StartDate='';}
    let DateEnd; if(date!=null){ DateEnd= date.DateEnd;}else{DateEnd='';}
      let ReportData={
          ReportId:this.data.REPORTID,      
          DateRangeSelection:this.f.DATERANGE.value,
          DateFrom:StartDate,
          DateTo:DateEnd,
          select_owner:this.f.FEEEARNERNAME.value,
          List1Selection:this.f.LIST1TEXT.value,
          List2Selection:this.f.LIST2TEXT.value,     
          OptionValue1:valuechange(this.f.OPTIONTEXT1.value), 
          OptionValue2:valuechange(this.f.OPTIONTEXT2.value),
          OptionValue3:valuechange(this.f.OPTIONTEXT3.value),
          OptionValue4:valuechange(this.f.OPTIONTEXT4.value),
          OptionValue5:valuechange(this.f.OPTIONTEXT5.value),
          OptionValue6:valuechange(this.f.OPTIONTEXT6.value),
          OptionValue7:valuechange(this.f.OPTIONTEXT7.value),
          OptionValue8:valuechange(this.f.OPTIONTEXT8.value),
          OptionValue9:valuechange(this.f.OPTIONTEXT9.value),
          OptionValue10:valuechange(this.f.OPTIONTEXT10.value),
       }
       keydelete(ReportData); 
      // console.log(ReportData);
       //Api Report Generate 
       this.Reportfilter.ReportgenerateData(ReportData).subscribe(reportgenerateData => {
        if(reportgenerateData.PDF_Generation.Response=="error - report not generated"){ 
          this.toastr.success('Report generated successfully')
            let Data={"ReportGenerateData":{
                title:this.title,
                SessionToken:reportgenerateData.PDF_Generation.SessionToken,
                Response:reportgenerateData.PDF_Generation.Response,
                PdfFileName:reportgenerateData.PDF_Generation.PdfFileName
              }}
              //open pop-up
            this.dialog.open(ReportsComponent,{
              width:'40%',
              data:Data
            });
        }else{
          this.toastr.error(reportgenerateData.PDF_Generation.Response)
        }
     })   
  }  
  //dialog Close
  ondialogcloseClick(): void {    
    this.dialogRef.close(true);
    localStorage.removeItem('ReportDaterange');  
  }
}
//checkbox value 0 & 1 set
function valuechange(check){
  if(check){
    if(check==true){
      return 1;
    }else if(check==false){
      return 0;
    }
  } else{
    return '';
  }      
}
//blank key delete in array
function keydelete(ReportData){
  Object.keys(ReportData).forEach(function(key) {
    let value = ReportData[key];
    if (value === ""||value === null){
        delete ReportData[key];
    }
  });
}
//Dateformat change
function datesave(Fromdate,todate){
  let filterVal = { 'ReportDateStart': Fromdate, 'DateEnd': todate };
  localStorage.setItem('ReportDaterange',JSON.stringify(filterVal));
}
