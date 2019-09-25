import { Component, OnInit,Input} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-recurrance-pattern',
  templateUrl: './recurrance-pattern.component.html',
  styleUrls: ['./recurrance-pattern.component.scss']
})
export class RecurrancePatternComponent implements OnInit {
  @Input() DairyForm: FormGroup;
  RedioBtnValue:any;
  constructor() { }

  ngOnInit() {
    this.DairyForm.controls['RedioDate'].setValue('EndDate');
    this.radiobtndate();
  }
  get f() {
    return this.DairyForm.controls;
  }
  radiobtnclick(){
    if(this.f.RedioChnage.value=="Once") {
        this.RedioBtnValue="Once"
    }else if(this.f.RedioChnage.value=="Daily"){
        this.RedioBtnValue="Daily"
    }else if(this.f.RedioChnage.value=="Weekly"){
        this.RedioBtnValue="Weekly"
    }else if(this.f.RedioChnage.value=="Monthly"){
        this.RedioBtnValue="Monthly"
    }else if(this.f.RedioChnage.value=="Yearly"){
        this.RedioBtnValue="Yearly"
    }  
    else{
      this.RedioBtnValue="Once"
    }
  }
  //radiobtnday
  radiobtnday(){
    if(this.f.RedioChnageDay.value == 'Day'){
        this.DairyForm.controls['EveryDay'].enable();
        this.DairyForm.controls['countvalue'].disable();
        this.DairyForm.controls['DaySelect'].disable();
    }
    else if(this.f.RedioChnageDay.value == 'The'){
        this.DairyForm.controls['countvalue'].enable();
        this.DairyForm.controls['DaySelect'].enable();
        this.DairyForm.controls['EveryDay'].disable();
    }else{ 
        this.DairyForm.controls['countvalue'].disable();
        this.DairyForm.controls['DaySelect'].disable();
        this.DairyForm.controls['EveryDay'].disable();
    }
  }
  
  //radiobtndate
  radiobtndate(){
    if(this.f.RedioDate.value == "EndDate"){
      this.DairyForm.controls['Date'].disable();
    }else{
      this.DairyForm.controls['Date'].enable();
    }
  }
  //choosedDate
  choosedDate(value){
   
  }
}
