import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit { 

  Datelistname:string;
  selectedowner:string;
  selectedsortorder:string;
  constructor(public dialogRef: MatDialogRef<ReportsComponent>){}
  
  ngOnInit() {
     this.Datelistname='Last Month';
     this.selectedowner = 'All';
     this.selectedsortorder = 'Matter Number';
  }
   //Dropdown Data
   Dropdowndaterange=[
    {name:'Last Month'},
    {name:'Current Month'},
    {name:'Last Quarter'},
    {name:'Current Quarter'},
    {name:'Last Financial Year'},
    {name:'Current Financial Year'},
    {name:'Date Range'},
  ];
    
  //Select owner Dropdown
  SelectOwner=[
    {name:'All'},
    {name:'None'},
    {name:'Diana parkison'},
    {name:'Claudine Suzie Parkinson'},
    {name:'Test'},   
  ]
  //Select sort order
  Selectsortorder=[
    {name:'Matter Number'},
    {name:'Matter Name'},
    {name:'Client Name'},
    {name:'Amount'},  
    {name:'Free Earner-Matter'},
    {name:'Free Earner-Client'},  
    {name:'Owner-Matter'},  
    {name:'Owner-Client'},
    {name:'Primary-FE-Matter'},  
    {name:'Primary-FE-Client'},   
  ]
  //checkBox Data
  checkboxdata = [
    { label: 'Show Detail', checked: false },
    { label: 'Active Matters Only', checked: false },
    { label: 'Inc. Pro Bono/Spec Matters', checked: false },          
    ];

    //dialog Close
    ondialogcloseClick(): void {    
      this.dialogRef.close(true);
    }
}
