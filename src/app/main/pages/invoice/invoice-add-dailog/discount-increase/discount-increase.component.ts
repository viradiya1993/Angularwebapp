import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorService } from 'app/_services';

@Component({
  selector: 'app-discount-increase',
  templateUrl: './discount-increase.component.html',
  styleUrls: ['./discount-increase.component.scss']
})
export class DiscountIncreaseComponent implements OnInit {
  @Input() addInvoiceForm: FormGroup;
  @Output() discountAmount: EventEmitter<any> = new EventEmitter<any>();
  isAmount: boolean = true;
  GSTAmmountCange: string;
  FeesCheckVal: any;
  SundriesCheckVal: any;
  MatterExPenseCheckVal: any;
  WorkInProgressData: any;
  constructor(
    private behaviorService : BehaviorService
  ) {

    this.behaviorService.workInProgress$.subscribe(result=>{
      this.WorkInProgressData=result
console.log(result);
    });
   }
  ngOnInit() {
    this.addInvoiceForm.controls['Percentage_type'].setValue('Percentage');
    this.addInvoiceForm.controls['Percentage'].setValue(0);
    this.addInvoiceForm.controls['Discount_type'].setValue('Discount');
    this.addInvoiceForm.controls['GST_type'].setValue('ExGstAmount');
    this.addInvoiceForm.controls['amount'].setValue(0);
    this.addInvoiceForm.controls['Fees'].setValue(true);
    this.GSTAmmountCange='Ex-GST';
    this.FeesCheckVal='Fees';
    this.SundriesCheckVal='';
    this.MatterExPenseCheckVal='';
    this.onAmoPerChnage('Enter');
  }
  get f() {
    return this.addInvoiceForm.controls;
  }
  checkBoxSelect(val){
    if(val.source.name=='Fees'){
      if(val.checked==true){
        this.FeesCheckVal=val.source.name
      }else{
        this.FeesCheckVal=''
      }
    }else if(val.source.name=='Sundries'){
      if(val.checked==true){
        this.SundriesCheckVal=val.source.name
      }else{
        this.SundriesCheckVal=''
      }
    }else if(val.source.name=='Matter Expenses'){
      if(val.checked==true){
        this.MatterExPenseCheckVal=val.source.name
      }else{
        this.MatterExPenseCheckVal=''
      }
    }
    this.CommonCalFuction()
  }
  PercentageTypeChange(val) {
    this.isAmount = val == "Percentage" ? true : false;
    if (val=='Percentage'){
      this.addInvoiceForm.controls['Percentage'].setValue(this.f.amount.value);
      // this.CommonCalFuction();
    }
    else{
      this.addInvoiceForm.controls['amount'].setValue(this.f.Percentage.value);
      // this.CommonCalFuction();
    }
     
    this.onAmoPerChnage('Enter');
  }
  GSTTypeChange(val){
    if(val == 'ExGstAmount'){
      this.GSTAmmountCange='Ex-GST';
    }else{
      this.GSTAmmountCange='Inc-GST';
    }
    this.CommonCalFuction();
   
  }
  DiscountTypeChange() {
    this.onAmoPerChnage('Enter');
  }
  onAmoPerChnage(searchFilter = "") {
    if(Number(this.WorkInProgressData.PRICE) < Number(this.f.amount.value ) ){
      this.addInvoiceForm.controls['ADDITIONALTEXT'].setValue('You have discounted by more then the selected items');
    }else{
    this.CommonCalFuction();
    this.discountAmount.emit({ 'amount': this.f.amount.value, 'Percentage': this.f.Percentage.value, 'Percentage_type': this.f.Percentage_type.value, 'GST_type': this.f.GST_type.value, 'Discount_type': this.f.Discount_type.value });
 
    }

  }
CommonCalFuction(){
  if(this.f.Percentage_type.value =="Percentage"){
    if(Number(this.f.Percentage.value) > 0){
      this.addInvoiceForm.controls['ADDITIONALTEXT'].setValue(this.f.Discount_type.value +' ' +this.FeesCheckVal +' '+ this.SundriesCheckVal + ' ' + this.MatterExPenseCheckVal + ' '+ 'by' +' ' +this.f.Percentage.value +'%');
    }
  }
  else{
    if(Number(this.f.amount.value) > 0){
      this.addInvoiceForm.controls['ADDITIONALTEXT'].setValue(this.f.Discount_type.value + ' '+ this.GSTAmmountCange +' '+ this.FeesCheckVal +' '+ this.SundriesCheckVal + ' ' + this.MatterExPenseCheckVal + ' ' +'by' +' '+'$'+ +this.f.amount.value);
    }
  }
  
}

}
